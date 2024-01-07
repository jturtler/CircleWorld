
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
	strengthChangeRate: " Util.getRandomInRange( 0.10, 0.25, { decimal: 2}); ",
	color: " INFO.TempVars_color = Util.getRandomInList( INFO.colorTeamList ); INFO.TempVars_color; ",
	team: " INFO.TempVars_color; ",
	behaviors: { },
	onObjCreate_EvalFields: [ "itemData.name", "itemData.speed", "itemData.width_half", "itemData.angle", "itemData.strength", "itemData.strengthChangeRate", "itemData.color", "itemData.team" ]
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

	// With above 'inputObjProp', 'circleJson' merged, have 'CommonObjManager.createObj' create 'itemData' & 'container'
	var container = CommonObjManager.createObj( circleProp );

	var itemData = container.itemData;
	itemData.objType = CircleManager.objType;


	// -- SET EVENTS SECTION ---
	//		- Default 'circle' event handler ('onFrameMove', 'onClick' )
	// 'onFrameMove_ClassBase' - Not overridable / always run(?) 'onFrameMove' ClassBase version
	itemData.onFrameMove_ClassBase = container => { };
	itemData.onAgeIncrease = container => CircleManager.ageIncreaseActions( container );
	if ( !itemData.onFrameMove ) itemData.onFrameMove = container => MovementHelper.moveNext( container );
	// if ( !itemData.onClick ) itemData.onClick = ( e ) => {  CommonObjManager.clickObjectEvent( e );  };
	if ( itemData.onClick ) container.addEventListener("click", itemData.onClick );
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
};
 
CircleManager.drawCircleShape = function( shape, itemData )
{
	shape.graphics.clear().beginFill(itemData.color).drawCircle( 0, 0, itemData.width_half);
};

// ---------------------------------

CircleManager.ageIncreaseActions = function( container )
{
	var itemData = container.itemData;

	var ageLogic = INFO.GlobalSettings.CircleSettings.ageLogic;

	if ( ageLogic.ageIncreaseActionsEval ) Util.evalTryCatch( ageLogic.ageIncreaseActionsEval, { INFO_TempVars: { obj: container } } );

	CircleManager.atAgeChanges( container );
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
};

/*
CircleManager.adjustSizeMax = function( obj, addRate )
{
	var sizeChangeLogic = INFO.GlobalSettings.CircleSettings.sizeChangeLogic;
	var decreaseRateWhenMax = sizeChangeLogic.decreaseRateWhenMax;
	var width_halfMax = sizeChangeLogic.width_halfMax;

	if ( obj.itemData.width_half >= width_halfMax ) addRate = addRate * decreaseRateWhenMax;
	
	obj.itemData.width_half += addRate;
};


CircleManager.adjustStrengthMax = function( obj )
{
	var sizeChangeLogic = INFO.GlobalSettings.CircleSettings.sizeChangeLogic;
	var itemData = obj.itemData;

	var sizeMax = ( itemData.behaviors.strengthMax ) ? itemData.behaviors.strengthMax: sizeChangeLogic.strengthMax;

	if ( itemData.strength > sizeMax ) obj.itemData.strength = sizeMax;
};
*/

CircleManager.decreaseSpeed = function( obj, change )
{
	var sizeChangeLogic = INFO.GlobalSettings.CircleSettings.sizeChangeLogic;

	obj.itemData.speed -= change;

	if ( obj.itemData.speed < sizeChangeLogic.speedMin ) obj.itemData.speed = sizeChangeLogic.speedMin;
};

CircleManager.decreaseSize = function( obj, change )
{
	obj.itemData.width_half -= change;

	if ( obj.itemData.width_half < 0 ) obj.itemData.width_half = 0;
};

CircleManager.decreseStrength = function( obj, change )
{
	obj.itemData.strength -= change;

	if ( obj.itemData.strength < 0 ) obj.itemData.strength = 0;
};


CircleManager.winStatusChanges = function( obj )
{
	var INFO_CS = INFO.GlobalSettings.CircleSettings;
	var SizeCL = INFO_CS.sizeChangeLogic;
	var FightLG = INFO_CS.fightLogic;

	obj.itemData.width_half += CircleManager.adjustUpWhenMax( obj, 'width_half', FightLG.fightWinSizeChange);
	obj.itemData.strength += CircleManager.adjustUpWhenMax( obj, 'strength', FightLG.fightWinStrengthChange);

	CircleManager.decreaseSpeed( obj, ( sizeUp * SizeCL.speedDownRate_bySizeUp ) );
};

CircleManager.loseStatusChanges = function( obj )
{
	var INFO_CS = INFO.GlobalSettings.CircleSettings;
	// var SizeCL = INFO_CS.sizeChangeLogic;
	var FightLG = INFO_CS.fightLogic;

	CircleManager.decreseStrength( obj, FightLG.fightLoseStengthChange );
	CircleManager.decreseSize( obj, FightLG.fightLoseSizeChange );
};

CircleManager.adjustUpWhenMax = function( obj, type, amount )
{
	var INFO_CS = INFO.GlobalSettings.CircleSettings;
	var SizeCL = INFO_CS.sizeChangeLogic;

	if ( type === 'width_half' )
	{
		if ( obj.itemData.width_half >= SizeCL.width_halfMax ) amount *= SizeCL.downRateWhenMax;
	}
	else if ( type === 'strength' )
	{
		if ( obj.itemData.strength >= SizeCL.strengthMax ) amount *= SizeCL.downRateWhenMax;
	}
	
	return amount;
};