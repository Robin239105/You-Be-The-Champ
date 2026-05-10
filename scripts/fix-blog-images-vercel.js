const prisma = require('../utils/prisma');

async function fixBlogImagesForVercel() {
  console.log('🔄 Fixing blog images for Vercel deployment...');
  
  try {
    // Update existing blog posts to use working images
    const updates = [
      {
        slug: "history-of-championship-rings-1927-to-today",
        coverImage: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg" // Using Cloudinary demo image
      },
      {
        slug: "top-5-most-valuable-championship-rings",
        coverImage: "https://res.cloudinary.com/demo/image/upload/v1/sample2.jpg" // Using Cloudinary demo image
      },
      {
        slug: "how-championship-rings-are-made-behind-scenes",
        coverImage: "https://res.cloudinary.com/demo/image/upload/v1/sample3.jpg" // Using Cloudinary demo image
      }
    ];

    for (const update of updates) {
      const post = await prisma.blogPost.findUnique({
        where: { slug: update.slug }
      });

      if (post) {
        await prisma.blogPost.update({
          where: { slug: update.slug },
          data: { coverImage: update.coverImage }
        });
        console.log(`✅ Updated image for: ${post.title}`);
      } else {
        console.log(`⚠️  Post not found: ${update.slug}`);
      }
    }

    console.log('\n🎉 Blog images fixed for Vercel deployment!');
    
  } catch (error) {
    console.error('❌ Error fixing blog images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixBlogImagesForVercel();
