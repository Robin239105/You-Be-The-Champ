const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, '../../You Be The Champ cPanel');

// 1. Update prisma/schema.prisma
const schemaPath = path.join(targetDir, 'prisma', 'schema.prisma');
let schemaContent = fs.readFileSync(schemaPath, 'utf8');
schemaContent = schemaContent.replace(/provider\s*=\s*"postgresql"/g, 'provider = "mysql"');
schemaContent = schemaContent.replace(/directUrl\s*=\s*env\("POSTGRES_URL_NON_POOLING"\)/g, '');
schemaContent = schemaContent.replace(/url\s*=\s*env\("POSTGRES_PRISMA_URL"\)/g, 'url = env("DATABASE_URL")');
fs.writeFileSync(schemaPath, schemaContent, 'utf8');

// 2. Update .env
const envPath = path.join(targetDir, '.env');
let envContent = '';
if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
}
envContent += '\n# MySQL Connection for cPanel\nDATABASE_URL="mysql://username:password@localhost:3306/db_name"\n';
fs.writeFileSync(envPath, envContent, 'utf8');

// 3. Update server.js
const serverPath = path.join(targetDir, 'server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

// Remove vercel export
serverContent = serverContent.replace(/module\.exports\s*=\s*app;/g, '');

// Add static serving
const staticCode = `
// --- CPANEL REACT INTEGRATION ---
// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
`;

// Insert the static code right after the API routes but before the error handler
serverContent = serverContent.replace(/\/\/ 4\. Error Handler/g, staticCode + '\n// 4. Error Handler');

fs.writeFileSync(serverPath, serverContent, 'utf8');

console.log("Migration modifications completed successfully.");
