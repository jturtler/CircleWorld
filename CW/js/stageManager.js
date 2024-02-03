//	- WorldRender Class - Main World Rendering Class, Starting point
function StageManager() { };

// Default 'interval' for TICK is 0.05 Seconds.  Thus, Default 'framerate' is 20? (20 FPS - 20 frames per seconds).  
// StageManager.framerate = 20; // On 1 Tick, how many frames we like to render..   
StageManager.frameCount = 1;  // 0 if wants to spawn right away..  reset to 0 if reaches 1000000
StageManager.frameCountResetMax = 1000000;

StageManager.stage;

// ---------------------

StageManager.startUp = function (infoJson, options) 
{
	if (!options) options = {};

	// 1. create 'createjs' stage object
	StageManager.stage = new createjs.Stage( infoJson.canvasName );
	createjs.Touch.enable( StageManager.stage );

	// 2. setUp the rendering of frames..
	StageManager.setStage_Events();
};

// --------------------
// --- Frame Run

StageManager.setStage_Events = function () 
{
	// createjs.Ticker.framerate = framerate;
	createjs.Ticker.removeEventListener( 'tick', StageManager.frameMove );
	createjs.Ticker.addEventListener( 'tick', StageManager.frameMove );

	StageManager.stage.addEventListener( 'stagemouseup', CommonObjManager.objMouseUpAction )

	StageManager.stage.addEventListener( 'stagemousemove', CommonObjManager.onMouseMove )
};

// ----------------------------------------------


StageManager.frameMove = function ( e ) 
{
	if ( !e.paused )
	{
		var aged = eval( INFO.ObjSettings.CircleSettings.ageLogic.ageIncreaseCheckInTickEval );		

		// 1. Proxy 'lines' remove (for new stage frame drawing), and clear all obj's 'distances' data.
		MovementHelper.removeAllProxyLines();
		MovementHelper.clearAllDistances( StageManager.getStageChildrenContainers() );
		CommonObjManager.tempLines_Check_NClear();

		// 2. Remove Child/Container who has size 0
		StageManager.removeObjs_ByStatus( StageManager.getStageChildrenContainers(), { sizeEmpty: true } );

		// 1. Each children 'container' changes/renders
		StageManager.getStageChildrenContainers().forEach(container => 
		{
			try {
				var itemData = container.itemData;

				if ( itemData )
				{
					itemData.statusList = []; // TODO: Move this to other place in later time.. <-- Later, keep last 10 status?
					CommonObjManager.highlightShapeCountCheck_NClear( container );

					if ( itemData.age && aged ) {						
						itemData.age++;
						if ( itemData.onAgeIncrease ) itemData.onAgeIncrease( container );	
					}
					if ( itemData.onFrameMove_ClassBase ) itemData.onFrameMove_ClassBase( container );	
					if ( itemData.onFrameChange ) itemData.onFrameChange( container );		
				}
			}
			catch( errMsg ) {  console.error( 'ERROR in StageManager.frameMove, in children container onFrameChange, ' + errMsg ); }
		});

			
		// 2. Selected AppMode Tick Render..
		try
		{
			var config = WorldRender.infoJson.appModeConfig;
			if ( config && config.onStageFrameMoveEval ) Util.evalTryCatch( config.onStageFrameMoveEval );
		}
		catch( errMsg ) {  console.error( 'ERROR in StageManager.frameMove, in config onStageFrameMoveEval, ' + errMsg ); }


		StageManager.stage.update();


		// Print the selected/clicked obj info on console.log <-- if the flag is set: INFO.printClickedObj = true;
		if ( INFO.printClickedObj && CommonObjManager.clickedContainer ) CommonObjManager.printObjInfo( CommonObjManager.clickedContainer, { type: 'console.log' } );

		// Frame Count..
		StageManager.frameCount++;
		if ( StageManager.frameCount > StageManager.frameCountResetMax ) StageManager.frameCount = 0;
	}
};

// ---------------------------------------------

StageManager.adjustCanvasSize = function () 
{
	// Check all objects and if 'canvasSizeChanged' method exists, call them..
	StageManager.getStageChildrenContainers().forEach( container => {
		if ( container.itemData.onCanvasSizeChanged ) 
		{
			try {
				container.itemData.onCanvasSizeChanged( container ); // Use global WorldRender.infoJson value rather than param value.
			} catch ( errMsg ) { console.error( 'ERROR in canvasSizeChanged() call, ' + errMsg ); } // All the error should be logged in error type logs?
		}
	});

	StageManager.stage.update();
};


StageManager.stageStopStart = function ( option ) 
{
	if ( !option ) option = {};
	var spanMsg = ( option.spanMsg !== undefined ) ? option.spanMsg: false;
	var bStop = ( option.bStop !== undefined ) ? option.bStop: true;

	createjs.Ticker.paused = bStop;

	if ( bStop )
	{
		if ( spanMsg ) WorldRender.spanInfoTag.text( 'Stopped.. ' );
		$( '#spanStopStart' ).text( 'tart' ); // set button text as 'start' for indicating 'start' again by button click.
		$( '#btnStopStart' ).css( 'background-color', 'tomato' );
	}
	else 
	{
		if ( spanMsg ) WorldRender.spanInfoTag.text( 'Started Again.. ' );
		$( '#spanStopStart' ).text( 'top' ); // set button text as 'start' for indicating 'start' again by button click.
		$( '#btnStopStart' ).css( 'background-color', '' )
	}
};


// ----------------------------

StageManager.getStageChildrenContainers = function ( objType ) 
{	
	var list = [];

	list = StageManager.stage.children.filter( obj => ( obj.itemData ) );
	if ( objType ) list = list.filter( obj => obj.itemData?.objType === objType );

	return list;
};

StageManager.removeStageChildrenContainers = function ( objType ) 
{	
	var list = StageManager.getStageChildrenContainers( objType );

	list.forEach( obj => StageManager.stage.removeChild( obj ) );
};

StageManager.removeAllStageObjs = function()
{
	StageManager.stage.removeAllChildren();
};

StageManager.removeObjs_ByStatus = function ( list, option ) 
{
	if ( !option ) option = {};

	if ( option.sizeEmpty ) 
	{
		list.filter( obj => obj.itemData.width_half <= 0 ).forEach( obj => StageManager.stage.removeChild( obj ) );	
	}
};

// --------------------


