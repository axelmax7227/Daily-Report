# 📂 Complete File Reference

This document explains every file in the MASKA Reports PWA project.

---

## 📋 Documentation Files

### QUICKSTART.md
**Purpose:** Get up and running in 5 minutes  
**Who needs it:** Everyone starting fresh  
**Contents:**
- Quick setup steps
- Minimal configuration
- Fast deployment guide
- Basic troubleshooting

### README.md
**Purpose:** Main project documentation  
**Who needs it:** Developers and admins  
**Contents:**
- Feature overview
- Installation instructions
- Configuration guide
- Technical details
- Troubleshooting
- FAQ

### DEPLOYMENT_GUIDE.md
**Purpose:** Step-by-step deployment walkthrough  
**Who needs it:** First-time deployers  
**Contents:**
- Detailed Azure setup
- Multiple deployment options
- Environment configuration
- Testing checklist

### USER_GUIDE.md
**Purpose:** End-user instructions  
**Who needs it:** Daily report creators  
**Contents:**
- How to create reports
- How to manage history
- OneDrive sync guide
- Tips and best practices
- Examples

### PROJECT_SUMMARY.md
**Purpose:** Project overview and completion status  
**Who needs it:** Project managers, developers  
**Contents:**
- Features implemented
- Technology stack
- File structure
- Metrics and stats
- Future enhancements

---

## 🌐 Web Application Files

### index.html
**Purpose:** Main application page  
**Type:** HTML5  
**Size:** ~6 KB  
**Key Features:**
- Report creation form
- Project and task management UI
- Preview section
- History modal
- Responsive layout

**Critical Elements:**
```html
<!-- Main form -->
<form id="report-form">
  - Date picker
  - Location dropdown
  - Time inputs
  - Projects container
  - General tasks container
</form>

<!-- Preview panel -->
<section class="preview-section">
  - Email subject
  - Email body
</section>

<!-- History modal -->
<div id="history-modal">
  - Past reports list
  - Load/delete actions
</div>
```

### auth-callback.html
**Purpose:** OAuth redirect handler  
**Type:** HTML + JavaScript  
**Size:** ~4 KB  
**Function:**
- Receives OAuth token from Microsoft
- Parses URL fragment
- Sends token to parent window
- Handles errors
- Auto-closes after success

**When Used:**
- During OneDrive authentication
- User clicks "☁️ Sync" button
- Popup window opens Microsoft login
- Redirects here after authentication
- Passes token back to main app

---

## 🎨 Styling Files

### styles.css
**Purpose:** All application styles  
**Type:** CSS3  
**Size:** ~14 KB  
**Organization:**
1. CSS Variables (colors, spacing)
2. Reset and base styles
3. Layout (container, header, main)
4. Components (buttons, forms, cards)
5. Responsive breakpoints
6. Animations

**Key Features:**
- Mobile-first design
- Flexbox and Grid layouts
- Smooth transitions
- Touch-friendly sizing
- Print styles
- Dark mode ready (variables)

**Responsive Breakpoints:**
```css
@media (max-width: 768px)  /* Tablet */
@media (max-width: 480px)  /* Mobile */
@media (min-width: 1024px) /* Desktop */
```

---

## 💻 JavaScript Files

### app.js
**Purpose:** Main application logic  
**Type:** ES6+ JavaScript  
**Size:** ~19 KB  
**Functions:**
- State management
- UI rendering
- Report generation
- Event handlers
- Preview updates
- Clipboard operations

**Key Components:**
```javascript
// State
state = {
    projects: [],
    generalTasks: [],
    currentReport: null
}

// Main Functions
- generateReport()
- updatePreview()
- saveReport()
- copyToClipboard()
- renderProjects()
- updateTotalHours()
```

### db.js
**Purpose:** Database operations  
**Type:** ES6+ JavaScript  
**Size:** ~11 KB  
**Database:** IndexedDB  
**Functions:**
- Initialize database
- CRUD operations (Create, Read, Update, Delete)
- Search and filter
- Export/import
- Statistics

**Key Functions:**
```javascript
- initDB()
- saveReportToDB(report)
- getReportFromDB(id)
- getAllReportsFromDB()
- deleteReportFromDB(id)
- searchReports(keyword)
- getReportStatistics()
```

### auth.js
**Purpose:** OneDrive authentication  
**Type:** ES6+ JavaScript  
**Size:** ~8 KB  
**Protocol:** OAuth 2.0  
**Functions:**
- Token management
- Authentication flow
- Popup handling
- Token expiry
- Client ID storage

**Key Functions:**
```javascript
- authenticateOneDrive()
- isAuthenticated()
- getToken()
- saveToken(token, expiry)
- signOut()
- getUserInfo()
```

### onedrive.js
**Purpose:** OneDrive API integration  
**Type:** ES6+ JavaScript  
**Size:** ~12 KB  
**API:** Microsoft Graph  
**Functions:**
- File upload/download
- Folder management
- Sync operations
- Error handling

**Key Functions:**
```javascript
- uploadToOneDrive(report)
- downloadFromOneDrive(filename)
- listOneDriveReports()
- deleteFromOneDrive(fileId)
- syncAllReportsToOneDrive()
- ensureReportsFolder()
```

### service-worker.js
**Purpose:** PWA offline functionality  
**Type:** Service Worker  
**Size:** ~8 KB  
**Features:**
- Asset caching
- Offline support
- Background sync
- Update handling

**Cache Strategy:**
```javascript
// Precache on install
PRECACHE_URLS = [
    '/', '/index.html', '/styles.css',
    '/app.js', '/db.js', '/auth.js',
    '/onedrive.js', ...
]

// Runtime caching for dynamic content
// Network-first for API calls
// Cache-first for static assets
```

### sw-register.js
**Purpose:** Service worker registration  
**Type:** ES6+ JavaScript  
**Size:** ~11 KB  
**Functions:**
- Register service worker
- Handle updates
- Install prompts
- Online/offline detection

**Features:**
- Auto-update check
- Install banner (desktop/mobile)
- Update notification
- PWA detection

---

## 📱 PWA Configuration Files

### manifest.json
**Purpose:** Web App Manifest  
**Type:** JSON  
**Size:** ~2 KB  
**Defines:**
- App name and description
- Display mode (standalone)
- Theme colors
- App icons (all sizes)
- Start URL
- Shortcuts

**Key Properties:**
```json
{
  "name": "MASKA Daily Reports",
  "short_name": "MASKA Reports",
  "display": "standalone",
  "theme_color": "#0078d4",
  "icons": [...],
  "shortcuts": [...]
}
```

---

## 🚀 Deployment Files

### vercel.json
**Purpose:** Vercel deployment config  
**Type:** JSON  
**Size:** ~1 KB  
**Configures:**
- Static file serving
- Headers (security, caching)
- Service worker cache control
- CORS settings

### package.json
**Purpose:** Project metadata  
**Type:** JSON  
**Size:** ~1 KB  
**Contains:**
- Project info
- Scripts (start, deploy)
- Keywords
- License

**Useful Scripts:**
```json
{
  "scripts": {
    "start": "python3 -m http.server 8000",
    "serve": "npx serve -p 8000",
    "deploy": "vercel --prod",
    "icons": "./generate-icons.sh"
  }
}
```

### .gitignore
**Purpose:** Git ignore rules  
**Type:** Text  
**Size:** <1 KB  
**Ignores:**
- node_modules/
- .env files
- Build outputs
- Editor configs
- OS files

---

## 🛠️ Utility Files

### generate-icons.sh
**Purpose:** Generate PWA icons  
**Type:** Bash script  
**Size:** ~4 KB  
**Functions:**
- Creates SVG source icon
- Generates all PNG sizes
- Checks for ImageMagick
- Provides fallback instructions

**Required Sizes:**
- 72x72, 96x96, 128x128
- 144x144, 152x152, 192x192
- 384x384, 512x512

**Usage:**
```bash
chmod +x generate-icons.sh
./generate-icons.sh
```

---

## 📁 Directories

### icons/
**Purpose:** App icon storage  
**Contents:**
- icon.svg (source)
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

**Note:** Icons must be generated using `generate-icons.sh`

### screenshots/
**Purpose:** App screenshots for app stores  
**Recommended:**
- desktop.png (1280x720)
- mobile.png (750x1334)
- tablet.png (1024x768)

**Note:** Screenshots are optional but improve PWA appearance

---

## 📊 File Size Summary

| Category | Files | Total Size | % of Project |
|----------|-------|------------|--------------|
| HTML | 2 | ~10 KB | 6% |
| CSS | 1 | ~14 KB | 9% |
| JavaScript | 6 | ~69 KB | 43% |
| Documentation | 5 | ~70 KB | 44% |
| Config | 4 | ~6 KB | 4% |
| Icons (after gen) | 9 | ~50-100 KB | varies |
| **Total (core)** | **18** | **~160 KB** | **100%** |

---

## 🔄 File Dependencies

```
index.html
├── styles.css
├── app.js
│   ├── db.js
│   ├── auth.js
│   └── onedrive.js
├── sw-register.js
│   └── service-worker.js
└── manifest.json
    └── icons/*

auth-callback.html
└── (standalone, minimal dependencies)
```

---

## 🎯 Critical Files (Don't Delete!)

These files are essential for the app to work:

**Absolutely Required:**
1. `index.html` - Main app
2. `styles.css` - All styling
3. `app.js` - Core logic
4. `db.js` - Data storage
5. `manifest.json` - PWA config

**Required for OneDrive:**
6. `auth.js` - Authentication
7. `onedrive.js` - API integration
8. `auth-callback.html` - OAuth handler

**Required for PWA:**
9. `service-worker.js` - Offline support
10. `sw-register.js` - SW registration
11. `icons/*` - App icons (all sizes)

**Optional but Recommended:**
- All documentation files
- `generate-icons.sh`
- `vercel.json`
- `package.json`

---

## 📝 Customization Guide

### Change Colors
**File:** `styles.css`  
**Section:** `:root` variables  
```css
:root {
    --primary-color: #0078d4;     /* Change this */
    --primary-hover: #106ebe;     /* And this */
}
```

### Change Report Format
**File:** `app.js`  
**Function:** `generateReport()`  
```javascript
function generateReport() {
    let body = `Dear Dionisis,\n\n`;  // Customize greeting
    body += `Today, I worked...`;      // Customize format
    // ...
}
```

### Change App Name
**Files to update:**
1. `manifest.json` → `name` and `short_name`
2. `index.html` → `<title>` and `<h1>`
3. `package.json` → `name` field

### Add New Features
1. Add HTML in `index.html`
2. Add styles in `styles.css`
3. Add logic in `app.js`
4. Update service worker cache if needed

---

## 🧪 Testing Each File

### Test HTML Files
```bash
# Open in browser
open index.html
open auth-callback.html
```

### Test CSS
```bash
# Check for syntax errors
npx stylelint styles.css
```

### Test JavaScript
```bash
# Check for syntax errors
npx eslint *.js
```

### Test PWA
```bash
# Use Lighthouse
npx lighthouse http://localhost:8000 --view
```

---

## 💾 Backup Recommendations

**Essential Files to Backup:**
- All `.js` files (your logic)
- `index.html` (your UI)
- `styles.css` (your design)
- `manifest.json` (your config)
- Documentation files

**Data Backups:**
- Export IndexedDB regularly
- OneDrive is your backup (if synced)
- Consider Git for version control

---

## 🎓 Learning Resources

Each file teaches different concepts:

**HTML/CSS Beginners:**
- Start with `index.html` and `styles.css`
- Learn form handling and responsive design

**JavaScript Beginners:**
- Read `app.js` for DOM manipulation
- Study `db.js` for IndexedDB basics

**Intermediate Developers:**
- Explore `auth.js` for OAuth 2.0
- Study `service-worker.js` for PWA

**Advanced Developers:**
- Review complete architecture
- Understand offline-first patterns
- Study state management without frameworks

---

## 📞 File-Specific Questions

**"Why is there no build step?"**
- Using vanilla JS = no bundler needed
- Simpler deployment
- Easier debugging

**"Why separate JS files?"**
- Modular architecture
- Easier maintenance
- Clear separation of concerns

**"Why IndexedDB not localStorage?"**
- Larger storage capacity
- Structured data support
- Better for complex apps

**"Why service worker?"**
- Required for PWA
- Enables offline mode
- Caching strategy

---

## ✅ File Completion Checklist

Before deployment, verify:

- [ ] All HTML files load without errors
- [ ] CSS validates and renders correctly
- [ ] JavaScript files have no syntax errors
- [ ] Service worker registers successfully
- [ ] Manifest is valid JSON
- [ ] Icons are generated (all sizes)
- [ ] Auth callback handles OAuth correctly
- [ ] Database operations work
- [ ] OneDrive integration functional
- [ ] Documentation is current

---

**This reference covers all files in the project.**  
**For usage instructions, see USER_GUIDE.md**  
**For deployment, see DEPLOYMENT_GUIDE.md**
