// -------------------------------------------
// -- AppUtil Class/Methods

function AppUtil() {}

AppUtil.OFFSET_WIDTH = 4;
AppUtil.OFFSET_HEIGHT = 30; // For bottom control space

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

		
AppUtil.fitCanvasSize = function( infoJson, option )
{
	if ( !option ) option = {};

	var offset_width = ( option.offset_width ) ? option.offset_width: AppUtil.OFFSET_WIDTH;
	var offset_height = ( option.offset_height ) ? option.offset_height: AppUtil.OFFSET_HEIGHT;

	infoJson.canvasHtml.width = infoJson.winTag.width() - offset_width;
	infoJson.canvasHtml.height = infoJson.winTag.height() - offset_height;
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


AppUtil.getPosition_Type = function( option )
{
	if ( !option ) option = {};
	var offset = ( option.offset ) ? option.offset: 100;

	var canvasHtml = WorldRender.infoJson.canvasHtml;	
	
	if ( !option.type ) return AppUtil.getPosition_Center();
	else if ( option.type === 'topLeft' ) return { x: offset, y: offset };
	else if ( option.type === 'topRight' ) return { x: canvasHtml.width - offset, y: offset };
	else if ( option.type === 'bottomRight' ) return { x: canvasHtml.width - offset, y: canvasHtml.height - offset };
	else if ( option.type === 'bottomLeft' ) return { x: offset, y: canvasHtml.height - offset };
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