
function CircleManager() { };

CircleManager.objType = 'circle';

CircleManager.colorTeamList_DEFAULT = [ "blue", "orange", "gray", "white", "black", "purple" ];

// -----------------------------

CircleManager.circleProp_DEFAULT = {
	name: "CircleManager.objType + '_' + CommonObjManager.getContainers().length", // Could be, ideally, set like 'circle_blue_1'
	speed: "Util.getRandomInRange(5, 8)",
	width_half: "Util.getRandomInRange(8, 13)",
	angle: "Util.getRandomInRange( 0, 360 )",
	color: " Util.getRandomInList( INFO.colorTeamList ); ",
	innerCircle: { addAge: 10, width_half: 4, color: "[RandomColorHex]" },
	behaviors: {
		collectDistances: true,
		onCollision: 'bounce',
		ghostModeAgeTill: 4
	},
	onObjCreate_EvalFields: [ "itemData.name", "itemData.speed", "itemData.width_half", "itemData.angle", "itemData.color", "itemData.startPosition" ]
};

// -----------------------------

// TODO: rename 'containers' --> 'objs'?
CircleManager.getCircleContainers = function()
{
	return StageManager.getStageChildrenContainers( CircleManager.objType );
};

CircleManager.removeAllCircleContainers = function()
{
	StageManager.removeStageChildrenContainers( CircleManager.objType );
};

// -----------------------------

CircleManager.createCircleObj = function ( inputObjProp )
{
	if ( !inputObjProp ) inputObjProp = {};
 
	// Circle related 'prop' default - overwritten by 'inputObjProp' is has any of the properties..
	var circleProp = ( INFO.baseCircleProp ) ? Util.cloneJson( INFO.baseCircleProp ): Util.cloneJson( CircleManager.circleProp_DEFAULT );
	Util.mergeJson( circleProp, inputObjProp );

	Util.onObjCreate_EvalFields( circleProp );
	// TODO: re-'name' obj with color (team) in the name string?


	// With above 'inputObjProp', 'circleJson' merged, have 'CommonObjManager.createObj' create 'itemData' & 'container'
	var container = CommonObjManager.createObj( circleProp );

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
	CircleManager.setCircleShapes( container );

	return container;
};


CircleManager.setCircleShapes = function ( container )
{
	var itemData = container.itemData;

	var shape = new createjs.Shape();
	shape.graphics.beginFill(itemData.color).drawCircle(0, 0, itemData.width_half);
	container.ref_Shape = shape;
	container.addChild( shape );

	// Below moved to not create right away, but scheduled by age - 'CircleManager.addInnerCircleInAge'
	//		TODO: The Logic should be more changed?
	// if ( itemData.innerCircle ) CircleManager.addInnerCircle( container, itemData.innerCircle );
};
 

CircleManager.addInnerCircle = function ( container, innerCircleJson )
{
	if ( innerCircleJson.color === '[RandomColorHex]' ) innerCircleJson.color = Util.getRandomColorHex();

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
