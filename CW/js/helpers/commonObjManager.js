
function CommonObjManager() { };

CommonObjManager.mouseDownTime_StagePaused; 
CommonObjManager.mouseDownObj; // = { stageX, stageY,  }  // on mouse down, pause the stage..

//CommonObjManager.forceMoveObj = []; // <-- should put it on obj..

CommonObjManager.clickedContainer;
CommonObjManager.clickedContainer_shape;
CommonObjManager.clickedContainerClearTimeoutId;
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
	// if ( !option.color ) option.color = 'yellow';
	if ( !option.endCount ) option.endCount = Math.round( createjs.Ticker.framerate / 2 );

	try
	{
		lineShape = CommonObjManager.drawLine( { from: sourceObj, to: targetObj, color: option.color, addToStage: true } );
		lineShape.endCount = option.endCount;

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

CommonObjManager.onMouseMove = function( e )
{
	if ( CommonObjManager.mouseDownObj ) 
	{
		var posX = e.stageX;
		var posY = e.stageY;

		var srcObj = CommonObjManager.mouseDownObj.obj;

		if ( !srcObj.itemData.forceMoves ) srcObj.itemData.forceMoves = [];
		var movesLength = srcObj.itemData.forceMoves.length;

		var newPosition = { x: posX, y: posY };
		var prevPosition = ( movesLength > 0 ) ? srcObj.itemData.forceMoves[ movesLength - 1 ] : undefined;
		var lineColor = INFO.ObjSettings.CircleSettings.uiLogic.swipeDirectionLineColor;

		// if previous position exists, draw line between prev to now position.
		if ( prevPosition ) {
			newPosition.lineShape = CommonObjManager.drawLine( { from: prevPosition, to: newPosition, color: lineColor, addToStage: true } );
			StageManager.stage.update(); // Draw lines on each move?
		}

		srcObj.itemData.forceMoves.push( newPosition );
	}
};


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

		var uiLogic = INFO.ObjSettings.CircleSettings.uiLogic;

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

		/*
		// Calculate + paint the line of new direction??
		var trgXY = { x: e.stageX, y: e.stageY };
		var distance = MovementHelper.getDistance( srcObj, trgXY );

		if ( distance > 10 ) {
			srcObj.itemData.angle = MovementHelper.getAngleToTarget( srcObj, trgXY );
			CommonObjManager.drawLine_ForPeriod( srcObj, trgXY, { color: INFO.ObjSettings.CircleSettings.uiLogic.swipeDirectionLineColor } );
		}
		*/

		// ----------------------
		CommonObjManager.clearMouseDownShape();
		CommonObjManager.mouseDownObj = undefined;

		StageManager.stage.update();

		// ----------------------------

		// Only if the stage was not in 'paused' at the time of 'mouseDown', run the stage again with 'paused' false.
		if ( !CommonObjManager.mouseDownTime_StagePaused ) StageManager.stageStopStart( { bStop: false } );
	
	}
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

		// Stop the movement when clicked.
		StageManager.stageStopStart( { bStop: true } );


		// Clear other selections..
		CommonObjManager.clearClickSelection_NTimeout();

		CommonObjManager.clickedContainer = container;
		
		var selectedShape = CommonObjManager.drawShapeLine_Obj( container, { color: CommonObjManager.selectedColor, sizeRate: 1.0, sizeOffset: 2, shape: 'rect' } )
		CommonObjManager.clickedContainer_shape = selectedShape;

		StageManager.stage.update(); // This could be optional

		// After set period of time, hide the selection shape obj
		CommonObjManager.clickedContainerClearTimeoutId = setTimeout(() => {
			CommonObjManager.clearClickSelection_NTimeout();
		}, 5000 );	// Make it configurable later?
	}
};

CommonObjManager.clearClickSelection_NTimeout = function () 
{
	if ( CommonObjManager.clickedContainer && CommonObjManager.clickedContainer_shape ) CommonObjManager.clickedContainer.removeChild( CommonObjManager.clickedContainer_shape );

	if ( CommonObjManager.clickedContainerClearTimeoutId ) clearTimeout( CommonObjManager.clickedContainerClearTimeoutId );
};

// -----------------------------------

CommonObjManager.dblClickObjectEvent = function ( e ) 
{
	var container = e.currentTarget;

	if ( container.itemData ) 
	{
		var itemData = container.itemData;
		console.log( itemData );
		WorldRender.spanInfoText( 'Item DoubleClicked: ' + itemData.name );

		
		StageManager.stageStopStart( { bStop: true } );

		$( '#btnInfoPanel' ).click();

		var infoLineTag_itemData = $( '<div class="infoLine"></div>' ).append( 'name: ' + itemData.name + ', width_half: ' + itemData.width_half + ', strength: ' + itemData.strength );
		$( '.divMainContent' ).remove( '.infoLine' ).append( infoLineTag_itemData );

		// Clear other selections..
		//CommonObjManager.clearClickSelection_NTimeout();

		CommonObjManager.dblClickedContainer = container;
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

// --------------------------------------------

CommonObjManager.drawLine = function( option ) //color, from, to ) 
{
	if ( !option ) option = {};
	var color = ( option.color ) ? option.color: 'yellow';
	var from = ( option.from ) ? option.from: '';
	var to = ( option.to ) ? option.to: '';
	var lineShape = ( option.lineShape ) ? option.lineShape: new createjs.Shape();

	if ( !from || !to ) throw 'from / to are required';
	if ( option.addToStage ) StageManager.stage.addChild( lineShape );

	if ( option.clear ) lineShape.graphics.clear();
	lineShape.graphics.setStrokeStyle(1).beginStroke( color ).moveTo( from.x, from.y ).lineTo( to.x, to.y ).endStroke();

	return lineShape;
};


CommonObjManager.drawShape = function( option ) 
{
	if ( !option ) option = {};
	var color = ( option.color ) ? option.color: 'yellow';
	var shapeType = ( option.shapeType ) ? option.shapeType: 'circle';
	var width_half = ( option.width_half ) ? option.width_half: 5;	
	var position = ( option.position ) ? option.position: { x: 100, y: 100 };	
	// option.existingContainer
	// option.existingShape
	// option.lineStroke
	// option.position
	// option.skipAddToStage
	// option.skipAddToContainer
	// option.updateStage // Draw the shape right away..  not efficient


	var container = ( option.existingContainer ) ? option.existingContainer : new createjs.Container();
	if ( !option.existingContainer ) {  container.x = position.x;  container.y = position.y;  }

	var shape = ( option.existingShape ) ? option.existingShape : new createjs.Shape();

	if ( shapeType === 'rect' )
	{
		var height_half = ( option.height_half ) ? option.height_half : width_half;

		if ( option.lineStroke ) shape.graphics.setStrokeStyle(1).beginStroke( color ).drawRect( -width_half, -height_half, width_half * 2, height_half * 2 );
		else shape.graphics.beginFill( color ).drawRect( -width_half, -height_half, width_half * 2, height_half * 2 );
	}
	else if ( shapeType === 'circle' )
	{	
		if ( option.lineStroke ) shape.graphics.setStrokeStyle(1).beginStroke( color ).drawCircle(0, 0, width_half );
		else shape.graphics.beginFill( color ).drawCircle( 0, 0, width_half );
	}
	
	if ( !option.skipAddToContainer ) container.addChild( shape );
	if ( !option.skipAddToStage ) StageManager.stage.addChild( container );
	if ( option.updateStage ) StageManager.stage.update();

	return shape;
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

CommonObjManager.drawLabel = function( option ) //color, from, to ) 
{
	if ( !option ) option = {};
	var color = ( option.color ) ? option.color: 'Blue';
	var text = ( option.text ) ? option.text: '';
	var yPos = ( option.yPos ) ? option.yPos: 15;

	var label = ( option.label ) ? option.label : new createjs.Text( text, 'normal 10px Arial', color );

	label.text = text;
	label.textAlign = 'center';
	label.textBaseline = 'middle';
	label.y = yPos;
	if ( option.container ) option.container.addChild( label );	

	return label;
};


CommonObjManager.drawStrengthLabel = function( container, option )
{
	if ( !option ) option = {};

	var itemData = container.itemData;

	option.text = Math.round( container.itemData.strength );
	option.label = container.ref_StgLabel;

	option.yPos = Math.round( itemData.width_half / 2.0 );
	if ( itemData.sizeMaxReached ) option.color = 'white'; // if max reached, the color is likely darker colr..

	return CommonObjManager.drawLabel( option );
};

// -------------------------------------

// If object is selected.. on each frame(?), we can print on info panel..
// Or, we can choose to print
// Only print last 100 ones.. in panel..
// try this on console.log 1st?

// TODO: Want to print this in real time.. in log..
CommonObjManager.printObjInfo = function( obj, option ) 
{
	var outputStr = '';

	if ( !option ) option = {};

	if ( obj )
	{
		// x, y, age, width_half, strength, speed, team, sizeMax, strengthMax, 
		// fight win/lose, others?
		try
		{
			outputStr += 'x: ' + obj.x + ', y: ' + obj.y;

			var itemData = obj.itemData;
			if ( itemData )
			{
				var dataSubset = Util.getObjSubset( itemData, [ 'name', 'age', 'team', 'color', 'width_half', 'stength', 'speed', 'sizeMaxReached', 'strengthMaxReached' ] );
				outputStr += ', itemData: ' + JSON.stringify( dataSubset, null, 2 );
			}
		}
		catch( errMsg )
		{
			console.log( 'ERROR in CommonObjManager.getObjStatusStr, ' + errMsg );
			outputStr += ' [ERROR] - ' + errMsg;
		}

		if ( option.type === 'console.log' ) console.log( outputStr );
	}

	return outputStr;
};
