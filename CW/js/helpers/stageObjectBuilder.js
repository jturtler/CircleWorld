
//	- StageObjectBuilder Class - Builder class for Stage Object

function StageObjectBuilder() {};

// NOTE: These are not 'stageObj', but are definition of obj inner info..

StageObjectBuilder.createSampleObjs = function( objNum )
{
  var stageObjs = [];

  for (var i = 0; i < objNum; i++) {
    stageObjs.push( StageObjectBuilder.createObj( { objType: 'circle' } ) );
  }

  return stageObjs;
};


StageObjectBuilder.createObj = function( option )
{
  var stageObj = {};
  
  var OBJ_COLOR_LIST = ['#7C9AFC', '#A0DE8F', '#F0F58C', 'Orange'];

  if ( option.objType ) stageObj.objType = option.objType;

  stageObj.name = 'Mark';  // 'team color name' + 1/2/3..
  stageObj.speed = Util.getRandNumBtw(5, 8);  // TODO: 'Sample' obj should be used later..
  stageObj.size = Util.getRandNumBtw(4, 7); // radius
  stageObj.color = Util.getRandFromList( OBJ_COLOR_LIST );

  stageObj.x = 100; // Portal location?  Set as Dynamic in later time
  stageObj.y = 100;

  stageObj.angle = Util.getRandNumBtw( 0, 360 );
  // movementX, movementY; <-- can be calculated by speed, position, angle.

  console.log( 'angle: ' + stageObj.angle );

  return stageObj;
};


// NOTE: 
//  - 3 portals that produce same color...  
//  - [config] small ones attack big ones..   they gets experience, but not too much..
//    - they can try to run back if they are lower than 10%? 
//    - ways to get more experience, get special ability..