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
