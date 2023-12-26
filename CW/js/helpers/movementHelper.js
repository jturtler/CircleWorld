function MovementHelper() { };

MovementHelper.moveNext = function (container) 
{
	var item = container.itemData;

	var movement = MovementHelper.getMovementCalc( item.angle, item.speed );

	// If 'WallTouched' case, change the 'movement'
	var wallTouched = MovementHelper.getWallReached( container, movement, WorldRender.infoJson.canvasHtml ); 

	if ( wallTouched )
	{
		item.angle = MovementHelper.getNewAngle_fromBounce( wallTouched, movement );
		movement = MovementHelper.getMovementCalc( item.angle, item.speed );
	}

	// Set the new movements..
	container.x += movement.x;
	container.y += movement.y;	
};

// -----------------------------------

MovementHelper.getWallReached = function (obj, movement, canvasHTML ) 
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
  else if ( objPosition_Right >= canvasHTML.width && movement.x > 0 ) wallTouched = 'reachedWall_Right';
  else if ( objPosition_Top <= 0 && movement.y < 0 ) wallTouched = 'reachedWall_Top';
  else if ( objPosition_Bottom >= canvasHTML.height && movement.y > 0 ) wallTouched = 'reachedWall_Bottom';

  return wallTouched;
};


MovementHelper.getNewAngle_fromBounce = function ( wallTouched, movement ) 
{
  if ( wallTouched === 'reachedWall_Left' ) movement.x = -movement.x;
  else if ( wallTouched === 'reachedWall_Right' ) movement.x = -movement.x;
  else if ( wallTouched === 'reachedWall_Top' ) movement.y = -movement.y;
  else if ( wallTouched === 'reachedWall_Bottom' ) movement.y = -movement.y;

  return MovementHelper.getAngle_fromMovement( movement );
};

// ---------------------------------------


// Part of physics or utils..
MovementHelper.getMovementCalc = function( angle, speed ) 
{
	var movement = {};

	var anglePi = Math.PI * ( angle / 180 );

	movement.x = Math.cos(anglePi) * speed;
	movement.y = Math.sin(anglePi) * speed;

	return movement;
};


MovementHelper.getAngle_fromMovement = function( movement )
{
  var angle = ( Math.atan2( movement.y, movement.x ) / Math.PI ) * 180;

  // QUESTION: Why I have to do this? 0 - 270.. somehow, 280 => -10..  () -0 ~ -90
  if ( angle < 0 ) angle = angle + 360;

  return angle;
};
