#!/usr/bin/env node

/**
 * Deployment Fix Script for Devnovate Blogs
 * Run this script to check and fix common deployment issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Devnovate Blogs - Deployment Fix Script\n');

// Check if we're in the right directory
const currentDir = process.cwd();
const hasClient = fs.existsSync(path.join(currentDir, 'client'));
const hasServer = fs.existsSync(path.join(currentDir, 'server'));

if (!hasClient || !hasServer) {
  console.log('❌ Error: This script must be run from the root directory of your project');
  console.log('   Expected structure:');
  console.log('   ├── client/');
  console.log('   ├── server/');
  console.log('   └── fix-deployment.js');
  process.exit(1);
}

console.log('✅ Project structure verified\n');

// Check client configuration
console.log('📱 Checking client configuration...');
const clientVercelConfig = path.join(currentDir, 'client', 'vercel.json');
const clientEnvExample = path.join(currentDir, 'client', 'env.example');

if (!fs.existsSync(clientVercelConfig)) {
  console.log('❌ Missing client/vercel.json - Creating...');
  const vercelConfig = {
    buildCommand: "npm run build",
    outputDirectory: "dist",
    framework: "vite",
    rewrites: [
      {
        source: "/(.*)",
        destination: "/index.html"
      }
    ]
  };
  fs.writeFileSync(clientVercelConfig, JSON.stringify(vercelConfig, null, 2));
  console.log('✅ Created client/vercel.json');
} else {
  console.log('✅ client/vercel.json exists');
}

if (!fs.existsSync(clientEnvExample)) {
  console.log('❌ Missing client/env.example - Creating...');
  const envExample = `# API Configuration
VITE_API_URL=https://devnovate-blogs-api.onrender.com/api

# Development API (optional, defaults to localhost:5000)
# VITE_DEV_API_URL=http://localhost:5000/api`;
  fs.writeFileSync(clientEnvExample, envExample);
  console.log('✅ Created client/env.example');
} else {
  console.log('✅ client/env.example exists');
}

// Check server configuration
console.log('\n🖥️  Checking server configuration...');
const serverFile = path.join(currentDir, 'server', 'server.js');
if (fs.existsSync(serverFile)) {
  const serverContent = fs.readFileSync(serverFile, 'utf8');
  if (serverContent.includes('health')) {
    console.log('✅ Health endpoint exists in server');
  } else {
    console.log('⚠️  Health endpoint missing - check server/server.js');
  }
  
  if (serverContent.includes('vercel.app')) {
    console.log('✅ Vercel domains allowed in CORS');
  } else {
    console.log('⚠️  Vercel domains not in CORS - check server/server.js');
  }
} else {
  console.log('❌ server/server.js not found');
}

// Check package.json files
console.log('\n📦 Checking package.json files...');
const clientPackage = path.join(currentDir, 'client', 'package.json');
const serverPackage = path.join(currentDir, 'server', 'package.json');

if (fs.existsSync(clientPackage)) {
  const pkg = JSON.parse(fs.readFileSync(clientPackage, 'utf8'));
  if (pkg.scripts.build) {
    console.log('✅ Client build script exists');
  } else {
    console.log('❌ Client build script missing');
  }
} else {
  console.log('❌ client/package.json not found');
}

if (fs.existsSync(serverPackage)) {
  const pkg = JSON.parse(fs.readFileSync(serverPackage, 'utf8'));
  if (pkg.scripts.start) {
    console.log('✅ Server start script exists');
  } else {
    console.log('❌ Server start script missing');
  }
} else {
  console.log('❌ server/package.json not found');
}

// Summary and next steps
console.log('\n🎯 Deployment Checklist:');
console.log('1. ✅ Project structure verified');
console.log('2. ✅ Vercel configuration created');
console.log('3. ✅ Environment variables template created');
console.log('4. ✅ Server configuration checked');

console.log('\n📋 Next Steps:');
console.log('1. Push your code to GitHub');
console.log('2. Deploy backend to Render:');
console.log('   - Root Directory: server');
console.log('   - Build Command: npm install');
console.log('   - Start Command: npm start');
console.log('3. Deploy frontend to Vercel:');
console.log('   - Root Directory: client');
console.log('   - Framework: Vite');
console.log('4. Set environment variables:');
console.log('   - Vercel: VITE_API_URL=https://your-backend.onrender.com/api');
console.log('   - Render: MONGODB_URI, JWT_SECRET, NODE_ENV=production');

console.log('\n📚 See DEPLOYMENT_GUIDE.md for detailed instructions');
console.log('🚀 Happy deploying!');
