
function CommonObjManager() { };

CommonObjManager.mouseDownObj; // = { stageX, stageY,  }  // on mouse down, pause the stage..
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
		if ( !option.endCount ) option.endCount = createjs.Ticker.framerate;
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
	if ( !option.endCount ) option.endCount = createjs.Ticker.framerate;

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


// ---------------------------------
// Add long click?  double click?  --> to open Up 'Panel' with the obj selection?

CommonObjManager.objMouseDownAction = function ( e )
{
	var container = e.currentTarget;
	var itemData = container.itemData;

	if ( itemData ) 
	{
		console.log( itemData );
		WorldRender.spanInfoText( 'Item Selected: ' + itemData.name );

		StageManager.stageStopStart( { bStop: true } );

		// Clear previouew
		CommonObjManager.clearShape_Obj();

		// Select object <-- paint it..	- record position, time
		CommonObjManager.mouseDownObj = {
			obj: container,
			stageX: e.stageX,
			stageY: e.stageY,
			time: new Date().getTime(),
			status: 'mouseDown',
			selectShape: CommonObjManager.drawShape_Obj( container )
		}; 

		StageManager.stage.update();
	}
};


// Stage Event
CommonObjManager.objMouseUpAction = function ( e )
{
	StageManager.stageStopStart( { bStop: false } );

	if ( CommonObjManager.mouseDownObj )
	{
		var srcObj = CommonObjManager.mouseDownObj.obj;

		// Calculate + paint the line of new direction??
		var trgXY = { x: e.stageX, y: e.stageY };

		var distance = MovementHelper.getDistance( srcObj, trgXY );

		console.log( 'mouseUp distance: ' + distance );

		if ( distance > 10 ) 
		{
			srcObj.itemData.angle = MovementHelper.getAngleToTarget( srcObj, trgXY );

			CommonObjManager.drawLine_ForPeriod( srcObj, trgXY );
			// var movement = MovementHelper.getMovementCalc( angle, srcObj.itemData.speed );		
		}
		else {
			// click event? 
		}

		// ----------------------
		CommonObjManager.clearShape_Obj();
		CommonObjManager.mouseDownObj = undefined;
	}
};

CommonObjManager.drawShape_Obj = function ( container )
{
	var itemData = container.itemData;

	var offset = 4;
	var size = itemData.width_half + offset;
	var widthHeight = size * 2;

	var selectedShape = new createjs.Shape();
	selectedShape.graphics.setStrokeStyle(1).beginStroke( CommonObjManager.selectedColor ).drawRect( -size, -size, widthHeight, widthHeight );

	container.addChild( selectedShape );

	return selectedShape;
};

CommonObjManager.clearShape_Obj = function ()
{
	var mObjJson = CommonObjManager.mouseDownObj;

	if ( mObjJson )
	{
		if ( mObjJson.obj && mObjJson.selectShape ) mObjJson.obj.removeChild( mObjJson.selectShape );
	}
};


/*
    document.onmousemove = handleMouseMove;
    setInterval(getMousePosition, 100); // setInterval repeats every X ms

    function handleMouseMove(event) {
        var dot, eventDoc, doc, body, pageX, pageY;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
              (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
              (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }

        mousePos = {
            x: event.pageX,
            y: event.pageY
        };
    }

*/

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
