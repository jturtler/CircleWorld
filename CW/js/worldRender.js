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
};

// ------------------------

WorldRender.startUp = function () 
{
	AppUtil.fitCanvasSize( WorldRender.infoJson ); // Adjust Canvas Size to fit the browser size

	StageManager.startUp( WorldRender.infoJson );

	StageManager.startPlan( { plan: 'Portal' } );

	// SetUp Events - 'Add Obj', 'Add Portal', 'Show/Hide Info Panel'
	WorldRender.setUp_Events();
};

// ------------------------

WorldRender.setUp_Events = function()
{
	// Add Circle
	$( '#btnAddObj' ).click( function() 
	{
		var middlePosX = Math.floor( WorldRender.infoJson.canvasHtml.width / 2 );
		var middlePosY = Math.floor( WorldRender.infoJson.canvasHtml.height / 2 );
		// Util.getRandomInList( PortalManager.portalTeamColors ),  // Util.getRandomInRange(0, WorldRender.infoJson.canvasHtml.width ), 
		var dataInfo = { color: 'black', position: { x: middlePosX, y: middlePosY } };

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

	inputFramerateTag.val(StageManager.framerate);

	btnFramerateUpTag.click( () => {
		StageManager.framerate += framerateChangeRate;
		inputFramerateTag.val( StageManager.framerate );

		createjs.Ticker.framerate = StageManager.framerate;
	});

	btnFramerateDownTag.click( () => {
		StageManager.framerate -= framerateChangeRate;
		if (StageManager.framerate < 1) StageManager.framerate = 1;

		inputFramerateTag.val( StageManager.framerate );

		createjs.Ticker.framerate = StageManager.framerate;
	});
};



