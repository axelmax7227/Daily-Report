// ===================================
// State Management
// ===================================
const state = {
    projects: [],
    generalTasks: [],
    currentReport: null
};

// ===================================
// Utility Functions
// ===================================

// Format date as DD/MM/YYYY
function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

// Format date for filename (DD-MM-YYYY)
function formatDateForFilename(date) {
    return formatDate(date).replace(/\//g, '-');
}

// Calculate total hours from time strings
function calculateWorkHours(timeFrom, timeTo) {
    const [fromHours, fromMinutes] = timeFrom.split(':').map(Number);
    const [toHours, toMinutes] = timeTo.split(':').map(Number);
    
    const fromTotalMinutes = fromHours * 60 + fromMinutes;
    const toTotalMinutes = toHours * 60 + toMinutes;
    
    const diffMinutes = toTotalMinutes - fromTotalMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===================================
// Project Management
// ===================================

function addProject() {
    const project = {
        id: Date.now(),
        name: '',
        tasks: []
    };
    
    state.projects.push(project);
    renderProjects();
    updatePreview();
}

function removeProject(projectId) {
    state.projects = state.projects.filter(p => p.id !== projectId);
    renderProjects();
    updatePreview();
}

function updateProjectName(projectId, name) {
    const project = state.projects.find(p => p.id === projectId);
    if (project) {
        project.name = name;
        updatePreview();
    }
}

function addTaskToProject(projectId) {
    const project = state.projects.find(p => p.id === projectId);
    if (project) {
        project.tasks.push({
            id: Date.now(),
            description: '',
            hours: 0
        });
        renderProjects();
        updatePreview();
    }
}

function removeTaskFromProject(projectId, taskId) {
    const project = state.projects.find(p => p.id === projectId);
    if (project) {
        project.tasks = project.tasks.filter(t => t.id !== taskId);
        renderProjects();
        updatePreview();
    }
}

function updateTask(projectId, taskId, field, value) {
    const project = state.projects.find(p => p.id === projectId);
    if (project) {
        const task = project.tasks.find(t => t.id === taskId);
        if (task) {
            task[field] = field === 'hours' ? parseFloat(value) || 0 : value;
            updatePreview();
            updateTotalHours();
        }
    }
}

function renderProjects() {
    const container = document.getElementById('projects-container');
    
    if (state.projects.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📁</div>
                <p>No projects added yet. Click "Add Project" to get started.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = state.projects.map(project => `
        <div class="project-card fade-in" data-project-id="${project.id}">
            <div class="project-header">
                <input 
                    type="text" 
                    class="form-control" 
                    placeholder="Project Name (e.g., ROB4GREEN, MASKA)"
                    value="${project.name}"
                    onchange="updateProjectName(${project.id}, this.value)"
                >
                <button class="btn btn-danger btn-sm" onclick="removeProject(${project.id})">
                    🗑️
                </button>
            </div>
            
            <div class="tasks-container">
                ${project.tasks.map(task => `
                    <div class="task-item">
                        <input 
                            type="text" 
                            class="form-control" 
                            placeholder="Task description"
                            value="${task.description}"
                            onchange="updateTask(${project.id}, ${task.id}, 'description', this.value)"
                        >
                        <input 
                            type="number" 
                            class="form-control" 
                            placeholder="Hours"
                            min="0"
                            step="0.5"
                            value="${task.hours || ''}"
                            onchange="updateTask(${project.id}, ${task.id}, 'hours', this.value)"
                        >
                        <button class="btn btn-danger btn-sm" onclick="removeTaskFromProject(${project.id}, ${task.id})">
                            ✕
                        </button>
                    </div>
                `).join('')}
            </div>
            
            <button class="btn btn-secondary btn-sm" onclick="addTaskToProject(${project.id})">
                + Add Task
            </button>
        </div>
    `).join('');
}

// ===================================
// General Tasks Management
// ===================================

function addGeneralTask() {
    state.generalTasks.push({
        id: Date.now(),
        description: ''
    });
    renderGeneralTasks();
    updatePreview();
}

function removeGeneralTask(taskId) {
    state.generalTasks = state.generalTasks.filter(t => t.id !== taskId);
    renderGeneralTasks();
    updatePreview();
}

function updateGeneralTask(taskId, value) {
    const task = state.generalTasks.find(t => t.id === taskId);
    if (task) {
        task.description = value;
        updatePreview();
    }
}

function renderGeneralTasks() {
    const container = document.getElementById('general-tasks-container');
    
    if (state.generalTasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="padding: var(--spacing);">
                <p style="font-size: 0.9rem;">No general tasks added yet.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = state.generalTasks.map(task => `
        <div class="general-task-item fade-in">
            <input 
                type="text" 
                class="form-control" 
                placeholder="General task description"
                value="${task.description}"
                onchange="updateGeneralTask(${task.id}, this.value)"
            >
            <button class="btn btn-danger btn-sm" onclick="removeGeneralTask(${task.id})">
                ✕
            </button>
        </div>
    `).join('');
}

// ===================================
// Total Hours Calculation
// ===================================

function updateTotalHours() {
    const total = state.projects.reduce((sum, project) => {
        return sum + project.tasks.reduce((taskSum, task) => taskSum + (task.hours || 0), 0);
    }, 0);
    
    document.getElementById('total-hours-display').textContent = `${total}h`;
}

// ===================================
// Report Generation
// ===================================

function generateReport() {
    const date = document.getElementById('report-date').value;
    const location = document.getElementById('work-location').value;
    const timeFrom = document.getElementById('time-from').value;
    const timeTo = document.getElementById('time-to').value;
    
    if (!date) {
        showToast('Please select a date', 'error');
        return null;
    }
    
    const formattedDate = formatDate(date);
    const subject = `MASKA: Daily report (${formattedDate})`;
    
    let body = `Dear Dionisis,\n\n`;
    body += `Today, I worked from ${location} from ${timeFrom} to ${timeTo}.\n\n`;
    
    // Calculate total task hours
    const totalTaskHours = state.projects.reduce((sum, project) => {
        return sum + project.tasks.reduce((taskSum, task) => taskSum + (task.hours || 0), 0);
    }, 0);
    
    body += `Tasks Hours: ${totalTaskHours}h\n\n`;
    
    // Add projects and tasks
    state.projects.forEach(project => {
        if (project.name && project.tasks.length > 0) {
            body += `${project.name}:\n`;
            project.tasks.forEach(task => {
                if (task.description) {
                    const hours = task.hours ? ` (${task.hours}h)` : '';
                    body += `   • ${task.description}${hours}\n`;
                }
            });
            body += `\n`;
        }
    });
    
    // Add general tasks if any
    if (state.generalTasks.length > 0 && state.generalTasks.some(t => t.description)) {
        body += `General Tasks:\n`;
        state.generalTasks.forEach(task => {
            if (task.description) {
                body += `   • ${task.description}\n`;
            }
        });
        body += `\n`;
    }
    
    body += `Best regards,\nAlexandros`;
    
    return {
        date,
        subject,
        body,
        location,
        timeFrom,
        timeTo,
        projects: JSON.parse(JSON.stringify(state.projects)),
        generalTasks: JSON.parse(JSON.stringify(state.generalTasks)),
        totalHours: totalTaskHours
    };
}

function updatePreview() {
    const report = generateReport();
    
    if (!report) return;
    
    document.getElementById('preview-subject').textContent = report.subject;
    document.getElementById('preview-body').textContent = report.body;
    
    state.currentReport = report;
}

// ===================================
// Clipboard & Actions
// ===================================

async function copyToClipboard() {
    const report = generateReport();
    
    if (!report) return;
    
    const textToCopy = `Subject: ${report.subject}\n\n${report.body}`;
    
    try {
        await navigator.clipboard.writeText(textToCopy);
        showToast('Report copied to clipboard! ✓', 'success');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            showToast('Report copied to clipboard! ✓', 'success');
        } catch (err) {
            showToast('Failed to copy to clipboard', 'error');
        }
        
        document.body.removeChild(textArea);
    }
}

async function saveReport() {
    const report = generateReport();
    
    if (!report) return;
    
    try {
        // Save to IndexedDB
        await saveReportToDB(report);
        showToast('Report saved locally! ✓', 'success');
        
        // Try to sync to OneDrive if authenticated
        if (isAuthenticated()) {
            try {
                await uploadToOneDrive(report);
                showToast('Report synced to OneDrive! ☁️', 'success');
            } catch (err) {
                console.error('OneDrive sync error:', err);
                showToast('Saved locally. OneDrive sync will retry later.', 'info');
            }
        } else {
            showToast('Report saved locally. Sign in to sync with OneDrive.', 'info');
        }
    } catch (err) {
        console.error('Save error:', err);
        showToast('Failed to save report', 'error');
    }
}

// ===================================
// History Management
// ===================================

function openHistoryModal() {
    const modal = document.getElementById('history-modal');
    modal.classList.add('active');
    loadHistory();
}

function closeHistoryModal() {
    const modal = document.getElementById('history-modal');
    modal.classList.remove('active');
}

async function loadHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '<div class="loading">Loading history...</div>';
    
    try {
        const reports = await getAllReportsFromDB();
        
        if (reports.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <p>No reports saved yet.</p>
                </div>
            `;
            return;
        }
        
        historyList.innerHTML = reports.map(report => `
            <div class="history-item fade-in">
                <div class="history-item-header">
                    <div class="history-item-date">${formatDate(report.date)}</div>
                    <div class="history-item-actions">
                        <button class="btn btn-secondary btn-sm" onclick="loadReport('${report.id}')">
                            Load
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteReport('${report.id}')">
                            Delete
                        </button>
                    </div>
                </div>
                <div class="history-item-info">
                    ${report.location} | ${report.timeFrom} - ${report.timeTo} | ${report.totalHours}h
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Error loading history:', err);
        historyList.innerHTML = `
            <div class="empty-state">
                <p style="color: var(--danger-color);">Error loading history</p>
            </div>
        `;
    }
}

async function loadReport(reportId) {
    try {
        const report = await getReportFromDB(reportId);
        
        if (!report) {
            showToast('Report not found', 'error');
            return;
        }
        
        // Load report data into form
        document.getElementById('report-date').value = report.date;
        document.getElementById('work-location').value = report.location;
        document.getElementById('time-from').value = report.timeFrom;
        document.getElementById('time-to').value = report.timeTo;
        
        state.projects = report.projects || [];
        state.generalTasks = report.generalTasks || [];
        
        renderProjects();
        renderGeneralTasks();
        updatePreview();
        updateTotalHours();
        
        closeHistoryModal();
        showToast('Report loaded! ✓', 'success');
    } catch (err) {
        console.error('Error loading report:', err);
        showToast('Failed to load report', 'error');
    }
}

async function deleteReport(reportId) {
    if (!confirm('Are you sure you want to delete this report?')) {
        return;
    }
    
    try {
        await deleteReportFromDB(reportId);
        showToast('Report deleted! ✓', 'success');
        loadHistory();
    } catch (err) {
        console.error('Error deleting report:', err);
        showToast('Failed to delete report', 'error');
    }
}

// ===================================
// Event Listeners
// ===================================

function initializeApp() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('report-date').value = today;
    
    // Add first project by default
    addProject();
    
    // Add first general task
    addGeneralTask();
    
    // Event listeners
    document.getElementById('add-project-btn').addEventListener('click', addProject);
    document.getElementById('add-general-task-btn').addEventListener('click', addGeneralTask);
    document.getElementById('preview-btn').addEventListener('click', () => {
        updatePreview();
        showToast('Preview updated! ✓', 'info');
    });
    document.getElementById('save-btn').addEventListener('click', saveReport);
    document.getElementById('copy-btn').addEventListener('click', copyToClipboard);
    document.getElementById('history-btn').addEventListener('click', openHistoryModal);
    document.getElementById('close-history-btn').addEventListener('click', closeHistoryModal);
    document.getElementById('sync-btn').addEventListener('click', handleSync);
    
    // Form change listeners for auto-preview
    document.getElementById('report-date').addEventListener('change', updatePreview);
    document.getElementById('work-location').addEventListener('change', updatePreview);
    document.getElementById('time-from').addEventListener('change', updatePreview);
    document.getElementById('time-to').addEventListener('change', updatePreview);
    
    // Close modal on outside click
    document.getElementById('history-modal').addEventListener('click', (e) => {
        if (e.target.id === 'history-modal') {
            closeHistoryModal();
        }
    });
    
    // Initial preview
    updatePreview();
    updateTotalHours();
}

// ===================================
// OneDrive Sync Handler
// ===================================

async function handleSync() {
    const syncBtn = document.getElementById('sync-btn');
    const originalContent = syncBtn.innerHTML;
    
    syncBtn.innerHTML = '<span class="icon">⏳</span>';
    syncBtn.disabled = true;
    
    try {
        if (!isAuthenticated()) {
            await authenticateOneDrive();
        } else {
            // Sync all pending reports
            const reports = await getAllReportsFromDB();
            let syncCount = 0;
            
            for (const report of reports) {
                try {
                    await uploadToOneDrive(report);
                    syncCount++;
                } catch (err) {
                    console.error('Sync error for report:', report.id, err);
                }
            }
            
            showToast(`Synced ${syncCount} report(s) to OneDrive! ☁️`, 'success');
        }
    } catch (err) {
        console.error('Sync error:', err);
        showToast('Sync failed. Please try again.', 'error');
    } finally {
        syncBtn.innerHTML = originalContent;
        syncBtn.disabled = false;
    }
}

// ===================================
// Initialize on load
// ===================================

// Wait for DOM and other scripts to load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
