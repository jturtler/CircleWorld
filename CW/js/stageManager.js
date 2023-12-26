//	- WorldRender Class - Main World Rendering Class, Starting point
function StageManager() { };

StageManager.framerate = 20;
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
	StageManager.setFramerate_Event( StageManager.framerate );

};


// --------------------
// --- Frame Run

StageManager.setFramerate_Event = function (framerate) 
{
	createjs.Ticker.framerate = framerate;
	createjs.Ticker.removeEventListener('tick', StageManager.frameRender);
	createjs.Ticker.addEventListener('tick', StageManager.frameRender);
};


StageManager.frameRender = function ( e ) 
{
	if ( !e.paused )
	{
		StageManager.stage.children.forEach(container => 
		{
			try
			{
				if ( container.itemData )
				{
					if ( container.itemData.runAction ) container.itemData.runAction( container, container.itemData );	
				}	
			}
			catch( errMsg ) {  console.error( 'ERROR in StageManager.frameRender, in container operation, ' + errMsg ); }
		});

		StageManager.stage.update();

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
	StageManager.stage.children.forEach( obj => {
		if ( obj.canvasSizeChanged ) {
			try {
				obj.canvasSizeChanged(); // Use global WorldRender.infoJson value rather than param value.
			} catch ( errMsg ) { console.error( 'ERROR in canvasSizeChanged() call, ' + errMsg ); } // All the error should be logged in error type logs?
		}
	});

	StageManager.stage.update();
};


// --------------------
// --- Frame Run Related

