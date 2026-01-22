# MASKA Reports PWA - AI Agent Instructions

## Project Overview
A Progressive Web App for creating daily work reports with automatic OneDrive synchronization. Pure vanilla JavaScript (no frameworks), IndexedDB for local storage, Microsoft Graph API for cloud sync.

## Architecture

### State Management Pattern
- **Global state object** in [JavaScript/app.js](../JavaScript/app.js#L4-L8): `state = { projects: [], generalTasks: [], currentReport: null }`
- All UI updates trigger through `updatePreview()` function
- State mutations happen via dedicated functions: `addProject()`, `updateTask()`, `removeGeneralTask()`, etc.
- **No React/Vue** - DOM manipulation via `innerHTML` with template literals

### Module Structure (Separation of Concerns)
1. **[JavaScript/app.js](../JavaScript/app.js)** - UI logic, state management, form handling, preview generation
2. **[JavaScript/db.js](../JavaScript/db.js)** - IndexedDB operations (all async, Promise-based)
3. **[JavaScript/auth.js](../JavaScript/auth.js)** - OAuth 2.0 flow, token management, popup-based authentication
4. **[JavaScript/onedrive.js](../JavaScript/onedrive.js)** - Microsoft Graph API calls, folder/file management
5. **[JavaScript/service-worker.js](../JavaScript/service-worker.js)** - Cache-first strategy, offline support

### Key Data Flows
- **Save Report**: Form → State → IndexedDB (`saveReportToDB`) → OneDrive upload (`uploadToOneDrive`) → Update DB with OneDrive metadata
- **Load Report**: IndexedDB → State → UI render (projects/tasks repopulated)
- **Authentication**: Popup window → [Application/auth-callback.html](../Application/auth-callback.html) → `postMessage` → Token storage in localStorage

## Critical Patterns

### IndexedDB Usage
```javascript
// All DB functions are async and return Promises
await initDB();  // Must be called before any DB operations
await saveReportToDB(report);  // Auto-generates ID and timestamp
await getAllReportsFromDB();  // Always sorted by date (newest first)
```
- Database name: `MASKAReportsDB`, Store: `reports`
- Reports have unique IDs: `report_${timestamp}_${random}`
- Never manipulate IndexedDB directly - always use [JavaScript/db.js](../JavaScript/db.js) functions

### OneDrive Integration
- **Folder structure**: `/MASKA_Reports/` in user's OneDrive root
- **Filename convention**: `MASKA_Daily_Report_DD-MM-YYYY.txt`
- **Authentication**: OAuth 2.0 popup flow (NOT redirect-based)
- **Client ID**: Stored in localStorage, prompted on first sync
- Token auto-refresh 5 minutes before expiry

### Service Worker Strategy
- **Cache-first** for static assets (HTML, CSS, JS, icons)
- **Network-first** for Microsoft Graph API calls
- Cache name: `maska-reports-v1` - increment for breaking changes
- Pre-cached files listed in `PRECACHE_URLS` array

## Development Workflows

### Testing Locally
```powershell
# Serve the app (PWA requires HTTPS or localhost)
npm run serve
# Or use Python
npm start  # python3 -m http.server 8000
```
Navigate to `http://localhost:8000`

### Testing OneDrive Integration
1. Create Azure App Registration at [portal.azure.com](https://portal.azure.com)
2. Add redirect URI: `http://localhost:8000/auth-callback.html`
3. Enable `Files.ReadWrite` and `User.Read` API permissions
4. Copy Client ID, paste when app prompts
5. Test sync button - should open popup, not redirect

### Service Worker Updates
- Change `CACHE_NAME` constant when modifying cached files
- Test in incognito to avoid stale caches
- Check DevTools → Application → Service Workers for status

## Project Conventions

### File Naming
- **JavaScript files**: `kebab-case.js` (e.g., `service-worker.js`, not `serviceWorker.js`)
- **Report files**: `MASKA_Daily_Report_DD-MM-YYYY.txt` format (underscores, not hyphens in prefix)
- **Date format**: `DD/MM/YYYY` for display, `DD-MM-YYYY` for filenames

### Code Style
- **No semicolons** at the end of function declarations
- **Template literals** for HTML generation
- **Arrow functions** in callbacks, **function declarations** for top-level
- **Comment sections**: `// ===================================`

### State Mutation
```javascript
// ✅ Correct: Update state, render, update preview
state.projects.push(newProject);
renderProjects();
updatePreview();

// ❌ Wrong: Direct DOM manipulation without state update
document.getElementById('projects-container').innerHTML = ...;
```

## External Dependencies

### Microsoft Graph API
- Base URL: `https://graph.microsoft.com/v1.0`
- Required scopes: `Files.ReadWrite`, `User.Read`
- Rate limits: Built-in retry logic not implemented - handle 429 responses manually

### IndexedDB Browser Support
- Supported in all modern browsers
- No fallback to localStorage - app requires IndexedDB

## Critical Files

- [JavaScript/app.js](../JavaScript/app.js#L1) - Main application logic (589 lines)
- [JavaScript/db.js](../JavaScript/db.js#L1) - Database operations (382 lines)
- [Application/index.html](../Application/index.html) - Form structure and modal templates
- [PWA Config/manifest.json](../PWA%20Config/manifest.json) - PWA configuration

## Common Tasks

### Adding a New Field to Reports
1. Update form in [Application/index.html](../Application/index.html)
2. Update state collection in `collectFormData()` ([JavaScript/app.js](../JavaScript/app.js))
3. Update preview generation in `updatePreview()`
4. Update DB schema version in [JavaScript/db.js](../JavaScript/db.js) if structural change
5. Update OneDrive file content in [JavaScript/onedrive.js](../JavaScript/onedrive.js#L67)

### Modifying Cache Strategy
1. Edit `PRECACHE_URLS` in [JavaScript/service-worker.js](../JavaScript/service-worker.js#L9)
2. Increment `CACHE_NAME` version (e.g., `v1` → `v2`)
3. Test cache invalidation in DevTools

### Debugging Authentication Issues
- Check localStorage for `maska_onedrive_token` and `maska_client_id`
- Verify redirect URI in Azure Portal matches `window.location.origin + '/auth-callback.html'`
- Check browser console in both main window and popup during auth flow
- Token expiry: 1 hour (Microsoft default), 5-minute buffer before refresh

## Documentation
- [Documentation/QUICKSTART.md](../Documentation/QUICKSTART.md) - Fast setup
- [Documentation/DEPLOYMENT_GUIDE.md](../Documentation/DEPLOYMENT_GUIDE.md) - Production deployment
- [Documentation/PROJECT_SUMMARY.md](../Documentation/PROJECT_SUMMARY.md) - Feature list and tech stack
