/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "css/responsive.css",
    "revision": "a18c8e48ff715f415cbee8ec53abcb3f"
  },
  {
    "url": "css/style_back.css",
    "revision": "65839cb10b9be89135281a0e4ae91757"
  },
  {
    "url": "css/style.css",
    "revision": "039d144fdf274bcb4292e82e1facb477"
  },
  {
    "url": "images/about.svg",
    "revision": "c9ecbd55c7ef63e5a50df53f1e5e802d"
  },
  {
    "url": "images/act_col_fpl-fu_arrow_right_24.svg",
    "revision": "d61e5ac96aea37ecbd9e17af41331646"
  },
  {
    "url": "images/act_col_fpl-fu_arrow_right_36.svg",
    "revision": "3548996447d506757a911c674a23ea13"
  },
  {
    "url": "images/act_col_fpl-sp_arrow_right_24.svg",
    "revision": "6726e1e050cacf293fd93974ed84e7dd"
  },
  {
    "url": "images/act_col_fpl-sp_arrow_right_36.svg",
    "revision": "f450400c101b20fab8b4f442105da1d0"
  },
  {
    "url": "images/act_col_sas_arrow_right_24.svg",
    "revision": "07ca0d29a883b607be0eace1a1528248"
  },
  {
    "url": "images/act_col_sas_arrow_right_36.svg",
    "revision": "7e68ec661b73b8651b49f8a679d287fe"
  },
  {
    "url": "images/act_col.svg",
    "revision": "d7397b5aabba1c795a8a77da2053a6c7"
  },
  {
    "url": "images/act_fpl-fu.svg",
    "revision": "31f758cad00163db9f733baab791a117"
  },
  {
    "url": "images/act_fpl-sp.svg",
    "revision": "d9e6158c7f6a674fa26db76af7083408"
  },
  {
    "url": "images/act_sas.svg",
    "revision": "35abec074ef298bce8018b7c26451a00"
  },
  {
    "url": "images/act.svg",
    "revision": "a59f1cd43cdb7fe359000002283a50a7"
  },
  {
    "url": "images/active.svg",
    "revision": "f7bed36b34a604e93941d71404522168"
  },
  {
    "url": "images/alert_col.svg",
    "revision": "ed00a205c0ee21cff01ef3da6f3b75bf"
  },
  {
    "url": "images/alert.svg",
    "revision": "5f2f94439570a21a82cf1007d5359b8a"
  },
  {
    "url": "images/arrow_down.svg",
    "revision": "1d6cebe7e67a1c69ca8f1941174c6b77"
  },
  {
    "url": "images/arrow_left.svg",
    "revision": "a4e529007c64fa98680116d155071f71"
  },
  {
    "url": "images/arrow_right.svg",
    "revision": "d100592ff7348419d6531e320a3fb917"
  },
  {
    "url": "images/arrow_up.svg",
    "revision": "aa66e325f7c4d48a42cc37f265646e40"
  },
  {
    "url": "images/arrows_col.svg",
    "revision": "3e3f227aa06dbfea700cb4ba587bf182"
  },
  {
    "url": "images/baseline-cloud_off-24px-unavailable.svg",
    "revision": "38d47e1cacd389927849f03eddb4f4c8"
  },
  {
    "url": "images/baseline-cloud_off-24px.svg",
    "revision": "520521bfa31c7dd2d930e07c15ed8884"
  },
  {
    "url": "images/baseline-cloud-24px_green.svg",
    "revision": "40dc9e3e4e184f60349091702664a346"
  },
  {
    "url": "images/baseline-cloud-24px.svg",
    "revision": "b88790cbd2e52f24f0a892907a8f0d9a"
  },
  {
    "url": "images/blank.gif",
    "revision": "325472601571f31e1bf00674c368d335"
  },
  {
    "url": "images/care.svg",
    "revision": "85848ba472f97377bec6e9697dfe077c"
  },
  {
    "url": "images/client.svg",
    "revision": "06fbcb3609cbd6c246ac69ebe007ad1b"
  },
  {
    "url": "images/close_white.svg",
    "revision": "f2f35369d814bbeca6c7895dbafa9a42"
  },
  {
    "url": "images/completed.svg",
    "revision": "d8c9827d88fe0ec692937f10cedabff1"
  },
  {
    "url": "images/Connect.svg",
    "revision": "3a0a2e0bd172fc55453712641f5360a9"
  },
  {
    "url": "images/entry.svg",
    "revision": "a19649ec23fe1803d4dd9408740cb5c6"
  },
  {
    "url": "images/failed.svg",
    "revision": "06ed2b711619acc16461bf830a1d9f96"
  },
  {
    "url": "images/favbar_color_act.svg",
    "revision": "4bc3606fec5c13e524c07faec581f418"
  },
  {
    "url": "images/favbar_color_arrows.svg",
    "revision": "c3ce5d7be683c83729425f3b7f39d820"
  },
  {
    "url": "images/favbar_color_contact.svg",
    "revision": "6f045a1b801a41c223aa19852b0d6ebc"
  },
  {
    "url": "images/favbar_color_fpl-fu.svg",
    "revision": "6daaad3095eb23645844d946000652c6"
  },
  {
    "url": "images/favbar_color_fpl-sp.svg",
    "revision": "232001f8a7fa6e86319b1f9b92713b1a"
  },
  {
    "url": "images/favbar_color_sas.svg",
    "revision": "a1edee2488949524b11b66afa59c40b4"
  },
  {
    "url": "images/followup.svg",
    "revision": "d015ebd0b1516cdfd3a4a110c6dc884c"
  },
  {
    "url": "images/hide.png",
    "revision": "6d8ab80b89fd5aec6cb0380854ee293d"
  },
  {
    "url": "images/hold.svg",
    "revision": "424c05cf649a49a1c5c8057c89e6d4f1"
  },
  {
    "url": "images/icons/Connect_144px.png",
    "revision": "ecb902321906751311c38d53b70904a6"
  },
  {
    "url": "images/icons/Connect_152px.png",
    "revision": "cff1c90fc5a84fc754cfeb370ab91f76"
  },
  {
    "url": "images/icons/Connect_192px.png",
    "revision": "5a7abcbe1bf0565a8a1096a80acab0dd"
  },
  {
    "url": "images/icons/Connect_512px.png",
    "revision": "b0295abf0af75702c5ebbca617a93620"
  },
  {
    "url": "images/icons/Connect_prod_144px.png",
    "revision": "ecb902321906751311c38d53b70904a6"
  },
  {
    "url": "images/icons/Connect_prod_152px.png",
    "revision": "cff1c90fc5a84fc754cfeb370ab91f76"
  },
  {
    "url": "images/icons/Connect_prod_192px.png",
    "revision": "5a7abcbe1bf0565a8a1096a80acab0dd"
  },
  {
    "url": "images/icons/Connect_prod_512px.png",
    "revision": "b0295abf0af75702c5ebbca617a93620"
  },
  {
    "url": "images/icons/icon-144x144.png",
    "revision": "4cf8223442d2fbf91653b6ebb5dad779"
  },
  {
    "url": "images/icons/icon-152x152.png",
    "revision": "982f5ccc626f58ca9f099457a0240c47"
  },
  {
    "url": "images/key.svg",
    "revision": "20f1389ffe6ee7e237c300129b2dc370"
  },
  {
    "url": "images/list.svg",
    "revision": "a6bac0e4f5a9dbe41cdfd1f87f35d4f0"
  },
  {
    "url": "images/loading.gif",
    "revision": "6334d3fb9d2884cf47c16aaea13bff03"
  },
  {
    "url": "images/lock.svg",
    "revision": "de3a2c52c81ddd7829b1d107e5ed5ee2"
  },
  {
    "url": "images/logo.svg",
    "revision": "44b0c57dc046930b5f78026ad2eeb937"
  },
  {
    "url": "images/logout.svg",
    "revision": "d9d3a6f585f07fe0ac5a080f456f597d"
  },
  {
    "url": "images/menu_icon.svg",
    "revision": "528dd5f2e025f2208386bead7bbc1e59"
  },
  {
    "url": "images/mobile.svg",
    "revision": "56d9b808639a50927115cab90dd8e246"
  },
  {
    "url": "images/net-green.svg",
    "revision": "7267a1c85f97b8d8f2b1d8e84c3baed2"
  },
  {
    "url": "images/net-sync.svg",
    "revision": "ca8591a7226c1592fedda68b4d1efa1f"
  },
  {
    "url": "images/net.svg",
    "revision": "2144acb467584dffbf59e6798923bd2b"
  },
  {
    "url": "images/open.svg",
    "revision": "f7cf6943aeb6e19ae972aabcebcb022d"
  },
  {
    "url": "images/outline-delete-24px.svg",
    "revision": "d98e9b1007e5681f76032d72eb189d4c"
  },
  {
    "url": "images/outline-share-24px.svg",
    "revision": "3312f4c3a989b0146198cdddc09678aa"
  },
  {
    "url": "images/pending.svg",
    "revision": "5fe5c1462f3c67821488685afdff8d87"
  },
  {
    "url": "images/plus_on.svg",
    "revision": "1122c272c9085cf3f611902a4c879b28"
  },
  {
    "url": "images/plus.svg",
    "revision": "7051f6c37f8d6b64308cf5a635ba1e56"
  },
  {
    "url": "images/provision.svg",
    "revision": "147b508f1006d0e64936952dbe40ff97"
  },
  {
    "url": "images/settings.svg",
    "revision": "7c8dcb4c9fce086566e3fe6414dccd08"
  },
  {
    "url": "images/sharp-add_circle_outline-24px.svg",
    "revision": "1077ca24d36bc60af3f7fd25a8c9e686"
  },
  {
    "url": "images/sharp-cloud_queue-24px.svg",
    "revision": "a4cbccc08adcc4a00bdb043e7e3c80b3"
  },
  {
    "url": "images/sharp-my_location-24px.svg",
    "revision": "0347ed20886b62e3858d6ce5839db9e0"
  },
  {
    "url": "images/sharp-remove_circle_outline-24px.svg",
    "revision": "c3fd40fc3ea16901dc5e3b2e5296c56c"
  },
  {
    "url": "images/statistics.svg",
    "revision": "49fd0bf0201f931b915bd2eaed777ea1"
  },
  {
    "url": "images/sync_error.svg",
    "revision": "6345c6b90ad5dd60d639a18892c6f3d2"
  },
  {
    "url": "images/sync-banner.svg",
    "revision": "679bf57f11ff6a88d3a130486a65e2aa"
  },
  {
    "url": "images/sync-n.svg",
    "revision": "bb5732a4e025d9baf31822b06d381366"
  },
  {
    "url": "images/sync.svg",
    "revision": "4e359cd567fad995e2433e434c8c2b23"
  },
  {
    "url": "images/user.svg",
    "revision": "60862197c3b1a2989278571db358709a"
  },
  {
    "url": "images/voucher.svg",
    "revision": "3a6f173fc310230cc6b091bc5ba7cc8d"
  },
  {
    "url": "index_Cws.html",
    "revision": "453fb31d594becd5d85e15790426971f"
  },
  {
    "url": "index.html",
    "revision": "de69617c4eb777ed35c5afab882d0863"
  },
  {
    "url": "indexedDB_CRUD.js",
    "revision": "4cf7dde799a26324486697ee9b0219b7"
  },
  {
    "url": "indexedDB_test.html",
    "revision": "955c2d49a6180010fc965ec3331b5267"
  },
  {
    "url": "scripts/app_back.js",
    "revision": "f91b1af15281982066edbdae4ce28b31"
  },
  {
    "url": "scripts/app.js",
    "revision": "758b83997900f698ec3175ba1639937a"
  },
  {
    "url": "scripts/libraries/jquery-3.4.0.js",
    "revision": "eac275563332b65bae1a3452532ebe38"
  },
  {
    "url": "scripts/libraries/jquery-dateformat.min.js",
    "revision": "c5b600620a496ec17424270557a2f676"
  },
  {
    "url": "scripts/libraries/jquery-ui.js",
    "revision": "e0e5b130995dffab378d011fcd4f06d6"
  },
  {
    "url": "scripts/libraries/jquery.blockUI.js",
    "revision": "1473907211f50cb96aa2f2402af49d69"
  },
  {
    "url": "scripts/libraries/localforage.min.js",
    "revision": "6de1bf1f7f98328eba5295e0e8a00110"
  },
  {
    "url": "scripts/services/appSettingMng.js",
    "revision": "3da5024d6ba5bf017bba8278845c38e7"
  },
  {
    "url": "scripts/services/htmlTemplate.js",
    "revision": "3cb28bad077d7e2379414e0a5ccef7d6"
  },
  {
    "url": "scripts/services/noteStorageMng.js",
    "revision": "3d763884cf1098f0e9fb090e3ee3609b"
  },
  {
    "url": "scripts/services/storageMng.js",
    "revision": "3531f83f4fb143cab7bfb8ec95f3ff6e"
  },
  {
    "url": "scripts/startUp.js",
    "revision": "eb47eadedc37e012aa31545052f004a0"
  },
  {
    "url": "scripts/utils/util.js",
    "revision": "627e1c3fc11308075d47fb77bf312482"
  },
  {
    "url": "styles/images/ui-icons_444444_256x240.png",
    "revision": "d10bc07005bb2d604f4905183690ac04"
  },
  {
    "url": "styles/images/ui-icons_555555_256x240.png",
    "revision": "00dd0ec0a16a1085e714c7906ff8fb06"
  },
  {
    "url": "styles/images/ui-icons_777620_256x240.png",
    "revision": "4e7e3e142f3939883cd0a7e00cabdaef"
  },
  {
    "url": "styles/images/ui-icons_777777_256x240.png",
    "revision": "40bf25799e4fec8079c7775083de09df"
  },
  {
    "url": "styles/images/ui-icons_cc0000_256x240.png",
    "revision": "093a819138276b446611d1d2a45b98a2"
  },
  {
    "url": "styles/images/ui-icons_ffffff_256x240.png",
    "revision": "ea4ebe072be75fbbea002631916836de"
  },
  {
    "url": "styles/jquery-ui.css",
    "revision": "85291df7b046cd32eb4fb33ddc85bb99"
  },
  {
    "url": "styles/jquery-ui.min.css",
    "revision": "215077014154308be415e1181a14646f"
  },
  {
    "url": "styles/materialize.css",
    "revision": "ebfc8887da89775b09fe167ce204b440"
  },
  {
    "url": "styles/style.css",
    "revision": "7fe4d1a9f3a9aeb0bc27500a3511c473"
  },
  {
    "url": "templates/noteItem.html",
    "revision": "706430bb520755b2c27b8bded945845a"
  },
  {
    "url": "templates/noteItem.js",
    "revision": "706430bb520755b2c27b8bded945845a"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/.mp3|.wav/, new workbox.strategies.CacheFirst({ "cacheName":"appShell", plugins: [] }), 'GET');

workbox.googleAnalytics.initialize({});
