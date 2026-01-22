# 🚀 MASKA Reports - Complete Deployment Guide

This guide will walk you through deploying your MASKA Reports PWA from scratch.

## 📑 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Generate App Icons](#generate-app-icons)
3. [Azure App Registration](#azure-app-registration)
4. [Deploy to Vercel](#deploy-to-vercel)
5. [Configure OneDrive](#configure-onedrive)
6. [Install on Devices](#install-on-devices)
7. [Testing Checklist](#testing-checklist)

---

## Prerequisites

Before you start, make sure you have:

- ✅ A Microsoft account
- ✅ The project files downloaded
- ✅ A code editor (optional)
- ✅ A command terminal (Terminal, CMD, PowerShell)

## Generate App Icons

### Step 1: Install ImageMagick (Optional but Recommended)

**On macOS:**
```bash
brew install imagemagick
```

**On Ubuntu/Debian:**
```bash
sudo apt-get install imagemagick
```

**On Windows:**
- Download from: https://imagemagick.org/script/download.php
- Install the executable

### Step 2: Generate Icons

```bash
cd maska-reports-pwa
chmod +x generate-icons.sh
./generate-icons.sh
```

**Alternative (if ImageMagick not available):**

1. Open `icons/icon.svg` in your browser
2. Go to https://realfavicongenerator.net/
3. Upload the SVG
4. Generate and download all sizes
5. Place them in the `icons/` directory

---

## Azure App Registration

### Step 1: Access Azure Portal

1. Open your browser
2. Go to: https://portal.azure.com
3. Sign in with your Microsoft account
4. If you don't have Azure access:
   - Click "Start free"
   - Follow the setup process (free tier is sufficient)

### Step 2: Navigate to App Registrations

1. In the search bar at the top, type: **"App registrations"**
2. Click on **App registrations** in the results
3. Alternatively:
   - Click the menu icon (☰) at top-left
   - Find **"Azure Active Directory"** or **"Microsoft Entra ID"**
   - Click **"App registrations"** in the left sidebar

### Step 3: Register New Application

1. Click the **"+ New registration"** button at the top
2. Fill in the form:

   **Name:**
   ```
   MASKA Reports
   ```

   **Supported account types:**
   - Select: **"Accounts in any organizational directory and personal Microsoft accounts"**
   - This is the third option (Multitenant + personal)

   **Redirect URI:**
   - Platform: Select **"Web"** from dropdown
   - URI: Leave empty for now (we'll add it after deployment)

3. Click **"Register"** button at the bottom

### Step 4: Save Your Client ID

1. You'll see the **Overview** page
2. Find **"Application (client) ID"**
3. It looks like: `12345678-1234-1234-1234-123456789abc`
4. **IMPORTANT:** Copy this and save it somewhere safe!
5. You'll need this later

### Step 5: Configure API Permissions

1. Click **"API permissions"** in the left sidebar
2. You'll see one default permission (User.Read)
3. Click **"+ Add a permission"** button
4. Click **"Microsoft Graph"**
5. Click **"Delegated permissions"**
6. In the search box, type: `Files.ReadWrite`
7. Check the box next to **"Files.ReadWrite"**
8. Click **"Add permissions"** button at the bottom
9. (Optional) Click **"Grant admin consent for [your account]"**
   - This pre-approves permissions
   - If you don't see this option, skip it

### Step 6: Configure Authentication

1. Click **"Authentication"** in the left sidebar
2. Scroll to **"Implicit grant and hybrid flows"**
3. Check these boxes:
   - ✅ **Access tokens (used for implicit flows)**
   - ✅ **ID tokens (used for implicit and hybrid flows)**
4. Scroll to **"Advanced settings"**
5. Set **"Allow public client flows"** to **Yes**
6. Click **"Save"** at the top

### Step 7: Note Your Configuration

Save this information in a text file:

```
Azure App Configuration
========================
Client ID: [Your copied Client ID]
Tenant: common
Authority: https://login.microsoftonline.com/common
Scopes: Files.ReadWrite User.Read

Created: [Today's date]
```

---

## Deploy to Vercel

### Option A: Using Vercel Dashboard (Easiest)

#### Step 1: Create Vercel Account

1. Go to: https://vercel.com
2. Click **"Sign Up"**
3. Sign up with:
   - GitHub (recommended)
   - GitLab
   - Bitbucket
   - Or email

#### Step 2: Import Project

1. Click **"Add New..."** button
2. Select **"Project"**
3. You have two options:

**Option 1: Upload Files Directly**
1. Click **"Browse"** or drag your `maska-reports-pwa` folder
2. Wait for upload to complete
3. Skip to Step 3

**Option 2: Import from Git**
1. Connect your GitHub/GitLab/Bitbucket account
2. Select your repository
3. Continue to Step 3

#### Step 3: Configure Project

1. **Project Name:** `maska-reports` (or your choice)
2. **Framework Preset:** Select **"Other"**
3. **Root Directory:** `./` (leave as is)
4. **Build Command:** Leave empty
5. **Output Directory:** Leave empty
6. **Install Command:** Leave empty

#### Step 4: Deploy

1. Click **"Deploy"** button
2. Wait 1-2 minutes for deployment
3. You'll see a success screen with your URL
4. Example: `https://maska-reports-abc123.vercel.app`
5. **SAVE THIS URL!**

#### Step 5: Get Production URL

1. After deployment, click **"Visit"** button
2. Copy the URL from your browser
3. This is your production URL
4. It should look like: `https://maska-reports-abc123.vercel.app`

### Option B: Using Vercel CLI (Alternative)

```bash
# Step 1: Install Vercel CLI
npm install -g vercel

# Step 2: Login
vercel login
# Follow the prompts in your terminal

# Step 3: Deploy
cd maska-reports-pwa
vercel --prod

# Step 4: Copy the deployment URL from the terminal output
```

---

## Configure OneDrive

### Step 1: Add Redirect URI to Azure

Now that you have your deployed URL, update Azure:

1. Go back to Azure Portal: https://portal.azure.com
2. Navigate to **App registrations**
3. Click on your **"MASKA Reports"** app
4. Click **"Authentication"** in left sidebar
5. Under **"Platform configurations"**, click **"+ Add a platform"**
6. Select **"Web"**
7. In **"Redirect URIs"**, add:
   ```
   https://your-vercel-url.vercel.app/auth-callback.html
   ```
   Replace `your-vercel-url` with your actual Vercel URL
   
   Example:
   ```
   https://maska-reports-abc123.vercel.app/auth-callback.html
   ```

8. Check both boxes under **"Implicit grant and hybrid flows"**:
   - ✅ Access tokens
   - ✅ ID tokens
9. Click **"Configure"**
10. Click **"Save"** at the top

### Step 2: Test OneDrive Connection

1. Open your deployed app: `https://your-vercel-url.vercel.app`
2. Click the **☁️ Sync** button (cloud icon in header)
3. A popup will appear asking for your Client ID
4. Paste your **Application (client) ID** from Azure
5. Click OK or press Enter
6. You'll be redirected to Microsoft login
7. Sign in with your Microsoft account
8. You'll see a permissions screen, click **"Accept"**
9. You should be redirected back to the app
10. You should see a success message: "Report synced to OneDrive!"

### Step 3: Verify OneDrive Folder

1. Open OneDrive in your browser: https://onedrive.live.com
2. You should see a new folder: **MASKA_Reports/**
3. Any reports you save will appear here

---

## Install on Devices

### Desktop (Windows/Mac/Linux)

#### Chrome or Edge:
1. Open the app URL in Chrome or Edge
2. Look for the **⊕** icon in the address bar (right side)
3. Click it and select **"Install"**
4. The app will open in its own window
5. You can now launch it from:
   - **Windows:** Start Menu → MASKA Reports
   - **Mac:** Applications → MASKA Reports
   - **Linux:** Applications menu

#### Alternative method:
1. Open the app
2. Click the three-dot menu (⋮)
3. Select **"Install MASKA Reports..."**

### iOS (iPhone/iPad)

1. Open **Safari** (must use Safari, not Chrome)
2. Navigate to your app URL
3. Tap the **Share** button (📤) at the bottom
4. Scroll down and tap **"Add to Home Screen"**
5. You can change the name if you want
6. Tap **"Add"** in the top right
7. The app icon will appear on your home screen

### Android

1. Open **Chrome**
2. Navigate to your app URL
3. Tap the three-dot menu (⋮) in the top right
4. Tap **"Add to Home screen"** or **"Install app"**
5. Tap **"Add"** or **"Install"**
6. The app will be added to your home screen

---

## Testing Checklist

After deployment, test these features:

### Basic Functionality
- [ ] App loads without errors
- [ ] Date is auto-filled with today
- [ ] Can add projects
- [ ] Can add tasks with hours
- [ ] Can add general tasks
- [ ] Total hours calculate correctly
- [ ] Preview updates in real-time
- [ ] Can copy to clipboard

### OneDrive Integration
- [ ] Can authenticate with OneDrive
- [ ] Client ID is saved after first entry
- [ ] Reports upload successfully
- [ ] Folder "MASKA_Reports" is created
- [ ] Files are named correctly: `MASKA_Daily_Report_DD-MM-YYYY.txt`
- [ ] File content matches preview

### History & Storage
- [ ] Reports appear in history
- [ ] Can load previous reports
- [ ] Can delete reports
- [ ] History persists after page reload

### PWA Features
- [ ] Can install on desktop
- [ ] Can install on mobile
- [ ] App works offline (after first visit)
- [ ] Service worker is registered
- [ ] Updates prompt appears when new version is available

### Responsive Design
- [ ] Looks good on desktop (1920x1080)
- [ ] Looks good on tablet (768x1024)
- [ ] Looks good on mobile (375x667)
- [ ] All buttons are tappable on touch devices
- [ ] Text is readable on all screen sizes

---

## Troubleshooting Common Issues

### Issue: "Popup blocked" during authentication

**Solution:**
1. Allow popups for your site
2. Click the popup icon in address bar
3. Select "Always allow popups from this site"
4. Try authentication again

### Issue: "Invalid redirect URI" error

**Solution:**
1. Double-check redirect URI in Azure matches exactly
2. Make sure it includes `/auth-callback.html`
3. Check for typos in the URL
4. Verify protocol is `https://` not `http://`

### Issue: App doesn't work offline

**Solution:**
1. Visit the app while online first
2. Wait for service worker to install
3. Check DevTools → Application → Service Workers
4. Make sure service worker is "activated and running"

### Issue: Can't install as PWA

**Solution:**
1. Make sure you're using HTTPS
2. Verify manifest.json is accessible
3. Check all icons are present in icons/ folder
4. Try a different browser
5. Clear browser cache and try again

---

## Next Steps

After successful deployment:

1. **Customize the app** (optional):
   - Edit colors in `styles.css`
   - Modify report template in `app.js`
   - Add your own logo in `icons/`

2. **Share with team**:
   - Send them the deployment URL
   - They can install it on their devices
   - Each person needs their own Microsoft account

3. **Monitor usage**:
   - Check OneDrive folder for reports
   - Verify reports are being saved correctly
   - Test on multiple devices

4. **Backup**:
   - OneDrive automatically backs up your reports
   - You can also export reports as JSON
   - Download important reports locally

---

## Support & Help

If you run into issues:

1. **Check the browser console:**
   - Press F12
   - Look for red errors
   - Share error messages when asking for help

2. **Verify configuration:**
   - Azure Client ID is correct
   - Redirect URI matches exactly
   - API permissions are granted

3. **Test in incognito mode:**
   - Rules out extension conflicts
   - Fresh service worker install
   - Clean local storage

4. **Review the README.md:**
   - Detailed troubleshooting section
   - FAQ with common questions
   - Additional configuration options

---

## Success! 🎉

If you've completed all steps, you should now have:

✅ A fully deployed PWA  
✅ OneDrive integration working  
✅ App installed on your devices  
✅ Automatic report synchronization  
✅ Offline functionality  

**Congratulations! You're ready to start creating daily reports!**

---

**Last Updated:** January 2026  
**Version:** 1.0.0
