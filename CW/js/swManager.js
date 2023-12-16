// -----------------------------------------
function SwManager() { };

SwManager.swFile = './service-worker.js';

SwManager.swRegObj;
SwManager.swInstallObj;

// --------------------------------------------

SwManager.initialSetup = function (callBack) {
	// checkRegisterSW
	if (('serviceWorker' in navigator)) {
		SwManager.runSWregistration(callBack);
	}
	else {
		alert('SERVICE WORKER not supported. Cannot continue!');
	}
};


// --------------------------------------------

// 1. main one
SwManager.runSWregistration = function (callBack) 
{
	navigator.serviceWorker.register(SwManager.swFile).then(registration => 
	{
		SwManager.swRegObj = registration;

		// If fresh registration case, we use 'callBack'..
		SwManager.createInstallAndStateChangeEvents(SwManager.swRegObj); //, callBack );

		callBack();

	}).catch(err =>
		// MISSING TRANSLATION
		alert('SW ERROR: ' + err, 'notifDark', undefined, '', 'left', 'bottom', 5000)
	);
};


SwManager.createInstallAndStateChangeEvents = function (swRegObj) //, callBack ) 
{
	// 1st time running SW registration (1st time running PWA)    
	if (!swRegObj.active) { SwManager.newRegistration = true; SwManager.registrationState = 'sw: new install'; }
	else { SwManager.newRegistration = false; SwManager.registrationState = 'sw: existing'; }


	// SW update change event 
	swRegObj.onupdatefound = () => 
	{
		SwManager.swInstallObj = swRegObj.installing;
		
		// sw state changes 1-4 (ref: SwManager.installStateProgress )
		SwManager.swInstallObj.onstatechange = () => 
		{
			SwManager.registrationUpdates = true;
			console.log(SwManager._swStage2 + 'state: ' + SwManager.swInstallObj.state);
		};
	};

	// This gets triggered after the new files are downloaded already...  Anyway to show 'download in progress'?
	navigator.serviceWorker.addEventListener('controllerchange', (e) => {
		// The oncontrollerchange property of the ServiceWorkerContainer interface is 
		// an event handler fired whenever a controllerchange event occurs 
		//  — when the document's associated ServiceWorkerRegistration acquires a new active worker.
		console.log(SwManager._swStage3 + '3. ControllerChange DETECTED');

		// App is in process of reloading/refersh/restarting.  No need to perform restart
		// if (AppUtil.appReloading) console.log(SwManager._swStage3 + 'App Intentional Reloading -> DISGARDING THIS MANUAL UPDATE CALL.');

		// if ( SwManager.swUpdateCase )

		if (!SwManager.swUpdateOption) SwManager.swUpdateOption = {};

		// If 1st time use(fresh), or intentional no reload update (during the app usage case), do not reload
		var delayReload = (SwManager.swUpdateOption.delayReload || SwManager.newRegistration ) ? true : false;

		// For Already logged in, simply delay it --> which the logOut will perform the update.
		if (delayReload) {
			console.log(SwManager._swStage3 + 'App Reload Delayed - After Installing New Update.');
			e.preventDefault();  // WHY USE THIS?
			return false;
		}
		else {
			// If Not logged in, perform App Reload to show the app update - [?] add 'autoLogin' flag before triggering page reload with below 'appReloadWtMsg'.
			var newMsg = 'App Reloading - New Update Installed.';
			console.log(SwManager._swStage3 + newMsg);
			AppUtil.appReloadWtMsg(newMsg);
		}
	});

};

// -----------------------------------

SwManager.checkNewAppFile_OnlyOnline = function (runFunction, option) 
{
	if (!option) option = {};
	// 'checkTypeTitle' Use on below actual msg.
	if (!option.checkTypeTitle) ption.checkTypeTitle = 'UNKNOWN CHECK TYPE';

	SwManager.newAppFileExists_EventCallBack = runFunction;
	//SwManager.swUpdateCase = false;
	SwManager.swUpdateOption = option;

	// Trigger the sw change/update check event..
	if ( !SwManager.swRegObj ) console.log( SwManager._swStage1 + option.checkTypeTitle + ' --> SwManager.swRegObj not available!');
	else 
	{
		SwManager.lastAppFileUpdateDt = new Date().toISOString();
		console.log(SwManager._swStage1 + option.checkTypeTitle + ' --> UPDATES CHECKING..');

		//SwManager.swUpdateCase = true;
		SwManager.swRegObj.update();
	}
};


// Wrapper/ShortCut to 'checkNewAppFile_OnlyOnline'
SwManager.checkAppUpdate = function (checkTypeTitle, option, runFunction) 
{
	if (!option) option = {};

	if (checkTypeTitle) option.checkTypeTitle = checkTypeTitle;

	if ( navigator.onLine ) SwManager.checkNewAppFile_OnlyOnline(runFunction, option);
	else console.log('OFFLINE - AppUpdateCheck not performed - ' + checkTypeTitle);
};


// -----------------------------------

// ==========================================
