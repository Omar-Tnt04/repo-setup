# ========================================
# Tunisian Top Freelancers - Quick Start
# ========================================

Write-Host "`n🚀 Welcome to Tunisian Top Freelancers Setup!" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# Check if Node.js is installed
Write-Host "📦 Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if MySQL is installed
Write-Host "`n🗄️  Checking MySQL installation..." -ForegroundColor Yellow
try {
    $mysqlVersion = mysql --version
    Write-Host "✅ MySQL is installed" -ForegroundColor Green
} catch {
    Write-Host "⚠️  MySQL not found in PATH. Please ensure MySQL is installed and running." -ForegroundColor Yellow
}

# Install root dependencies
Write-Host "`n📥 Installing project dependencies..." -ForegroundColor Yellow
npm install

# Install backend dependencies
Write-Host "`n📥 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
Set-Location ..

# Install frontend dependencies
Write-Host "`n📥 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location ..

# Check for .env files
Write-Host "`n⚙️  Checking environment configuration..." -ForegroundColor Yellow

$backendEnv = Test-Path "backend\.env"
$frontendEnv = Test-Path "frontend\.env"

if (-not $backendEnv) {
    Write-Host "⚠️  backend\.env not found!" -ForegroundColor Yellow
    Write-Host "   Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "   ⚠️  IMPORTANT: Edit backend\.env with your MySQL password and API keys!" -ForegroundColor Red
}

if (-not $frontendEnv) {
    Write-Host "⚠️  frontend\.env not found!" -ForegroundColor Yellow
    Write-Host "   Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item "frontend\.env.example" "frontend\.env"
    Write-Host "   ⚠️  IMPORTANT: Edit frontend\.env with your Stripe publishable key!" -ForegroundColor Red
}

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "✅ Installation Complete!" -ForegroundColor Green
Write-Host "============================================`n" -ForegroundColor Cyan

Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Edit backend\.env with your credentials:" -ForegroundColor White
Write-Host "   - MySQL password" -ForegroundColor Gray
Write-Host "   - Stripe secret key (get from https://stripe.com/)" -ForegroundColor Gray
Write-Host "   - Gemini API key (get from https://makersuite.google.com/)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Edit frontend\.env with:" -ForegroundColor White
Write-Host "   - Stripe publishable key" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Set up the database:" -ForegroundColor White
Write-Host "   npm run db:setup" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. (Optional) Load sample data:" -ForegroundColor White
Write-Host "   npm run db:seed" -ForegroundColor Cyan
Write-Host ""
Write-Host "5. Start the development servers:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 Full documentation available in SETUP_GUIDE.md" -ForegroundColor Yellow
Write-Host ""
