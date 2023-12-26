
function CircleManager() { };

CircleManager.selectedContainer;
CircleManager.selectedContainer_highlightShape;
CircleManager.highlightColor = 'yellow';

// -----------------------------

CircleManager.createCircleItem = function ( dataJson )
{
	if ( !dataJson ) dataJson = {};
	if ( !dataJson.position ) dataJson.position = { x: 100, y: 100 };

	var item = StageObjectBuilder.createCircle( dataJson );

	CircleManager.createCircleStageItem( item, dataJson.position );
};


CircleManager.createCircleStageItem = function (item, position) 
{
	var subShape;

	var shape = new createjs.Shape();
	shape.graphics.beginFill(item.color).drawCircle(0, 0, item.size);

	//var label = new createjs.Text(item.name, 'normal 10px Arial', 'White');
	//label.textAlign = 'center';
	//label.textBaseline = 'middle';

	if ( item.subObj )
	{
		subShape = new createjs.Shape();
		subShape.graphics.beginFill(item.subObj.color).drawCircle(0, 0, item.subObj.size);
	}

	// container - grouping of 
	var container = new createjs.Container();
	container.itemData = item;

	container.x = position.x;
	container.y = position.y;


	// Add to 'container
	container.addChild( shape );
	if ( subShape ) container.addChild( subShape );
	//container.addChild( shapeRect );


	container.addEventListener("click", CircleManager.clickObjectEvent );
	

	// Add 'container' to 'createjs' stage
	StageManager.stage.addChild(container);


	// Immediately show the object/container/item added
	StageManager.stage.update();
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

		var shape = new createjs.Shape();
		shape.graphics.setStrokeStyle(1).beginStroke( CircleManager.highlightColor ).drawRect( -size, -size, widthHeight, widthHeight );	
		container.addChild( shape );

		CircleManager.selectedContainer_highlightShape = shape;


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
