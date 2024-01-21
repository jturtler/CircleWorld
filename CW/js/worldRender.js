//	- WorldRender Class - Main World Rendering Class, Starting point
function WorldRender() { };

WorldRender.stage;
WorldRender.infoJson = {};  // canvasName, canvasTag, canvasHtml, winTag, etc..

WorldRender.spanInfoTag = $( '#spanInfo' );

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
	
	WorldRender.setINFO_ObjSettings_withDefault( ObjSettings.DefaultJson );

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
			// divMainContentTag.append('<div class="infoLine" style="opacity: 0;">- </div>');
			// divMainContentTag.append('<div class="infoLine">------------------------</div>');
		});
	});

	$( '#btnReloadApp' ).click( function() 
	{
		AppUtil.appReloadWtMsg( 'Reloading app, checking updates..' );
	});

	// Add Circle
	$( '#btnAddObj' ).click( function() 
	{
		// Can be overridden from config appMode
		var dataInfo = { color: 'black', startPosition: AppUtil.getPosition_Center() };

		CircleManager.createCircleObj( dataInfo );

		// If the stage is paused, show the added circle right away by updating stage.
		if ( createjs.Ticker.paused ) StageManager.stage.update();
	});

	
	$( '#btnStopStart' ).click( function() 
	{
		if ( !createjs.Ticker.paused ) StageManager.stageStopStart( { bStop: true, spanMsg: true } );
		else StageManager.stageStopStart( { bStop: false, spanMsg: true } );
	});


	// browserResize_Setup
	$( window ).on( "resize", () => 
	{
		AppUtil.callOnlyOnce( { waitTimeMs: 1000 }, () => {
			WorldRender.resizeCanvas();
		}); 		
	});

	//$( document ).on( 'mousemove', CommonObjManager.onMouseMove ); // Moved to StageManager

	WorldRender.framerateChange_Setup( $('#spanFramerate'), $('#btnFramerateUp'), $('#btnFramerateDown') );


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


WorldRender.framerateChange_Setup = function ( spanFramerateTag, btnFramerateUpTag, btnFramerateDownTag ) 
{
	var framerateChangeRate = 5;

	spanFramerateTag.text( Math.round( createjs.Ticker.framerate ) );  // Load this value from 'config'

	btnFramerateUpTag.click( () => {
		createjs.Ticker.framerate = Math.round( createjs.Ticker.framerate + framerateChangeRate );
		spanFramerateTag.text( Math.round( createjs.Ticker.framerate ) );
	});

	btnFramerateDownTag.click( () => {
		createjs.Ticker.framerate = Math.round( createjs.Ticker.framerate - framerateChangeRate );
		if (createjs.Ticker.framerate < 1) createjs.Ticker.framerate = 1;
		spanFramerateTag.text( Math.round( createjs.Ticker.framerate ) );
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

		$('#spanFramerate').val( Math.round( createjs.Ticker.framerate ) );  // Load this value from 'config'
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

	// 1. Reset some global variables/array/counts, etc..	
	CommonObjManager.resetData();

	// 2. Remove all stage objects
	StageManager.removeAllStageObjs();

	// 3. curr appModeConfig json reset
	WorldRender.infoJson.appModeConfig = '';

	// 4. reset 'INFO' all - except 'configJson'
	INFO = { configJson: INFO.configJson };
	WorldRender.setConfig_INFO_Vars( INFO.configJson.INFO_Vars ); // Reload 'ObjSettings' under config 'INFO'
}; 


WorldRender.setConfig_INFO_Vars = function( INFO_Vars )
{
	if ( INFO_Vars )
	{
		for ( var prop in INFO_Vars )
		{
			INFO[prop] = INFO_Vars[ prop ];
		}
	}

	// In case the config 'INFO_Vars' did not set INFO.colorTeamList, set it here..(?)
	if ( !INFO.colorTeamList ) INFO.colorTeamList = Util.cloneJson( CircleManager.colorTeamList_DEFAULT );

	WorldRender.setINFO_ObjSettings_withDefault( ObjSettings.DefaultJson );	
};

// ---------------------------------

WorldRender.setINFO_ObjSettings_withDefault = function( ObjSettings_DefaultJson )
{
	if ( !INFO.ObjSettings ) INFO.ObjSettings = {}; // Normally, this gets set by configJson's appMode selection, 'INFO_vars'

	var gSettingsJson = Util.cloneJson( ObjSettings_DefaultJson );

	// Merge deep..  Base is 'ObjSettings_DefaultJson' from 'ObjSettings' class.
	Util.mergeDeep( gSettingsJson, INFO.ObjSettings, { arrOverwrite: true } );

	INFO.ObjSettings = gSettingsJson;

	// Run 'preRunEval' for quick shortcut INFO variables creation.
	if ( INFO.ObjSettings.preRunEval ) Util.evalTryCatch( INFO.ObjSettings.preRunEval );
};

// ---------------------------------

WorldRender.openInfoPanel = function( )
{

};


WorldRender.spanInfoText = function( text )
{
	WorldRender.spanInfoTag.text( text );
};

