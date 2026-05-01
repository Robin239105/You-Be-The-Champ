import csv, json, glob, os, sys

base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 1. ATG thumbnails from categories.csv
atg_thumbs = {}
with open(os.path.join(base, 'categories.csv'), encoding='utf-8') as f:
    for row in csv.DictReader(f):
        thumb = row.get('Thumbnail URL', '').strip()
        if thumb:
            atg_thumbs[row['Name'].strip()] = thumb

# 2. Product-derived thumbnails
cat_img = {}
for path in sorted(glob.glob(os.path.join(base, 'src/data/products/products_*.json'))):
    with open(path) as f:
        products = json.load(f)
    for p in products:
        imgs = p.get('images', [])
        if not imgs:
            continue
        img = imgs[0].strip()
        for cat in p.get('categories', []):
            cat = cat.strip()
            if cat and cat not in cat_img:
                cat_img[cat] = img

# 3. Override ATG entries with real CSV thumbnails
for name, thumb in atg_thumbs.items():
    cat_img['All Time Greats > ' + name] = thumb

# 4. Write JS file
out_path = os.path.join(base, 'src/data/categoryThumbnails.js')
lines = [
    '// Auto-generated — do not edit manually',
    '// Source: categories.csv (ATG) + products_*.json (all others)',
    'export const categoryThumbnails = {'
]
for k, v in sorted(cat_img.items()):
    k2 = k.replace('\\', '\\\\').replace("'", "\\'")
    v2 = v.replace('\\', '\\\\').replace("'", "\\'")
    lines.append("  '" + k2 + "': '" + v2 + "',")
lines.append('};')
lines.append('')
lines.append('export function getCategoryThumbnail(path) {')
lines.append('  if (!path) return null;')
lines.append('  const p = path.trim();')
lines.append('  if (categoryThumbnails[p]) return categoryThumbnails[p];')
lines.append('  const keys = Object.keys(categoryThumbnails);')
lines.append("  const match = keys.find(k => k.startsWith(p + ' >') || p.startsWith(k + ' >'));")
lines.append('  return match ? categoryThumbnails[match] : null;')
lines.append('}')

with open(out_path, 'w') as f:
    f.write('\n'.join(lines) + '\n')

print('Done. Entries:', len(cat_img))
print('ATG from CSV:', len(atg_thumbs))
print('Written to:', out_path)
