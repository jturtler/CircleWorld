function MovementHelper() { };

// ------------------------------------

MovementHelper.PROXY_LINES = [];
MovementHelper.TEMP_LINES = [];

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
	var chaseTarget;

	var movement = MovementHelper.getMovementCalc( itemData.angle, itemData.speed );
	var INFO_G_C = INFO.ObjSettings.CircleSettings;

	
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
			// 'distance' to all other object data collection - even needed for collison check
			itemData.distances = MovementHelper.collectDistances( container, StageManager.getStageChildrenContainers() );

			if ( behaviors.proxyDetection && INFO_G_C.proxyDetectionLogic ) 
			{
				MovementHelper.performDistanceProxyDraw( container, INFO_G_C.proxyDetectionLogic );
			
				chaseTarget = MovementHelper.getNearestChaseTarget( container, INFO_G_C.chaseActionLogic );
			}
			

			// onCollison or onChase
			var inCollisionObj = MovementHelper.checkCollision( container );

			if ( inCollisionObj )
			{
				if ( chaseTarget && inCollisionObj === chaseTarget && behaviors.chaseAction && INFO_G_C.chaseActionLogic?.onCollision === 'fight' )
				{
					itemData.statusList.push( 'fight' );

					// Attack 
					MovementHelper.fightAction( container, chaseTarget ); // Also set for config eval logic

					// Still 'chase' while attacking?
					var changedData = MovementHelper.setDirection_moveTowardTarget( container, chaseTarget, itemData.speed );
					itemData.angle = changedData.newAngle;
					movement = changedData.newMovement;
					movementCaseMet = true;
				}
				else if ( behaviors.bounceAction && INFO_G_C.bounceActionLogic )
				{
					itemData.statusList.push( 'bounce' );

					// TODO: this is not right...  Need proper Vector collision bounce calculation
					if ( INFO_G_C.bounceActionLogic.bounceLogicEval ) {
						Util.evalTryCatch( INFO_G_C.bounceActionLogic.bounceLogicEval, { INFO_TempVars: { movement: movement, obj: container } } );
					}
					// else {  movement.x = -movement.x;  movement.y = -movement.y;  }
	
					itemData.angle = MovementHelper.getAngle_fromMovement( movement );
			
					// After one 'bounce' collision, add to the collisionList for avoiding collision with this item for some ticks.
					MovementHelper.collisionExceptions_Add( itemData, inCollisionObj );

					movementCaseMet = true;
				}
			}
			else
			{
				if ( chaseTarget && behaviors.chaseAction && INFO_G_C.chaseActionLogic )
				{
					itemData.statusList.push( 'chase' );

					var changedData = MovementHelper.setDirection_moveTowardTarget( container, chaseTarget, itemData.speed );
					itemData.angle = changedData.newAngle;
					movement = changedData.newMovement;
		
					movementCaseMet = true;
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


MovementHelper.collisionExceptions_Add = function( itemData, inCollisionObj )
{
	if ( !itemData.collisionExceptions ) itemData.collisionExceptions = [];

	Util.RemoveFromArrayAll( itemData.collisionExceptions, 'obj', inCollisionObj, { runFunc: ( item ) => {
		clearTimeout( item.timeoutRef );
	} } );
	
	var timeoutRef = setTimeout(() => {
		Util.RemoveFromArrayAll( itemData.collisionExceptions, 'obj', inCollisionObj );		
	}, 500 );

	itemData.collisionExceptions.push( { obj: inCollisionObj, timeoutRef: timeoutRef } );
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

	movement.x = Util.decimalSet( Math.cos(anglePi) * speed, 2 );
	movement.y = Util.decimalSet( Math.sin(anglePi) * speed, 2 );

	return movement;
};

// getAngleFromDirectionXY
MovementHelper.getAngle_fromMovement = function( movement )
{
  var angle = Util.decimalSet( ( Math.atan2( movement.y, movement.x ) / Math.PI ) * 180, 2 );

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

	return Util.decimalSet( Math.sqrt( ( xDiff * xDiff ) + ( yDiff * yDiff ) ), 2 );
};


// ---------------------------------------
// --- Distance between objects

// Populating newly created 'distances' obj array data with nearby object detection lines (drawn)
MovementHelper.performDistanceProxyDraw = function ( container, proxyDetectionLogic )
{
	var itemData = container.itemData;

	if ( itemData.behaviors?.proxyDetection && itemData.distances )
	{
		// Draw lines that falls into the proxy distance..
		var proxyDistance = INFO.ObjSettings.CircleSettings.proxyDetectionLogic.proxyDistance;
		if ( itemData.behaviors.proxyDistance ) proxyDistance = itemData.behaviors.proxyDistance;

		if ( proxyDistance )
		{
			for ( var i = 0; i < itemData.distances.length; i++ )
			{
				var distanceJson = itemData.distances[i];
	
				if ( distanceJson.distance <= proxyDistance )
				{
					distanceJson.proxyDetected = true;

					if ( proxyDetectionLogic.showDetectionLines )
					{
						var ref_line = MovementHelper.checkNGetTargetDistanceLine( container, distanceJson.ref_target );

						// 'ref_line' could be in either source or target obj's distances. If in other obj, reuse that to get 'ref_line'.
						if ( ref_line ) distanceJson.ref_line = ref_line;
						else distanceJson.ref_line = MovementHelper.drawProxyLine( container, distanceJson.ref_target, proxyDetectionLogic.detectionLineColor );	
					}
				}
			}	
		}
	}
};


MovementHelper.getNearestChaseTarget = function( container, chaseActionLogic )
{
	// Condition - the target need to be smaller (seems).  The 'line' is shared, however we can flag in the distance?  or in the obj?
	var itemData = container.itemData;
	var chaseTarget;

	if ( itemData.behaviors?.proxyDetection && itemData.distances )
	{
		for ( var i = 0; i < itemData.distances.length; i++ )
		{
			var distanceJson = itemData.distances[i];

			// Get nearest object with attack condition. (size equal or smaller)
			if ( distanceJson.proxyDetected && MovementHelper.checkChaseTarget( container, distanceJson.ref_target ) )
			{
				distanceJson.chasable = true;
				chaseTarget = distanceJson.ref_target;

				if ( !distanceJson.ref_line ) distanceJson.ref_line = MovementHelper.drawProxyLine( container, distanceJson.ref_target, chaseActionLogic.chaseLineColor );				
				else MovementHelper.drawLine( distanceJson.ref_line, chaseActionLogic.chaseLineColor, container, distanceJson.ref_target );

				break;
			}
		}
	}

	return chaseTarget;
};


MovementHelper.checkChaseTarget = function( sourceObj, targetObj )
{
	var chaseTargetEval = INFO.ObjSettings.CircleSettings.chaseActionLogic.chaseTargetEval;

	if ( chaseTargetEval ) return Util.evalTryCatch( chaseTargetEval, { INFO_TempVars: { srcObj: sourceObj, trgObj: targetObj } } );
	// else return ( sourceObj.itemData.color !== targetObj.itemData.color && sourceObj.itemData.width_half > targetObj.itemData.width_half );
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
	var inCollisionObj;
	var itemData = container.itemData;

	if ( itemData.distances && itemData.distances.length > 0 )
	{
		for ( var i = 0; i < itemData.distances.length; i++ )
		{
			var distanceJson = itemData.distances[i];

			// If exists in 'collisionExceptions', do not check the 'targetInCollision'/collision
			
			if ( itemData.collisionExceptions && itemData.collisionExceptions.find( item => item.obj === distanceJson.ref_target ) ) { }
			else if ( itemData.color === distanceJson.ref_target.itemData.color ) { }  // Same color, no collision..
			else if ( MovementHelper.targetInCollision( distanceJson.distance, itemData.width_half, distanceJson.ref_target.itemData.width_half ) )
			{
				inCollisionObj = distanceJson.ref_target;
				itemData.statusList.push( 'inCollision' );
				break;
			}
		}
	}

	return inCollisionObj;
};

MovementHelper.targetInCollision = function( distance, currWidth_half, targetWidth_half )
{
	return ( distance <= ( currWidth_half + targetWidth_half ) );
};


// ------------------------------------------

MovementHelper.setDirection_moveTowardTarget = function( sourceObj, targetObj, speed )
{
  var angleToTarget =  Util.decimalSet( MovementHelper.getAngleToTarget( sourceObj, targetObj ), 2 );

  var angleChange = MovementHelper.getAngleTowardTarget( angleToTarget, sourceObj.itemData.angle, INFO.ObjSettings.CircleSettings.chaseActionLogic.angleChangeMax_perTick );

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

MovementHelper.fightAction = function( attackerObj, attackedObj )
{
	if ( attackerObj.itemData.strength >= attackedObj.itemData.strength ) CircleManager.fightObjStatusChange( attackerObj, attackedObj );
	else CircleManager.fightObjStatusChange( attackedObj, attackerObj );
};
