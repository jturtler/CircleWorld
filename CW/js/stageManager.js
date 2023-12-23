//	- WorldRender Class - Main World Rendering Class, Starting point
function StageManager() {};

StageManager.framerate = 1;
StageManager.stage;

// ---------------------

StageManager.startUp = function( infoJson, options )
{
  if ( !options ) options = {};


  // 1. create 'createjs' stage object
  StageManager.stage = new createjs.Stage( infoJson.canvasName );


  // 2. add 'stageObj' starting ones
  if ( options.startingStageObjs ) options.startingStageObjs.forEach( obj => { StageManager.addStageObject( obj ); } );
  StageManager.stage.update(); // 1st update/show after objects are setup


  // 3. setUp the rendering of frames..
  StageManager.setFramerate_Event( StageManager.framerate ); 

};


// 'addStageContainer'?
StageManager.addStageObject = function ( obj )
{
  var shape = new createjs.Shape();
  shape.graphics.beginFill('green').drawCircle(0, 0, 30);

  var label = new createjs.Text('MARK', 'normal 14px Arial', 'White');
  label.textAlign = 'center';
  label.textBaseline = 'middle';

  var container = new createjs.Container();
  // container.stageObj = obj;
  container.x = 100; //obj.x;
  container.y = 100; //obj.y;

  container.addChild( shape, label );

  // Add 'container' to 'createjs' stage
  StageManager.stage.addChild( container );
};


StageManager.setFramerate_Event = function ( framerate ) 
{
  createjs.Ticker.framerate = framerate;
  createjs.Ticker.removeEventListener('tick', StageManager.frameRender );
  createjs.Ticker.addEventListener('tick', StageManager.frameRender );
};


StageManager.frameRender = function()
{
  StageManager.stage.children.forEach( obj => {
    obj.x += 10;
  });

  StageManager.stage.update();
};
