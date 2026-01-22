// ===================================
// OneDrive API Integration
// ===================================

const ONEDRIVE_API = 'https://graph.microsoft.com/v1.0';
const REPORTS_FOLDER = 'MASKA_Reports';

// ===================================
// Folder Management
// ===================================

async function ensureReportsFolder() {
    const token = getToken();
    
    if (!token) {
        throw new Error('Not authenticated');
    }
    
    try {
        // Check if folder exists
        const checkResponse = await fetch(
            `${ONEDRIVE_API}/me/drive/root:/${REPORTS_FOLDER}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        
        if (checkResponse.ok) {
            const folder = await checkResponse.json();
            return folder.id;
        }
        
        // Create folder if it doesn't exist
        if (checkResponse.status === 404) {
            const createResponse = await fetch(
                `${ONEDRIVE_API}/me/drive/root/children`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: REPORTS_FOLDER,
                        folder: {},
                        '@microsoft.graph.conflictBehavior': 'rename'
                    })
                }
            );
            
            if (!createResponse.ok) {
                throw new Error('Failed to create reports folder');
            }
            
            const folder = await createResponse.json();
            return folder.id;
        }
        
        throw new Error('Failed to check folder existence');
    } catch (err) {
        console.error('Error ensuring reports folder:', err);
        throw err;
    }
}

// ===================================
// File Upload
// ===================================

async function uploadToOneDrive(report) {
    // Validate authentication and token expiry
    if (!isAuthenticated()) {
        throw new Error('Not authenticated. Please sign in to OneDrive.');
    }
    
    // Check if token is still valid
    if (!isTokenValid()) {
        throw new Error('Token expired. Please re-authenticate with OneDrive.');
    }
    
    const token = getToken();
    
    try {
        // Ensure folder exists
        await ensureReportsFolder();
        
        // Generate filename
        const filename = `MASKA_Daily_Report_${formatDateForFilename(report.date)}.txt`;
        
        // Check if file already exists to handle conflicts
        let shouldUpload = true;
        try {
            const checkResponse = await fetch(
                `${ONEDRIVE_API}/me/drive/root:/${REPORTS_FOLDER}/${filename}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            if (checkResponse.ok) {
                // File exists - this is expected for updates
                console.log('File exists, will update:', filename);
            }
        } catch (err) {
            // File doesn't exist, continue with upload
        }
        
        // Prepare file content
        const fileContent = `Subject: ${report.subject}\n\n${report.body}`;
        
        // Upload file
        const uploadResponse = await fetch(
            `${ONEDRIVE_API}/me/drive/root:/${REPORTS_FOLDER}/${filename}:/content`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'text/plain'
                },
                body: fileContent
            }
        );
        
        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error('Upload error:', errorText);
            
            if (uploadResponse.status === 401) {
                throw new Error('Token expired. Please re-authenticate.');
            }
            
            throw new Error('Failed to upload to OneDrive');
        }
        
        const uploadedFile = await uploadResponse.json();
        
        // Update report with OneDrive info
        if (report.id) {
            await updateReportInDB(report.id, {
                oneDriveFileId: uploadedFile.id,
                oneDriveUrl: uploadedFile.webUrl,
                syncedAt: new Date().toISOString()
            });
        }
        
        return uploadedFile;
    } catch (err) {
        console.error('Error uploading to OneDrive:', err);
        throw err;
    }
}

// ===================================
// File Download
// ===================================

async function downloadFromOneDrive(filename) {
    if (!isAuthenticated()) {
        throw new Error('Not authenticated');
    }
    
    const token = getToken();
    
    try {
        const response = await fetch(
            `${ONEDRIVE_API}/me/drive/root:/${REPORTS_FOLDER}/${filename}:/content`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        
        if (!response.ok) {
            throw new Error('Failed to download file');
        }
        
        return await response.text();
    } catch (err) {
        console.error('Error downloading from OneDrive:', err);
        throw err;
    }
}

// ===================================
// List Files
// ===================================

async function listOneDriveReports() {
    if (!isAuthenticated()) {
        throw new Error('Not authenticated');
    }
    
    const token = getToken();
    
    try {
        // Ensure folder exists
        await ensureReportsFolder();
        
        const response = await fetch(
            `${ONEDRIVE_API}/me/drive/root:/${REPORTS_FOLDER}:/children`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        
        if (!response.ok) {
            throw new Error('Failed to list files');
        }
        
        const data = await response.json();
        return data.value || [];
    } catch (err) {
        console.error('Error listing OneDrive files:', err);
        throw err;
    }
}

// ===================================
// Delete File
// ===================================

async function deleteFromOneDrive(fileId) {
    if (!isAuthenticated()) {
        throw new Error('Not authenticated');
    }
    
    const token = getToken();
    
    try {
        const response = await fetch(
            `${ONEDRIVE_API}/me/drive/items/${fileId}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        
        if (!response.ok && response.status !== 404) {
            throw new Error('Failed to delete file');
        }
        
        return true;
    } catch (err) {
        console.error('Error deleting from OneDrive:', err);
        throw err;
    }
}

// ===================================
// Sync Functions
// ===================================

async function syncAllReportsToOneDrive() {
    if (!isAuthenticated()) {
        throw new Error('Not authenticated');
    }
    
    try {
        const localReports = await getAllReportsFromDB();
        const results = {
            success: 0,
            failed: 0,
            skipped: 0
        };
        
        for (const report of localReports) {
            try {
                // Check if already synced
                if (report.oneDriveFileId) {
                    results.skipped++;
                    continue;
                }
                
                await uploadToOneDrive(report);
                results.success++;
            } catch (err) {
                console.error('Failed to sync report:', report.id, err);
                results.failed++;
            }
        }
        
        return results;
    } catch (err) {
        console.error('Error syncing all reports:', err);
        throw err;
    }
}

async function syncFromOneDrive() {
    if (!isAuthenticated()) {
        throw new Error('Not authenticated');
    }
    
    try {
        const oneDriveFiles = await listOneDriveReports();
        const localReports = await getAllReportsFromDB();
        
        // Create a map of local reports by date
        const localReportsByDate = {};
        localReports.forEach(report => {
            const dateKey = formatDateForFilename(report.date);
            localReportsByDate[dateKey] = report;
        });
        
        const results = {
            downloaded: 0,
            skipped: 0,
            failed: 0
        };
        
        for (const file of oneDriveFiles) {
            try {
                // Extract date from filename
                const match = file.name.match(/MASKA_Daily_Report_(\d{2}-\d{2}-\d{4})\.txt/);
                
                if (!match) {
                    results.skipped++;
                    continue;
                }
                
                const dateKey = match[1];
                
                // Skip if already exists locally
                if (localReportsByDate[dateKey]) {
                    results.skipped++;
                    continue;
                }
                
                // Download and parse the file
                const content = await downloadFromOneDrive(file.name);
                
                // Parse the report
                // This is a simplified parser - you may need to enhance it
                const report = parseReportFromText(content, dateKey, file);
                
                // Save to local database
                await saveReportToDB(report);
                results.downloaded++;
            } catch (err) {
                console.error('Failed to download report:', file.name, err);
                results.failed++;
            }
        }
        
        return results;
    } catch (err) {
        console.error('Error syncing from OneDrive:', err);
        throw err;
    }
}

// ===================================
// Helper Functions
// ===================================

function parseReportFromText(content, dateKey, fileInfo) {
    // Extract subject and body
    const lines = content.split('\n');
    const subjectLine = lines.find(line => line.startsWith('Subject:'));
    const subject = subjectLine ? subjectLine.replace('Subject:', '').trim() : '';
    
    const bodyStartIndex = lines.findIndex(line => line.startsWith('Dear'));
    const body = bodyStartIndex >= 0 ? lines.slice(bodyStartIndex).join('\n') : content;
    
    // Parse date (DD-MM-YYYY to YYYY-MM-DD)
    const [day, month, year] = dateKey.split('-');
    const date = `${year}-${month}-${day}`;
    
    // Extract basic info from body
    const locationMatch = body.match(/worked from (\w+)/);
    const timeMatch = body.match(/from (\d{2}:\d{2}) to (\d{2}:\d{2})/);
    const hoursMatch = body.match(/Tasks Hours: (\d+(?:\.\d+)?)h/);
    
    return {
        date,
        subject,
        body,
        location: locationMatch ? locationMatch[1] : 'TF',
        timeFrom: timeMatch ? timeMatch[1] : '09:00',
        timeTo: timeMatch ? timeMatch[2] : '17:00',
        totalHours: hoursMatch ? parseFloat(hoursMatch[1]) : 0,
        projects: [], // Would need more sophisticated parsing
        generalTasks: [],
        oneDriveFileId: fileInfo.id,
        oneDriveUrl: fileInfo.webUrl,
        syncedAt: new Date().toISOString()
    };
}

// ===================================
// Storage Info
// ===================================

async function getOneDriveStorageInfo() {
    if (!isAuthenticated()) {
        throw new Error('Not authenticated');
    }
    
    const token = getToken();
    
    try {
        const response = await fetch(
            `${ONEDRIVE_API}/me/drive`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        
        if (!response.ok) {
            throw new Error('Failed to get storage info');
        }
        
        const drive = await response.json();
        return {
            totalSpace: drive.quota.total,
            usedSpace: drive.quota.used,
            remainingSpace: drive.quota.remaining,
            state: drive.quota.state
        };
    } catch (err) {
        console.error('Error getting storage info:', err);
        throw err;
    }
}

// ===================================
// Export Functions
// ===================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        uploadToOneDrive,
        downloadFromOneDrive,
        listOneDriveReports,
        deleteFromOneDrive,
        syncAllReportsToOneDrive,
        syncFromOneDrive,
        getOneDriveStorageInfo,
        ensureReportsFolder
    };
}
