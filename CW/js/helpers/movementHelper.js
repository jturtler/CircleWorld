function MovementHelper() { };

// ------------------------------------

MovementHelper.detectLineColor = "yellow";
MovementHelper.attackLineColor = "red";
MovementHelper.circleHighlightColor = "red";

MovementHelper.maxTickAngleChange = 0.5;  // max angle change per tick is 5 degree.  If frameRate is 10, we have 10 tick per sec.  thus, 50 degree per sec max changing angle.

MovementHelper.PROXY_LINES = [];

// ------------------------------------

MovementHelper.removeAllProxyLines = function()
{
	if ( MovementHelper.PROXY_LINES.length > 0 ) 
	{
		for ( var i = MovementHelper.PROXY_LINES.length - 1; i >= 0; i--) 
		{ 
			StageManager.stage.removeChild( MovementHelper.PROXY_LINES[i] );
	
			MovementHelper.PROXY_LINES.splice( i, 1 );
		}	
	} 
};

MovementHelper.clearAllDistances = function( containers )
{
	containers.forEach( container => {
		container.itemData.distances = [];
	});
};


// --------------------------------------------

MovementHelper.moveNext = function (container) 
{
	var movementCaseMet = false;

	var itemData = container.itemData;
	var behaviors = itemData.behaviors;
	var attackTarget;

	var movement = MovementHelper.getMovementCalc( itemData.angle, itemData.speed );
	INFO.movementInEval = movement; // For movement change eval from config

	
	// Priority #1. - If 'WallTouched' case, change the 'movement'
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

	
	// Priority #2. If on Object Collision, Bounce/Attack
	//			- Otherwise, check for 'Chase' action
	if ( !movementCaseMet )
	{
		if ( behaviors )
		{
			if ( behaviors.proxyDetection ) 
			{
				// 'distance' to all other object data collection
				itemData.distances = MovementHelper.collectDistances( container, StageManager.getStageChildrenContainers() );

				MovementHelper.performDistanceProxyDraw( container );
			
				attackTarget = MovementHelper.getNearestAttackTarget( container, { linePaint: true, paintColor: MovementHelper.attackLineColor } );	
			}


			// 'behavior' ignore / not active age check
			if ( behaviors.behaviorActivateAge && behaviors.behaviorActivateAge > itemData.age ) { }
			else
			{
				var obj_inCollision = MovementHelper.checkCollision( container );

				if ( obj_inCollision )
				{
					if ( behaviors.chaseAction?.onCollision === 'attack' && attackTarget )
					{
						itemData.statusList.push( 'attack' );

						// Attack 
						MovementHelper.attackAction( container, attackTarget, behaviors.chaseAction ); // Also set for config eval logic

						// Still 'chase' while attacking?
						if ( behaviors.chaseAction?.action === 'chase' )
						{
							var changedData = MovementHelper.setDirection_moveTowardTarget( container, attackTarget, itemData.speed );
							itemData.angle = changedData.newAngle;
							movement = changedData.newMovement;
							movementCaseMet = true;
						}
					}
					else if ( behaviors.onCollision === 'bounce' )
					{
						itemData.statusList.push( 'bounce' );

						// TODO: this is not right...  Need proper Vector collision bounce calculation
						if ( behaviors.bounceLogicEval ) Util.evalTryCatch( behaviors.bounceLogicEval );
						else {  movement.x = -movement.x;  movement.y = -movement.y;	 }
		
						itemData.angle = MovementHelper.getAngle_fromMovement( movement );
		
						// Highlight with circle
						CommonObjManager.highlightSeconds( container, { color: MovementHelper.circleHighlightColor, timeoutSec: 1, shape: 'circle', sizeRate: 1.4 } );
		
						movementCaseMet = true;
					}

				}
				else
				{
					if ( behaviors.chaseAction?.action === 'chase' && attackTarget )
					{
						itemData.statusList.push( 'chase' );

						var changedData = MovementHelper.setDirection_moveTowardTarget( container, attackTarget, itemData.speed );
						itemData.angle = changedData.newAngle;
						movement = changedData.newMovement;
			
						movementCaseMet = true;
					}
				}
			}
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
	if ( list && list.length > 0 )
	{
		for ( var i = list.length - 1; i >= 0; i--) 
		{ 
			list[i].turns--;
			if ( list[i].turns <= 0 ) list.splice( i, 1 );
		}
	}
};

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
// --- Basic Calculation Related Methods

// Part of physics or utils..
MovementHelper.getMovementCalc = function( angle, speed ) 
{
	var movement = {};

	var anglePi = Math.PI * ( angle / 180 );

	movement.x = Math.cos(anglePi) * speed;
	movement.y = Math.sin(anglePi) * speed;

	return movement;
};

// getAngleFromDirectionXY
MovementHelper.getAngle_fromMovement = function( movement )
{
  var angle = ( Math.atan2( movement.y, movement.x ) / Math.PI ) * 180;

  // QUESTION: Why I have to do this? 0 - 270.. somehow, 280 => -10..  () -0 ~ -90
  if ( angle < 0 ) angle = angle + 360;

  return angle;
};


MovementHelper.getAngleToTarget = function( sourceObj, targetObj )
{
  var movementX = targetObj.x - sourceObj.x;
  var movementY = targetObj.y - sourceObj.y;
  
  var angle = ( Math.atan2( movementY, movementX ) / Math.PI ) * 180;

  // QUESTION: Why I have to do this? 0 - 270.. somehow, 280 => -10..  () -0 ~ -90
  if ( angle < 0 )
  {
	 angle = angle + 360;
  }

  return angle;
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


// ---------------------------------------
// --- Distance between objects

// Populating newly created 'distances' obj array data with nearby object detection lines (drawn)
MovementHelper.performDistanceProxyDraw = function ( container )
{
	var itemData = container.itemData;

	if ( itemData.behaviors?.proxyDetection && itemData.distances )
	{
		// Draw lines that falls into the proxy distance..
		var proxyDistance = itemData.behaviors.proxyDetection.proxyDistance;

		if ( proxyDistance )
		{
			for ( var i = 0; i < itemData.distances.length; i++ )
			{
				var distanceJson = itemData.distances[i];
	
				if ( distanceJson.distance <= proxyDistance )
				{
					var ref_line = MovementHelper.checkNGetTargetDistanceLine( container, distanceJson.ref_target );

					// If 'target' has ref_line aready, use that reference in this obj's distanceJson.  Otherwise, create the line & set ref.
					// We are not saving the new line's ref to both objects, since other object probably didn't have distances created, yet.
					if ( ref_line ) distanceJson.ref_line = ref_line;
					else distanceJson.ref_line = MovementHelper.drawProxyLine( container, distanceJson.ref_target, MovementHelper.detectLineColor );
				}
			}	
		}
	}
};


MovementHelper.getNearestAttackTarget = function( container, option )
{
	if ( !option ) option = {};

	// Condition - the target need to be smaller (seems).  The 'line' is shared, however we can flag in the distance?  or in the obj?
	var itemData = container.itemData;
	var attackTarget;

	if ( itemData.behaviors?.proxyDetection && itemData.distances )
	{
		for ( var i = 0; i < itemData.distances.length; i++ )
		{
			var distanceJson = itemData.distances[i];

			// Get nearest object with attack condition. (size equal or smaller)
			if ( distanceJson.ref_line && MovementHelper.checkAttackTarget( container, distanceJson.ref_target ) )
			{
				distanceJson.attackable = true;
				attackTarget = distanceJson.ref_target;

				if ( option.linePaint && distanceJson.ref_line ) MovementHelper.drawLine( distanceJson.ref_line, option.paintColor, container, distanceJson.ref_target );

				break;
			}
		}
	}

	return attackTarget;
};


MovementHelper.checkAttackTarget = function( source, target )
{
	// Also, allow same size object as the target to attach - TODO: Make this configurable..
	return ( source.itemData.color !== target.itemData.color && source.itemData.width_half > target.itemData.width_half );
};


MovementHelper.checkNGetTargetDistanceLine = function( sourceObj, targetObj )
{
	var ref_line;

	var trgDistances = targetObj.itemData.distances;

	if ( trgDistances )
	{
		var distanceJson = trgDistances.find( dst => ( dst.ref_target === sourceObj && dst.ref_line ) );

		if ( distanceJson ) ref_line = distanceJson.ref_line;
	}

	return ref_line;
};

MovementHelper.drawProxyLine = function( sourceObj, targetObj, color ) 
{
	var lineShape;

	try
	{
		lineShape = new createjs.Shape();

		MovementHelper.drawLine( lineShape, color, sourceObj, targetObj );

		StageManager.stage.addChild( lineShape );

		MovementHelper.PROXY_LINES.push( lineShape );
	}
	catch( errMsg ) { console.error( 'ERROR in MovementHelper.drawProxyLine, ' + errMsg ); }

	return lineShape;
};


MovementHelper.drawLine = function( lineShape, color, sourceObj, targetObj ) 
{
	if ( !color ) color = 'yellow';

	lineShape.graphics.clear()
		.setStrokeStyle(1)
		.beginStroke( color )
		.moveTo( sourceObj.x, sourceObj.y )
		.lineTo( targetObj.x, targetObj.y )
		.endStroke();
};

MovementHelper.collectDistances = function( currObj, targets )
{
	var distances = [];

	targets.forEach( target => {

		if ( target != currObj )
		{
			var distance = MovementHelper.getDistance( currObj, target );
			distances.push( { distance: distance, ref_target: target } );
		}
	});

	// sort the list.. - smallest 1st..  ascending order
	Util.sortByKey( distances, 'distance' );

	return distances;
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
				itemData.statusList.push( 'onCollision' );
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


// ------------------------------------------

MovementHelper.setDirection_moveTowardTarget = function( sourceObj, targetObj, speed )
{
  var angleToTarget = MovementHelper.getAngleToTarget( sourceObj, targetObj );

  var angleChange = MovementHelper.getAngleTowardTarget( angleToTarget, sourceObj.itemData.angle, MovementHelper.maxTickAngleChange );

  var newAngle = ( sourceObj.itemData.angle + angleChange + 360 ) % 360;
			 
  var movement = MovementHelper.getMovementCalc( newAngle, speed );

  return { newAngle: newAngle, newMovement: movement};
};

  // paramInputs: 45, 130, 5
  // targetAngle = 45, currentAngle = 130, maxAngle = 5
  // we want to change to 45 evantually..

  // 45 - 130 = -85, but with max 5 at a time, the new angle is 130 - 5

  // 1st is target, 2nd is currAngle..
  // 100 - 30 = 70, but should limit to 5 degree each tick, thus, angle 5, thus, 30 + 5

  // 340 - 10 = 330  <-- but over 180, thus need to go the other way.. (angle direction)  
  //    330 - 360 = -30..  --> -5(max), 10 - 5..   

  // 10 - 350 = -340.  Because less than -180, switch.  -340 + 360 = 20..  

MovementHelper.getAngleTowardTarget = function( targetAngle, currAngle, maxAngle )
{
  // 1. Get simple angle diff number;
  var angleDiff = targetAngle - currAngle;

  // 2. Switch angle diff direction (if large) to smaller angle diff direction.
  if ( angleDiff > 180 ) angleDiff = angleDiff - 360;
  else if ( angleDiff < -180 ) angleDiff = angleDiff + 360;

  // 3. Limit the angle diff to max angle.
  if ( angleDiff > 0 && angleDiff > maxAngle ) angleDiff = maxAngle;
  if ( angleDiff < 0 && angleDiff > (-maxAngle) ) angleDiff = (-maxAngle);

  return angleDiff;
};

// ---------------------------------------

MovementHelper.attackAction = function( attackerObj, targetObj, chaseAction )
{
	INFO.attacterObj = attackerObj;
	INFO.attackedObj = targetObj;

	if ( chaseAction.attackLogicEval ) Util.evalTryCatch( chaseAction.attackLogicEval );
	else
	{
		if ( INFO.attacterObj.itemData.strength >= INFO.attackedObj.itemData.strength ) MovementHelper.ObjStatusChange_SizeStrength( INFO.attacterObj, INFO.attackedObj );
		else MovementHelper.ObjStatusChange_SizeStrength( INFO.attackedObj, INFO.attacterObj );
	}
};

MovementHelper.ObjStatusChange_SizeStrength = function( winner, loser )
{
	// Change stength & size..
	loser.itemData.strength--;
	if ( loser.itemData.strength <= 0 )	{
		loser.itemData.strength = 0;
		loser.itemData.width_half = 0;  // Remove these from ..
	}
	else loser.itemData.width_half -= CircleManager.fightLossSizeChangeRate;

	if ( loser.itemData.width_half < 0 ) loser.itemData.width_half = 0;

	if ( loser.itemData.objType === CircleManager.objType && loser.ref_Shape ) CircleManager.drawCircleShape( loser.ref_Shape, loser.itemData );


	winner.itemData.strength++;
	winner.itemData.width_half += CircleManager.fightWinSizeChangeRate;
	if ( winner.itemData.width_half > CircleManager.circleSizeMax ) winner.itemData.width_half = CircleManager.circleSizeMax;

	if ( winner.itemData.objType === CircleManager.objType && winner.ref_Shape ) CircleManager.drawCircleShape( winner.ref_Shape, winner.itemData );

};