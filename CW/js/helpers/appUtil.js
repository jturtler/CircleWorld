// -------------------------------------------
// -- AppUtil Class/Methods

function AppUtil() {}

AppUtil.OFFSET_WIDTH = 4;
AppUtil.OFFSET_HEIGHT = 25; // For bottom control space

AppUtil.appReloading = false;  
AppUtil.callOnlyOnce_timeoutId;

// ==== Methods ======================

AppUtil.appReloadWtMsg = function( msg, option )
{    
	if ( !msg ) msg = 'App Reloading!!';
	if ( !option ) option = {};
	
	// MsgManager.msgAreaShowOpt( msg, { cssClasses: 'notifCBlue', closeOthers: true } );
	$( '#spanInfo' ).text( msg );

	AppUtil.appReloading = true;

	window.location = window.location.href.split("?")[0];	
};

		
AppUtil.fitCanvasSize = function( infoJson )
{
	infoJson.canvasHtml.width = infoJson.winTag.width() - AppUtil.OFFSET_WIDTH;
	infoJson.canvasHtml.height = infoJson.winTag.height() - AppUtil.OFFSET_HEIGHT;
};


AppUtil.callOnlyOnce = function( option, callBack ) 
{
	var waitTimeMs = ( option && option.waitTimeMs ) ? option.waitTimeMs: 1000;

	clearTimeout( AppUtil.callOnlyOnce_timeoutId );

	AppUtil.callOnlyOnce_timeoutId = setTimeout( () => {
		if ( callBack ) callBack();
	}, waitTimeMs );

};

// -------------------------------------------------------

AppUtil.getPosition_Center = function()
{
	return { 
		x: Math.floor( WorldRender.infoJson.canvasHtml.width / 2 ),
		y: Math.floor( WorldRender.infoJson.canvasHtml.height / 2 )
	};
};


AppUtil.getPosition_Random = function()
{
	var offset = 20; // considering the width_half of object, the position should consider it.
	return { 
		x: Util.getRandomInRange( offset, WorldRender.infoJson.canvasHtml.width - offset ),
		y: Util.getRandomInRange( offset, WorldRender.infoJson.canvasHtml.height - offset )
	};
};


// ==========================================
// ====  BLOCK / UNBLOCK PAGE

// Use this to display a popup with some messages or interactions..
//AppUtil.openDivPopupArea( $( '#divPopupArea' ), populateProcess, closeProcess )
AppUtil.openDivPopupArea = function (divPopupAreaTag, populateProcess, closeProcess) 
{
	AppUtil.blockPage(undefined, function (scrimTag) {
		divPopupAreaTag.show();  // Always clear out 'mainContent' and reCreate it.
		$('.scrim').show();

		divPopupAreaTag.find('div.divExtraSec').remove();


		var divMainContentTag = divPopupAreaTag.find('.divMainContent');
		divMainContentTag.html(''); //.attr('style', ''); // Reset the content & style.  // style="overflow: scroll;height: 85%; margin-top: 10px; background-color: #eee;padding: 7px;"

		var closeBtn = divPopupAreaTag.find('div.close');

		closeBtn.off('click').click(function () {
			$('.scrim').hide();
			divPopupAreaTag.hide();
			AppUtil.unblockPage(scrimTag);

			if (closeProcess) {
				try {
					closeProcess(divPopupAreaTag);
				} catch (errMsg) { console.log('ERROR during AppUtil.openDivPopupArea closeProcess, ' + errMsg); }
			}
		});

		scrimTag.off('click').click(function () {  closeBtn.click();  });

		if (populateProcess) {
			try {
				populateProcess(divMainContentTag, divPopupAreaTag);
			} catch (errMsg) { console.log('ERROR during AppUtil.openDivPopupArea populateProcess, ' + errMsg); }
		}

	});

};

AppUtil.blockPage = function (scrimTag, runFunc) {
	if (!scrimTag) scrimTag = AppUtil.getScrimTag();

	scrimTag.off('click');
	scrimTag.show();

	if (runFunc) runFunc(scrimTag);

	return scrimTag;
};

AppUtil.unblockPage = function (scrimTag) {
	if (!scrimTag) scrimTag = AppUtil.getScrimTag();

	scrimTag.off('click');
	scrimTag.hide();
};

// -- GET ----
AppUtil.getScrimTag = function () {
	return $('.scrim');
};