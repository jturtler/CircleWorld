if(!self.define){let e,s={};const r=(r,i)=>(r=new URL(r+".js",i).href,s[r]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=r,e.onload=s,document.head.appendChild(e)}else e=r,importScripts(r),s()})).then((()=>{let e=s[r];if(!e)throw new Error(`Module ${r} didn’t register its module`);return e})));self.define=(i,a)=>{const d=e||("document"in self?document.currentScript.src:"")||location.href;if(s[d])return;let f={};const n=e=>r(e,d),l={module:{uri:d},exports:f,require:n};s[d]=Promise.all(i.map((e=>l[e]||n(e)))).then((e=>(a(...e),f)))}}define(["./workbox-f2efd100"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"about.html",revision:"9d74de30f29d09f88b1e80badd4d4169"},{url:"config.json",revision:"e408f87ca28aef1b3c20912e8935e731"},{url:"icons/icon-144x144.png",revision:"4cf8223442d2fbf91653b6ebb5dad779"},{url:"icons/icon-152x152.png",revision:"982f5ccc626f58ca9f099457a0240c47"},{url:"index.html",revision:"c3b281f29c7b665107fe6ae7b552f788"},{url:"js/helpers/appUtil.js",revision:"52d10f55139757f455e382bd7ae49229"},{url:"js/helpers/circleManager.js",revision:"71063ef308ef86bf66cf24ad8e0074e6"},{url:"js/helpers/commonObjManager.js",revision:"1616ca73172d0493c24a3fd3e7026667"},{url:"js/helpers/configManager.js",revision:"e7989183048c7b6003213b5019e2eb09"},{url:"js/helpers/movementHelper.js",revision:"88d7e4b8ff5d6b119c806a0050f25d39"},{url:"js/helpers/portalManager.js",revision:"8745ae87dfe3b4357950b88a1eba9138"},{url:"js/helpers/util.js",revision:"a0b5c0403df9ade65809960f99deee05"},{url:"js/libraries/easeljs.min.js",revision:"7a5956812442842a2d811127d63a07f3"},{url:"js/libraries/jquery-3.4.1.min.js",revision:"a6b6350ee94a3ea74595c065cbf58af0"},{url:"js/old/builder.js",revision:"d0d799ae3695aaad6ff1e98ad62644a4"},{url:"js/old/graphicsService.js",revision:"7a20f0dbf150ea6242047ccdb39c2edb"},{url:"js/old/kid.js",revision:"bebe6df963e30f9a9ee43f810380f0c0"},{url:"js/old/kidsBuilder.js",revision:"0db18e4f540c23385dbcccb6c19d1189"},{url:"js/old/physicsHandler.js",revision:"6a618c908a1be5f85212628fcb598b34"},{url:"js/old/util_ref.js",revision:"d97418353299d2f4e52b775adb0dbc4d"},{url:"js/stageManager.js",revision:"fef7be4de1383db2bfde354e9058effa"},{url:"js/swManager.js",revision:"51a255fa2ae2d3ec3fcec660fb0931b1"},{url:"js/worldRender.js",revision:"836d67b063bdbcfaa1ab69fbbc24b8d7"},{url:"manifest.json",revision:"984b3a03606c7523fa79990f00f91073"}],{}),e.registerRoute(/.mp3|.wav/,new e.CacheFirst({cacheName:"appShell",plugins:[]}),"GET")}));
//# sourceMappingURL=service-worker.js.map
