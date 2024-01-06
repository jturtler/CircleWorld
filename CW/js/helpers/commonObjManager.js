
function CommonObjManager() { };

CommonObjManager.selectedContainer;
CommonObjManager.selectedContainer_shape;
CommonObjManager.selectedColor = 'green';

CommonObjManager.createdObjCount = 0;
CommonObjManager.objNameIndex = 0;
CommonObjManager.objNameList = [];

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

// TODO: Should be obsolete?
CommonObjManager.getContainers = function()
{
	return StageManager.getStageChildrenContainers();
};

CommonObjManager.removeAllContainers = function()
{
	StageManager.removeStageChildrenContainers();
};

CommonObjManager.resetData = function()
{
	CommonObjManager.createdObjCount = 0;
	CommonObjManager.objNameIndex = 0;
	CommonObjManager.objNameList = [];
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

	CommonObjManager.createdObjCount++;

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

CommonObjManager.highlightForPeriod = function( container, option )
{
	try
	{
		if ( !option ) option = {};
		if ( !option.color ) option.color = 'yellow';
		if ( !option.framecounts ) option.framecounts = createjs.Ticker.framerate;
		if ( !option.shape ) option.shape = 'circle';  // rect, etc..
		if ( !option.sizeRate ) option.sizeRate = 2;
		// shape: 'circle/rect/etc..', timeout
	
		var itemData = container.itemData;
	
		CommonObjManager.clearHighlightShape( container ); // if exists, remove any highlight shape

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

		itemData.highlightCount = option.framecounts;	
	}
	catch( errMsg ) {  console.error( 'ERROR in CommonObjManager.highlightForPeriod, ' + errMsg ); }
};

CommonObjManager.clearHighlightShape = function( container )
{
	if ( container.ref_highlightShape ) {
		container.removeChild( container.ref_highlightShape );
		delete container.ref_highlightShape;
	} 
};

CommonObjManager.highlightShapeCountCheck_NClear = function( container )
{
	if ( container.itemData.highlightCount )
	{
		container.itemData.highlightCount--;

		if ( container.itemData.highlightCount <= 0 && container.ref_highlightShape ) 
		{
			CommonObjManager.clearHighlightShape ( container );
		} 
	}
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

// --------------------------------------------

CommonObjManager.getUniqueObjName = function ( option ) 
{
	if ( !option ) option = {};
	var typeName = ( option.type ) ? option.type: 'none';

	CommonObjManager.objNameIndex++;

	var name = 'obj' + CommonObjManager.objNameIndex + '_' + typeName;

	CommonObjManager.objNameList.push( name );

	return name;
};

CommonObjManager.getObjByName = function ( name )
{
	return StageManager.getStageChildrenContainers().find( obj => obj.itemData?.name === name );
};
