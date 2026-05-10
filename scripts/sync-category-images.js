const prisma = require('../utils/prisma');
const { categoryThumbnails } = require('../src/data/categoryThumbnails');

async function syncCategoryImages() {
  console.log('🔄 Syncing category thumbnails to database...');
  
  try {
    const categories = await prisma.category.findMany();
    let updated = 0;
    let skipped = 0;
    
    for (const category of categories) {
      // Build full category path
      const path = await getCategoryPath(category, categories);
      
      // Check if we have a thumbnail for this path
      const thumbnail = getCategoryThumbnail(path);
      
      if (thumbnail && category.image !== thumbnail) {
        await prisma.category.update({
          where: { id: category.id },
          data: { image: thumbnail }
        });
        console.log(`✅ Updated: ${path} -> ${thumbnail}`);
        updated++;
      } else if (!thumbnail) {
        console.log(`⚠️  No thumbnail found: ${path}`);
        skipped++;
      } else {
        console.log(`✓ Already synced: ${path}`);
        skipped++;
      }
    }
    
    console.log(`\n🎉 Sync complete!`);
    console.log(`📊 Updated: ${updated} categories`);
    console.log(`📊 Skipped: ${skipped} categories`);
    
  } catch (error) {
    console.error('❌ Error syncing images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to build category path
async function getCategoryPath(category, allCategories) {
  const path = [];
  let current = category;
  
  while (current) {
    path.unshift(current.name);
    if (current.parentId) {
      current = allCategories.find(c => c.id === current.parentId);
    } else {
      break;
    }
  }
  
  return path.join(' > ');
}

// Helper function to get thumbnail (copied from frontend)
function getCategoryThumbnail(path) {
  if (!path) return null;
  const p = path.trim();
  if (categoryThumbnails[p]) return categoryThumbnails[p];
  const keys = Object.keys(categoryThumbnails);
  const match = keys.find(k => k.startsWith(p + ' >') || p.startsWith(k + ' >'));
  return match ? categoryThumbnails[match] : null;
}

// Run the sync
syncCategoryImages();
