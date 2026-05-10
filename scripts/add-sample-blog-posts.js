const prisma = require('../utils/prisma');

async function addSampleBlogPosts() {
  console.log('🔄 Adding sample blog posts...');
  
  try {
    const samplePosts = [
      {
        title: "The History of Championship Rings: From 1927 to Today",
        slug: "history-of-championship-rings-1927-to-today",
        excerpt: "Explore the fascinating evolution of championship rings, from the first World Series ring to modern masterpieces.",
        content: "<p>Championship rings have come a long way since their inception in 1927. The first championship ring was awarded to the New York Yankees after winning the 1927 World Series. Since then, these symbols of victory have evolved dramatically in design, materials, and significance.</p><p>Early rings were simple gold bands with minimal engraving. Today's championship rings are intricate works of art featuring diamonds, precious stones, and detailed craftsmanship that can cost upwards of $30,000.</p>",
        coverImage: "/Slider 1.jpg",
        category: "History",
        author: "You Be The Champ Team",
        isPublished: true
      },
      {
        title: "Top 5 Most Valuable Championship Rings of All Time",
        slug: "top-5-most-valuable-championship-rings",
        excerpt: "Discover the rarest and most expensive championship rings ever sold at auction and their incredible stories.",
        content: "<p>Championship rings aren't just symbols of victory - they're valuable collectibles that can fetch incredible prices at auction. From the 1972 Miami Dolphins perfect season ring to Michael Jordan's first championship ring, these pieces carry immense historical and monetary value.</p><p>The most expensive championship ring ever sold was a 1956 Yankees World Series ring that fetched over $2 million at auction, demonstrating the incredible investment potential of these sports artifacts.</p>",
        coverImage: "/Slider 2.jpg",
        category: "Collectibles",
        author: "Sports Memorabilia Expert",
        isPublished: true
      },
      {
        title: "How Championship Rings Are Made: Behind the Scenes",
        slug: "how-championship-rings-are-made-behind-scenes",
        excerpt: "Take an exclusive look at the meticulous craftsmanship and technology behind creating championship rings.",
        content: "<p>Creating a championship ring is a complex process that combines traditional jewelry-making techniques with modern technology. Each ring typically takes 4-6 weeks to complete and involves multiple skilled craftsmen.</p><p>The process begins with detailed CAD designs, followed by wax casting, stone setting, and final polishing. Most championship rings contain 10-15 carats of diamonds and precious stones, with each stone being individually set by hand.</p>",
        coverImage: "/Slider 3 Main.jpg",
        category: "Craftsmanship",
        author: "Master Jeweler",
        isPublished: true
      }
    ];

    for (const post of samplePosts) {
      // Check if post already exists
      const existing = await prisma.blogPost.findUnique({
        where: { slug: post.slug }
      });

      if (!existing) {
        await prisma.blogPost.create({
          data: post
        });
        console.log(`✅ Created: ${post.title}`);
      } else {
        console.log(`⚠️  Already exists: ${post.title}`);
      }
    }

    console.log('\n🎉 Sample blog posts added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding blog posts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleBlogPosts();
