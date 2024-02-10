function LocationPingManager() { };

// ------------------------------------

LocationPingManager.PROXY_LINES = [];
LocationPingManager.TEMP_LINES = [];

// ------------------------------------

LocationPingManager.pingRandomLocation = function( dataJson )
{
	// dist_min: 10, dist_max: INFO.TempVars_distanceRange
	var position = LocationPingManager.getRandomLocation( dataJson );

	var container = new createjs.Container();
	container.x = position.x;
	container.y = position.y;

	CommonObjManager.drawShape( { existingContainer: container, updateStage: true, color: 'red', width_half: 2 } );

	// Need to add to array?  add removing concept?
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
