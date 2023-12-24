//	- WorldRender Class - Main World Rendering Class, Starting point
function WorldRender() { };

WorldRender.stage;
WorldRender.infoJson = {};  // canvasName, canvasTag, canvasTagHtml, winTag, etc..

// ------------------------

WorldRender.setInfoJson = function (inputJson) 
{
	WorldRender.infoJson.canvasName = inputJson.canvasName;
	WorldRender.infoJson.canvasTag = $('#' + inputJson.canvasName);
	WorldRender.infoJson.canvasTagHtml = WorldRender.infoJson.canvasTag[0];
	WorldRender.infoJson.winTag = inputJson.winTag;
};


WorldRender.startUp = function () 
{
	AppUtil.fitCanvasSize(WorldRender.infoJson); // Adjust Canvas Size to fit the browser size

	var startingObjs = StageObjectBuilder.createSampleObjs(1);
	WorldRender.stage = StageManager.startUp(WorldRender.infoJson, { startingObjs: startingObjs });

	WorldRender.framerateChange_Setup();

	WorldRender.browserResize_Setup();

	// SetUp Events - 'Add Obj', 'Add Portal', 'Show/Hide Info Panel'
	WorldRender.setUp_Events();
};

// ------------------------

WorldRender.setUp_Events = function()
{
	$( '#btnAddObj' ).click( function() 
	{
		StageManager.insertToStage( StageObjectBuilder.createObj( { objType: 'circle' } ) );
	});
};


WorldRender.browserResize_Setup = function()
{
	$( window ).on( "resize", () => 
	{
		AppUtil.callOnlyOnce( { waitTimeMs: 1000 }, () => {
			WorldRender.resizeCanvas();
		}); 		
	});
};


WorldRender.resizeCanvas = function () 
{
	AppUtil.fitCanvasSize(WorldRender.infoJson);
	StageManager.setSize(WorldRender.infoJson);
};


WorldRender.framerateChange_Setup = function () 
{
	var framerateChangeRate = 5;

	var inputFramerateTag = $('#inputFramerate');
	inputFramerateTag.val(StageManager.framerate);

	$('#btnFramerateUp').click( () => {
		StageManager.framerate += framerateChangeRate;
		inputFramerateTag.val( StageManager.framerate );

		createjs.Ticker.framerate = StageManager.framerate;
		// StageManager.setFramerate_Event();
	});

	$('#btnFramerateDown').click( () => {
		StageManager.framerate -= framerateChangeRate;
		if (StageManager.framerate < 1) StageManager.framerate = 1;

		inputFramerateTag.val( StageManager.framerate );

		createjs.Ticker.framerate = StageManager.framerate;
	});


};





/*
  me._bStop = false;

  // -------------------
	 // --- Initial Kids Build using 'KidsBuilder' class.
	 //me.physicsHandler = new PhysicsHandler( me.stageObj, me.canvas_width, me.canvas_height );

	 // TODO: 
	 //    1. Circle Create with name?  <-- Affected by html (size, speed, name?)
	 //    2. Make all these things configurable <--- matching Item dropdown in ControlDiv?
	 //    2. Circle moving with arrow?
	 //    3. Bouncing?  With wall detection line?  <-- make this configurable?  
	 //    4. STOP check --> But stage.update() whenever there is a change?  <-- no movements, but affects some things in UI..


	 //    [** All these should be placed on HTML DIV and can be moved to config file?]

	 //    A. Make the canvas background color change checkboxable
	 //    B. CleanUp the Info/Control Div  (Or Config)
	 //    C. 'Variable' concept, Object concept, Number vs String concept?

	 // ----------------------
	 // Setup HTML Tag related
  };

  // ---------------------------------------------------
  // -- Setups: Setup Stage and Objects, Setup Rendering

	 // btn clicks handle
	 $('#btnStartStop').click(me.stopStart);
	 $('#btnAddKid').click(function () {
		me.kidsBuilder.createKid();
	 });

	 Util.outputMsgAdd("Key: 's' to stop/start, 'a' to add new kid");
  };

  // Handle Key Down Function
  me.handleKeyDown = function (event, stageObj) {
	 switch (event.keyCode) {
		case 83: //_keycode_s:
		case 32: //_keycode space:
		  me.stopStart();
		  return false;

		case 65: //_keycode_a:
		  var kidObj = me.kidsBuilder.createKid();
		  return false;
	 }
  };

  me.stopStart = function () {
	 me._bStop = !me._bStop;
	 var msg = me._bStop ? 'Stopped' : 'Started';
	 Util.outputMsgAdd(msg, 4);
  };
}
*/
