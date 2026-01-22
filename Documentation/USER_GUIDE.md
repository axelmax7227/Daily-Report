# 📖 MASKA Reports - User Guide

Welcome to MASKA Reports! This guide will help you create and manage your daily work reports.

## 🎯 Quick Start (2 Minutes)

1. **Open the app** on your device
2. **Fill in your work details:**
   - Date (auto-filled with today)
   - Location (TF or Remote)
   - Work hours (from and to)
3. **Add your projects and tasks**
4. **Click "Save Report"**
5. **Copy to clipboard** and paste into your email

That's it! Your report is saved and synced to OneDrive.

---

## 📝 Creating Your First Report

### Step 1: Basic Information

When you open the app, you'll see a form:

**Date Field**
- Automatically filled with today's date
- Click to change if creating a report for a different day

**Work Location**
- Choose from dropdown:
  - **TF** - Working at TF location
  - **Remote** - Working remotely

**Work Hours**
- **From:** Your start time (e.g., 09:00)
- **To:** Your end time (e.g., 17:00)
- Uses 24-hour format

### Step 2: Adding Projects

Projects are the main categories of work (e.g., ROB4GREEN, MASKA).

1. Click **"+ Add Project"** button
2. Type the project name in the text box
3. The project card will appear

**Example:**
```
Project Name: ROB4GREEN
```

### Step 3: Adding Tasks to Projects

Each project can have multiple tasks:

1. Click **"+ Add Task"** inside a project card
2. Enter the task description
3. Enter hours spent (can use decimals like 2.5)

**Example:**
```
Task: Unity Digital Twin development
Hours: 3

Task: ROS2 integration testing
Hours: 2.5
```

**Tips:**
- You can have multiple tasks per project
- Click the **✕** button to remove a task
- Hours automatically calculate in the total

### Step 4: General Tasks

For tasks that don't belong to a specific project:

1. Scroll to the "General Tasks" section
2. Click **"+ Add General Task"**
3. Enter the task description

**Example:**
```
• Team meeting
• Email correspondence
• Documentation review
```

### Step 5: Preview Your Report

1. Click the **"👁️ Preview"** button
2. See how your report will look
3. Check the email subject and body
4. Verify all information is correct

**What you'll see:**
```
Subject: MASKA: Daily report (22/01/2026)

Dear Dionisis,

Today, I worked from TF from 09:00 to 17:00.

Tasks Hours: 8h

ROB4GREEN:
   • Unity Digital Twin development (3h)
   • ROS2 integration testing (2.5h)
   • HoloLens testing (2.5h)

General Tasks:
   • Team meeting
   • Email correspondence

Best regards,
Alexandros
```

### Step 6: Save Your Report

Click **"💾 Save Report"** to:
- Save locally on your device
- Automatically upload to OneDrive (if connected)
- Add to your report history

You'll see a confirmation message: "Report saved locally! ✓"

### Step 7: Copy to Email

1. Click **"📋 Copy to Clipboard"**
2. Open your email application
3. Press **Ctrl+V** (or Cmd+V on Mac) to paste
4. The subject and body are copied together
5. Send your email!

---

## 📋 Managing Your Reports

### Viewing History

Click the **📋 History** button (in the header) to see all your past reports.

**What you'll see:**
- Date of each report
- Work location and hours
- Total hours worked

**Available actions:**
- **Load:** Edit a previous report
- **Delete:** Remove a report (both locally and from OneDrive)

### Loading a Previous Report

1. Click **📋 History**
2. Find the report you want
3. Click **"Load"**
4. The report data fills the form
5. Make your changes
6. Save again

**Tip:** This is useful for:
- Copying similar reports
- Fixing mistakes
- Creating templates

### Deleting Reports

1. Click **📋 History**
2. Find the report to delete
3. Click **"Delete"**
4. Confirm the deletion
5. Report is removed from both local storage and OneDrive

⚠️ **Warning:** Deletion cannot be undone!

---

## ☁️ OneDrive Sync

### First-Time Setup

**One-Time Setup** (only needed once):

1. Click the **☁️ Sync** button (cloud icon)
2. A popup will ask for your "Client ID"
3. Enter the Client ID provided by your admin
4. Click OK
5. You'll be redirected to Microsoft login
6. Sign in with your Microsoft account
7. Click "Accept" to grant permissions
8. You're redirected back to the app
9. Your reports now sync automatically!

### How Sync Works

**Automatic Sync:**
- When you save a report, it uploads to OneDrive automatically
- No need to manually sync each time

**Manual Sync:**
- Click **☁️ Sync** button to sync all reports
- Useful if you've been working offline

**Where Reports Are Stored:**
- OneDrive folder: `MASKA_Reports/`
- Filename format: `MASKA_Daily_Report_DD-MM-YYYY.txt`
- Example: `MASKA_Daily_Report_22-01-2026.txt`

### Checking Your Reports on OneDrive

1. Go to https://onedrive.live.com
2. Sign in with your Microsoft account
3. Open the **MASKA_Reports** folder
4. Your reports are stored as text files
5. You can download, share, or backup these files

---

## 📱 Working Across Devices

### Installing on Multiple Devices

You can use MASKA Reports on all your devices:

**Desktop Computer:**
- Open the app in Chrome or Edge
- Click the install icon (⊕) in address bar
- Click "Install"

**iPhone or iPad:**
- Open in Safari
- Tap Share button (📤)
- Tap "Add to Home Screen"

**Android Phone or Tablet:**
- Open in Chrome
- Tap the menu (⋮)
- Tap "Install app"

**Benefits of Installing:**
- Quick access from home screen/desktop
- Works like a native app
- Faster loading
- Works offline

### Syncing Between Devices

Once you set up OneDrive:

1. Create a report on Device A
2. Save it (automatically uploads to OneDrive)
3. Open app on Device B
4. Your report is available in History
5. All devices stay in sync!

---

## 🔌 Working Offline

The app works perfectly without internet!

### What Works Offline:
✅ Create new reports  
✅ Edit existing reports  
✅ View history  
✅ Copy to clipboard  
✅ Save locally  

### What Requires Internet:
❌ OneDrive sync  
❌ First-time OneDrive authentication  

### Offline to Online Transition:

When your connection returns:
1. App detects you're back online
2. Shows notification: "Connection restored!"
3. Automatically syncs pending reports
4. Everything is up to date!

---

## 💡 Tips & Best Practices

### Time Management

**Tracking Hours:**
- Break tasks into clear activities
- Be specific about what you worked on
- Round to nearest 0.5 hour for accuracy

**Example - Good:**
```
Unity Digital Twin development (3h)
ROS2 integration testing (2h)
```

**Example - Too Vague:**
```
Worked on project (5h)
```

### Organizing Projects

**Use Clear Project Names:**
```
✅ ROB4GREEN
✅ MASKA
✅ Internal Tools
```

**Not:**
```
❌ Project 1
❌ Work
❌ Stuff
```

### Daily Routine

Recommended workflow:

**End of Day:**
1. Open MASKA Reports app
2. Fill in today's work
3. Review and save
4. Copy and email immediately

**Benefits:**
- Fresh memory of what you did
- Accurate time tracking
- Forms a helpful habit

### Making Templates

For recurring work patterns:

1. Create a report with common projects/tasks
2. Save it
3. Next day:
   - Load from history
   - Change the date
   - Adjust hours and tasks
   - Save as new report

---

## ❓ Common Questions

### "Do I need internet to use the app?"

No! After your first visit, the app works completely offline. Reports are saved locally and sync when you're back online.

### "What if I forget to authenticate with OneDrive?"

No problem! Your reports are always saved locally on your device. You can authenticate later and sync all past reports.

### "Can I edit a report after sending the email?"

Yes! Load the report from History, make changes, and save. This updates the local copy and OneDrive file, but doesn't change the email you already sent.

### "What if I make a mistake?"

- **Before saving:** Just edit the fields and fix it
- **After saving:** Load from history, fix it, save again
- **After emailing:** Load from history, fix it, save, and send a correction email

### "Can I use this on my personal computer and work computer?"

Yes! Install it on both devices and sign in with the same Microsoft account. OneDrive keeps everything in sync.

### "How do I know my report was synced?"

You'll see one of these messages after saving:
- "Report synced to OneDrive! ☁️" - Success!
- "Saved locally. Sign in to sync with OneDrive." - Need to authenticate
- "Saved locally. OneDrive sync will retry later." - Temporary connection issue

### "What happens if I lose my device?"

Don't worry! If you enabled OneDrive sync:
1. All your reports are safely stored in OneDrive
2. Install the app on a new device
3. Sign in with the same Microsoft account
4. All your reports will be available

---

## 🛟 Getting Help

### If the app isn't working:

1. **Try refreshing:** Press Ctrl+R (Cmd+R on Mac)
2. **Check your internet:** Some features need connectivity
3. **Try another browser:** Chrome and Edge work best
4. **Contact your admin:** They can help with Client ID issues

### If OneDrive isn't syncing:

1. **Check sign-in:** Click ☁️ Sync to verify authentication
2. **Check storage:** Make sure OneDrive isn't full
3. **Manual sync:** Click ☁️ Sync button to retry
4. **Re-authenticate:** Sign out and sign back in

### If you see errors:

Take a screenshot and share with your administrator. Include:
- The error message
- What you were doing when it happened
- Your browser and device type

---

## 🎓 Advanced Features

### Keyboard Shortcuts

Speed up your workflow:

- `Ctrl+S` (Cmd+S on Mac) - Save report
- `Ctrl+P` (Cmd+P on Mac) - Preview
- `Ctrl+K` (Cmd+K on Mac) - Copy to clipboard
- `Ctrl+H` (Cmd+H on Mac) - Open history

### Decimal Hours

You can use decimal hours for precise tracking:

```
2.5h = 2 hours 30 minutes
1.25h = 1 hour 15 minutes
0.5h = 30 minutes
```

### Quick Copy-Paste

Instead of typing project names each day:
1. Use History to load yesterday's report
2. Change the date
3. Update hours
4. Save as today's report

---

## 📊 Example Reports

### Example 1: Regular Office Day

```
Date: 22/01/2026
Location: TF
Hours: 09:00 to 17:00

ROB4GREEN:
   • Unity Digital Twin development (4h)
   • ROS2 integration (2h)
   • Team meeting (1h)

General Tasks:
   • Email correspondence
   • Documentation update

Total: 7h
```

### Example 2: Remote Work Day

```
Date: 22/01/2026
Location: Remote
Hours: 09:00 to 17:00

MASKA:
   • Frontend development (3.5h)
   • Code review (1.5h)
   • Sprint planning (1h)

General Tasks:
   • Client call
   • Administrative tasks

Total: 6h
```

### Example 3: Multi-Project Day

```
Date: 22/01/2026
Location: TF
Hours: 09:00 to 17:00

ROB4GREEN:
   • HoloLens testing (2h)
   • Bug fixes (1.5h)

MASKA:
   • Database optimization (2h)
   • Documentation (1h)

General Tasks:
   • Team standup
   • Training session

Total: 6.5h
```

---

## ✅ Checklist for Success

Use this checklist for each report:

- [ ] Date is correct
- [ ] Work location selected (TF/Remote)
- [ ] Start and end times filled
- [ ] All projects listed
- [ ] Tasks are specific and clear
- [ ] Hours add up correctly
- [ ] Previewed before saving
- [ ] Report saved successfully
- [ ] Copied and pasted into email
- [ ] Email sent to Dionisis

---

## 🎉 You're All Set!

You now know how to:

✅ Create daily reports  
✅ Track your work hours  
✅ Sync with OneDrive  
✅ Work offline  
✅ Manage report history  
✅ Use the app on multiple devices  

**Happy reporting! 📊**

---

**Questions?** Contact your system administrator or project manager.

**Version:** 1.0.0  
**Last Updated:** January 2026
