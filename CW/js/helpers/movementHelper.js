function MovementHelper() { };

MovementHelper.moveNext = function (container) 
{
	var itemData = container.itemData;
	var movementCaseMet = false;

	var movement = MovementHelper.getMovementCalc( itemData.angle, itemData.speed );

	var behaviors = itemData.behaviors;

	if ( behaviors && behaviors.collectDistances ) MovementHelper.collectDistances( container, StageManager.stage.children );

	// CHECK 1. collision with any other object
	//		- Rather than each object checking all other object, we can reduce this list
	//		- by calcuating once per frame...
	//		- 
	if ( !movementCaseMet )
	{
		if ( behaviors && behaviors.onCollision )
		{
			if ( behaviors.protectedUntilAge && behaviors.protectedUntilAge > itemData.age ) { } // ignore since still in protected mode
			else if ( behaviors.onCollision === 'bounce' )
			{
				// TODO: ALSO, if in collision when the age is turned on just now, also ignore it for a while?

				var obj_inCollision = MovementHelper.checkCollision( container );

				if ( !itemData.collisionCheckCount ) itemData.collisionCheckCount = 1;
				else itemData.collisionCheckCount++;

				if ( obj_inCollision )
				{
					if ( itemData.collisionCheckCount === 1 ) itemData.collisionWhileInBeginning = true;

					if ( itemData.collisionWhileInBeginning ) { } // We should ignore collision if the collision check started while in collision with other object..
					else
					{
						// TODO: this is not right...  Need proper Vector collision bounce calculation
						//		- Override expression in Config Eval? - if exists..
						movement.x = -movement.x;
						movement.y = -movement.y;

						itemData.angle = MovementHelper.getAngle_fromMovement( movement );

						// Highlight with circle
						CommonObjManager.highlightSeconds( container, { color: 'red', timeoutSec: 1, shape: 'circle', sizeRate: 1.4 } );

						movementCaseMet = true;
					}
				}
				else
				{
					if ( itemData.collisionWhileInBeginning ) itemData.collisionWhileInBeginning = false;
				}
			}
		}
	}


	// CHECK 2. - If 'WallTouched' case, change the 'movement'
	if ( !movementCaseMet )
	{
		var wallTouched = MovementHelper.getWallReached( container, movement, WorldRender.infoJson.canvasHtml ); 

		if ( wallTouched )
		{
			itemData.angle = MovementHelper.getNewAngle_fromBounce( wallTouched, movement );
			movement = MovementHelper.getMovementCalc( itemData.angle, itemData.speed );
			movementCaseMet = true;
		}
	}

	
	// Set the new movements..
	container.x += movement.x;
	container.y += movement.y;	


	// Section: decrement turns of various lists
	MovementHelper.decrementTurns( itemData.collisionExceptions );  // collisionExceptions: [ { target: container, turns: 1 }
};


MovementHelper.decrementTurns = function( list )
{
	if ( list )
	{
		for ( var i = list.length - 1; i >= 0; i--) 
		{ 
			list[i].turns--;
			if ( list[i].turns <= 0 ) list.splice( i, 1 );
		}
	}
};

// collisionExceptions: [ { target: container, turns: 1 }

// -----------------------------------

MovementHelper.getWallReached = function (obj, movement, canvasHTML ) 
{
	var wallTouched = '';
	
	var itemData = obj.itemData;

	var objPosition_Left = obj.x - itemData.width_half;
	var objPosition_Right = obj.x + itemData.width_half;
	var objPosition_Top = obj.y - itemData.width_half;
	var objPosition_Bottom = obj.y + itemData.width_half;


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


// ---------------------------------------
// --- Distance between objects


MovementHelper.collectDistances = function( currObj, targets )
{
	var itemData = currObj.itemData;
	itemData.distances = [];

	targets.forEach( target => {

		if ( target != currObj )
		{
			var distance = MovementHelper.getDistance( currObj, target );
			itemData.distances.push( { distance: distance, ref_target: target } );
		}
	});

	// sort the list.. - smallest 1st..  ascending order
	Util.sortByKey( itemData.distances, 'distance' );
};


MovementHelper.getDistance = function( obj1, obj2 )
{
	var xA = obj1.x;
	var yA = obj1.y;
	var xB = obj2.x;
	var yB = obj2.y;

	var xDiff = xA - xB;
	var yDiff = yA - yB;

	return Math.sqrt( ( xDiff * xDiff ) + ( yDiff * yDiff ) );
};


MovementHelper.checkCollision = function( container )
{
	var obj_inCollision;
	var itemData = container.itemData;

	if ( itemData.distances && itemData.distances.length > 0 )
	{
		for ( var i = 0; i < itemData.distances.length; i++ )
		{
			var otherItemDistance = itemData.distances[i];

			// If exists in 'collisionExceptions', do not check the 'targetInTouch'/collision
			if ( itemData.collisionExceptions && itemData.collisionExceptions.find( item => item.target === otherItemDistance.ref_target ) ) { }
			else if ( itemData.color === otherItemDistance.ref_target.itemData.color ) { }  // Same color, no collision..
			else if ( MovementHelper.targetInTouch( otherItemDistance.distance, itemData.width_half, otherItemDistance.ref_target.itemData.width_half ) )
			{
				obj_inCollision = otherItemDistance.ref_target;
				break;
			}
		}
	}

	return obj_inCollision;
};

MovementHelper.targetInTouch = function( distance, currWidth_half, targetWidth_half )
{
	return ( distance <= ( currWidth_half + targetWidth_half ) );
};
