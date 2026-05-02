const prisma = require('../utils/prisma');
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');

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

    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    const nameIdx = headers.indexOf('Name');
    const descIdx = headers.indexOf('Description');
    if (nameIdx === -1 || descIdx === -1) {
      return res.status(400).json({ success: false, message: 'CSV missing Name or Description column' });
    }

    const rows = [];
    let inQuote = false;
    let currentRow = [];
    let currentField = '';

    for (let lineNum = 1; lineNum < lines.length; lineNum++) {
      const line = lines[lineNum];
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') { inQuote = !inQuote; }
        else if (ch === ',' && !inQuote) { currentRow.push(currentField); currentField = ''; }
        else { currentField += ch; }
      }
      if (!inQuote) {
        currentRow.push(currentField);
        currentField = '';
        if (currentRow.length > Math.max(nameIdx, descIdx)) rows.push(currentRow);
        currentRow = [];
      } else {
        currentField += '\n';
      }
    }

    let updated = 0, skipped = 0;
    for (const row of rows) {
      const name = (row[nameIdx] || '').replace(/^"|"$/g, '').trim();
      const desc = htmlDecode((row[descIdx] || '').replace(/^"|"$/g, '').trim());
      if (!name || !desc) { skipped++; continue; }
      const slug = slugify(name, { lower: true, strict: true });
      const result = await prisma.category.updateMany({
        where: { OR: [{ name }, { slug }] },
        data: { description: desc },
      });
      updated += result.count;
    }

    res.json({ success: true, message: `Updated ${updated} categories, skipped ${skipped}` });
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

const createCategory = async (req, res) => {
  const { name, description } = req.body;
  const slug = slugify(name, { lower: true, strict: true });

  try {
    const category = await prisma.category.create({
      data: { name, slug, description: description || '' }
    });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  const { name, description } = req.body;
  const slug = slugify(name, { lower: true, strict: true });

  try {
    const updateData = { name, slug };
    if (description !== undefined) updateData.description = description;
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
  getCategoryByName,
  importDescriptions,
  createCategory,
  updateCategory,
  deleteCategory
};
