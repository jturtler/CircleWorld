
//	- StageObjectBuilder Class - Builder class for Stage Object

function StageObjectBuilder() {};

StageObjectBuilder.createCircle = function( dataJson )
{
  var item = {};
  
  // if ( dataJson.objType ) obj.objType = dataJson.objType;
  item.objType = 'circle';

  item.name = 'Mark';  // 'team color name' + 1/2/3..
  item.speed = Util.getRandomInRange(5, 8);  // TODO: 'Sample' item should be used later..
  item.size = Util.getRandomInRange(8, 13); //Util.getRandomInRange(4, 7); // radius
  item.color;
  
  if ( dataJson.color ) item.color = dataJson.color;
  else item.color = "black";

  item.angle = Util.getRandomInRange( 0, 360 );  // movementX, movementY; <-- can be calculated by speed, angle.
  // console.log( 'angle: ' + item.angle );

  // subObj
  item.subObj = {
    size: 4,
    color: Util.getRandomColorHex()
  };


	item.runAction = ( container, itemData ) => MovementHelper.moveNext(container);

  return item;
};


// NOTE: 
//  - 3 portals that produce same color...  
//  - [config] small ones attack big ones..   they gets experience, but not too much..
//    - they can try to run back if they are lower than 10%? 
//    - ways to get more experience, get special ability..