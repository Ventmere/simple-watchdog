# simple-watchdog
Simple watchdog script

## PM2 Config file
Add a watchdog.config.js:

```javascript
module.exports = {
  apps: [
    {
      name: "watchdog",
      script: "./index.js",
      env: {
        // url to check
        URL: "http://dev.b2.local:3001",
        // cmd to exec when watchdog detected an error
        CMD: "docker ps",
        // error notification receiver
        MAIL_TO: "admin@gmail.com",
        // mailgun api credentials
        MAILGUN_DOMAIN: "xx.com",
        MAILGUN_API_KEY: "key-xxxx"
      }
    }
  ]
};
```
