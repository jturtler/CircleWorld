if(!self.define){let e,s={};const r=(r,i)=>(r=new URL(r+".js",i).href,s[r]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=r,e.onload=s,document.head.appendChild(e)}else e=r,importScripts(r),s()})).then((()=>{let e=s[r];if(!e)throw new Error(`Module ${r} didn’t register its module`);return e})));self.define=(i,a)=>{const d=e||("document"in self?document.currentScript.src:"")||location.href;if(s[d])return;let c={};const n=e=>r(e,d),l={module:{uri:d},exports:c,require:n};s[d]=Promise.all(i.map((e=>l[e]||n(e)))).then((e=>(a(...e),c)))}}define(["./workbox-f2efd100"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"about.html",revision:"9d74de30f29d09f88b1e80badd4d4169"},{url:"config.json",revision:"f8f4a5dbed7d233af4790b575294b776"},{url:"icons/icon-144x144.png",revision:"4cf8223442d2fbf91653b6ebb5dad779"},{url:"icons/icon-152x152.png",revision:"982f5ccc626f58ca9f099457a0240c47"},{url:"index.html",revision:"b6f87ce3e781f0620c1cae41d50b846e"},{url:"js/helpers/appUtil.js",revision:"f03960d7026f6f917a91c57a0cbd9cee"},{url:"js/helpers/circleManager.js",revision:"0604ab48a478d868163f3d828a4ecef7"},{url:"js/helpers/commonObjManager.js",revision:"9da24512eb99ea328399500c36c7df7b"},{url:"js/helpers/configManager.js",revision:"e7989183048c7b6003213b5019e2eb09"},{url:"js/helpers/globalSettings.js",revision:"3820ef6d8c27b263ff583c6d8d8bb04f"},{url:"js/helpers/locationPingManager.js",revision:"2c66f7a85ed6725123567a501b99e2f9"},{url:"js/helpers/movementHelper.js",revision:"7c418f65eaba2853568e19cb588b42c0"},{url:"js/helpers/otherObjManager.js",revision:"d66079c68ba7fa470618d7783805efae"},{url:"js/helpers/portalManager.js",revision:"2bb04e3bc4e69a7f70b05318a90c97df"},{url:"js/helpers/util.js",revision:"abecc8a2da14c248d224a4cf1bb83d46"},{url:"js/libraries/easeljs.min.js",revision:"7a5956812442842a2d811127d63a07f3"},{url:"js/libraries/jquery-3.4.1.min.js",revision:"a6b6350ee94a3ea74595c065cbf58af0"},{url:"js/old/builder.js",revision:"d0d799ae3695aaad6ff1e98ad62644a4"},{url:"js/old/graphicsService.js",revision:"7a20f0dbf150ea6242047ccdb39c2edb"},{url:"js/old/kid.js",revision:"8ff2e4dc31dafd138d40b26f3bc9fa7d"},{url:"js/old/kidsBuilder.js",revision:"0db18e4f540c23385dbcccb6c19d1189"},{url:"js/old/physicsHandler.js",revision:"6a618c908a1be5f85212628fcb598b34"},{url:"js/old/util_ref.js",revision:"d97418353299d2f4e52b775adb0dbc4d"},{url:"js/stageManager.js",revision:"c2f03e7f03059fbeb50e1b8fae60d1da"},{url:"js/swManager.js",revision:"51a255fa2ae2d3ec3fcec660fb0931b1"},{url:"js/worldRender.js",revision:"1df5c861968380e9e258861cb36298e6"},{url:"manifest.json",revision:"d8082235d6e7323348fc371b189b9563"}],{}),e.registerRoute(/.mp3|.wav/,new e.CacheFirst({cacheName:"appShell",plugins:[]}),"GET")}));
//# sourceMappingURL=service-worker.js.map
