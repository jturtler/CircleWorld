//	- WorldRender Class - Main World Rendering Class, Starting point
function StageManager() { };

StageManager.framerate = 5;
StageManager.stage;

// ---------------------

StageManager.startUp = function (infoJson, options) 
{
	if (!options) options = {};


	// 1. create 'createjs' stage object
	StageManager.stage = new createjs.Stage(infoJson.canvasName);


	// 2. add 'stageObj' starting ones
	if (options.startingObjs) options.startingObjs.forEach(item => { StageManager.insertToStage(item); });
	StageManager.stage.update(); // 1st update/show after objects are setup


	// 3. setUp the rendering of frames..
	StageManager.setFramerate_Event(StageManager.framerate);

};

// ---------------------------------------------

StageManager.setSize = function (infoJson) 
{
	// Apply the changed canvas size?

	// But the PhysicsHandler use the WorldRender.infoJson, global variables..

};

// 'addStageContainer'?
StageManager.insertToStage = function (item) 
{
	var shape = new createjs.Shape();
	//shape.graphics.beginFill('green').drawCircle(0, 0, 20); // should be based on the fiels..
	shape.graphics.beginFill(item.color).drawCircle(0, 0, item.size);

	var label = new createjs.Text(item.name, 'normal 11px Arial', 'White');
	label.textAlign = 'center';
	label.textBaseline = 'middle';

	var container = new createjs.Container();

	container.itemData = item;

	container.x = item.x;
	container.y = item.y;

	container.addChild(shape, label);

	// Add 'container' to 'createjs' stage
	StageManager.stage.addChild(container);
};


StageManager.setFramerate_Event = function (framerate) 
{
	createjs.Ticker.framerate = framerate;
	createjs.Ticker.removeEventListener('tick', StageManager.frameRender);
	createjs.Ticker.addEventListener('tick', StageManager.frameRender);
};


StageManager.frameRender = function () 
{
	StageManager.stage.children.forEach(container => 
	{
		StageManager.moveNext(container);
	});

	StageManager.stage.update();
};


StageManager.moveNext = function (container) 
{
	var item = container.itemData;

	var nextMovement = StageManager.getNextMovement( item.angle, item.speed );

	// Check the wall bouncing + change direction?  <-- Change the movement?

	container.x += nextMovement.x;
	container.y += nextMovement.y;	
};


StageManager.getNextMovement = function( angle, speed )
{
	var nextMovement = {};

	var anglePi = Math.PI * ( angle / 180 );

	nextMovement.x = Math.cos(anglePi) * speed;
	nextMovement.y = Math.sin(anglePi) * speed;

	return nextMovement;
};



/*
me.moveNext = function( wallTouches, currentInterest, speed ) 
{
  if ( wallTouches.length > 0 )
  {
	 // sets me.movementX, me.movementY
	 me.setDirection_Bounce( wallTouches );
  }
  else if ( currentInterest )
  {
	 if ( currentInterest.type === 'fear' ) { }
	 else if ( currentInterest.type === 'hunger' ) { }
  }
  
  me.setLocation( me.x + me.movementX, me.y + me.movementY );
};
*/