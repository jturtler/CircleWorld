
function CircleManager() { };

CircleManager.containerList = []; // Keep all the created containers here..
CircleManager.objType = 'circle';

// -----------------------------

// Should only be called follow by 'stage.removeAllChildren()'
CircleManager.clearData = function()
{
	CircleManager.containerList = [];
};

CircleManager.createCircleItem = function ( inputJson )
{
	if ( !inputJson ) inputJson = {};
 
	// Circle related 'itemData' default - overwritten by 'inputJson' is has any of the properties..
	var circleItemData = {
		name: 'circle_' + CommonObjManager.containerList.length, // Could be, ideally, set like 'circle_blue_1'
		speed: Util.getRandomInRange(5, 8),
		width_half: Util.getRandomInRange(8, 13),
		angle: Util.getRandomInRange( 0, 360 ),
		innerCircle: { addAge: 10, width_half: 4, color: Util.getRandomColorHex() },
		behaviors: {			
			collectDistances: true,
			onCollision: 'bounce',
			protectedUntilAge: 4
		}
	};	// behaviorChange can be inserted into above 'behaviors' when innerCircle is added at some age..

	Util.mergeJson( circleItemData, inputJson );

	Util.EVAL_OnCreate( circleItemData );


	// With above 'inputJson', 'circleJson' merged, have 'CommonObjManager.createItem' create 'itemData' & 'container'
	var container = CommonObjManager.createItem( circleItemData );

	var itemData = container.itemData;
	itemData.objType = CircleManager.objType;


	// -- SET EVENTS SECTION ---
	//		- Default 'circle' event handler ('onFrameMove', 'onClick' )
	// 'onFrameMove_ClassBase' - Not overridable / always run(?) 'onFrameMove' ClassBase version
	itemData.onFrameMove_ClassBase = container => CircleManager.addInnerCircleInAge( container );
	if ( !itemData.onFrameMove ) itemData.onFrameMove = container => MovementHelper.moveNext( container );
	if ( !itemData.onClick ) itemData.onClick = ( e ) => {  CommonObjManager.clickObjectEvent( e );  };
	if ( itemData.onClick ) container.addEventListener("click", itemData.onClick );
	

	// More 'circle' related shapes & etc created/added to 'container'
	CircleManager.setCircleContainer( container );

	CircleManager.containerList.push( container );

	return container;
};


CircleManager.setCircleContainer = function ( container )
{
	var itemData = container.itemData;

	var shape = new createjs.Shape();
	shape.graphics.beginFill(itemData.color).drawCircle(0, 0, itemData.width_half);
	container.ref_Shape = shape;
	container.addChild( shape );

	// if ( itemData.innerCircle ) CircleManager.addInnerCircle( container, itemData.innerCircle );
};


CircleManager.addInnerCircle = function ( container, innerCircleJson )
{
	var innerCircleShape = new createjs.Shape();
	innerCircleShape.graphics.beginFill( innerCircleJson.color ).drawCircle(0, 0, innerCircleJson.width_half );
	container.ref_innerCircleShape = innerCircleShape;
	container.addChild( innerCircleShape );

	innerCircleJson.added = true;
};

// 'container.itemData' already has 'innerCircle' data, but at some age, it start to show/activate..
CircleManager.addInnerCircleInAge = function ( container )
{
	var itemData = container.itemData;
	var innerCircle = itemData.innerCircle;

	if ( innerCircle )
	{
		if ( innerCircle.behaviorChange ) Util.mergeJson( itemData.behaviors, innerCircle.behaviorChange );
		// "proxyDetectAction": {  "action": "chase", "chaseProxyDistance": 100  }
	
		if ( !innerCircle.added && itemData.age >= innerCircle.addAge ) CircleManager.addInnerCircle( container, innerCircle );	
	}	
};

// ---------------------------------
