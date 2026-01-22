// ===================================
// Service Worker Registration
// ===================================

// Check if service workers are supported
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        registerServiceWorker();
    });
}

async function registerServiceWorker() {
    try {
        const registration = await navigator.serviceWorker.register('./service-worker.js', {
            scope: '/'
        });
        
        console.log('[App] ServiceWorker registered:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('[App] ServiceWorker update found');
            
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New service worker available
                    showUpdateNotification();
                }
            });
        });
        
        // Check for updates periodically (every hour)
        setInterval(() => {
            registration.update();
        }, 60 * 60 * 1000);
        
        // Request background sync permission
        if ('sync' in registration) {
            console.log('[App] Background Sync supported');
        }
        
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            // Don't request immediately - wait for user interaction
            // Notification.requestPermission();
        }
        
    } catch (err) {
        console.error('[App] ServiceWorker registration failed:', err);
    }
}

// ===================================
// Update Notification
// ===================================

function showUpdateNotification() {
    const updateBanner = document.createElement('div');
    updateBanner.className = 'update-banner';
    updateBanner.innerHTML = `
        <div class="update-content">
            <span>🎉 A new version is available!</span>
            <button id="update-btn" class="btn btn-sm btn-primary">Update Now</button>
            <button id="dismiss-update-btn" class="btn btn-sm btn-secondary">Later</button>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .update-banner {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #0078d4, #106ebe);
            color: white;
            padding: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideDown 0.3s ease;
        }
        
        .update-content {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            flex-wrap: wrap;
        }
        
        .update-banner .btn {
            background: white;
            color: #0078d4;
            border: none;
            padding: 6px 16px;
            cursor: pointer;
            border-radius: 4px;
            font-weight: 500;
        }
        
        .update-banner .btn:hover {
            background: #f0f0f0;
        }
        
        .update-banner .btn-secondary {
            background: transparent;
            color: white;
            border: 1px solid white;
        }
        
        .update-banner .btn-secondary:hover {
            background: rgba(255,255,255,0.1);
        }
        
        @keyframes slideDown {
            from {
                transform: translateY(-100%);
            }
            to {
                transform: translateY(0);
            }
        }
        
        @media (max-width: 640px) {
            .update-content {
                flex-direction: column;
                text-align: center;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.insertBefore(updateBanner, document.body.firstChild);
    
    // Update button handler with { once: true } to prevent memory leaks
    document.getElementById('update-btn').addEventListener('click', () => {
        // Tell service worker to skip waiting
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
        }
        
        // Reload the page
        window.location.reload();
    }, { once: true });
    
    // Dismiss button handler with { once: true } to prevent memory leaks
    document.getElementById('dismiss-update-btn').addEventListener('click', () => {
        updateBanner.remove();
    }, { once: true });
}

// ===================================
// Installation Prompt
// ===================================

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    console.log('[App] Install prompt available');
    
    // Prevent the default prompt
    e.preventDefault();
    
    // Store the event for later use
    deferredPrompt = e;
    
    // Show custom install button
    showInstallPrompt();
});

function showInstallPrompt() {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('[App] Already installed');
        return;
    }
    
    // Create install banner
    const installBanner = document.createElement('div');
    installBanner.id = 'install-banner';
    installBanner.className = 'install-banner';
    installBanner.innerHTML = `
        <div class="install-content">
            <div class="install-text">
                <strong>📱 Install MASKA Reports</strong>
                <span>Get quick access from your home screen</span>
            </div>
            <div class="install-actions">
                <button id="install-btn" class="btn btn-sm btn-success">Install</button>
                <button id="dismiss-install-btn" class="btn btn-sm btn-icon">✕</button>
            </div>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .install-banner {
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            background: white;
            padding: 16px;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
            z-index: 9998;
            animation: slideUp 0.3s ease;
        }
        
        .install-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
        }
        
        .install-text {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        
        .install-text strong {
            font-size: 1rem;
            color: #323130;
        }
        
        .install-text span {
            font-size: 0.875rem;
            color: #605e5c;
        }
        
        .install-actions {
            display: flex;
            gap: 8px;
            flex-shrink: 0;
        }
        
        @keyframes slideUp {
            from {
                transform: translateY(100%);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @media (max-width: 640px) {
            .install-banner {
                bottom: 0;
                left: 0;
                right: 0;
                border-radius: 12px 12px 0 0;
            }
            
            .install-content {
                flex-direction: column;
                text-align: center;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(installBanner);
    
    // Install button handler with { once: true } to prevent memory leaks
    document.getElementById('install-btn').addEventListener('click', async () => {
        if (!deferredPrompt) {
            return;
        }
        
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user's response
        const { outcome } = await deferredPrompt.userChoice;
        console.log('[App] Install outcome:', outcome);
        
        // Clear the deferred prompt
        deferredPrompt = null;
        
        // Remove the banner
        installBanner.remove();
        
        if (outcome === 'accepted') {
            if (typeof showToast === 'function') {
                showToast('App installed successfully! 🎉', 'success');
            }
        }
    }, { once: true });
    
    // Dismiss button handler with { once: true } to prevent memory leaks
    document.getElementById('dismiss-install-btn').addEventListener('click', () => {
        installBanner.remove();
        // Remember user dismissed (optional)
        localStorage.setItem('install-prompt-dismissed', Date.now());
    }, { once: true });
    
    // Auto-dismiss after showing a few times
    const dismissedTime = localStorage.getItem('install-prompt-dismissed');
    if (dismissedTime) {
        const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
        if (daysSinceDismissed < 7) {
            // Don't show if dismissed in last 7 days
            installBanner.remove();
        }
    }
}

// ===================================
// App Installed Handler
// ===================================

window.addEventListener('appinstalled', () => {
    console.log('[App] PWA installed');
    showToast('App installed successfully! 🎉', 'success');
    
    // Hide install prompt if visible
    const installBanner = document.getElementById('install-banner');
    if (installBanner) {
        installBanner.remove();
    }
});

// ===================================
// Online/Offline Detection
// ===================================

window.addEventListener('online', () => {
    console.log('[App] Back online');
    showToast('Connection restored! ✓', 'success');
    
    // Try to sync pending reports
    if (typeof handleSync === 'function') {
        handleSync().catch(err => {
            console.error('[App] Auto-sync failed:', err);
        });
    }
});

window.addEventListener('offline', () => {
    console.log('[App] Gone offline');
    showToast('Working offline. Changes will sync when online.', 'info');
});

// ===================================
// Display Mode Detection
// ===================================

function isInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
}

if (isInstalled()) {
    console.log('[App] Running as installed PWA');
    document.body.classList.add('pwa-installed');
} else {
    console.log('[App] Running in browser');
}

// ===================================
// Log App Info
// ===================================

console.log('[App] MASKA Reports PWA v1.0.0');
console.log('[App] Service Worker supported:', 'serviceWorker' in navigator);
console.log('[App] Installed:', isInstalled());
console.log('[App] Online:', navigator.onLine);
