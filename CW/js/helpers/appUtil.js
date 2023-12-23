// -------------------------------------------
// -- AppUtil Class/Methods

function AppUtil() {}

AppUtil.OFFSET_WIDTH = 20;
AppUtil.OFFSET_HEIGHT = 40; // For bottom control space

AppUtil.appReloading = false;  
AppUtil.callOnlyOnce_timeoutId;

// ============================================
// Size of browser viewport --> $(window).height(); $(window).width();
// Size of HTML document --> $(document).height(); $(document).width();
// For screen size (screen obj): --> window.screen.height; window.screen.width;

// Browser refresh/reload
// Set this before refreshing, thus, sw state event not display the update message.

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
	infoJson.canvasTagHtml.width = infoJson.winTag.width() - AppUtil.OFFSET_WIDTH;
	infoJson.canvasTagHtml.height = infoJson.winTag.height() - AppUtil.OFFSET_HEIGHT;
};


AppUtil.callOnlyOnce = function( option, callBack ) 
{
	var waitTimeMs = ( option && option.waitTimeMs ) ? option.waitTimeMs: 1000;

	clearTimeout( AppUtil.callOnlyOnce_timeoutId );

	AppUtil.callOnlyOnce_timeoutId = setTimeout( () => {
		if ( callBack ) callBack();
	}, waitTimeMs );

};