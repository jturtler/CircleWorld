//	- WorldRender Class - Main World Rendering Class, Starting point
function StageManager() { };

StageManager.framerate = 20;

StageManager.stage;

StageManager.selectedContainer;
StageManager.selectedContainer_highlightShape;

// ---------------------

StageManager.startUp = function (infoJson, options) 
{
	if (!options) options = {};


	// 1. create 'createjs' stage object
	StageManager.stage = new createjs.Stage(infoJson.canvasName);


	// 2. add 'stageObj' starting ones
	if (options.startingObjs) options.startingObjs.forEach(item => { StageManager.insertToStage(item); });
	//StageManager.stage.update(); // 1st update/show after objects are setup


	// 3. setUp the rendering of frames..
	StageManager.setFramerate_Event(StageManager.framerate);

};

// ---------------------------------------------

StageManager.setSize = function (infoJson) 
{
	// Apply the changed canvas size?

	// But the PhysicsHandler use the WorldRender.infoJson, global variables..

	// No Need!!!  <-- Have the 'frame renderer' to use the global info for wall bounding
};

StageManager.addNewItem = function ()
{
	var item = StageObjectBuilder.createObj( { objType: 'circle' } );
	StageManager.insertToStage( item );
};

// 'addStageContainer'?
StageManager.insertToStage = function (item) 
{
	var subShape;

	var shape = new createjs.Shape();
	shape.graphics.beginFill(item.color).drawCircle(0, 0, item.size);

	//var label = new createjs.Text(item.name, 'normal 10px Arial', 'White');
	//label.textAlign = 'center';
	//label.textBaseline = 'middle';

	if ( item.subObj )
	{
		subShape = new createjs.Shape();
		subShape.graphics.beginFill(item.subObj.color).drawCircle(0, 0, item.subObj.size);
	}

	// container - grouping of 
	var container = new createjs.Container();
	container.itemData = item;

	container.x = item.x;
	container.y = item.y;


	// Add to 'container
	container.addChild( shape );
	if ( subShape ) container.addChild( subShape );
	//container.addChild( shapeRect );


	container.addEventListener("click", StageManager.clickObjectEvent );
	

	// Add 'container' to 'createjs' stage
	StageManager.stage.addChild(container);


	// Immediately show the object/container/item added
	StageManager.stage.update();
};


StageManager.clickObjectEvent = function ( e ) 
{
	var container = e.currentTarget;

	if ( container.itemData ) 
	{
		var item = container.itemData;
		console.log( item );

		// Clear other selections..
		StageManager.clearPrevSelection();


		StageManager.selectedContainer = container;
		
		var offset = 4;
		var size = item.size + offset;
		var widthHeight = size * 2;

		var shape = new createjs.Shape();
		shape.graphics.setStrokeStyle(1).beginStroke("green").drawRect( -size, -size, widthHeight, widthHeight );	
		container.addChild( shape );

		StageManager.selectedContainer_highlightShape = shape;


		StageManager.stage.update();
	}
};

StageManager.clearPrevSelection = function () 
{
	if ( StageManager.selectedContainer && StageManager.selectedContainer_highlightShape )
	{
		StageManager.selectedContainer.removeChild( StageManager.selectedContainer_highlightShape );
	}
};


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
			StageManager.moveNext(container);
		});

		StageManager.stage.update();		
	}
};


StageManager.moveNext = function (container) 
{
	var item = container.itemData;

	var movement = StageManager.getMovementCalc( item.angle, item.speed );

	// If 'WallTouched' case, change the 'movement'
	var canvasHTML = WorldRender.infoJson.canvasTagHtml;
	var wallTouched = StageManager.getWallReached( container, movement, canvasHTML.width, canvasHTML.height ); 

	if ( wallTouched )
	{
		item.angle = StageManager.getNewAngle_fromBounce( wallTouched, movement );
		movement = StageManager.getMovementCalc( item.angle, item.speed );
	}

	// Set the new movements..
	container.x += movement.x;
	container.y += movement.y;	
};


// -----------------------------------

StageManager.getWallReached = function (obj, movement, canvas_width, canvas_height) 
{
	var wallTouched = '';

	var item = obj.itemData;

	var objPosition_Left = obj.x - item.size;
	var objPosition_Right = obj.x + item.size;
	var objPosition_Top = obj.y - item.size;
	var objPosition_Bottom = obj.y + item.size;


  // When reaching left wall, we only notify it if it reach the position of 0 or less
  //	And the direction was left (minus), not right or straight down.
  if ( objPosition_Left <= 0 && movement.x < 0 ) wallTouched = 'reachedWall_Left';
  else if ( objPosition_Right >= canvas_width && movement.x > 0 ) wallTouched = 'reachedWall_Right';
  else if ( objPosition_Top <= 0 && movement.y < 0 ) wallTouched = 'reachedWall_Top';
  else if ( objPosition_Bottom >= canvas_height && movement.y > 0 ) wallTouched = 'reachedWall_Bottom';

  return wallTouched;
};


StageManager.getNewAngle_fromBounce = function ( wallTouched, movement ) 
{
  if ( wallTouched === 'reachedWall_Left' ) movement.x = -movement.x;
  else if ( wallTouched === 'reachedWall_Right' ) movement.x = -movement.x;
  else if ( wallTouched === 'reachedWall_Top' ) movement.y = -movement.y;
  else if ( wallTouched === 'reachedWall_Bottom' ) movement.y = -movement.y;

  return StageManager.getAngle_fromMovement( movement );
};

// ---------------------------------------


// Part of physics or utils..
StageManager.getMovementCalc = function( angle, speed ) 
{
	var movement = {};

	var anglePi = Math.PI * ( angle / 180 );

	movement.x = Math.cos(anglePi) * speed;
	movement.y = Math.sin(anglePi) * speed;

	return movement;
};


StageManager.getAngle_fromMovement = function( movement )
{
  var angle = ( Math.atan2( movement.y, movement.x ) / Math.PI ) * 180;

  // QUESTION: Why I have to do this? 0 - 270.. somehow, 280 => -10..  () -0 ~ -90
  if ( angle < 0 ) angle = angle + 360;

  return angle;
};