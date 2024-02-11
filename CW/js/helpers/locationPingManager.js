function LocationPingManager() { };

// ------------------------------------

LocationPingManager.LATEST_PING_OBJ;

// ------------------------------------


LocationPingManager.clearExistingPing = function( container, pingObj )
{
	if ( container && pingObj ) // LocationPingManager.LATEST_PING_OBJ )
	{
		try 
		{
			LocationPingManager.LATEST_PING_OBJ = undefined;	

			StageManager.stage.removeChild( pingObj );
		}
		catch( errMsg ) {  console.log( 'ERROR in LocationPingManager.clearExistingPing, ' + errMsg );  }
	}
};


LocationPingManager.pingRandomLocation = function( dataJson, container )
{

	// Need to clear previous ping?
	LocationPingManager.clearExistingPing( container );


	// dist_min: 10, dist_max: INFO.TempVars_distanceRange
	var position = LocationPingManager.getRandomLocation( dataJson );

	var pingObj = new createjs.Container();
	pingObj.x = position.x;
	pingObj.y = position.y;
	LocationPingManager.LATEST_PING_OBJ = pingObj;

	var pingShape = CommonObjManager.drawShape( { existingContainer: pingObj, updateStage: true, color: 'red', width_half: 2 } );

	container.itemData.behaviors.moveTarget = {
		targetObj: pingObj,
		clearConditionEval: [ " ( MovementHelper.getDistance( INFO.TempVars.container, INFO.TempVars.targetObj ) <= LocationPingManager.touchOffset( INFO.TempVars.container )  ) " ],
		clearActionEval: [ " LocationPingManager.clearExistingPing( INFO.TempVars.container, INFO.TempVars.targetObj );  LocationPingManager.pingRandomLocation( { dist_min: 10, dist_max: INFO.TempVars_distanceRange }, INFO.mainObj ); " ] 
	};

	//conditionActions.push( { conditionEval: [], actionEval: [] } );

	// Need to add to array?  add removing concept?
};


LocationPingManager.touchOffset = function( container )
{
	var minOffset = 4;
	var touchDistance = minOffset;

	if ( container.itemData.width_half > ( minOffset + 1 ) )
	{
		touchDistance = container.itemData.width_half - 1; 
	}

	return touchDistance;
};


LocationPingManager.getRandomLocation = function( dataJson )
{
	var canvasHtml = WorldRender.infoJson.canvasHtml;	
	
	// if ( option.type === 'bottomLeft' ) return { x: offset, y: canvasHtml.height - offset };

	var x = Util.getRandomInRange( dataJson.dist_min, dataJson.dist_max ); 
	var y = Util.getRandomInRange( dataJson.dist_min, dataJson.dist_max ); 

	y = canvasHtml.height - y;

	return { x: x, y: y };
};


LocationPingManager.paintPing = function()
{
	// disappear after a couple sections..
};
