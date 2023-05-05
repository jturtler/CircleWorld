//	- GraphicsService --
//

function GraphicsService() {}

GraphicsService.LINES = [];

GraphicsService.addLineDraw = function( stageObj, obj1, obj2, color ) 
{
  var line = new createjs.Shape();

  line.graphics
    .setStrokeStyle(1)
    .beginStroke( color )
    .moveTo(obj1.x, obj1.y)
    .lineTo(obj2.x, obj2.y)
    .endStroke();

  stageObj.addChild( line );

  GraphicsService.LINES.push( line );
};

GraphicsService.clearLines = function( stageObj ) 
{
  GraphicsService.LINES.forEach( ( line, i, list ) => {
    stageObj.removeChild(line);
    list.splice(i, 1);
  });
};

