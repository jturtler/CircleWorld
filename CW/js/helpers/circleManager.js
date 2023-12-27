
function CircleManager() { };

// -----------------------------

CircleManager.createCircleItem = function ( dataJson )
{
	if ( !dataJson ) dataJson = {};
	if ( !dataJson.position ) dataJson.position = { x: 100, y: 100 };
	if ( !dataJson.collisionExceptions ) dataJson.collisionExceptions = [];

	var itemData = {};  

	itemData.objType = 'circle'; 
	itemData.name = 'Mark';  // 'team color name' + 1/2/3..
	itemData.speed = Util.getRandomInRange(5, 8);  // TODO: 'Sample' itemData should be used later..
	itemData.width_half = Util.getRandomInRange(8, 13); // radius..  // [MANDATORY]
	itemData.color = ( dataJson.color ) ? dataJson.color: "black"; 
	itemData.angle = Util.getRandomInRange( 0, 360 );  // movementX, movementY; <-- can be calculated by speed, angle. 
	itemData.innerCircle = { width_half: 4, color: Util.getRandomColorHex() };
	itemData.behaviors = {
		collectDistances: true,
		onCollision: 'bounce'
	}

	itemData.collisionExceptions = dataJson.collisionExceptions; //: [ { target: container, count: 1 } ]


	itemData.runAction = ( container, itemData ) => MovementHelper.moveNext( container );
	
	CircleManager.createCircleStageItem( itemData, dataJson.position );
};


CircleManager.createCircleStageItem = function (itemData, position) 
{
	var container = new createjs.Container();

	var shape = new createjs.Shape();
	shape.graphics.beginFill(itemData.color).drawCircle(0, 0, itemData.width_half);
	container.ref_Shape = shape;
	container.addChild( shape );

	if ( itemData.innerCircle )
	{
		var innerCircleShape = new createjs.Shape();
		innerCircleShape.graphics.beginFill( itemData.innerCircle.color ).drawCircle(0, 0, itemData.innerCircle.width_half );
		container.ref_innerCircleShape = innerCircleShape;
		container.addChild( innerCircleShape );
	}

	container.itemData = itemData; // [MANDATORY]
	container.x = position.x;
	container.y = position.y;


	container.addEventListener("click", CommonObjManager.clickObjectEvent );
	

	// Add 'container' to 'createjs' stage
	StageManager.stage.addChild(container);

	// Immediately show the object/container/item added
	// StageManager.stage.update();
};


// ---------------------------------
