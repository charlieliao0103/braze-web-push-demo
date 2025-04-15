{
    "headers": [
        {
            "source": "/sw.js",
            "headers": [
                {
                    "key": "Service-Worker-Allowed",
                    "value": "/"
                },
                {
                    "key": "Content-Type",
                    "value": "application/javascript"
                },
                {
                    "key": "Cache-Control",
                    "value": "no-cache, max-age=0"
                },
                {
                    "key": "Access-Control-Allow-Origin",
                    "value": "*"
                }
            ]
        },
        {
            "source": "/(.*)",
            "headers": [
                {
                    "key": "Content-Security-Policy",
                    "value": "default-src 'self' https: 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://*.braze.com; worker-src 'self' blob:;"
                }
            ]
        }
    ]
}
