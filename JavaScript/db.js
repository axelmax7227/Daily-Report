// ===================================
// IndexedDB Setup and Management
// ===================================

const DB_NAME = 'MASKAReportsDB';
const DB_VERSION = 1;
const STORE_NAME = 'reports';

let db = null;

// ===================================
// Database Initialization
// ===================================

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => {
            console.error('Database error:', request.error);
            reject(request.error);
        };
        
        request.onsuccess = () => {
            db = request.result;
            console.log('Database initialized successfully');
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Create object store if it doesn't exist
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                
                // Create indexes for searching
                objectStore.createIndex('date', 'date', { unique: false });
                objectStore.createIndex('timestamp', 'timestamp', { unique: false });
                
                console.log('Object store created');
            }
        };
    });
}

// ===================================
// CRUD Operations
// ===================================

// Save a report to the database
async function saveReportToDB(report) {
    if (!db) {
        await initDB();
    }
    
    return new Promise((resolve, reject) => {
        // Generate unique ID if not exists
        if (!report.id) {
            report.id = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        
        // Add timestamp
        report.timestamp = Date.now();
        report.savedAt = new Date().toISOString();
        
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.put(report);
        
        request.onsuccess = () => {
            console.log('Report saved:', report.id);
            resolve(report);
        };
        
        request.onerror = () => {
            console.error('Error saving report:', request.error);
            reject(request.error);
        };
    });
}

// Get a specific report by ID
async function getReportFromDB(reportId) {
    if (!db) {
        await initDB();
    }
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.get(reportId);
        
        request.onsuccess = () => {
            resolve(request.result);
        };
        
        request.onerror = () => {
            console.error('Error getting report:', request.error);
            reject(request.error);
        };
    });
}

// Get all reports (sorted by date, newest first)
async function getAllReportsFromDB() {
    if (!db) {
        await initDB();
    }
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.getAll();
        
        request.onsuccess = () => {
            const reports = request.result;
            // Sort by date (newest first)
            reports.sort((a, b) => new Date(b.date) - new Date(a.date));
            resolve(reports);
        };
        
        request.onerror = () => {
            console.error('Error getting all reports:', request.error);
            reject(request.error);
        };
    });
}

// Get reports by date range
async function getReportsByDateRange(startDate, endDate) {
    if (!db) {
        await initDB();
    }
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const index = objectStore.index('date');
        
        const range = IDBKeyRange.bound(startDate, endDate);
        const request = index.getAll(range);
        
        request.onsuccess = () => {
            resolve(request.result);
        };
        
        request.onerror = () => {
            console.error('Error getting reports by date:', request.error);
            reject(request.error);
        };
    });
}

// Delete a report
async function deleteReportFromDB(reportId) {
    if (!db) {
        await initDB();
    }
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.delete(reportId);
        
        request.onsuccess = () => {
            console.log('Report deleted:', reportId);
            resolve();
        };
        
        request.onerror = () => {
            console.error('Error deleting report:', request.error);
            reject(request.error);
        };
    });
}

// Delete all reports (use with caution)
async function clearAllReports() {
    if (!db) {
        await initDB();
    }
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.clear();
        
        request.onsuccess = () => {
            console.log('All reports cleared');
            resolve();
        };
        
        request.onerror = () => {
            console.error('Error clearing reports:', request.error);
            reject(request.error);
        };
    });
}

// Update a report
async function updateReportInDB(reportId, updates) {
    if (!db) {
        await initDB();
    }
    
    return new Promise(async (resolve, reject) => {
        try {
            // Get existing report
            const existingReport = await getReportFromDB(reportId);
            
            if (!existingReport) {
                reject(new Error('Report not found'));
                return;
            }
            
            // Merge updates
            const updatedReport = {
                ...existingReport,
                ...updates,
                id: reportId, // Ensure ID doesn't change
                updatedAt: new Date().toISOString()
            };
            
            // Save updated report
            await saveReportToDB(updatedReport);
            resolve(updatedReport);
        } catch (err) {
            reject(err);
        }
    });
}

// ===================================
// Search and Filter Functions
// ===================================

// Search reports by keyword
async function searchReports(keyword) {
    const allReports = await getAllReportsFromDB();
    const lowerKeyword = keyword.toLowerCase();
    
    return allReports.filter(report => {
        // Search in body, subject, projects, tasks
        const searchableText = [
            report.body,
            report.subject,
            JSON.stringify(report.projects),
            JSON.stringify(report.generalTasks)
        ].join(' ').toLowerCase();
        
        return searchableText.includes(lowerKeyword);
    });
}

// Get reports for a specific month
async function getReportsByMonth(year, month) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
    
    return await getReportsByDateRange(startDate, endDate);
}

// Get statistics
async function getReportStatistics() {
    const allReports = await getAllReportsFromDB();
    
    const stats = {
        totalReports: allReports.length,
        totalHours: 0,
        projectBreakdown: {},
        locationBreakdown: {}
    };
    
    allReports.forEach(report => {
        // Total hours
        stats.totalHours += report.totalHours || 0;
        
        // Location breakdown
        if (report.location) {
            stats.locationBreakdown[report.location] = 
                (stats.locationBreakdown[report.location] || 0) + 1;
        }
        
        // Project breakdown
        if (report.projects) {
            report.projects.forEach(project => {
                if (project.name) {
                    const projectHours = project.tasks.reduce(
                        (sum, task) => sum + (task.hours || 0), 0
                    );
                    stats.projectBreakdown[project.name] = 
                        (stats.projectBreakdown[project.name] || 0) + projectHours;
                }
            });
        }
    });
    
    return stats;
}

// ===================================
// Export/Import Functions
// ===================================

// Export all reports as JSON
async function exportReportsAsJSON() {
    const allReports = await getAllReportsFromDB();
    const dataStr = JSON.stringify(allReports, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `maska_reports_backup_${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}

// Import reports from JSON file
async function importReportsFromJSON(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                const reports = JSON.parse(e.target.result);
                
                if (!Array.isArray(reports)) {
                    reject(new Error('Invalid format: expected array of reports'));
                    return;
                }
                
                let importedCount = 0;
                for (const report of reports) {
                    try {
                        await saveReportToDB(report);
                        importedCount++;
                    } catch (err) {
                        console.error('Error importing report:', err);
                    }
                }
                
                resolve(importedCount);
            } catch (err) {
                reject(err);
            }
        };
        
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
}

// ===================================
// Initialize Database on Load
// ===================================

// Initialize database when script loads
initDB().catch(err => {
    console.error('Failed to initialize database:', err);
});

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        saveReportToDB,
        getReportFromDB,
        getAllReportsFromDB,
        getReportsByDateRange,
        deleteReportFromDB,
        clearAllReports,
        updateReportInDB,
        searchReports,
        getReportsByMonth,
        getReportStatistics,
        exportReportsAsJSON,
        importReportsFromJSON
    };
}
