
// Require WorkBox build
const {generateSW} = require('workbox-build');

generateSW({

  swDest: 'CW/service-worker.js',
  globDirectory: 'CW',
  globPatterns: [
    '**/*.{html,css,js,gif,jpg,png,svg,mp3,wav,json}'
  ],
  skipWaiting: true,
  clientsClaim: true,
  cleanupOutdatedCaches: false,
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
