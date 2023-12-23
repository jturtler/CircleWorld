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

	var startingStageObjs = StageObjectBuilder.createStageObjs_Samples(1);
	WorldRender.stage = StageManager.startUp(WorldRender.infoJson, { startingStageObjs: startingStageObjs });

	WorldRender.framerateChange_Setup();

	// Resize event

					// Events - browser resizing handling
				//AppUtil.setResizeEventHandler( () => { WorldRender.resizeCanvas(); } );

	// callOnlyOnce
};

// ------------------------

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
canvasWidth, canvasHeight ) 
{
  var me = this;

  me.canvas_width = (canvasWidth) ? canvasWidth: 700; // If not provided, the default width is 700
  me.canvas_height = (canvasHeight) ? canvasHeight: 500;

  me._bStop = false;
  me._initialKidsNum = 10;
  me.framerate = 1; // 1 // 10 frame per sec..

  me.stageObj;
  me.kids = [];

  me.circleOne;
  me.squareOne;

  // ------------------------

  me.kidsBuilder;
  me.physicsHandler;

  // ---------------------

  me.inputFramerateTag; //= $( '#inputFramerate' );
  me.btnFramerateUpTag; //= $( '#btnFramerateUp' );
  me.btnFramerateDownTag; //= $( '#btnFramerateDown' );

  // -------------------

  me.shape1;
  me.shape1_label1;
  me.shape1_x_dir = 'plus';  

  me.obj1;  // me.char = { ----}

  me.resizeStage = function()
  {
	 // _canvasStage
  };


  me.startUp = function () 
  {
	 // -- Setup Stage and Objects

	 // TODO: Create a 'stageObj' global one <-- class, and place createjs.Stage in it..
	 // Put the size in there as well.. + some other physics calculation in here??

	 // Then, how is it difference from 'WorldRender'?  vs 'stage'?


	 me.stageObj = new createjs.Stage('demoCanvas'); //me.setUp_StageObj();
  
	 me.shape1 = new createjs.Shape();
	 me.shape1.graphics.beginFill('red').drawRect(0, 0, 120, 120);
	 me.shape1.x = 100;
	 me.shape1.y = 100;

	 me.shape1_label1 = new createjs.Text('James', 'normal 14px Arial', 'White');    
	 me.shape1_label1.x = 110;
	 me.shape1_label1.y = 110;
	 me.stageObj.addChild(me.shape1, me.shape1_label1);


	 me.obj1 = new createjs.Container();
	 var shape3 = new createjs.Shape();
	 shape3.graphics.beginFill('green').drawCircle(0, 0, 30);

	 var label3 = new createjs.Text('MARK', 'normal 14px Arial', 'White');
	 label3.textAlign = 'center';
	 label3.textBaseline = 'middle';

	 me.obj1.addChild( shape3, label3 );
	 me.obj1.x = 300;
	 me.obj1.y = 300;

	 me.stageObj.addChild( me.obj1 );


	 me.stageObj.update();




	 // --- Initial Kids Build using 'KidsBuilder' class.
	 //me.kidsBuilder = new KidsBuilder( me.stageObj, me.kids, me.canvas_width, me.canvas_height );
	 //me.physicsHandler = new PhysicsHandler( me.stageObj, me.canvas_width, me.canvas_height );

	 //me.kidsBuilder.createKids(me._initialKidsNum);  // <-- This could be moved...  Start off after a couple ticks..


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


	 // -- Render Objects In Stage
	 me.setUp_TickRendering( me.stageObj, me.framerate );

	 // -- Key Action Setup
	 //me.setUp_KeyDown_BtnClicks(me.stageObj);


	 // ----------------------
	 // Setup HTML Tag related

	 me.inputFramerateTag = $( '#inputFramerate' );    
	 me.inputFramerateTag.val( me.framerate );

	 $( '#btnFramerateUp' ).click( function() 
	 {
		me.framerate += 1;
		console.log( me.framerate );
		me.inputFramerateTag.val( me.framerate );
		me.setUp_TickRendering(me.stageObj, me.framerate);
	 });

	 $( '#btnFramerateDown' ).click( function() 
	 {
		me.framerate -= 1;
		if ( me.framerate < 1 ) me.framerate = 1;

		me.inputFramerateTag.val( me.framerate );
		me.setUp_TickRendering(me.stageObj, me.framerate);
	 });

  };

  // ---------------------------------------------------
  // -- Setups: Setup Stage and Objects, Setup Rendering

  me.setUp_StageObj = function () {
	 return new createjs.Stage('demoCanvas');
  };

  me.setUp_TickRendering = function (stageObj, framerate) 
  {
	 createjs.Ticker.framerate = framerate;

	 createjs.Ticker.removeEventListener('tick', me.eventListener_TickRender );

	 createjs.Ticker.addEventListener('tick', me.eventListener_TickRender );
  };

  me.eventListener_TickRender = function()
  {
	 me.tickRender( me.stageObj );
  }

  me.setUp_KeyDown_BtnClicks = function (stageObj) {
	 // key down handle
	 window.onkeydown = function (event) {
		me.handleKeyDown(event, stageObj);
	 };

	 // btn clicks handle
	 $('#btnStartStop').click(me.stopStart);
	 $('#btnAddKid').click(function () {
		me.kidsBuilder.createKid();
	 });

	 Util.outputMsgAdd("Key: 's' to stop/start, 'a' to add new kid");
  };

  // -------------------------------------------------------

  me.getRandomColor = function()
  {
	 return Math.floor( Math.random()*16777215 ).toString(16);
  };

  me.tickRender = function (stageObj) 
  {
	 //$( '#divInfo' ).text( '' ); 

	 if ( !me._bStop ) 
	 {
		// Reset/Clear things
		//GraphicsService.clearLines( stageObj );

		// Perform Physics 1st?  Or kids act 1st?
		//me.physicsHandler.performPhysics(me.kids);


		// NOTE: Put this in 'PhysicsHandler'?
		me.kids.forEach((kid, i, list) => 
		{
		  kid.performNext();

		  // Remove kids if died..
		  if ( kid.died ) list.splice(i, 1);
		});


		// Simple Bouncing right and left
		//    - shape1 width is 120..
		if ( me.shape1.x >= me.canvas_width - 120 ) me.shape1_x_dir = 'minus';
		else if ( me.shape1.x <= 0 ) me.shape1_x_dir = 'plus';

		me.shape1.x += ( me.shape1_x_dir === 'minus' ) ? -10: 10;
		me.shape1_label1.x += ( me.shape1_x_dir === 'minus' ) ? -10: 10;
		//me.shape1.y = 100;


		me.obj1.x += 10;

		stageObj.update();
	 }
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
