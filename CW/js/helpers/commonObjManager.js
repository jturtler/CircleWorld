
function CommonObjManager() { };

CommonObjManager.mouseDownTime_StagePaused; 
CommonObjManager.mouseDownObj; // = { stageX, stageY,  }  // on mouse down, pause the stage..
CommonObjManager.clickedContainer;
CommonObjManager.clickedContainer_shape;
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

	// if ( itemData.onClick ) container.addEventListener("click", itemData.onClick );
	
	StageManager.stage.addChild( container );

	return container;
};


// ------------------------------------

CommonObjManager.highlightForPeriod = function( container, option )
{
	try
	{
		if ( !option ) option = {};
		if ( !option.endCount ) option.endCount = createjs.Ticker.framerate;
		// shape: 'circle/rect/etc..', timeout
	
		var itemData = container.itemData;
	
		CommonObjManager.clearHighlightShape( container ); // if exists, remove any highlight shape

		// option: { color: 'yellow', sizeRate: 1.0, sizeOffset: 4, shape: 'circle' / 'square' }
		var highlightShape = CommonObjManager.drawShapeLine_Obj( container, option );
				
		container.ref_highlightShape = highlightShape;	

		itemData.highlightCount = option.endCount;	
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

CommonObjManager.tempLines_Check_NClear = function()
{
	for ( var i = MovementHelper.TEMP_LINES.length - 1; i >= 0; i--) 
	{ 
		var lineShape = MovementHelper.TEMP_LINES[i];

		if ( lineShape.endCount )
		{
			lineShape.endCount--;

			if ( lineShape.endCount <= 0 ) 
			{
				StageManager.stage.removeChild( lineShape );

				MovementHelper.TEMP_LINES.splice( i, 1 );
			}
		}
	}
};

CommonObjManager.drawLine_ForPeriod = function( sourceObj, targetObj, option ) 
{
	var lineShape;

	if ( !option ) option = {};
	if ( !option.color ) option.color = 'yellow';
	if ( !option.endCount ) option.endCount = Math.round( createjs.Ticker.framerate / 2 );

	try
	{
		lineShape = new createjs.Shape();

		MovementHelper.drawLine( lineShape, option.color, sourceObj, targetObj );
		lineShape.endCount = option.endCount;

		StageManager.stage.addChild( lineShape );

		MovementHelper.TEMP_LINES.push( lineShape );
	}
	catch( errMsg ) { console.error( 'ERROR in CommonObjManager.drawLine_ForPeriod, ' + errMsg ); }

	return lineShape;
};


CommonObjManager.removeAllTempLines = function()
{
	for ( var i = MovementHelper.TEMP_LINES.length - 1; i >= 0; i--) 
	{ 
		var lineShape = MovementHelper.TEMP_LINES[i];

		StageManager.stage.removeChild( lineShape );

		MovementHelper.TEMP_LINES.splice( i, 1 );
	}
};

// ---------------------------------
// Add long click?  double click?  --> to open Up 'Panel' with the obj selection?

CommonObjManager.objMouseDownAction = function ( e )
{
	var container = e.currentTarget;
	var itemData = container.itemData;

	if ( itemData ) 
	{
		CommonObjManager.mouseDownTime_StagePaused = createjs.Ticker.paused;

		StageManager.stageStopStart( { bStop: true } );

		// Clear previouew
		CommonObjManager.clearMouseDownShape();
		CommonObjManager.removeAllTempLines();

		var uiLogic = INFO.GlobalSettings.CircleSettings.uiLogic;

		// Select object <-- paint it..	- record position, time
		CommonObjManager.mouseDownObj = {
			obj: container,
			stageX: e.stageX,
			stageY: e.stageY,
			time: new Date().getTime(),
			status: 'mouseDown',
			selectShape: CommonObjManager.drawShapeLine_Obj( container, { color: uiLogic.clickHighlightColor, sizeRate: 1.0, sizeOffset: 4, shape: 'rect' } )
		}; 

		StageManager.stage.update();
	}
};


// Stage Event
CommonObjManager.objMouseUpAction = function ( e )
{
	if ( CommonObjManager.mouseDownObj )
	{
		var srcObj = CommonObjManager.mouseDownObj.obj;

		// Calculate + paint the line of new direction??
		var trgXY = { x: e.stageX, y: e.stageY };
		var distance = MovementHelper.getDistance( srcObj, trgXY );

		if ( distance > 10 ) 
		{
			srcObj.itemData.angle = MovementHelper.getAngleToTarget( srcObj, trgXY );
			//var deltaTime = new Date().getTime() - CommonObjManager.mouseDownObj.time;
			//var swipeSpeed = distance / deltaTime; // if ( swipeSpeed > 2.5 ), perform swipe..

			CommonObjManager.drawLine_ForPeriod( srcObj, trgXY, { color: INFO.GlobalSettings.CircleSettings.uiLogic.swipeDirectionLineColor } );
			// var movement = MovementHelper.getMovementCalc( angle, srcObj.itemData.speed );		
		}
		else {
			// CommonObjManager.clickObjectEvent( srcObj );
		}

		// ----------------------
		CommonObjManager.clearMouseDownShape();
		CommonObjManager.mouseDownObj = undefined;

		StageManager.stage.update();

		// ----------------------------

		// Only if the stage was not in 'paused' at the time of 'mouseDown', run the stage again with 'paused' false.
		if ( !CommonObjManager.mouseDownTime_StagePaused ) StageManager.stageStopStart( { bStop: false } );
	
	}
};

// { color: CommonObjManager.selectedColor, sizeRate: 1.0, sizeOffset: 4, shape: 'circle' / 'square' )
CommonObjManager.drawShapeLine_Obj = function ( container, option )
{
	if ( !option ) option = {};

	option = Util.cloneJson( option ); // Debugging - for some reason, this option is being reused?  shared?

	var color = ( option.color ) ? option.color: 'green';
	var sizeRate = ( option.sizeRate ) ? option.sizeRate: 1;
	var sizeOffset = ( option.sizeOffset ) ? option.sizeOffset: 0;
	var shape = ( option.shape ) ? option.shape: 'rect';

	var itemData = container.itemData;

	var width_halfUp = ( itemData.width_half + sizeOffset ) * sizeRate;
	if ( option.width_half ) width_halfUp = option.width_half; // If direct size were entered, set it with that size..
	
	var selectedShape = new createjs.Shape();
	if ( shape === 'rect' )
	{
		var widthFull = width_halfUp * 2;
		selectedShape.graphics.setStrokeStyle(1).beginStroke( color ).drawRect( -width_halfUp, -width_halfUp, widthFull, widthFull );
	}
	else if ( shape === 'circle' )
	{	
		selectedShape.graphics.setStrokeStyle(1).beginStroke( color ).drawCircle(0, 0, width_halfUp );
	}

	container.addChild( selectedShape );

	return selectedShape;
};

CommonObjManager.clearMouseDownShape = function ()
{
	var mObjJson = CommonObjManager.mouseDownObj;

	if ( mObjJson )
	{
		if ( mObjJson.obj && mObjJson.selectShape ) mObjJson.obj.removeChild( mObjJson.selectShape );
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

		CommonObjManager.clickedContainer = container;
		
		var selectedShape = CommonObjManager.drawShapeLine_Obj( container, { color: CommonObjManager.selectedColor, sizeRate: 1.0, sizeOffset: 4, shape: 'rect' } )

		CommonObjManager.clickedContainer_shape = selectedShape;

		StageManager.stage.update(); // This could be optional
	}
};

CommonObjManager.clearPrevSelection = function () 
{
	if ( CommonObjManager.clickedContainer && CommonObjManager.clickedContainer_shape )
	{
		CommonObjManager.clickedContainer.removeChild( CommonObjManager.clickedContainer_shape );
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
