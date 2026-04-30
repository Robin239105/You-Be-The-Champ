const { PrismaClient } = require('@prisma/client');
const slugify = require('slugify');

const prisma = new PrismaClient();

const getProducts = async (req, res) => {
  const { category, status, search, limit = 20, page = 1 } = req.query;
  const skip = (page - 1) * limit;

  const where = {};
  if (category) where.categories = { some: { slug: category } };
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { sku: { contains: search } }
    ];
  }

  try {
    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: { categories: true, images: true },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let product = null;

    // 1. Try finding by ID first (can be UUID or numeric string)
    try {
      product = await prisma.product.findUnique({
        where: { id: slug },
        include: { categories: true, tags: true, images: true, variants: true }
      });
    } catch (e) {
      // Ignore ID lookup errors
    }


    // 2. If not found by ID (or not a UUID), try finding by slug
    if (!product) {
      product = await prisma.product.findUnique({
        where: { slug: slug },
        include: { categories: true, tags: true, images: true, variants: true }
      });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('GetProduct Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProduct = async (req, res) => {
  const { 
    name, sku, description, shortDescription, price, salePrice, 
    stockQuantity, status, isFeatured, metaTitle, metaDescription,
    categories, tags, images 
  } = req.body;

  const slug = slugify(name, { lower: true, strict: true }) + '-' + sku.toLowerCase();

  try {
    const product = await prisma.product.create({
      data: {
        name, slug, sku, description, shortDescription, 
        price: parseFloat(price), 
        salePrice: salePrice ? parseFloat(salePrice) : null,
        stockQuantity: parseInt(stockQuantity),
        status, isFeatured, metaTitle, metaDescription,
        categories: {
          connect: categories.map(id => ({ id }))
        },
        tags: {
          connect: tags ? tags.map(id => ({ id })) : []
        },
        images: {
          create: images ? images.map(img => ({ url: img.url, isPrimary: img.isPrimary })) : []
        }
      },
      include: { categories: true, images: true }
    });
    if (images && images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((url, idx) => ({
          url,
          productId: product.id,
          isPrimary: idx === 0
        }))
      });
    }

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { 
    name, sku, description, shortDescription, price, salePrice, 
    stockQuantity, status, isFeatured, metaTitle, metaDescription,
    categories, tags, images 
  } = req.body;

  const { id } = req.params;

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name, sku, description, shortDescription,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        stockQuantity: parseInt(stockQuantity),
        status, isFeatured, metaTitle, metaDescription,
        categories: {
          set: categories ? categories.map(catId => ({ id: catId })) : []
        },
        tags: {
          set: tags ? tags.map(tagId => ({ id: tagId })) : []
        }
      }
    });

    // Handle Images Update
    if (images) {
      // Clear old images and add new ones
      await prisma.productImage.deleteMany({ where: { productId: id } });
      
      if (images.length > 0) {
        await prisma.productImage.createMany({
          data: images.map((url, idx) => ({
            url,
            productId: id,
            isPrimary: idx === 0
          }))
        });
      }
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('UpdateProduct Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id }
    });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const exportProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { categories: true, images: true }
    });
    
    // Format for CSV/JSON
    const formatted = products.map(p => ({
      name: p.name,
      sku: p.sku,
      price: p.price,
      salePrice: p.salePrice,
      stockQuantity: p.stockQuantity,
      description: p.description,
      shortDescription: p.shortDescription,
      status: p.status,
      isFeatured: p.isFeatured,
      categories: p.categories.map(c => c.name).join(','),
      images: p.images.map(i => i.url).join(',')
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const importProducts = async (req, res) => {
  const { products } = req.body; // Expecting array of objects

  if (!Array.isArray(products)) {
    return res.status(400).json({ success: false, message: 'Invalid product data format. Expected an array.' });
  }

  const results = {
    created: 0,
    updated: 0,
    errors: []
  };

  const categoryCache = {}; // Cache persists across all products in this request

  try {
    for (const item of products) {
      try {
        const {
          name, sku, price, salePrice, stockQuantity, description, 
          shortDescription, status, isFeatured, categories, images
        } = item;

        if (!name || !sku || !price) {
          results.errors.push(`Skipped: Missing required fields for product ${sku || 'unknown'}`);
          continue;
        }

        const slug = slugify(name, { lower: true, strict: true }) + '-' + sku.toLowerCase();

        // 1. Handle Categories (Create if not exist) with Cache
        const categoryIds = [];


        if (categories) {
          const categoryNames = typeof categories === 'string' ? categories.split(',').map(c => c.trim()) : categories;
          for (const catName of categoryNames) {
            const catSlug = slugify(catName, { lower: true, strict: true });
            
            if (categoryCache[catSlug]) {
              categoryIds.push(categoryCache[catSlug]);
              continue;
            }

            let category = await prisma.category.findUnique({ where: { slug: catSlug } });
            if (!category) {
              category = await prisma.category.create({
                data: { name: catName, slug: catSlug }
              });
            }
            
            categoryCache[catSlug] = category.id;
            categoryIds.push(category.id);
          }
        }


        // 2. Create or Update Product
        const productData = {
          name,
          slug,
          sku,
          description,
          shortDescription,
          price: parseFloat(price),
          salePrice: salePrice ? parseFloat(salePrice) : null,
          stockQuantity: parseInt(stockQuantity) || 0,
          status: status || 'PUBLISHED',
          isFeatured: isFeatured === true || isFeatured === 'true',
          categories: {
            set: categoryIds.map(id => ({ id }))
          }
        };

        let product;
        const existingProduct = await prisma.product.findUnique({ where: { sku } });

        if (existingProduct) {
          product = await prisma.product.update({
            where: { sku },
            data: productData
          });
          results.updated++;
        } else {
          product = await prisma.product.create({
            data: productData
          });
          results.created++;
        }

        // 3. Handle Images (Update or Create)
        if (images) {
          const imageUrls = typeof images === 'string' ? images.split(',').map(i => i.trim()) : images;
          
          // For existing products, clear old images and add new ones (simple replacement strategy)
          if (existingProduct) {
            await prisma.productImage.deleteMany({ where: { productId: product.id } });
          }

          await prisma.productImage.createMany({
            data: imageUrls.map((url, idx) => ({
              url,
              productId: product.id,
              isPrimary: idx === 0
            }))
          });
        }

      } catch (err) {
        results.errors.push(`Error with product ${item.sku}: ${err.message}`);
      }
    }

    res.json({
      success: true,
      message: 'Import process completed',
      summary: results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  getProducts, 
  getProductBySlug, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getCategories,
  exportProducts,
  importProducts
};
