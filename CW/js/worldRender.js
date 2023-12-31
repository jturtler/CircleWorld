//	- WorldRender Class - Main World Rendering Class, Starting point
function WorldRender() { };

WorldRender.stage;
WorldRender.infoJson = {};  // canvasName, canvasTag, canvasHtml, winTag, etc..

// ------------------------

WorldRender.setInfoJson = function (inputJson) 
{
	WorldRender.infoJson.canvasName = inputJson.canvasName;
	WorldRender.infoJson.canvasTag = $('#' + inputJson.canvasName);
	WorldRender.infoJson.canvasHtml = WorldRender.infoJson.canvasTag[0];
	WorldRender.infoJson.winTag = inputJson.winTag;
	WorldRender.infoJson.appModeConfig = '';  // Set when appMode dropdown is selected - from config.json
};

// ------------------------

WorldRender.startUp = function () 
{
	AppUtil.fitCanvasSize( WorldRender.infoJson ); // Adjust Canvas Size to fit the browser size
	
	StageManager.startUp( WorldRender.infoJson );

	// SetUp Events - 'Add Obj', 'Add Portal', 'Show/Hide Info Panel'
	WorldRender.setUp_Tag_Events();
};

// ------------------------

WorldRender.setUp_Tag_Events = function()
{
	WorldRender.appModeTag_PopulateNSetupEvents( $( '#selAppMode' ), INFO.configJson );

	$( '#btnInfoPanel' ).click( function()
	{		
		// Open the info panel dialog/popup..

		AppUtil.openDivPopupArea($('#divPopupArea'), function (divMainContentTag) 
		{
			//divMainContentTag.attr('style', 'overflow: scroll;height: 90%; margin-top: 2px; background-color: #eee;padding: 3px;');

			// ---------------
			divMainContentTag.append('<div class="infoLine" style="opacity: 0;">- </div>');
			divMainContentTag.append('<div class="infoLine">------------------------</div>');
		});

	});

	// Add Circle
	$( '#btnAddObj' ).click( function() 
	{
		var dataInfo = { color: 'black', startPosition: AppUtil.getPosition_Center() };

		CircleManager.createCircleItem( dataInfo );

		// If the stage is paused, show the added circle right away by updating stage.
		if ( createjs.Ticker.paused ) StageManager.stage.update();
	});

	$( '#btnStopStart' ).click( function() 
	{
		if ( !createjs.Ticker.paused )
		{			
			createjs.Ticker.paused = true;
			$( '#spanStopStart' ).text( 'tart' );
			$( '#spanInfo' ).text( 'Stopped.. ' );
		}
		else
		{
			createjs.Ticker.paused = false;
			$( '#spanStopStart' ).text( 'top' );
			$( '#spanInfo' ).text( 'Started Again.. ' );
		}
	});

	// browserResize_Setup
	$( window ).on( "resize", () => 
	{
		AppUtil.callOnlyOnce( { waitTimeMs: 1000 }, () => {
			WorldRender.resizeCanvas();
		}); 		
	});


	WorldRender.framerateChange_Setup( $('#inputFramerate'), $('#btnFramerateUp'), $('#btnFramerateDown') );


	// KeyDown ShortCut to other function/feature
	window.onkeydown = function( e )
	{
		switch ( e.keyCode ) 
		{
			case 83: //_keycode_s:
			case 32: //_keycode space:
				$( '#btnStopStart' ).click();
				return false;

			case 65: //_keycode_a:
				$( '#btnAddObj' ).click();
				return false;

			case 73: //_keycode_i:
				$( '#btnInfoPanel' ).click();
				return false;
		}
	};
};


// -------------------------------
// --- Event Related Methods

WorldRender.resizeCanvas = function () 
{
	AppUtil.fitCanvasSize(WorldRender.infoJson);
	StageManager.adjustCanvasSize( WorldRender.infoJson );
};


WorldRender.framerateChange_Setup = function ( inputFramerateTag, btnFramerateUpTag, btnFramerateDownTag ) 
{
	var framerateChangeRate = 5;

	inputFramerateTag.val( Math.round( createjs.Ticker.framerate ) );  // Load this value from 'config'

	btnFramerateUpTag.click( () => {
		createjs.Ticker.framerate = Math.round( createjs.Ticker.framerate + framerateChangeRate );
		inputFramerateTag.val( createjs.Ticker.framerate );
	});

	btnFramerateDownTag.click( () => {
		createjs.Ticker.framerate = Math.round( createjs.Ticker.framerate - framerateChangeRate );
		if (createjs.Ticker.framerate < 1) createjs.Ticker.framerate = 1;
		inputFramerateTag.val( createjs.Ticker.framerate );
	});
};

// -------------------------------------

WorldRender.appModeTag_PopulateNSetupEvents = function( selAppModeTag, configJson )
{
	var appModeList = [];
	configJson.appModes.forEach( appMode => {  appModeList.push( { text: appMode.modeName, value: appMode.modeName } );  } );

	Util.populateSelect( selAppModeTag, '[AppMode]', appModeList );

	// On select event..
	selAppModeTag.off( 'change' ).change( e => WorldRender.switchAppMode( e ) );

	// If initial selection is empty, set background as 'tomato' to attract attention..
	if ( !selAppModeTag.val() ) selAppModeTag.css( 'background-color', 'tomato' );
};



WorldRender.switchAppMode = function( e )
{
	var selAppModeTag = $( '#selAppMode' ); // SET THIS ON TOP?


	// Pause before making changes
	createjs.Ticker.paused = true;

	WorldRender.resetAppData();

	// This is called from 'appMode' select..
	var appModeName = selAppModeTag.val();
	var appModeConfig = Util.getFromList( INFO.configJson.appModes, 'modeName', appModeName );

	if ( appModeConfig )
	{
		WorldRender.infoJson.appModeConfig = appModeConfig;

		if ( appModeConfig.onStartRunEval ) Util.evalTryCatch( appModeConfig.onStartRunEval );

		$('#inputFramerate').val( Math.round( createjs.Ticker.framerate ) );  // Load this value from 'config'
	}

	// If empty selection, display 'tomato' color for attention.
	if ( !appModeName ) selAppModeTag.css( 'background-color', 'tomato' );
	else selAppModeTag.css( 'background-color', '' );


	// Un-Pause ticker
	createjs.Ticker.paused = false;
};


WorldRender.resetAppData = function( )
{
	createjs.Ticker.framerate = 20;

	// 1. Clear the 'containerList' array
	CircleManager.clearData();
	PortalManager.clearData();
	CommonObjManager.clearData();

	// 2. Remove all stage containers
	StageManager.removeStageObjs();

	// 3. curr appModeConfig json reset
	WorldRender.infoJson.appModeConfig = '';

	// 4. reset 'INFO' all - except 'configJson'
	var tempConfigJson = INFO.configJson;
	INFO = { configJson: tempConfigJson };
	WorldRender.setConfig_INFO_Vars( INFO.configJson.INFO_Vars );
}; 


WorldRender.setConfig_INFO_Vars = function( INFO_Vars )
{
	if ( INFO_Vars )
	{
		for ( var prop in INFO_Vars )
		{			
			var data = INFO_Vars[ prop ];

			// Probably not used.. <-- Due to these not should be decided on define time, but on Run Time!
			// if ( Util.isTypeString( data ) && data.trim().indexOf( '[EVAL]' ) === 0 ) data = Util.evalTryCatch( data.replace( '[EVAL]', '' ) );

			INFO[prop] = data;
		}
	}
};


// ---------------------------------

WorldRender.openInfoPanel = function( )
{

};
