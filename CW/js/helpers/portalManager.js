
function PortalManager() { };

// ------------------------------------
PortalManager.objType = 'portal';
PortalManager.portalTeamColors = [ 'blue', 'orange', 'gray', 'white' ];
PortalManager.PortalPositionOffset = 100;
PortalManager.portalSpawnFrequency = 40; //StageManager.framerate * 2;
PortalManager.remainSpawnNum = 15; //StageManager.framerate * 2;


PortalManager.portalProp_DEFAULT = {
	name: " CommonObjManager.getUniqueObjName( { type: PortalManager.objType } ); ",
	width_half: 8,
	speed: 0,
	strength: 1000,
	strengthChangeRate: 0,	
	color: " INFO.TempVars_color = PortalManager.getNextPortalTeamColor( PortalManager.getPortalContainers().length ); INFO.TempVars_color; ",
	team: " INFO.TempVars_color; ",

	spawnFreqency: PortalManager.portalSpawnFrequency, // every 3 tick, create new itemData..
	remainSpawnNum: PortalManager.remainSpawnNum,
	positionFixed: false,
	spawnCircleProp: { },
	onObjCreate_EvalFields: [ "itemData.name", "itemData.color", "itemData.team" ]	
};

// ------------------------------------

PortalManager.getPortalContainers = function()
{
	return StageManager.getStageChildrenContainers( PortalManager.objType );
};

PortalManager.removeAllPortalContainers = function()
{
	StageManager.removeStageChildrenContainers( PortalManager.objType );
};

// ------------------------------------

PortalManager.createPortalObj = function ( inputJson )
{
	if ( !inputJson ) inputJson = {};
 
	var portalProp = ( INFO.baseProtalProp ) ? Util.cloneJson( INFO.baseProtalProp ): Util.cloneJson( PortalManager.portalProp_DEFAULT );
	Util.mergeJson( portalProp, inputJson );
	
	Util.onObjCreate_EvalFields( portalProp );


	// Get 'itemData' & 'container' created by common method.
	var container = CommonObjManager.createObj( portalProp );

	var itemData = container.itemData;
	itemData.objType = PortalManager.objType;


	// -- SET EVENTS SECTION ---
	//		- Default event handler ('onFrameMove', 'onClick' )
	itemData.onFrameMove_ClassBase = container => {};
	if ( !itemData.onCanvasSizeChanged ) itemData.onCanvasSizeChanged = container => PortalManager.repositionContainer( container );
	if ( !itemData.onFrameMove ) itemData.onFrameMove = container => PortalManager.spawnCircle( container );
	if ( !itemData.onClick ) itemData.onClick = ( e ) => {  CommonObjManager.clickObjectEvent( e );  };
	if ( !itemData.onDblClick ) itemData.onDblClick = ( e ) => {  CommonObjManager.dblClickObjectEvent( e );  };

	if ( itemData.onClick ) container.addEventListener("click", itemData.onClick );
	if ( itemData.onDblClick ) container.addEventListener("dblclick", itemData.onDblClick );
	
	PortalManager.repositionPortals( PortalManager.getPortalContainers() ); // When portal number increases, reposition the portal positions.

	PortalManager.setPortalShapes( container );

	return container;
};


PortalManager.setPortalShapes = function ( container ) 
{
	var itemData = container.itemData;

	var width_full = itemData.width_half * 2;

	// 'Portal' Shape Add
	var shape = new createjs.Shape();
	shape.graphics.beginFill(itemData.color).drawRect( -itemData.width_half, -width_full, width_full, width_full * 2 );
	container.ref_ShapeRect = shape;
	container.addChild( shape );

	// 'Portal' Label Add
	var label = new createjs.Text( itemData.remainSpawnNum, 'normal 10px Arial', 'White');
	label.textAlign = 'center';
	label.textBaseline = 'middle';
	container.ref_Label = label;
	container.addChild( label );
};


PortalManager.spawnCircle = function ( container )
{
	var itemData = container.itemData;

	if ( ( StageManager.frameCount % itemData.spawnFreqency ) === 0 )
	{
		if ( itemData.remainSpawnNum > 0 )
		{
			// Spawn Circle Item/Object <-- every 3 frame?  <-- Need global frame count..

			var spawnCircleProp = Util.cloneJson( itemData.spawnCircleProp );
			spawnCircleProp.color = itemData.color;
			spawnCircleProp.team = itemData.team;			
			spawnCircleProp.startPosition = { x: container.x, y: container.y };
			//spawnCircleProp.collisionExceptions = [ { target: container, turns: 4 } ];  // <-- circular loop on Util.traverseEval
			spawnCircleProp.onObjCreate_EvalFields_Exceptions = [ 'itemData.color', 'itemData.team', 'itemData.startPosition' ];

			var circleObj = CircleManager.createCircleObj( spawnCircleProp );
			itemData.remainSpawnNum--;

			MovementHelper.collisionExceptions_Add( circleObj.itemData, container );


			// Label change
			if ( container.ref_Label ) container.ref_Label.text = itemData.remainSpawnNum;

			CommonObjManager.highlightForPeriod( container, { color: 'yellow', shape: 'rect', sizeRate: 2, sizeOffset: 1 } );
		}
	}
};


PortalManager.repositionContainer = function( container )
{
	if ( container.itemData.portalTypeData )
	{
		var position = PortalManager.getPortalPosition( container.itemData.portalTypeData, WorldRender.infoJson.canvasHtml );

		container.x = position.x;
		container.y = position.y;	
	}
};


// TODO: Change this..
PortalManager.getPortalsPosition = function ()
{
	var position = {};
	var offset = 150;

	var positionEval = portalPosition.positionEval
	var positionName = portalPosition.position;

	if ( positionEval ) {
		position = positionEval();
	}
	else
	{
		if ( positionName === 'leftTop' ) { position.x = offset;  position.y = offset; }
		else if ( positionName === 'rightTop' ) { position.x = canvasHtml.width - offset;  position.y = offset; }
		else if ( positionName === 'rightBottom' ) { position.x = canvasHtml.width - offset;  position.y = canvasHtml.height - offset; }
		else if ( positionName === 'leftBottom' ) { position.x = offset;  position.y = canvasHtml.height - offset; }	
	}

	return position;
};


PortalManager.getNextPortalTeamColor = function ( portalNumber )
{
	var newColorIdx = portalNumber % PortalManager.portalTeamColors.length;

	return PortalManager.portalTeamColors[ newColorIdx ];
};


PortalManager.repositionPortals = function( portalContainerList )
{
	// RePosition only the ones without 'positionFixed': true.
	var containers = portalContainerList.filter( container => ( !container.itemData.positionFixed ) );
	var offset = 100;

	var positionCenter = AppUtil.getPosition_Center();
	var canvasHtml = WorldRender.infoJson.canvasHtml;


	if ( containers.length === 1 ) Util.mergeJson( containers[0], positionCenter );
	else if ( containers.length === 2 )
	{
		Util.mergeJson( containers[0], { x: offset, y: positionCenter.y } );
		Util.mergeJson( containers[1], { x: canvasHtml.width - offset, y: positionCenter.y } );
	}
	else if ( containers.length === 3 )
	{
		Util.mergeJson( containers[0], { x: offset, y: offset } );
		Util.mergeJson( containers[1], { x: canvasHtml.width - offset, y: offset } );
		Util.mergeJson( containers[2], { x: canvasHtml.width - offset, y: canvasHtml.height - offset } );
	}
	else if ( containers.length === 4 )
	{
		Util.mergeJson( containers[0], { x: offset, y: offset } );
		Util.mergeJson( containers[1], { x: canvasHtml.width - offset, y: offset } );
		Util.mergeJson( containers[2], { x: canvasHtml.width - offset, y: canvasHtml.height - offset } );
		Util.mergeJson( containers[3], { x: offset, y: canvasHtml.height - offset } );
	}
	else if ( containers.length === 5 )
	{
		Util.mergeJson( containers[0], { x: offset, y: offset } );
		Util.mergeJson( containers[1], { x: canvasHtml.width - offset, y: offset } );
		Util.mergeJson( containers[2], { x: canvasHtml.width - offset, y: canvasHtml.height - offset } );
		Util.mergeJson( containers[3], { x: offset, y: canvasHtml.height - offset } );
		Util.mergeJson( containers[4], positionCenter );
	}
	else if ( containers.length > 6 )
	{
		Util.mergeJson( containers[0], { x: offset, y: offset } );
		Util.mergeJson( containers[1], { x: canvasHtml.width - offset, y: offset } );
		Util.mergeJson( containers[2], { x: canvasHtml.width - offset, y: canvasHtml.height - offset } );
		Util.mergeJson( containers[3], { x: offset, y: canvasHtml.height - offset } );
		Util.mergeJson( containers[4], positionCenter );

		for ( var i = 5; i < containers.length; i++ ) {  Util.mergeJson( containers[i], AppUtil.getPosition_Random() );  }
	}
};
