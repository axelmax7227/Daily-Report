# ⚡ QUICKSTART - Get Running in 5 Minutes

This guide will get your MASKA Reports PWA up and running as fast as possible.

---

## 🎯 Goal

Have a working daily reports app that:
- Creates formatted reports
- Saves locally on your device
- Syncs to OneDrive
- Works on all your devices

---

## ✅ Prerequisites

You need:
- A web browser (Chrome recommended)
- A Microsoft account
- 5 minutes of your time

---

## 🚀 Steps

### 1. Test Locally (2 minutes)

Open your terminal and run:

```bash
cd maska-reports-pwa

# Option 1: Python (if you have it)
python3 -m http.server 8000

# Option 2: Node.js (if you have it)
npx serve -p 8000
```

Open browser: http://localhost:8000

**Try it:**
- Fill in a report
- Click "Preview"
- Click "Copy to Clipboard"
- ✅ If this works, continue to step 2

### 2. Register Azure App (1 minute)

1. Go to https://portal.azure.com
2. Search: "App registrations"
3. Click: "+ New registration"
4. Name: `MASKA Reports`
5. Accounts: Select "Multitenant + personal Microsoft accounts"
6. Click: "Register"
7. **Copy the Client ID** and save it

### 3. Configure Permissions (30 seconds)

Still in Azure Portal:

1. Click: "API permissions"
2. Click: "+ Add a permission"
3. Click: "Microsoft Graph"
4. Click: "Delegated permissions"
5. Check: `Files.ReadWrite`
6. Click: "Add permissions"
7. Click: "Authentication"
8. Check: ✅ Access tokens
9. Check: ✅ ID tokens
10. Click: "Save"

### 4. Deploy to Vercel (1 minute)

```bash
# Install Vercel CLI
npm install -g vercel

# Login (opens browser)
vercel login

# Deploy (follow prompts)
vercel --prod
```

**Save the URL!** Example: `https://maska-reports-xyz.vercel.app`

### 5. Update Azure Redirect (30 seconds)

Back in Azure Portal:

1. Click: "Authentication"
2. Click: "+ Add a platform"
3. Select: "Web"
4. Redirect URI: `https://your-vercel-url.vercel.app/auth-callback.html`
5. Check: ✅ Access tokens, ✅ ID tokens
6. Click: "Configure"
7. Click: "Save"

### 6. Test OneDrive Sync (30 seconds)

1. Open your deployed app
2. Click: ☁️ Sync button
3. Enter: Your Client ID
4. Sign in with Microsoft
5. Click: "Accept" permissions
6. ✅ Done!

---

## ✨ You're Done!

Your app is now:
- ✅ Deployed online
- ✅ Working on all devices
- ✅ Syncing to OneDrive
- ✅ Installable as PWA

### Next Steps:

**Install on your devices:**
- Desktop: Click ⊕ icon in address bar
- iOS: Safari → Share → Add to Home Screen
- Android: Chrome → Menu → Install app

**Start using it:**
1. Create your first report
2. Save it
3. Copy to clipboard
4. Paste in email
5. Send!

---

## 📚 Need More Help?

- **User Guide**: See `USER_GUIDE.md` for detailed usage
- **Deployment**: See `DEPLOYMENT_GUIDE.md` for step-by-step deployment
- **Technical**: See `README.md` for full documentation

---

## 🛟 Quick Troubleshooting

**Problem: Popup blocked during authentication**
- Solution: Allow popups for your site

**Problem: "Invalid redirect URI"**
- Solution: Make sure Azure redirect URI matches exactly

**Problem: Can't install as PWA**
- Solution: Must use HTTPS (use deployed URL, not localhost)

**Problem: OneDrive not syncing**
- Solution: Click ☁️ Sync button to re-authenticate

---

## 🎉 That's It!

In just 5 minutes, you have:
- ✅ A deployed PWA
- ✅ OneDrive integration
- ✅ Offline support
- ✅ Multi-device sync

**Start creating your daily reports now!**

---

**Questions?** Check the other documentation files in this folder.
