const prisma = require('../utils/prisma');
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');

function htmlDecode(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&nbsp;/g, ' ').trim();
}

const getCategoryByName = async (req, res) => {
  const name = decodeURIComponent(req.params.name || '').trim();
  if (!name) return res.status(400).json({ success: false, message: 'Name required' });

  try {
    const category = await prisma.category.findFirst({
      where: {
        OR: [
          { name: { equals: name, mode: 'insensitive' } },
          { slug: { equals: slugify(name, { lower: true, strict: true }) } },
        ],
      },
    });
    res.json({ success: true, data: category || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const importDescriptions = async (req, res) => {
  try {
    const csvPath = path.join(__dirname, '..', 'categories.csv');
    if (!fs.existsSync(csvPath)) {
      return res.status(404).json({ success: false, message: 'categories.csv not found on server' });
    }

    // Parse CSV using csv-parser (handles quoted multi-line fields correctly)
    const rows = await new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(csvPath)
        .pipe(csvParser())
        .on('data', (row) => results.push(row))
        .on('end', () => resolve(results))
        .on('error', reject);
    });

    let updated = 0, skipped = 0, notFound = 0;
    for (const row of rows) {
      const name = (row['Name'] || '').trim();
      const desc = htmlDecode((row['Description'] || '').trim());
      if (!name || !desc) { skipped++; continue; }
      const slug = slugify(name, { lower: true, strict: true });

      // Case-insensitive name match OR slug match
      const result = await prisma.category.updateMany({
        where: {
          OR: [
            { name: { equals: name, mode: 'insensitive' } },
            { slug },
          ],
        },
        data: { description: desc },
      });

      if (result.count > 0) {
        updated += result.count;
      } else {
        notFound++;
      }
    }

    res.json({
      success: true,
      message: `Updated ${updated} categories (${skipped} skipped — no description, ${notFound} not found in DB)`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Build tree structure from flat categories
const buildCategoryTree = (categories, parentId = null) => {
  return categories
    .filter(cat => (cat.parentId || null) === parentId)
    .map(cat => ({
      ...cat,
      children: buildCategoryTree(categories, cat.id)
    }));
};

// Auto-detect parent from name "Parent > Child > Grandchild"
const inferParentFromName = (name, allCategories) => {
  if (!name.includes('>')) return null;
  const parts = name.split('>').map(p => p.trim());
  if (parts.length < 2) return null;
  const parentName = parts.slice(0, -1).join(' > ');
  const parent = allCategories.find(c => c.name === parentName);
  return parent?.id || null;
};

const getCategoryTree = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    // Auto-infer parent relationships from name structure if not set
    const enriched = categories.map(c => ({
      ...c,
      parentId: c.parentId || inferParentFromName(c.name, categories)
    }));
    
    const tree = buildCategoryTree(enriched);
    res.json({ success: true, data: tree });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete categories whose names look like URLs
const cleanupBadCategories = async (req, res) => {
  try {
    const result = await prisma.category.deleteMany({
      where: {
        OR: [
          { name: { startsWith: 'http://' } },
          { name: { startsWith: 'https://' } },
          { name: { contains: 'youbethechamp.com' } }
        ]
      }
    });
    res.json({ success: true, message: `Deleted ${result.count} bad categories`, count: result.count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createCategory = async (req, res) => {
  const { name, description, image, parentId } = req.body;
  const slug = slugify(name, { lower: true, strict: true });

  try {
    const data = { 
      name, 
      slug, 
      description: description || '',
      image: image || null,
      parentId: parentId || null
    };
    const category = await prisma.category.create({ data });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  const { name, description, image, parentId } = req.body;
  const slug = slugify(name, { lower: true, strict: true });

  try {
    const updateData = { name, slug };
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image || null;
    if (parentId !== undefined) updateData.parentId = parentId || null;
    
    if (parentId === req.params.id) {
      return res.status(400).json({ success: false, message: 'Category cannot be its own parent' });
    }
    
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: updateData
    });
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await prisma.category.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryTree,
  getCategoryByName,
  importDescriptions,
  createCategory,
  updateCategory,
  deleteCategory,
  cleanupBadCategories
};
