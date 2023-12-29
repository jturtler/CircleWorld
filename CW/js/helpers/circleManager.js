
function CircleManager() { };

CircleManager.containerList = []; // Keep all the created containers here..

// -----------------------------

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
		// innerCircle: { width_half: 4, color: Util.getRandomColorHex() },
		behaviors: {			
			collectDistances: true,
			onCollision: 'bounce',
			protectedAgeUpTo: 30
		}
	};
	Util.mergeJson( circleItemData, inputJson );


	// With above 'inputJson', 'circleJson' merged, have 'CommonObjManager.createItem' create 'itemData' & 'container'
	var container = CommonObjManager.createItem( circleItemData );

	var itemData = container.itemData;
	itemData.objType = 'circle';

	// Default 'circle' event handler ('onFrameMove', 'onClick' )
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

	if ( itemData.innerCircle )
	{
		var innerCircleShape = new createjs.Shape();
		innerCircleShape.graphics.beginFill( itemData.innerCircle.color ).drawCircle(0, 0, itemData.innerCircle.width_half );
		container.ref_innerCircleShape = innerCircleShape;
		container.addChild( innerCircleShape );
	}
};


// ---------------------------------
