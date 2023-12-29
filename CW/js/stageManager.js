//	- WorldRender Class - Main World Rendering Class, Starting point
function StageManager() { };

// Default 'interval' for TICK is 0.05 Seconds.  Thus, Default 'framerate' is 20? (20 FPS - 20 frames per seconds).  
StageManager.framerate = 20; // On 1 Tick, how many frames we like to render..   
StageManager.frameCount = 1;  // 0 if wants to spawn right away..  reset to 0 if reaches 1000000
StageManager.frameCountResetMax = 1000000;

StageManager.stage;

// ---------------------

StageManager.startUp = function (infoJson, options) 
{
	if (!options) options = {};

	// 1. create 'createjs' stage object
	StageManager.stage = new createjs.Stage( infoJson.canvasName );

	// 2. setUp the rendering of frames..
	StageManager.setFramerate_Event();
};


StageManager.removeStageObjs = function()
{
	StageManager.stage.removeAllChildren();
};

// --------------------
// --- Frame Run

StageManager.setFramerate_Event = function () 
{
	// createjs.Ticker.framerate = framerate;
	createjs.Ticker.removeEventListener( 'tick', StageManager.frameMove );
	createjs.Ticker.addEventListener( 'tick', StageManager.frameMove );
};


StageManager.frameMove = function ( e ) 
{
	if ( !e.paused )
	{
		// 1. Each children 'container' changes/renders
		StageManager.stage.children.forEach(container => 
		{
			try {
				if ( container.itemData.age ) container.itemData.age++;
				if ( container.itemData.onFrameMove ) container.itemData.onFrameMove( container );	
			}
			catch( errMsg ) {  console.error( 'ERROR in StageManager.frameMove, in children container onFrameMove, ' + errMsg ); }
		});

			
		// 2. Selected AppMode Tick Render..
		try
		{
			var config = WorldRender.infoJson.appModeConfig;
			if ( config && config.onFrameMoveEval ) Util.evalTryCatch( config.onFrameMoveEval );
		}
		catch( errMsg ) {  console.error( 'ERROR in StageManager.frameMove, in config onFrameMoveEval, ' + errMsg ); }


		StageManager.stage.update();


		// Frame Count..
		StageManager.frameCount++;
		if ( StageManager.frameCount > StageManager.frameCountResetMax ) StageManager.frameCount = 0;
	}
};

// ---------------------------------------------

StageManager.startPlan = function( dataJson )
{
	if ( dataJson.plan === 'Portal' )
	{
		// Add Portal one by one?
		for( var i = 0; i < 4; i++ ) PortalManager.createPortalItem();
	}
};


StageManager.adjustCanvasSize = function () 
{
	// Check all objects and if 'canvasSizeChanged' method exists, call them..
	StageManager.stage.children.forEach( container => {
		if ( container.itemData.onCanvasSizeChanged ) 
		{
			try {
				container.itemData.onCanvasSizeChanged( container ); // Use global WorldRender.infoJson value rather than param value.
			} catch ( errMsg ) { console.error( 'ERROR in canvasSizeChanged() call, ' + errMsg ); } // All the error should be logged in error type logs?
		}
	});

	StageManager.stage.update();
};


// --------------------
// --- Frame Run Related

