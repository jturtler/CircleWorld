
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
		onCollision: 'bounce'
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

	// increase gradually as ages / consumes others?


	// -- SET EVENTS SECTION ---
	//		- Default 'circle' event handler ('onFrameMove', 'onClick' )
	// 'onFrameMove_ClassBase' - Not overridable / always run(?) 'onFrameMove' ClassBase version
	itemData.onFrameMove_ClassBase = container => { };
	itemData.onAgeIncrease = container => CircleManager.ageIncreaseActions( container );
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
	CircleManager.drawCircleShape( shape, itemData );

	container.ref_Shape = shape;
	container.addChild( shape );

	// Below moved to not create right away, but scheduled by age - 'CircleManager.addInnerCircleInAge'
	//		TODO: The Logic should be more changed?
	// if ( itemData.innerCircle ) CircleManager.addInnerCircle( container, itemData.innerCircle );
};
 
CircleManager.drawCircleShape = function( shape, itemData )
{
	shape.graphics.clear().beginFill(itemData.color).drawCircle( 0, 0, itemData.width_half);
};


/*
CircleManager.reshapeCircle = function( container, movement )
{
	shape.graphics.beginFill(itemData.color).drawCircle(movement.x, movement.y, itemData.width_half);
};
*/

// ---------------------------------

CircleManager.ageIncreaseActions = function( container )
{
	var itemData = container.itemData;

	var ageLogic = INFO.GlobalSettings.CircleSettings.ageLogic;
	
	if ( ageLogic.ageIncreaseActionsEval ) Util.evalTryCatch( ageLogic.ageIncreaseActionsEval, { INFO_TempVars: { obj: container } } );

	CircleManager.atAgeChanges( container );
	// CircleManager.checkNaddInnerCircleInAge( container );
};

CircleManager.atAgeChanges = function ( container )
{
	var itemData = container.itemData;

	var cSets = INFO.GlobalSettings.CircleSettings;
	var ageLogic = cSets.ageLogic;

	if ( ageLogic.atAgeChanges )
	{
		for( var prop in ageLogic.atAgeChanges )
		{
			if ( prop == itemData.age )
			{
				var ageActions = ageLogic.atAgeChanges[prop];

				ageActions.forEach( action => {
					if ( action.innerCircleAdd && action.settingName ) CircleManager.addInnerCircle( container, cSets[ action.settingName ] );
					else if ( action.bounceActionBehaviorSet ) container.itemData.behaviors.bounceAction = true;
					else if ( action.proxyDetectionBehaviorSet ) container.itemData.behaviors.proxyDetection = true;
					else if ( action.chaseActionBehaviorSet ) container.itemData.behaviors.chaseAction = true;
				});
			}
		}
	}
};


// 'container.itemData' already has 'innerCircle' data, but at some age, it start to show/activate..
CircleManager.checkNaddInnerCircleInAge = function ( container )
{
	var itemData = container.itemData;
	var innerCircle = itemData.innerCircle;

	if ( innerCircle )
	{	
		if ( !innerCircle.added && itemData.age >= innerCircle.addAge ) {
			if ( innerCircle.behaviorChange ) Util.mergeJson( itemData.behaviors, innerCircle.behaviorChange );
			CircleManager.addInnerCircle( container, innerCircle );	
		}
	}	
};

CircleManager.addInnerCircle = function ( container, innerCircleJson )
{
	if ( innerCircleJson )
	{
		if ( innerCircleJson.color === '[RandomColorHex]' ) innerCircleJson.color = Util.getRandomColorHex();

		var innerCircleShape = new createjs.Shape();
		innerCircleShape.graphics.beginFill( innerCircleJson.color ).drawCircle(0, 0, innerCircleJson.width_half );
		container.ref_innerCircleShape = innerCircleShape;
		container.addChild( innerCircleShape );
	
		innerCircleJson.added = true;	
	}
};


// ------------------------------------------


CircleManager.fightObjStatusChange = function( winObj, loseObj )
{
	var cSettings = INFO.GlobalSettings.CircleSettings;
	var fightLogic = cSettings.fightLogic;
	// var sizeChangeLogic = cSettings.sizeChangeLogic;

	if ( fightLogic.winEval ) Util.evalTryCatch( fightLogic.winEval, { INFO_TempVars: { winObj: winObj } } );
	if ( fightLogic.loseEval ) Util.evalTryCatch( fightLogic.loseEval, { INFO_TempVars: { loseObj: loseObj } } );
	/*
	else
	{
		winObj.itemData.strength++;
		winObj.itemData.width_half += fightLogic.fightWinSizeChangeRate;
		winObj.itemData.speed -= ( fightLogic.fightWinSizeChangeRate * sizeChangeLogic.speedDownRate_bySizeUp );
		CircleManager.adjustSizeMax( winObj );
		CircleManager.adjustSpeedMin( winObj );
		if ( winObj.ref_Shape ) CircleManager.drawCircleShape( winObj.ref_Shape, winObj.itemData );
	}*/

	// Lose Obj Changes
	// if ( fightLogic.loseEval ) Util.evalTryCatch( fightLogic.loseEval, { INFO_TempVars: { loseObj: loseObj } } );
	/* else
	{
		loseObj.itemData.strength--;
		loseObj.itemData.width_half -= fightLogic.fightLoseSizeChangeRate;		
		CircleManager.adjustSizeMax( loseObj );
		if ( loseObj.itemData.strength <= 0 )  {  loseObj.itemData.strength = 0;  loseObj.itemData.width_half = 0;  }
		if ( loseObj.itemData.objType === CircleManager.objType && loseObj.ref_Shape ) CircleManager.drawCircleShape( loseObj.ref_Shape, loseObj.itemData );
	}*/
};


CircleManager.adjustSizeMax = function( obj )
{
	var sizeChangeLogic = INFO.GlobalSettings.CircleSettings.sizeChangeLogic;

	if ( obj.itemData.width_half > sizeChangeLogic.width_halfMax ) obj.itemData.width_half = sizeChangeLogic.width_halfMax;
};

CircleManager.adjustSpeedMin = function( obj )
{
	var sizeChangeLogic = INFO.GlobalSettings.CircleSettings.sizeChangeLogic;

	if ( obj.itemData.speed < sizeChangeLogic.speedMin ) winObj.itemData.speed = sizeChangeLogic.speedMin;
};

CircleManager.adjustSizeMin = function( obj )
{
	if ( obj.itemData.width_half < 0 ) obj.itemData.width_half = 0;
};
