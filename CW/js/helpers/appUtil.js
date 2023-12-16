// -------------------------------------------
// -- AppUtil Class/Methods

function AppUtil() {}

// ============================================
// Size of browser viewport --> $(window).height(); $(window).width();
// Size of HTML document --> $(document).height(); $(document).width();
// For screen size (screen obj): --> window.screen.height; window.screen.width;

// Browser refresh/reload
// Set this before refreshing, thus, sw state event not display the update message.
AppUtil.appReloading = false;  

// ==== Methods ======================

AppUtil.appReloadWtMsg = function( msg, option )
{    
	if ( !msg ) msg = 'App Reloading!!';
	if ( !option ) option = {};
	
	// MsgManager.msgAreaShowOpt( msg, { cssClasses: 'notifCBlue', closeOthers: true } );
	$( '.divInfo' ).text( msg );

	AppUtil.appReloading = true;

	window.location = window.location.href.split("?")[0];	
};

		
AppUtil.fitCanvasSize = function( canvasTag, winTag ) 
{
	var cTag = canvasTag[0];
	cTag.width = winTag.width() - OFFSET_WIDTH;
	cTag.height = winTag.height() - OFFSET_HEIGHT;

	console.log( 'canvasTagHTML Dimension: ' + cTag.width + ', ' + cTag.height );
};