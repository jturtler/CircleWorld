
//	- StageObjectBuilder Class - Builder class for Stage Object

function StageObjectBuilder() {};

// NOTE: These are not 'stageObj', but are definition of obj inner info..

StageObjectBuilder.createSampleObjs = function( objNum )
{
  var objs = [];

  for (var i = 0; i < objNum; i++) {  objs.push( StageObjectBuilder.createObj( { objType: 'circle' } ) );  }

  return objs;
};


StageObjectBuilder.createObj = function( option )
{
  var obj = {};
  
  var OBJ_COLOR_LIST = ['#7C9AFC', '#A0DE8F', '#F0F58C', 'Orange'];

  if ( option.objType ) obj.objType = option.objType;

  obj.name = 'Mark';  // 'team color name' + 1/2/3..
  obj.speed = Util.getRandomInRange(5, 8);  // TODO: 'Sample' obj should be used later..
  obj.size = Util.getRandomInRange(8, 13); //Util.getRandomInRange(4, 7); // radius
  obj.color = Util.getRandomInList( OBJ_COLOR_LIST );

  obj.x = 100; // Portal location?  Set as Dynamic in later time
  obj.y = 100;

  obj.angle = Util.getRandomInRange( 0, 360 );  // movementX, movementY; <-- can be calculated by speed, angle.
  // console.log( 'angle: ' + obj.angle );

  // subObj
  obj.subObj = {
    size: 4,
    color: Util.getRandomColorHex()
  };

  return obj;
};


// NOTE: 
//  - 3 portals that produce same color...  
//  - [config] small ones attack big ones..   they gets experience, but not too much..
//    - they can try to run back if they are lower than 10%? 
//    - ways to get more experience, get special ability..