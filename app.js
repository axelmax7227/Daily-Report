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

// Sanitize user input to prevent XSS attacks
function sanitizeInput(input) {
    if (typeof input !== 'string') {
        return '';
    }
    // Remove any HTML tags and trim whitespace
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML.trim();
}

// Escape HTML for safe insertion into attributes
function escapeHtml(text) {
    if (typeof text !== 'string') {
        return '';
    }
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

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
    if (project && typeof name === 'string') {
        project.name = sanitizeInput(name);
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
            if (field === 'hours') {
                task[field] = parseFloat(value) || 0;
            } else if (field === 'description' && typeof value === 'string') {
                task[field] = sanitizeInput(value);
            }
            updatePreview();
            updateTotalHours();
        }
    }
}

function renderProjects() {
    const container = document.getElementById('projects-container');
    
    // Clear existing content
    container.innerHTML = '';
    
    if (state.projects.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <div class="empty-state-icon">📁</div>
            <p>No projects added yet. Click "Add Project" to get started.</p>
        `;
        container.appendChild(emptyState);
        return;
    }
    
    // Create project cards using safe DOM methods
    state.projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card fade-in';
        projectCard.dataset.projectId = project.id;
        
        // Project header
        const projectHeader = document.createElement('div');
        projectHeader.className = 'project-header';
        
        const projectInput = document.createElement('input');
        projectInput.type = 'text';
        projectInput.className = 'form-control';
        projectInput.placeholder = 'Project Name (e.g., ROB4GREEN, MASKA)';
        projectInput.value = project.name || '';
        projectInput.addEventListener('change', (e) => {
            updateProjectName(project.id, e.target.value);
        });
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn btn-danger btn-sm';
        removeBtn.textContent = '🗑️';
        removeBtn.addEventListener('click', () => {
            removeProject(project.id);
        });
        
        projectHeader.appendChild(projectInput);
        projectHeader.appendChild(removeBtn);
        
        // Tasks container
        const tasksContainer = document.createElement('div');
        tasksContainer.className = 'tasks-container';
        
        project.tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            
            const taskDescInput = document.createElement('input');
            taskDescInput.type = 'text';
            taskDescInput.className = 'form-control';
            taskDescInput.placeholder = 'Task description';
            taskDescInput.value = task.description || '';
            taskDescInput.addEventListener('change', (e) => {
                updateTask(project.id, task.id, 'description', e.target.value);
            });
            
            const taskHoursInput = document.createElement('input');
            taskHoursInput.type = 'number';
            taskHoursInput.className = 'form-control';
            taskHoursInput.placeholder = 'Hours';
            taskHoursInput.min = '0';
            taskHoursInput.step = '0.5';
            taskHoursInput.value = task.hours || '';
            taskHoursInput.addEventListener('change', (e) => {
                updateTask(project.id, task.id, 'hours', e.target.value);
            });
            
            const taskRemoveBtn = document.createElement('button');
            taskRemoveBtn.className = 'btn btn-danger btn-sm';
            taskRemoveBtn.textContent = '✕';
            taskRemoveBtn.addEventListener('click', () => {
                removeTaskFromProject(project.id, task.id);
            });
            
            taskItem.appendChild(taskDescInput);
            taskItem.appendChild(taskHoursInput);
            taskItem.appendChild(taskRemoveBtn);
            tasksContainer.appendChild(taskItem);
        });
        
        // Add task button
        const addTaskBtn = document.createElement('button');
        addTaskBtn.className = 'btn btn-secondary btn-sm';
        addTaskBtn.textContent = '+ Add Task';
        addTaskBtn.addEventListener('click', () => {
            addTaskToProject(project.id);
        });
        
        projectCard.appendChild(projectHeader);
        projectCard.appendChild(tasksContainer);
        projectCard.appendChild(addTaskBtn);
        container.appendChild(projectCard);
    });
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
    if (task && typeof value === 'string') {
        task.description = sanitizeInput(value);
        updatePreview();
    }
}

function renderGeneralTasks() {
    const container = document.getElementById('general-tasks-container');
    
    // Clear existing content
    container.innerHTML = '';
    
    if (state.generalTasks.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.style.padding = 'var(--spacing)';
        const p = document.createElement('p');
        p.style.fontSize = '0.9rem';
        p.textContent = 'No general tasks added yet.';
        emptyState.appendChild(p);
        container.appendChild(emptyState);
        return;
    }
    
    // Create general task items using safe DOM methods
    state.generalTasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'general-task-item fade-in';
        
        const taskInput = document.createElement('input');
        taskInput.type = 'text';
        taskInput.className = 'form-control';
        taskInput.placeholder = 'General task description';
        taskInput.value = task.description || '';
        taskInput.addEventListener('change', (e) => {
            updateGeneralTask(task.id, e.target.value);
        });
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn btn-danger btn-sm';
        removeBtn.textContent = '✕';
        removeBtn.addEventListener('click', () => {
            removeGeneralTask(task.id);
        });
        
        taskItem.appendChild(taskInput);
        taskItem.appendChild(removeBtn);
        container.appendChild(taskItem);
    });
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
            showToast('Authenticated successfully! Click Sync again to sync reports.', 'success');
        } else {
            // First, download reports FROM OneDrive
            let downloadResults = null;
            try {
                downloadResults = await syncAllReportsFromOneDrive();
                if (downloadResults.downloaded > 0) {
                    showToast(`Downloaded ${downloadResults.downloaded} report(s) from OneDrive! 📥`, 'success');
                    // Refresh history if modal is open
                    if (document.getElementById('history-modal').classList.contains('active')) {
                        await loadHistory();
                    }
                }
            } catch (err) {
                console.error('Download from OneDrive error:', err);
            }
            
            // Then, upload local reports TO OneDrive
            const reports = await getAllReportsFromDB();
            let syncCount = 0;
            
            for (const report of reports) {
                try {
                    await uploadToOneDrive(report);
                    syncCount++;
                } catch (err) {
                    console.error('Upload error for report:', report.id, err);
                }
            }
            
            if (syncCount > 0) {
                showToast(`Uploaded ${syncCount} report(s) to OneDrive! ☁️`, 'success');
            }
            
            if (!downloadResults || (downloadResults.downloaded === 0 && syncCount === 0)) {
                showToast('All reports are already synced! ✓', 'info');
            }
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
