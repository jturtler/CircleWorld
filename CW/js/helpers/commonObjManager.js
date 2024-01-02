
function CommonObjManager() { };

CommonObjManager.selectedContainer;
CommonObjManager.selectedContainer_highlightShape;
CommonObjManager.selectedColor = 'green';

CommonObjManager.itemJsonDefault = {
	startPosition: { x: 200, y: 200 }, // position can change afterwards if obj is not in stationary one.
	name: "cmnObj",
	width_half: 8,
	color: 'green',
	speed: 5,
	angle: 90,
	age: 1
};

// ------------------------------------

CommonObjManager.getContainers = function()
{
	return StageManager.getStageChildrenContainers();
};

CommonObjManager.removeAllContainers = function()
{
	StageManager.removeStageChildrenContainers();
};

// -----------------------------------

CommonObjManager.createObj = function ( inputJson )
{
	// 'itemData' create - combine/merge with 'inputJson' data.
	if ( !inputJson ) inputJson = {};
	var itemData = Util.cloneJson( CommonObjManager.itemJsonDefault );
	Util.mergeJson( itemData, inputJson );


	// Create 'container' (children of 'stage') with 'itemData' in it.
	var container = CommonObjManager.createStageItem( itemData ); // return 'container'

	return container; // 'itemData' is part of 'container.
};


CommonObjManager.createStageItem = function (itemData) 
{
	var container = new createjs.Container();

	container.itemData = itemData; // [MANDATORY]
	container.x = itemData.startPosition.x;
	container.y = itemData.startPosition.y;

	if ( itemData.onClick ) container.addEventListener("click", itemData.onClick );
	
	StageManager.stage.addChild( container );

	return container;
};


// ------------------------------------

CommonObjManager.highlightSeconds = function( container, option )
{
	try
	{
		if ( !option ) option = {};
		if ( !option.color ) option.color = 'yellow';
		if ( !option.timeoutSec ) option.timeoutSec = 1;
		if ( !option.shape ) option.shape = 'circle';  // rect, etc..
		if ( !option.sizeRate ) option.sizeRate = 2;
		// shape: 'circle/rect/etc..', timeout
	
		var itemData = container.itemData;
	
		var width_full = itemData.width_half * option.sizeRate;
	
		var highlightShape = new createjs.Shape();
		if ( option.shape === 'rect' )
		{
			var width_double = width_full * 2;
			highlightShape.graphics.setStrokeStyle(1).beginStroke( option.color ).drawRect( -width_full, -width_double, width_double, width_double * 2 );
		}
		else if ( option.shape === 'circle' )
		{	
			highlightShape.graphics.setStrokeStyle(1).beginStroke( option.color ).drawCircle(0, 0, width_full );
		}

		
		container.addChild( highlightShape );
		
		container.ref_highlightShape = highlightShape;	


		setTimeout( () => 
		{
			if ( container.ref_highlightShape )
			{
				container.removeChild( container.ref_highlightShape );  // delete container.ref_highlightShape;
			}
		}, option.timeoutSec * 1000 );
	
	}
	catch( errMsg ) {  console.error( 'ERROR in CommonObjManager.highlightSeconds, ' + errMsg ); }
};


// ---------------------------------

CommonObjManager.clickObjectEvent = function ( e ) 
{
	var container = e.currentTarget;

	if ( container.itemData ) 
	{
		var itemData = container.itemData;
		console.log( itemData );

		WorldRender.spanInfoText( 'Item Selected: ' + itemData.name );


		// Clear other selections..
		CommonObjManager.clearPrevSelection();


		CommonObjManager.selectedContainer = container;
		
		var offset = 4;
		var size = itemData.width_half + offset;
		var widthHeight = size * 2;

		var selectedShape = new createjs.Shape();
		selectedShape.graphics.setStrokeStyle(1).beginStroke( CommonObjManager.selectedColor ).drawRect( -size, -size, widthHeight, widthHeight );	
		container.addChild( selectedShape );

		CommonObjManager.selectedContainer_shape = selectedShape;


		StageManager.stage.update(); // This could be optional
	}
};

CommonObjManager.clearPrevSelection = function () 
{
	if ( CommonObjManager.selectedContainer && CommonObjManager.selectedContainer_shape )
	{
		CommonObjManager.selectedContainer.removeChild( CommonObjManager.selectedContainer_shape );
	}
};
