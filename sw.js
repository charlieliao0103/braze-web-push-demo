const brazeConfig = {
    apiKey: 'YOUR_API_KEY',
    appId: 'YOUR_APP_ID',
    userId: 'test-user-123', // Unique user identifier
    enableLogging: true
};

const braze = require('@braze/web-sdk');
braze.initialize(brazeConfig.apiKey, brazeConfig);

// Start session tracking
braze.openSession();

document.getElementById('optInButton').addEventListener('click', async () => {
    try {
        // Request browser permission
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
            // Register service worker
            const registration = await navigator.serviceWorker.register('service-worker.js');
            
            // Get push subscription
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: 'YOUR_VAPID_KEY'
            });
            
            // Send to Braze
            braze.subscribeToPushNotifications(subscription);
            braze.logCustomEvent('push_opt_in_success');
        }
    } catch (error) {
        console.error('Push subscription failed:', error);
    }
});
