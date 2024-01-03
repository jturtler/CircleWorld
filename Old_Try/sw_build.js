
// Require WorkBox build
const {generateSW} = require('workbox-build');

generateSW({

  swDest: 'PwaBasicApp/service-worker.js',
  globDirectory: 'PwaBasicApp',
  globPatterns: [
    '**/*.{html,css,js,gif,jpg,png,svg}'
  ],
  skipWaiting: true,
  clientsClaim: true,
  offlineGoogleAnalytics: true,

  runtimeCaching: [
    {
      urlPattern: /.mp3|.wav/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'appShell'
      }
    }
  ]

}).then(({count, size}) => {
  console.log(`Generated new service worker with ${count} precached files, totaling ${size} bytes.`);
}).catch(console.error);
