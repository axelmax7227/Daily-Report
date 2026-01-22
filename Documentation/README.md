# 📊 MASKA Daily Reports PWA

A Progressive Web App for generating and managing daily work reports with automatic OneDrive synchronization.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![PWA](https://img.shields.io/badge/PWA-enabled-success.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- ✅ **Daily Report Generator** - Create structured daily work reports
- ☁️ **OneDrive Integration** - Automatic synchronization with Microsoft OneDrive
- 📱 **Progressive Web App** - Install on any device (desktop, mobile, tablet)
- 💾 **Offline Support** - Works without internet connection
- 📊 **Report History** - View and manage past reports
- 🔄 **Auto-sync** - Seamless synchronization across devices
- 📋 **Copy to Clipboard** - Easy email integration
- 🎨 **Responsive Design** - Optimized for all screen sizes

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Azure App Registration](#-azure-app-registration)
- [Deployment](#-deployment)
- [Usage Guide](#-usage-guide)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting)
- [FAQ](#-faq)

## 🚀 Quick Start

### 1. Clone or Download

```bash
# Download the project files to your local machine
cd maska-reports-pwa
```

### 2. Generate Icons

```bash
# Make the script executable
chmod +x generate-icons.sh

# Run the icon generation script
./generate-icons.sh
```

### 3. Test Locally

```bash
# Option 1: Using Python
python3 -m http.server 8000

# Option 2: Using Node.js
npx serve

# Then open: http://localhost:8000
```

### 4. Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 📦 Prerequisites

### Required

- **Modern Web Browser** (Chrome, Firefox, Safari, Edge)
- **Microsoft Account** (for OneDrive integration)
- **HTTPS** (required for PWA features)

### Optional (for development)

- **Node.js** (v14+)
- **ImageMagick** (for icon generation)
- **Git** (for version control)

## 🔧 Installation

### Local Development Setup

1. **Download Project Files**
   ```bash
   # If using Git
   git clone <repository-url>
   cd maska-reports-pwa
   ```

2. **Generate Icons**
   ```bash
   chmod +x generate-icons.sh
   ./generate-icons.sh
   ```

3. **Start Local Server**
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # OR using Node.js
   npx serve -p 8000
   
   # OR using PHP
   php -S localhost:8000
   ```

4. **Open in Browser**
   ```
   http://localhost:8000
   ```

### Installing on Devices

#### Desktop (Windows/Mac/Linux)

1. Open the app in Chrome, Edge, or Safari
2. Look for the install icon in the address bar (⊕ or similar)
3. Click "Install" or press `Ctrl/Cmd + Shift + A`
4. The app will be added to your applications

#### Mobile (iOS)

1. Open the app in Safari
2. Tap the Share button (📤)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

#### Mobile (Android)

1. Open the app in Chrome
2. Tap the three-dot menu (⋮)
3. Tap "Add to Home screen" or "Install app"
4. Tap "Add" or "Install"

## 🔐 Azure App Registration

To enable OneDrive integration, you need to register an application in Azure:

### Step-by-Step Guide

#### 1. Access Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Sign in with your Microsoft account
3. If you don't have access, you can use a free Azure account

#### 2. Register New Application

1. Search for "**Azure Active Directory**" or "**Microsoft Entra ID**"
2. Click "**App registrations**" in the left menu
3. Click "**+ New registration**"

#### 3. Configure Application

Fill in the registration form:

- **Name**: `MASKA Reports` (or your preferred name)
- **Supported account types**: 
  - Select "**Accounts in any organizational directory and personal Microsoft accounts**"
- **Redirect URI**: 
  - Platform: **Web**
  - URI: `https://your-app-url.vercel.app/auth-callback.html`
  - For local testing: `http://localhost:8000/auth-callback.html`

#### 4. Get Client ID

1. After registration, you'll see the **Overview** page
2. Copy the **Application (client) ID**
3. Save this for later - you'll need it in the app

#### 5. Configure API Permissions

1. Click "**API permissions**" in the left menu
2. Click "**+ Add a permission**"
3. Select "**Microsoft Graph**"
4. Select "**Delegated permissions**"
5. Add these permissions:
   - `Files.ReadWrite` (Read and write user files)
   - `User.Read` (Sign in and read user profile)
6. Click "**Add permissions**"
7. Click "**Grant admin consent** " (optional, but recommended)

#### 6. Configure Authentication

1. Click "**Authentication**" in the left menu
2. Under "**Implicit grant and hybrid flows**", enable:
   - ✅ **Access tokens**
   - ✅ **ID tokens**
3. Click "**Save**"

### Testing the Configuration

1. Open your deployed app
2. Click the **☁️ Sync** button
3. Enter your **Client ID** when prompted
4. You should be redirected to Microsoft login
5. Grant the requested permissions
6. You should be redirected back to the app

### Multiple Environments

You can add multiple redirect URIs for different environments:

```
Production: https://maska-reports.vercel.app/auth-callback.html
Staging:    https://maska-reports-staging.vercel.app/auth-callback.html
Local:      http://localhost:8000/auth-callback.html
```

## 🌐 Deployment

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy static sites with custom domains and HTTPS.

#### Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd maska-reports-pwa
vercel --prod
```

#### Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub, GitLab, or Bitbucket
3. Click "**Add New Project**"
4. Import your Git repository or upload files
5. Configure:
   - **Framework Preset**: Other
   - **Build Command**: (leave empty)
   - **Output Directory**: `.` (current directory)
6. Click "**Deploy**"

#### Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click "**Domains**"
3. Add your custom domain
4. Follow DNS configuration instructions

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd maska-reports-pwa
netlify deploy --prod --dir .
```

### Option 3: Azure Static Web Apps

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new **Static Web App**
3. Connect to your Git repository
4. Configure build:
   - **App location**: `/`
   - **Output location**: `/`
5. Deploy

### Option 4: GitHub Pages

```bash
# Assuming you have a GitHub repository

# Create gh-pages branch
git checkout -b gh-pages

# Add all files
git add .
git commit -m "Deploy to GitHub Pages"

# Push
git push origin gh-pages

# Enable GitHub Pages in repository settings
# Set source to gh-pages branch
```

### Option 5: Self-Hosted

#### Using Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    root /var/www/maska-reports;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Service worker cache control
    location /service-worker.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma no-cache;
        add_header Expires 0;
    }
    
    # Enable CORS if needed
    location ~* \.(json|svg|png|jpg|jpeg)$ {
        add_header Access-Control-Allow-Origin "*";
    }
}
```

#### Using Apache

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    Redirect permanent / https://your-domain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName your-domain.com
    DocumentRoot /var/www/maska-reports
    
    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem
    
    <Directory /var/www/maska-reports>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Fallback to index.html
        FallbackResource /index.html
    </Directory>
    
    # Disable caching for service worker
    <Files "service-worker.js">
        Header set Cache-Control "no-cache, no-store, must-revalidate"
        Header set Pragma "no-cache"
        Header set Expires 0
    </Files>
</VirtualHost>
```

## 📖 Usage Guide

### Creating a Daily Report

1. **Open the App**
   - Launch the installed PWA or visit the web URL

2. **Fill in Basic Information**
   - **Date**: Auto-filled with today's date (you can change it)
   - **Work Location**: Select "TF" or "Remote"
   - **Work Hours**: Set start and end time (24-hour format)

3. **Add Projects**
   - Click "**+ Add Project**"
   - Enter project name (e.g., "ROB4GREEN", "MASKA")
   - Click "**+ Add Task**" to add tasks to the project
   - Enter task description and hours

4. **Add General Tasks** (Optional)
   - Click "**+ Add General Task**"
   - Enter task description

5. **Preview Report**
   - Click "**👁️ Preview**" to see the formatted email
   - Review the subject line and body

6. **Save Report**
   - Click "**💾 Save Report**"
   - Report is saved locally
   - Automatically uploads to OneDrive if authenticated

7. **Copy to Email**
   - Click "**📋 Copy to Clipboard**"
   - Open your email client
   - Paste the report
   - Send to recipients

### Managing Reports

#### View History

1. Click the "**📋 History**" button in the header
2. Browse through your past reports
3. Click "**Load**" to edit a previous report
4. Click "**Delete**" to remove a report (both local and OneDrive)

#### Syncing with OneDrive

1. **First-Time Setup**
   - Click the "**☁️ Sync**" button
   - Enter your Azure App Client ID
   - Authenticate with Microsoft
   - Grant permissions

2. **Automatic Sync**
   - Reports are automatically uploaded when saved
   - Manual sync: Click "**☁️ Sync**" anytime

3. **Offline Mode**
   - Reports are saved locally when offline
   - Automatically sync when connection is restored

### Working Offline

The app works fully offline after the first visit:

- ✅ Create new reports
- ✅ Edit existing reports  
- ✅ View history
- ✅ Copy to clipboard
- ⏳ OneDrive sync (when back online)

### Keyboard Shortcuts

- `Ctrl/Cmd + S` - Save report
- `Ctrl/Cmd + P` - Preview
- `Ctrl/Cmd + K` - Copy to clipboard
- `Ctrl/Cmd + H` - Open history

## 🛠️ Development

### Project Structure

```
maska-reports-pwa/
├── index.html              # Main application page
├── auth-callback.html      # OAuth callback handler
├── manifest.json           # PWA manifest
├── service-worker.js       # Service worker for offline support
├── sw-register.js          # Service worker registration
├── styles.css              # Application styles
├── app.js                  # Main application logic
├── db.js                   # IndexedDB database management
├── auth.js                 # OneDrive authentication
├── onedrive.js             # OneDrive API integration
├── generate-icons.sh       # Icon generation script
├── icons/                  # App icons
│   ├── icon.svg           # Source SVG icon
│   └── icon-*.png         # Generated PNG icons
├── screenshots/            # App screenshots for stores
└── README.md              # This file
```

### Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Storage**: IndexedDB for local data persistence
- **API**: Microsoft Graph API for OneDrive
- **PWA**: Service Workers, Web App Manifest
- **Authentication**: OAuth 2.0 with Microsoft Identity Platform

### Local Development

```bash
# Start development server
python3 -m http.server 8000

# Open browser
open http://localhost:8000

# Test PWA features (requires HTTPS)
# Use ngrok for HTTPS tunnel:
ngrok http 8000
```

### Testing

#### Browser Testing

Test in multiple browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (iOS and macOS)

#### Device Testing

Test on multiple devices:
- 📱 iOS (iPhone, iPad)
- 📱 Android (phone, tablet)
- 💻 Desktop (Windows, macOS, Linux)

#### Feature Testing

- [ ] Report creation and editing
- [ ] Local storage persistence
- [ ] OneDrive authentication
- [ ] OneDrive file upload/download
- [ ] Offline functionality
- [ ] PWA installation
- [ ] Service worker updates
- [ ] Responsive design

### Customization

#### Changing Colors

Edit `styles.css`:

```css
:root {
    --primary-color: #0078d4;      /* Main blue */
    --primary-hover: #106ebe;      /* Darker blue */
    --success-color: #107c10;      /* Green */
    /* ... */
}
```

#### Changing Report Format

Edit `app.js`, function `generateReport()`:

```javascript
function generateReport() {
    // Modify the body template
    let body = `Dear Dionisis,\n\n`;
    // ... customize format ...
    return report;
}
```

#### Adding New Features

1. Add UI elements in `index.html`
2. Add styles in `styles.css`
3. Add logic in `app.js`
4. Update service worker cache in `service-worker.js`

## 🔧 Troubleshooting

### Common Issues

#### 1. App Won't Install

**Problem**: Install prompt doesn't appear

**Solutions**:
- Ensure you're using HTTPS (not HTTP)
- Check that manifest.json is valid
- Verify all icons are present
- Try a different browser
- Clear browser cache

#### 2. OneDrive Authentication Fails

**Problem**: Can't authenticate with OneDrive

**Solutions**:
- Verify Client ID is correct
- Check redirect URI matches Azure configuration
- Ensure API permissions are granted
- Try signing out and back in
- Clear browser storage and retry

#### 3. Reports Not Syncing

**Problem**: Reports save locally but don't upload to OneDrive

**Solutions**:
- Check internet connection
- Verify authentication status (click sync button)
- Check OneDrive storage space
- Look for errors in browser console (F12)
- Re-authenticate with OneDrive

#### 4. Service Worker Not Updating

**Problem**: App doesn't show new features after update

**Solutions**:
- Hard refresh: `Ctrl/Cmd + Shift + R`
- Clear cache and reload
- Unregister service worker in DevTools
- Uninstall and reinstall the app

#### 5. Offline Mode Not Working

**Problem**: App requires internet to work

**Solutions**:
- Visit the app while online first
- Check service worker is registered (DevTools → Application → Service Workers)
- Verify cache is populated (DevTools → Application → Cache Storage)
- Ensure service worker scope is correct

### Debug Mode

Enable debugging in browser console:

```javascript
// In browser console
localStorage.setItem('debug', 'true');
location.reload();
```

View logs:
- Open DevTools (F12)
- Go to Console tab
- Look for `[App]`, `[ServiceWorker]`, or `[DB]` prefixed messages

### Getting Help

If you encounter issues:

1. Check the browser console for errors (F12)
2. Check the Network tab for failed requests
3. Verify service worker status in DevTools → Application
4. Check IndexedDB in DevTools → Application → Storage

## ❓ FAQ

### General

**Q: Do I need a server to run this app?**  
A: No, it's a static web app. You can deploy it on any static hosting service.

**Q: Can I use this without OneDrive?**  
A: Yes! The app works fully offline and stores reports locally. OneDrive is optional.

**Q: Is my data secure?**  
A: Yes. Data is stored locally on your device and only uploaded to your personal OneDrive with your explicit consent.

**Q: Can I use this on multiple devices?**  
A: Yes! Once synced with OneDrive, your reports are accessible from any device.

### Technical

**Q: Why do I need Azure App Registration?**  
A: This is required by Microsoft to access OneDrive via their Graph API.

**Q: Can I use Google Drive instead?**  
A: Not currently, but the code can be adapted to use Google Drive API.

**Q: Does this work on iOS?**  
A: Yes! Safari on iOS supports PWAs. Use "Add to Home Screen".

**Q: What browsers are supported?**  
A: Chrome, Edge, Firefox, Safari - any modern browser with PWA support.

**Q: How much storage does the app use?**  
A: Very little! Reports are text files, typically just a few KB each.

### Privacy & Security

**Q: Where is my data stored?**  
A: Locally in your browser's IndexedDB and optionally in your personal OneDrive.

**Q: Can others see my reports?**  
A: No. Reports are private and only accessible by you.

**Q: What happens if I uninstall the app?**  
A: Local data is removed, but OneDrive copies remain safe.

**Q: Do you collect any analytics?**  
A: No. This app has no analytics or tracking.

## 📄 License

MIT License - feel free to modify and use for your own purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📞 Support

For issues or questions:

1. Check this README
2. Check browser console for errors
3. Review Azure App Registration setup
4. Verify deployment configuration

## 🎉 Acknowledgments

Built for the MASKA project to streamline daily reporting and improve productivity.

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Author**: Your Name

**Happy Reporting! 📊**
