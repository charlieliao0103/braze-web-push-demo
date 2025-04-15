// Modify the service worker registration block
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(
        window.brazeConfig.serviceWorker.path, 
        { 
            scope: window.brazeConfig.serviceWorker.scope,
            updateViaCache: 'none'  // Important for Vercel deployments
        }
    ).then(registration => {
        console.log('SW registered:', registration);
        
        // Force immediate activation
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'activated') {
                    console.log('New SW activated');
                    window.location.reload();
                }
            });
        });
    }).catch(error => {
        console.error('SW registration failed:', error);
    });
}
