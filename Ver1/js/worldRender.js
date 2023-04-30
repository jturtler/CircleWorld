//	- WorldRender Class - Main World Rendering Class, Starting point
function WorldRender( canvasWidth, canvasHeight ) 
{
  var me = this;

  me.canvas_width = (canvasWidth) ? canvasWidth: 700; // must match the '<canvas>' tag width
  me.canvas_height = (canvasHeight) ? canvasHeight: 500;

  me._bStop = false;
  me._initialKidsNum = 10;
  me.framerate = 1; // 1 // 10 frame per sec..

  me.stageObj;
  me.kids = [];

  // ------------------------

  me.kidsBuilder;
  me.physicsHandler;

  // ---------------------

  me.inputFramerateTag; //= $( '#inputFramerate' );
  me.btnFramerateUpTag; //= $( '#btnFramerateUp' );
  me.btnFramerateDownTag; //= $( '#btnFramerateDown' );

  // -------------------

  // 창민
  me.chaingMin = 0;

  me.startUp = function () 
  {
    // -- Setup Stage and Objects
    me.stageObj = new createjs.Stage('demoCanvas'); //me.setUp_StageObj();



    // --- Initial Kids Build using 'KidsBuilder' class.
    //me.kidsBuilder = new KidsBuilder( me.stageObj, me.kids, me.canvas_width, me.canvas_height );
    //me.physicsHandler = new PhysicsHandler( me.stageObj, me.canvas_width, me.canvas_height );





    //me.kidsBuilder.createKids(me._initialKidsNum);  // <-- This could be moved...  Start off after a couple ticks..



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
    me.chaingMin = 120 + 45; //me.chaingMin + 2;

    //console.log( new Date().toString() );
    var timeVar = new Date().getTime();
    var frameTimeStr = new Date().toString().substr( 0, 24 );

    var remainder = timeVar % 2;
    var color = '#' + me.getRandomColor();

    $( '#divInfo' ).text( 'Frame: ' + frameTimeStr + ' / COLOR: ' + color + ' / [창민숫자: ' + me.chaingMin + ']' );
  
    $( '#demoCanvas').css( 'background-color', color );
    
    // <canvas id="demoCanvas" width="700" height="500" style="background-color: #FDD;"></canvas>

    if ( !me._bStop ) 
    {
      // Reset/Clear things
      //GraphicsService.clearLines( stageObj );

      // Perform Physics 1st?  Or kids act 1st?
      //me.physicsHandler.performPhysics(me.kids);


      /*
      // NOTE: Put this in 'PhysicsHandler'?
      me.kids.forEach((kid, i, list) => 
      {
        kid.performNext();

        // Remove kids if died..
        if ( kid.died ) list.splice(i, 1);
      });
      */

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
