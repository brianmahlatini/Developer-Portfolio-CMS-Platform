#!/bin/bash

# Developer Portfolio CMS Platform - Quick Setup Script
# This script automates the initial setup process

set -e  # Exit on error

echo "🚀 Developer Portfolio CMS Platform - Setup Script"
echo "=================================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 20+"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm"
    exit 1
fi

if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL client not found (psql)"
    echo "   You'll need to configure DATABASE_URL manually"
fi

echo "✅ Prerequisites OK"
echo "   Node: $(node -v)"
echo "   npm: $(npm -v)"
echo ""

# Setup environment
echo "⚙️  Setting up environment..."

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created .env from template"
    echo "   ⚠️  IMPORTANT: Edit .env with your configuration"
else
    echo "✅ .env already exists"
fi

echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"

echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate
echo "✅ Prisma Client generated"

echo ""

# Database setup
echo "🗄️  Setting up database..."

read -p "Set up database now? (requires DATABASE_URL to be configured) (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running migrations..."
    npm run db:push || echo "⚠️  Migration failed - check DATABASE_URL"
    
    echo "Seeding database..."
    npm run db:seed || echo "⚠️  Seed failed - check database configuration"
    
    echo "✅ Database setup complete"
else
    echo "⏭️  Skipping database setup"
    echo "   Run 'npm run db:push' and 'npm run db:seed' manually later"
fi

echo ""

# Build
echo "🔨 Building application..."
npm run build
echo "✅ Build successful"

echo ""
echo "=================================================="
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env with your configuration (database, JWT secret, etc.)"
echo "2. Start development: npm run dev"
echo "3. Visit: http://localhost:3000"
echo "4. Login with: admin@example.com / admin12345"
echo ""
echo "🐳 For Docker:"
echo "   npm run docker:up"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Project overview"
echo "   - API_DOCS.md - API reference"
echo "   - DEPLOYMENT.md - Deployment guide"
echo "   - TROUBLESHOOTING.md - Common issues"
echo ""
