const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const slugify = require('slugify');

const prisma = new PrismaClient();

function htmlDecode(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

async function main() {
  const csvPath = path.join(__dirname, '..', 'categories.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');

  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`Read ${records.length} categories from CSV`);

  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const row of records) {
    const name = (row['Name'] || '').trim();
    const description = htmlDecode(row['Description'] || '');

    if (!name || !description) {
      skipped++;
      continue;
    }

    const slug = slugify(name, { lower: true, strict: true });

    try {
      const result = await prisma.category.updateMany({
        where: {
          OR: [
            { name: name },
            { slug: slug },
          ],
        },
        data: { description },
      });

      if (result.count > 0) {
        updated += result.count;
      } else {
        notFound++;
        if (notFound <= 10) {
          console.log(`  Not found in DB: "${name}" (slug: ${slug})`);
        }
      }
    } catch (err) {
      console.error(`Error updating "${name}":`, err.message);
    }
  }

  console.log(`\nDone!`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped (no description): ${skipped}`);
  console.log(`  Not found in DB: ${notFound}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
