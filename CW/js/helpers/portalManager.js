
function PortalManager() { };


PortalManager.portalTeamColors = [ 'blue', 'red', 'gray', 'green' ];
PortalManager.portalTypeIdx = 0; // Create 'Portal' class?
PortalManager.portalTypes = [ 
	{ color: PortalManager.portalTeamColors[0], position: 'leftTop', positionEval: function() { return { x: PortalManager.PortalPositionOffset, y: PortalManager.PortalPositionOffset } } },
	{ color: PortalManager.portalTeamColors[1], position: 'rightTop' }, 
	{ color: PortalManager.portalTeamColors[2], position: 'rightBottom' }, 
	{ color: PortalManager.portalTeamColors[3], position: 'leftBottom' } 
];  // Use eval in here instead..

PortalManager.PortalPositionOffset = 100;

// position 2 types..
PortalManager.portalSpawnFrequency = 40; //StageManager.framerate * 2;
PortalManager.remainSpawnNum = 15; //StageManager.framerate * 2;


PortalManager.createPortalItem = function ()
{
	// Each one will get each color from list..  'red', 'blue', 'gray', 'green' // 'yellow'??	
	PortalManager.portalTypeIdx++;
	if ( PortalManager.portalTypeIdx >= PortalManager.portalTypes.length ) PortalManager.portalTypeIdx = 0; 

	var portalTypeData = PortalManager.portalTypes[ PortalManager.portalTypeIdx ];  // { color: 'blue' }


	// Create a portal item
	var position = PortalManager.getPortalPosition( portalTypeData, WorldRender.infoJson.canvasHtml );

	var itemData = { };  //  x: position.x, y: position.y - Only used once when adding to stage..  Will be changed afterwards..
	
	itemData.color = portalTypeData.color;
	itemData.width_half = 6; // [MANDATORY]
	itemData.spawnFreqency = PortalManager.portalSpawnFrequency; // every 3 tick, create new itemData..
	itemData.objType = 'portal';
	itemData.name = 'portal_' + portalTypeData.color;
	itemData.portalIdx = PortalManager.portalTypeIdx;
	itemData.portalTypeData = portalTypeData;
	itemData.remainSpawnNum = PortalManager.remainSpawnNum;

	itemData.runAction = ( container, itemData ) => 
	{
		if ( ( StageManager.frameCount % itemData.spawnFreqency ) === 0 )
		{
			if ( itemData.remainSpawnNum > 0 )
			{
				// Spawn Circle Item/Object <-- every 3 frame?  <-- Need global frame count..
				// PortalManager.spawnCircle( itemData, position );
				CircleManager.createCircleItem( { color: itemData.color, position: { x: container.x, y: container.y }, collisionExceptions: [ { target: container, turns: 4 } ] } );
				itemData.remainSpawnNum--;

				// Label change
				if ( container.ref_Label ) container.ref_Label.text = itemData.remainSpawnNum;

				CommonObjManager.highlightSeconds( container, { color: 'yellow', timeoutSec: 1, shape: 'rect', sizeRate: 1.5 } );
			}
		}
	};

	PortalManager.createStagePortalItem( itemData, position );
};


PortalManager.createStagePortalItem = function ( itemData, position ) 
{
	var container = new createjs.Container();

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


	// container - grouping of 
	container.itemData = itemData; // [MANDATORY]
	container.x = position.x;
	container.y = position.y;


	// container.addEventListener( "click", function() { } );

	container.canvasSizeChanged = () =>
	{
		if ( container && container.itemData && container.itemData.portalTypeData )
		{
			var position = PortalManager.getPortalPosition( container.itemData.portalTypeData, WorldRender.infoJson.canvasHtml );

			container.x = position.x;
			container.y = position.y;	
		}
	};
	

	// -------------------
	StageManager.stage.addChild(container);

	//StageManager.stage.update();
};


PortalManager.getPortalPosition = function ( portalPosition, canvasHtml )
{
	var position = {};
	var offset = 100;

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


// ---------------------------------
