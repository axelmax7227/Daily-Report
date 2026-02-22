// ===================================
// Microsoft OneDrive Authentication
// ===================================

// Configuration
const AUTH_CONFIG = {
    clientId: '', // Will be set from environment or user input
    redirectUri: window.location.origin + '/auth-callback.html',
    scopes: ['Files.ReadWrite', 'User.Read', 'Mail.Read', 'Mail.Read.Shared', 'Mail.Send'],
    authority: 'https://login.microsoftonline.com/common',
    apiEndpoint: 'https://graph.microsoft.com/v1.0'
};

// Token storage keys
const TOKEN_STORAGE_KEY = 'maska_onedrive_token';
const TOKEN_EXPIRY_KEY = 'maska_onedrive_token_expiry';
const CLIENT_ID_KEY = 'maska_client_id';

// ===================================
// Configuration Management
// ===================================

function setClientId(clientId) {
    AUTH_CONFIG.clientId = clientId;
    localStorage.setItem(CLIENT_ID_KEY, clientId);
}

function getClientId() {
    if (!AUTH_CONFIG.clientId) {
        AUTH_CONFIG.clientId = localStorage.getItem(CLIENT_ID_KEY) || '';
    }
    return AUTH_CONFIG.clientId;
}

function hasClientId() {
    return getClientId() !== '';
}

// ===================================
// Token Management
// ===================================

function saveToken(accessToken, expiresIn) {
    const expiryTime = Date.now() + (expiresIn * 1000) - 300000; // 5 min buffer
    localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
}

function getToken() {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
}

function getTokenExpiry() {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    return expiry ? parseInt(expiry) : 0;
}

function isTokenValid() {
    const token = getToken();
    const expiry = getTokenExpiry();
    
    if (!token || !expiry) {
        return false;
    }
    
    return Date.now() < expiry;
}

function clearToken() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

function isAuthenticated() {
    return hasClientId() && isTokenValid();
}

// ===================================
// OAuth Flow
// ===================================

async function authenticateOneDrive() {
    return new Promise((resolve, reject) => {
        // Check if client ID is configured
        if (!hasClientId()) {
            // Prompt user for client ID
            promptForClientId().then(clientId => {
                if (!clientId) {
                    reject(new Error('Client ID is required'));
                    return;
                }
                setClientId(clientId);
                startOAuthFlow(resolve, reject);
            });
        } else {
            startOAuthFlow(resolve, reject);
        }
    });
}

function promptForClientId() {
    return new Promise((resolve) => {
        const clientId = prompt(
            'Enter your Microsoft Azure App Client ID:\n\n' +
            'Don\'t have one? Follow these steps:\n' +
            '1. Go to Azure Portal (portal.azure.com)\n' +
            '2. Register a new app\n' +
            '3. Add redirect URI: ' + AUTH_CONFIG.redirectUri + '\n' +
            '4. Copy the Application (client) ID\n\n' +
            'See README.md for detailed instructions.'
        );
        resolve(clientId);
    });
}

function startOAuthFlow(resolve, reject) {
    const authUrl = buildAuthUrl();
    
    // Open popup window for authentication
    const width = 500;
    const height = 600;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    
    const popup = window.open(
        authUrl,
        'OneDrive Authentication',
        `width=${width},height=${height},left=${left},top=${top}`
    );
    
    if (!popup) {
        reject(new Error('Popup blocked. Please allow popups for this site.'));
        return;
    }
    
    // Listen for the authentication callback
    const messageHandler = (event) => {
        // Verify origin
        if (event.origin !== window.location.origin) {
            return;
        }
        
        if (event.data.type === 'auth-success') {
            window.removeEventListener('message', messageHandler);
            popup.close();
            
            // Save token
            saveToken(event.data.accessToken, event.data.expiresIn);
            resolve(event.data.accessToken);
        } else if (event.data.type === 'auth-error') {
            window.removeEventListener('message', messageHandler);
            popup.close();
            reject(new Error(event.data.error));
        }
    };
    
    window.addEventListener('message', messageHandler);
    
    // Check if popup was closed
    const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
            clearInterval(checkPopupClosed);
            window.removeEventListener('message', messageHandler);
            reject(new Error('Authentication cancelled'));
        }
    }, 1000);
}

function buildAuthUrl() {
    const params = new URLSearchParams({
        client_id: getClientId(),
        response_type: 'token',
        redirect_uri: AUTH_CONFIG.redirectUri,
        scope: AUTH_CONFIG.scopes.join(' '),
        response_mode: 'fragment'
    });
    
    return `${AUTH_CONFIG.authority}/oauth2/v2.0/authorize?${params.toString()}`;
}

// ===================================
// Sign Out
// ===================================

function signOut() {
    clearToken();
    showToast('Signed out successfully', 'info');
}

// ===================================
// User Info
// ===================================

async function getUserInfo() {
    if (!isAuthenticated()) {
        throw new Error('Not authenticated');
    }
    
    const token = getToken();
    
    try {
        const response = await fetch(`${AUTH_CONFIG.apiEndpoint}/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to get user info');
        }
        
        return await response.json();
    } catch (err) {
        console.error('Error getting user info:', err);
        throw err;
    }
}

// ===================================
// Settings UI
// ===================================

function showAuthSettings() {
    const currentClientId = getClientId();
    const isAuth = isAuthenticated();
    
    const settingsHtml = `
        <div class="auth-settings">
            <h3>OneDrive Settings</h3>
            <div class="form-group">
                <label>Client ID:</label>
                <input type="text" id="client-id-input" class="form-control" 
                       value="${currentClientId}" placeholder="Enter Azure App Client ID">
            </div>
            <div class="form-group">
                <label>Status:</label>
                <p>${isAuth ? '✅ Authenticated' : '❌ Not authenticated'}</p>
            </div>
            <div class="form-actions">
                <button class="btn btn-primary" onclick="saveAuthSettings()">Save</button>
                ${isAuth ? '<button class="btn btn-danger" onclick="signOut()">Sign Out</button>' : ''}
            </div>
        </div>
    `;
    
    // Show in a modal or settings panel
    // Implementation depends on your UI structure
    console.log('Auth settings:', settingsHtml);
}

function saveAuthSettings() {
    const clientId = document.getElementById('client-id-input').value.trim();
    
    if (!clientId) {
        showToast('Please enter a valid Client ID', 'error');
        return;
    }
    
    setClientId(clientId);
    showToast('Settings saved! You can now authenticate.', 'success');
}

// ===================================
// Export Functions
// ===================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        authenticateOneDrive,
        isAuthenticated,
        signOut,
        getUserInfo,
        getToken,
        setClientId,
        getClientId,
        hasClientId
    };
}
