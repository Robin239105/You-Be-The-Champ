const prisma = require('../utils/prisma');
const slugify = require('slugify');

const getPosts = async (req, res) => {
  const { published, limit = 20, page = 1 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const where = {};
  if (published === 'true') where.isPublished = true;

  try {
    const [posts, total] = await prisma.$transaction([
      prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
        select: { id: true, title: true, slug: true, excerpt: true, coverImage: true, category: true, author: true, isPublished: true, createdAt: true }
      }),
      prisma.blogPost.count({ where })
    ]);
    res.json({ success: true, data: posts, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getPostBySlug = async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug: req.params.slug } });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createPost = async (req, res) => {
  const { title, excerpt, content, coverImage, category, author, isPublished } = req.body;
  if (!title || !content) return res.status(400).json({ success: false, message: 'Title and content are required' });

  const baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;
  while (await prisma.blogPost.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${count++}`;
  }

  try {
    const post = await prisma.blogPost.create({
      data: { title, slug, excerpt: excerpt || '', content, coverImage: coverImage || null, category: category || '', author: author || 'Admin', isPublished: isPublished === true || isPublished === 'true' }
    });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, excerpt, content, coverImage, category, author, isPublished } = req.body;
  try {
    let updateData = { excerpt, content, coverImage, category, author, isPublished: isPublished === true || isPublished === 'true' };
    if (title) {
      updateData.title = title;
      const existing = await prisma.blogPost.findUnique({ where: { id } });
      if (existing && existing.title !== title) {
        const baseSlug = slugify(title, { lower: true, strict: true });
        let slug = baseSlug, count = 1;
        while (await prisma.blogPost.findFirst({ where: { slug, NOT: { id } } })) {
          slug = `${baseSlug}-${count++}`;
        }
        updateData.slug = slug;
      }
    }
    const post = await prisma.blogPost.update({ where: { id }, data: updateData });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    await prisma.blogPost.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const bulkDeletePosts = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ success: false, message: 'ids array required' });
  try {
    const result = await prisma.blogPost.deleteMany({ where: { id: { in: ids } } });
    res.json({ success: true, deleted: result.count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const bulkPublishPosts = async (req, res) => {
  const { ids, isPublished } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ success: false, message: 'ids array required' });
  try {
    await prisma.blogPost.updateMany({ where: { id: { in: ids } }, data: { isPublished: !!isPublished } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getPosts, getPostBySlug, createPost, updatePost, deletePost, bulkDeletePosts, bulkPublishPosts };
