if(!self.define){let e,s={};const r=(r,i)=>(r=new URL(r+".js",i).href,s[r]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=r,e.onload=s,document.head.appendChild(e)}else e=r,importScripts(r),s()})).then((()=>{let e=s[r];if(!e)throw new Error(`Module ${r} didn’t register its module`);return e})));self.define=(i,d)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(s[a])return;let c={};const n=e=>r(e,a),l={module:{uri:a},exports:c,require:n};s[a]=Promise.all(i.map((e=>l[e]||n(e)))).then((e=>(d(...e),c)))}}define(["./workbox-f2efd100"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"about.html",revision:"9d74de30f29d09f88b1e80badd4d4169"},{url:"config.json",revision:"23112cec49eb40b072a625cf37957be5"},{url:"icons/icon-144x144.png",revision:"4cf8223442d2fbf91653b6ebb5dad779"},{url:"icons/icon-152x152.png",revision:"982f5ccc626f58ca9f099457a0240c47"},{url:"index.html",revision:"ce8e7cb4ec975828a490e76876e4e0fb"},{url:"js/helpers/appUtil.js",revision:"6c28da2c5b7b0004fc1d4b2633e4a399"},{url:"js/helpers/circleManager.js",revision:"c026ad2360ae8564bba99ad0d7d98018"},{url:"js/helpers/commonObjManager.js",revision:"c49febc218488d5b495531fbc37c03a8"},{url:"js/helpers/configManager.js",revision:"e7989183048c7b6003213b5019e2eb09"},{url:"js/helpers/globalSettings.js",revision:"38daa713759a95ee033642bfdfa99f8c"},{url:"js/helpers/movementHelper.js",revision:"5d7970228b41e1ad4e0fb93df765eb36"},{url:"js/helpers/portalManager.js",revision:"0db36209b483666cc198a0b483002f8d"},{url:"js/helpers/util.js",revision:"f90b04daaa4052a75a9770fb5f09eece"},{url:"js/libraries/easeljs.min.js",revision:"7a5956812442842a2d811127d63a07f3"},{url:"js/libraries/jquery-3.4.1.min.js",revision:"a6b6350ee94a3ea74595c065cbf58af0"},{url:"js/old/builder.js",revision:"d0d799ae3695aaad6ff1e98ad62644a4"},{url:"js/old/graphicsService.js",revision:"7a20f0dbf150ea6242047ccdb39c2edb"},{url:"js/old/kid.js",revision:"8ff2e4dc31dafd138d40b26f3bc9fa7d"},{url:"js/old/kidsBuilder.js",revision:"0db18e4f540c23385dbcccb6c19d1189"},{url:"js/old/physicsHandler.js",revision:"6a618c908a1be5f85212628fcb598b34"},{url:"js/old/util_ref.js",revision:"d97418353299d2f4e52b775adb0dbc4d"},{url:"js/stageManager.js",revision:"3756367b74c14502a900567ce9f93b4e"},{url:"js/swManager.js",revision:"51a255fa2ae2d3ec3fcec660fb0931b1"},{url:"js/worldRender.js",revision:"91de73efff9604d0f95850058c3959e5"},{url:"manifest.json",revision:"d8082235d6e7323348fc371b189b9563"}],{}),e.registerRoute(/.mp3|.wav/,new e.CacheFirst({cacheName:"appShell",plugins:[]}),"GET")}));
//# sourceMappingURL=service-worker.js.map
