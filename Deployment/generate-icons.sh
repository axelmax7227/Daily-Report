#!/bin/bash

# ===================================
# Icon Generation Script for MASKA Reports PWA
# ===================================

# This script generates all required icon sizes from an SVG source
# You can also use your own PNG icon by replacing the SVG creation

cd "$(dirname "$0")"

echo "🎨 Generating PWA icons..."

# Create SVG icon (you can replace this with your own design)
cat > icons/icon.svg << 'EOF'
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0078d4;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#106ebe;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="512" height="512" rx="80" fill="url(#grad)"/>
  
  <!-- Document icon -->
  <path d="M 160 140 L 280 140 L 352 212 L 352 400 L 160 400 Z" 
        fill="white" opacity="0.95"/>
  <path d="M 280 140 L 280 212 L 352 212" 
        fill="none" stroke="white" stroke-width="4" opacity="0.95"/>
  
  <!-- Lines representing text -->
  <line x1="200" y1="260" x2="312" y2="260" stroke="#0078d4" stroke-width="6" stroke-linecap="round"/>
  <line x1="200" y1="290" x2="312" y2="290" stroke="#0078d4" stroke-width="6" stroke-linecap="round"/>
  <line x1="200" y1="320" x2="280" y2="320" stroke="#0078d4" stroke-width="6" stroke-linecap="round"/>
  <line x1="200" y1="350" x2="300" y2="350" stroke="#0078d4" stroke-width="6" stroke-linecap="round"/>
</svg>
EOF

echo "✓ SVG icon created"

# Check if ImageMagick is installed
if command -v convert &> /dev/null; then
    echo "✓ ImageMagick found, generating PNG icons..."
    
    # Generate all required sizes
    sizes=(72 96 128 144 152 192 384 512)
    
    for size in "${sizes[@]}"; do
        convert -background none icons/icon.svg -resize ${size}x${size} icons/icon-${size}x${size}.png
        echo "  ✓ Generated ${size}x${size}"
    done
    
    echo "✅ All icons generated successfully!"
else
    echo "⚠️  ImageMagick not found. Using alternative method..."
    
    # Alternative: Use Node.js with sharp (if available)
    if command -v node &> /dev/null && npm list sharp &> /dev/null; then
        echo "Using Node.js with sharp..."
        node << 'NODEJS'
const fs = require('fs');
const sharp = require('sharp');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const svgBuffer = fs.readFileSync('icons/icon.svg');

Promise.all(
    sizes.map(size =>
        sharp(svgBuffer)
            .resize(size, size)
            .png()
            .toFile(`icons/icon-${size}x${size}.png`)
            .then(() => console.log(`  ✓ Generated ${size}x${size}`))
    )
).then(() => {
    console.log('✅ All icons generated successfully!');
}).catch(err => {
    console.error('Error generating icons:', err);
});
NODEJS
    else
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "⚠️  Manual Icon Generation Required"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "Please generate PNG icons manually:"
        echo ""
        echo "Option 1: Install ImageMagick"
        echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
        echo "  macOS: brew install imagemagick"
        echo "  Then run this script again"
        echo ""
        echo "Option 2: Install Node.js sharp"
        echo "  npm install sharp"
        echo "  Then run this script again"
        echo ""
        echo "Option 3: Use online tools"
        echo "  - Open icons/icon.svg in your browser"
        echo "  - Use https://realfavicongenerator.net/"
        echo "  - Generate and download all sizes"
        echo ""
        echo "Required sizes: 72, 96, 128, 144, 152, 192, 384, 512"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    fi
fi

echo ""
echo "📱 Next steps:"
echo "  1. (Optional) Replace icons/icon.svg with your custom design"
echo "  2. Generate screenshots for screenshots/ directory"
echo "  3. Deploy the app"
echo ""
