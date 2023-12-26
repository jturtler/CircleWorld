
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

	var item = { };  //  x: position.x, y: position.y - Only used once when adding to stage..  Will be changed afterwards..
	
	item.color = portalTypeData.color;
	item.size = 14;
	item.spawnFreqency = PortalManager.portalSpawnFrequency; // every 3 tick, create new item..
	item.objType = 'portal';
	item.name = 'portal_' + portalTypeData.color;
	item.portalIdx = PortalManager.portalTypeIdx;
	item.portalTypeData = portalTypeData;
	item.remainSpawnNum = PortalManager.remainSpawnNum;

	item.runAction = ( container, itemData ) => 
	{
		if ( ( StageManager.frameCount % itemData.spawnFreqency ) === 0 )
		{
			if ( itemData.remainSpawnNum > 0 )
			{
				// Spawn Circle Item/Object <-- every 3 frame?  <-- Need global frame count..
				// PortalManager.spawnCircle( itemData, position );
				CircleManager.createCircleItem( { color: itemData.color, position: { x: container.x, y: container.y } } );
				itemData.remainSpawnNum--;

				PortalManager.highlightSeconds( container, { color: 'yellow', timeoutSec: 2 } );
			}
		}
	};

	PortalManager.createStagePortalItem( item, position );
};


PortalManager.createStagePortalItem = function ( item, position ) 
{
	var shape = new createjs.Shape();
	shape.graphics.beginFill(item.color).drawRect( -(item.size/2), -item.size, item.size, item.size * 2 );


	// container - grouping of 
	var container = new createjs.Container();
	container.itemData = item;

	container.x = position.x;
	container.y = position.y;


	// Add to 'container
	container.addChild( shape );
	// if ( subShape ) container.addChild( subShape );
	//container.addChild( shapeRect );


	// container.addEventListener("click", PortalManager.clickObjectEvent );
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

	StageManager.stage.update();
};


// Should be common method?
PortalManager.highlightSeconds = function( container, option )
{
	try
	{
		if ( !option ) option = {};
		if ( !option.color ) option.color = 'yellow';
		if ( !option.timeoutSec ) option.timeoutSec = 2;
		// shape: 'circle/rect/etc..', timeout
	
		var item = container.itemData;
	
		var size = item.size;
		var sizeDouble = size * 2;
	
		var highlightShape = new createjs.Shape();
		highlightShape.graphics.setStrokeStyle(1).beginStroke( option.color ).drawRect( -size, -sizeDouble, sizeDouble, sizeDouble * 2 );	
		
		container.addChild( highlightShape );
		StageManager.stage.update();
		
		container.highlightShape = highlightShape;	

	
		container.timeoutCall = ( container ) => {
			if ( container.highlightShape )
			{
				container.removeChild( container.highlightShape );
				delete container.highlightShape;
				StageManager.stage.update();
			}
		};
	
		setTimeout( () => {
			if ( container.timeoutCall ) {
				container.timeoutCall( container );
				delete container.timeoutCall;
			}
		}, option.timeoutSec * 1000 );
	
	}
	catch( errMsg ) {  console.error( 'ERROR in PortalManager.highlightSeconds, ' + errMsg ); }
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
