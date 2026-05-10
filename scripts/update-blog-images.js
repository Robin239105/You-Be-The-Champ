const prisma = require('../utils/prisma');

async function updateBlogImages() {
  console.log('🔄 Updating blog post images...');
  
  try {
    const updates = [
      {
        slug: "history-of-championship-rings-1927-to-today",
        coverImage: "/Slider 1.jpg"
      },
      {
        slug: "top-5-most-valuable-championship-rings",
        coverImage: "/Slider 2.jpg"
      },
      {
        slug: "how-championship-rings-are-made-behind-scenes",
        coverImage: "/Slider 3 Main.jpg"
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

    console.log('\n🎉 Blog post images updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating blog images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateBlogImages();
