
function CircleManager() { };

CircleManager.objType = 'circle';

CircleManager.colorTeamList_DEFAULT = [ "blue", "orange", "gray", "white", "black", "purple" ];

// -----------------------------

CircleManager.circleProp_DEFAULT = {
	name: " CommonObjManager.getUniqueObjName( { type: CircleManager.objType } ); ", // Could be, ideally, set like 'circle_blue_1'
	speed: "Util.getRandomInRange(5, 8)",
	width_half: "Util.getRandomInRange(8, 13)",
	angle: "Util.getRandomInRange( 0, 360 )",
	strength: " Util.getRandomInRange(8, 13); ",
	strengthIncrease: " Util.getRandomInRange( 0.10, 0.25, { decimal: 2}); ",
	color: " INFO.TempVars_color = Util.getRandomInList( INFO.colorTeamList ); INFO.TempVars_color; ",
	team: " INFO.TempVars_color; ",
	behaviors: { },
	onObjCreate_EvalFields: [ "itemData.name", "itemData.speed", "itemData.width_half", "itemData.angle", "itemData.strength", "itemData.strengthIncrease", "itemData.color", "itemData.team" ]
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
	var circleProp = Util.cloneJson( CircleManager.circleProp_DEFAULT );  // ( INFO.baseCircleProp ) ? Util.cloneJson( INFO.baseCircleProp ): 
	Util.mergeJson( circleProp, inputObjProp );

	Util.onObjCreate_EvalFields( circleProp );

	// With above 'inputObjProp', 'circleJson' merged, have 'CommonObjManager.createObj' create 'itemData' & 'container'
	var container = CommonObjManager.createObj( circleProp );

	var itemData = container.itemData;
	itemData.objType = CircleManager.objType;


	// -- SET EVENTS SECTION ---
	//		- Default 'circle' event handler ('onFrameChange', 'onClick' )
	// 'onFrameMove_ClassBase' - Not overridable / always run(?) 'onFrameChange' ClassBase version
	itemData.onFrameMove_ClassBase = container => { };
	itemData.onAgeIncrease = container => CircleManager.ageIncreaseActions( container );
	if ( !itemData.onFrameChange ) itemData.onFrameChange = container => MovementHelper.moveNext( container );
	if ( !itemData.onClick ) itemData.onClick = ( e ) => {  CommonObjManager.clickObjectEvent( e );  };
	if ( !itemData.onDblClick ) itemData.onDblClick = ( e ) => {  CommonObjManager.dblClickObjectEvent( e );  };

	if ( itemData.onClick ) container.addEventListener("click", itemData.onClick );
	if ( itemData.onDblClick ) container.addEventListener("dblclick", itemData.onDblClick );
	container.addEventListener('mousedown', CommonObjManager.objMouseDownAction );
      	

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


	if ( INFO.ObjSettings.CircleSettings.uiLogic.strengthShow )
	{
		container.ref_StgLabel = CommonObjManager.drawStrengthLabel( container, { container: container } );		
	}
};
 
CircleManager.drawCircleShape = function( shape, itemData )
{
	shape.graphics.clear().beginFill(itemData.color).drawCircle( 0, 0, itemData.width_half);
};

CircleManager.sizeChangeRedraw = function( container )
{
	if ( container.ref_Shape ) CircleManager.drawCircleShape( container.ref_Shape, container.itemData );
	if ( container.ref_StgLabel ) CommonObjManager.drawStrengthLabel( container );
};

// ---------------------------------

CircleManager.ageIncreaseActions = function( container )
{
	var itemData = container.itemData;

	var ageLogic = INFO.ObjSettings.CircleSettings.ageLogic;

	if ( ageLogic.ageIncreaseActionsEval ) Util.evalTryCatch( ageLogic.ageIncreaseActionsEval, { INFO_TempVars: { obj: container } } );

	CircleManager.atAgeChanges( container );
};

CircleManager.atAgeChanges = function ( container )
{
	var itemData = container.itemData;

	var cSets = INFO.ObjSettings.CircleSettings;
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

CircleManager.setAgeAdjustedProxyDistance = function( itemData )
{
	var distance;

	var proxyDistLogic = INFO.ObjSettings.CircleSettings.proxyDetectionLogic;
	distance = proxyDistLogic.proxyDistance;

	var ageWidthDist = itemData.width_half * proxyDistLogic.proxyDistanceWidthTimes;
	
	if ( distance < ageWidthDist ) distance = ageWidthDist;

	return distance;
};


// ------------------------------------------

CircleManager.fightObjStatusChange = function( winObj, loseObj )
{
	var cSettings = INFO.ObjSettings.CircleSettings;
	var fightLogic = cSettings.fightLogic;
	// var sizeChangeLogic = cSettings.sizeChangeLogic;

	if ( fightLogic.winEval ) Util.evalTryCatch( fightLogic.winEval, { INFO_TempVars: { winObj: winObj } } );
	if ( fightLogic.loseEval ) Util.evalTryCatch( fightLogic.loseEval, { INFO_TempVars: { loseObj: loseObj } } );
};


CircleManager.decreaseSpeed = function( obj, change )
{
	var sizeChangeLogic = INFO.ObjSettings.CircleSettings.sizeChangeLogic;

	obj.itemData.speed -= change;

	if ( obj.itemData.speed < sizeChangeLogic.speedMin ) obj.itemData.speed = sizeChangeLogic.speedMin;
};

CircleManager.decreaseSize = function( obj, change )
{
	obj.itemData.width_half += change; // 'change' has minus value

	if ( obj.itemData.width_half < 0 ) obj.itemData.width_half = 0;
};

CircleManager.decreseStrength = function( obj, change )
{
	obj.itemData.strength += change;

	if ( obj.itemData.strength < 0 ) obj.itemData.strength = 0;
};


CircleManager.winStatusChanges = function( obj )
{
	var INFO_CS = INFO.ObjSettings.CircleSettings;
	var SizeCL = INFO_CS.sizeChangeLogic;
	var FightLG = INFO_CS.fightLogic;

	var sizeUp = CircleManager.adjustUpWhenMax( obj, 'width_half', FightLG.fightWinSizeChange);

	obj.itemData.width_half += sizeUp;
	obj.itemData.strength += CircleManager.adjustUpWhenMax( obj, 'strength', FightLG.fightWinStrengthChange);

	CircleManager.decreaseSpeed( obj, Util.decimalSet( sizeUp * SizeCL.speedDownRate_bySizeUp, 2 ) );
};

CircleManager.loseStatusChanges = function( obj )
{
	var INFO_CS = INFO.ObjSettings.CircleSettings;
	// var SizeCL = INFO_CS.sizeChangeLogic;
	var FightLG = INFO_CS.fightLogic;

	CircleManager.decreseStrength( obj, FightLG.fightLoseStrengthChange );
	CircleManager.decreaseSize( obj, FightLG.fightLoseSizeChange );
};

CircleManager.adjustUpWhenMax = function( obj, type, amount )
{
	var INFO_CS = INFO.ObjSettings.CircleSettings;
	var SizeCL = INFO_CS.sizeChangeLogic;

	if ( type === 'width_half' )
	{
		if ( obj.itemData.width_half >= SizeCL.width_halfMax ) amount = amount * SizeCL.downRateWhenMax;
	}
	else if ( type === 'strength' )
	{
		if ( obj.itemData.strength >= SizeCL.strengthMax ) amount = amount * SizeCL.downRateWhenMax;
	}
	
	return amount;
};


CircleManager.getAverage = function( prop )
{
	var list = CircleManager.getCircleContainers();
	var total = 0;

	list.forEach( item => total += item[prop] );

	return Math.round( total / list.length );
};
