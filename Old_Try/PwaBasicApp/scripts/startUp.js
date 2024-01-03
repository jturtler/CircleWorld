
// ============================================
// StartUp Runs

serviceWorkerStart();
// ?? - Should we run the app after this finishes registering?

startApp();


// ============================================
function startApp() {

	$( document ).ready( function() 
	{
    //console.log( 'Started App in JQuery Doc ' );
    // -- App Class/Methods
    var appObj = new App();
    appObj.run();
	});

};

// ============================================

function serviceWorkerStart() {
//window.isUpdateAvailable = new Promise(function(resolve, reject) {
  // lazy way of disabling service workers while developing
  if ('serviceWorker' in navigator )
  //&& ['localhost', '127'].indexOf(location.hostname) === -1
  {
    // register service worker file
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => {
          reg.onupdatefound = () => {
            const installingWorker = reg.installing;
            installingWorker.onstatechange = () => {
                switch (installingWorker.state) {
                  case 'installed':
                      if (navigator.serviceWorker.controller) {
                        // new update available
                        console.log( 'Update Found.' );
                        //resolve(true);
                      } else {
                        // no update available
                        console.log( 'No Update Found.' );
                        //resolve(false);
                      }
                      break;
                }
            };
          };
      })
      .catch(err => console.error('[SW ERROR]', err));
  }
  //});
  
};
