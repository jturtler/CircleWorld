
function PortalManager() { };

// ------------------------------------

PortalManager.portalTeamColors = [ 'blue', 'red', 'gray', 'green' ];
PortalManager.PortalPositionOffset = 100;
PortalManager.portalSpawnFrequency = 40; //StageManager.framerate * 2;
PortalManager.remainSpawnNum = 15; //StageManager.framerate * 2;

PortalManager.containerList = []; // Keep all the created containers here..

// ------------------------------------

PortalManager.clearData = function()
{
	PortalManager.containerList = [];
};


PortalManager.createPortalItem = function ( inputJson )
{
	if ( !inputJson ) inputJson = {};
 
	// Portal related 'itemData' default - overwritten by 'inputJson' is has any of the properties..
	var portalItemData = {
		name: 'portal_' + CommonObjManager.containerList.length, // Could be, ideally, set like 'circle_blue_1'
		width_half: 7,
		color: PortalManager.getNextPortalTeamColor( PortalManager.containerList.length ),
		spawnFreqency: PortalManager.portalSpawnFrequency, // every 3 tick, create new itemData..
		remainSpawnNum: PortalManager.remainSpawnNum,
		positionFixed: false,
		spawnCircleProp: {
			protectedUntilAge: 4,
			innerCircle: {
				addAge: 10,
				width_half: 4,
				color: Util.getRandomColorHex()
			}
		}		
	};
	Util.mergeJson( portalItemData, inputJson );
	
	Util.EVAL_OnCreate( portalItemData );


	// Get 'itemData' & 'container' created by common method.
	var container = CommonObjManager.createItem( portalItemData );

	var itemData = container.itemData;
	itemData.objType = 'portal';


	// -- SET EVENTS SECTION ---
	//		- Default event handler ('onFrameMove', 'onClick' )
	itemData.onFrameMove_ClassBase = container => {};
	if ( !itemData.onFrameMove ) itemData.onFrameMove = container => PortalManager.spawnCircle( container );
	if ( !itemData.onClick ) itemData.onClick = ( e ) => {  CommonObjManager.clickObjectEvent( e );  };
	if ( !itemData.onCanvasSizeChanged ) itemData.onCanvasSizeChanged = container => PortalManager.repositionContainer( container );
	if ( itemData.onClick ) container.addEventListener("click", itemData.onClick );


	PortalManager.containerList.push( container );
	
	PortalManager.repositionPortals( PortalManager.containerList ); // When portal number increases, reposition the portal positions.

	PortalManager.setPortalContainer( container );

	return container;
};


PortalManager.setPortalContainer = function ( container ) 
{
	var itemData = container.itemData;

	var width_full = itemData.width_half * 2;

	// 'Portal' Shape Add
	var shape = new createjs.Shape();
	shape.graphics.beginFill(itemData.color).drawRect( -itemData.width_half, -width_full, width_full, width_full * 2 );
	container.ref_Shape = shape;
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
			spawnCircleProp.startPosition = { x: container.x, y: container.y };
			spawnCircleProp.collisionExceptions = [ { target: container, turns: 4 } ];  // <-- circular loop on Util.traverseEval

			CircleManager.createCircleItem( spawnCircleProp );
			itemData.remainSpawnNum--;

			// Label change
			if ( container.ref_Label ) container.ref_Label.text = itemData.remainSpawnNum;

			CommonObjManager.highlightSeconds( container, { color: 'yellow', timeoutSec: 1, shape: 'rect', sizeRate: 1.5 } );
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
