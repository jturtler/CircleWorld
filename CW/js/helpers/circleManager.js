
function CircleManager() { };

CircleManager.selectedContainer;
CircleManager.selectedContainer_highlightShape;
CircleManager.highlightColor = 'yellow';

// -----------------------------

CircleManager.createCircleItem = function ( dataJson )
{
	if ( !dataJson ) dataJson = {};
	if ( !dataJson.position ) dataJson.position = { x: 100, y: 100 };

	var item = {};  

	item.objType = 'circle'; 
	item.name = 'Mark';  // 'team color name' + 1/2/3..
	item.speed = Util.getRandomInRange(5, 8);  // TODO: 'Sample' item should be used later..
	item.size = Util.getRandomInRange(8, 13); //Util.getRandomInRange(4, 7); // radius	
	item.color = ( dataJson.color ) ? dataJson.color: "black"; 
	item.angle = Util.getRandomInRange( 0, 360 );  // movementX, movementY; <-- can be calculated by speed, angle. 
	item.innerCircle = { size: 4, color: Util.getRandomColorHex() };

	item.runAction = ( container, itemData ) => MovementHelper.moveNext(container);
	
	CircleManager.createCircleStageItem( item, dataJson.position );
};


CircleManager.createCircleStageItem = function (item, position) 
{
	var container = new createjs.Container();

	var shape = new createjs.Shape();
	shape.graphics.beginFill(item.color).drawCircle(0, 0, item.size);
	container.ref_Shape = shape;
	container.addChild( shape );

	if ( item.innerCircle )
	{
		var innerCircleShape = new createjs.Shape();
		innerCircleShape.graphics.beginFill( item.innerCircle.color ).drawCircle(0, 0, item.innerCircle.size );
		container.ref_innerCircleShape = innerCircleShape;
		container.addChild( innerCircleShape );
	}


	container.itemData = item;
	container.x = position.x;
	container.y = position.y;


	container.addEventListener("click", CircleManager.clickObjectEvent );
	

	// Add 'container' to 'createjs' stage
	StageManager.stage.addChild(container);

	// Immediately show the object/container/item added
	// StageManager.stage.update();
};


CircleManager.clickObjectEvent = function ( e ) 
{
	var container = e.currentTarget;

	if ( container.itemData ) 
	{
		var item = container.itemData;
		console.log( item );


		// Clear other selections..
		CircleManager.clearPrevSelection();


		CircleManager.selectedContainer = container;
		
		var offset = 4;
		var size = item.size + offset;
		var widthHeight = size * 2;

		var highlightShape = new createjs.Shape();
		highlightShape.graphics.setStrokeStyle(1).beginStroke( CircleManager.highlightColor ).drawRect( -size, -size, widthHeight, widthHeight );	
		container.addChild( highlightShape );

		CircleManager.selectedContainer_highlightShape = highlightShape;


		StageManager.stage.update();
	}
};

CircleManager.clearPrevSelection = function () 
{
	if ( CircleManager.selectedContainer && CircleManager.selectedContainer_highlightShape )
	{
		CircleManager.selectedContainer.removeChild( CircleManager.selectedContainer_highlightShape );
	}
};

// ---------------------------------
