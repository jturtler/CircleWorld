
function CircleManager() { };

CircleManager.objType = 'circle';

CircleManager.colorTeamList_DEFAULT = [ "blue", "orange", "gray", "white", "black", "purple" ];

// Archetypes determine starting adjustments to basic stats
CircleManager.archetypeList = [ 'aggressive', 'cautious', 'fast_small', 'slow_large', 'scavenger' ];

CircleManager.archetypeTraits = {
	aggressive:    { strengthMul: 1.25, speedMul: 1.0, sizeMul: 1.0, energyMul: 1.0 },
	cautious:      { strengthMul: 0.9,  speedMul: 0.8, sizeMul: 1.0, energyMul: 1.1 },
	fast_small:    { strengthMul: 0.8,  speedMul: 1.5, sizeMul: 0.7, energyMul: 0.9 },
	slow_large:    { strengthMul: 1.1,  speedMul: 0.7, sizeMul: 1.4, energyMul: 1.2 },
	scavenger:     { strengthMul: 0.85, speedMul: 0.95,sizeMul: 0.9, energyMul: 1.4 }
};

// -----------------------------

CircleManager.circleProp_DEFAULT = {
	name: function() { return CommonObjManager.getUniqueObjName( { type: CircleManager.objType } ); },
	// Basic physical traits - use functions so they are generated safely without eval strings
	speed: function() { return Util.getRandomInRange(5, 8); },
	width_half: function() { return Util.getRandomInRange(8, 13); },
	angle: function() { return Util.getRandomInRange( 0, 360 ); },
	strength: function() { return Util.getRandomInRange(8, 13); },
	strengthIncrease: function() { return Util.getRandomInRange( 0.10, 0.25, { decimal: 2}); },
	color: function() { var c = Util.getRandomInList( INFO.colorTeamList || CircleManager.colorTeamList_DEFAULT ); return c; },
	team: function(item){ return item.color; },
	// Archetype and energy
	archetype: function() { return Util.getRandomInList( CircleManager.archetypeList ); },
	energy: function(item){
		// base energy depends on size and strength; functions may be resolved in multiple passes
		var size = (typeof item.width_half === 'number') ? item.width_half : 10;
		var str = (typeof item.strength === 'number') ? item.strength : 10;
		return Math.round( (size * 2) + (str * 1.2) );
	},
	behaviors: { }
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

	// Initialize archetype-based adjustments
	if ( itemData.archetype && CircleManager.archetypeTraits[itemData.archetype] )
	{
		var t = CircleManager.archetypeTraits[itemData.archetype];
		itemData.strength = Math.round( itemData.strength * (t.strengthMul || 1) );
		itemData.speed = Util.decimalSet( itemData.speed * (t.speedMul || 1), 2 );
		itemData.width_half = Util.decimalSet( itemData.width_half * (t.sizeMul || 1), 2 );
		itemData.energy = Math.round( itemData.energy * (t.energyMul || 1) );
	}

	// initialize memory and learning stats
	if ( !itemData.memory ) itemData.memory = { beaten: [], feared: [], wins: 0, losses: 0 };
	if ( itemData.energy === undefined ) itemData.energy = Math.round( (itemData.width_half * 2) + (itemData.strength * 1.2) );
	// record energy max for ratio-based slowdowns
	itemData.energyMax = itemData.energy;

	
	// -- SET EVENTS SECTION ---
	//		- Default 'circle' event handler ('onFrameChange', 'onClick' )
	// 'onFrameMove_ClassBase' - Not overridable / always run(?) 'onFrameChange' ClassBase version
	//itemData.onFrameMove_ClassBase = container => { };
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

	// Update memory / learning and win/loss counters
	if ( winObj && winObj.itemData ) {
		winObj.itemData.memory = winObj.itemData.memory || { beaten: [], feared: [], wins:0, losses:0 };
		winObj.itemData.memory.beaten.push( loseObj.itemData.name || loseObj.id );
		winObj.itemData.memory.wins = (winObj.itemData.memory.wins || 0) + 1;
	}
	if ( loseObj && loseObj.itemData ) {
		loseObj.itemData.memory = loseObj.itemData.memory || { beaten: [], feared: [], wins:0, losses:0 };
		loseObj.itemData.memory.feared.push( winObj.itemData.name || winObj.id );
		loseObj.itemData.memory.losses = (loseObj.itemData.memory.losses || 0) + 1;
	}

	// Energy transfer / consumption: winner gains a portion of loser's size/strength as energy
	try {
		var energyGain = Math.round( (loseObj.itemData.width_half * 1.5) + (loseObj.itemData.strength * 0.5) );
		if ( winObj.itemData.energy === undefined ) winObj.itemData.energy = 0;
		winObj.itemData.energy += energyGain;
	}
	catch(e) { console.error('ERROR calculating energyGain: ' + e); }

	// Allow config-driven custom evals (legacy support)
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

	// Learning/adaptation: increment wins and slightly increase future strength growth
	obj.itemData.memory = obj.itemData.memory || { beaten:[], feared:[], wins:0, losses:0 };
	obj.itemData.memory.wins = (obj.itemData.memory.wins || 0) + 1;

	// Small adaptation: winning increases strengthIncrease marginally
	obj.itemData.strengthIncrease = (obj.itemData.strengthIncrease || 0) + (0.01 * Math.min(5, obj.itemData.memory.wins));

	CircleManager.decreaseSpeed( obj, Util.decimalSet( sizeUp * SizeCL.speedDownRate_bySizeUp, 2 ) );
};

CircleManager.loseStatusChanges = function( obj )
{
	var INFO_CS = INFO.ObjSettings.CircleSettings;
	// var SizeCL = INFO_CS.sizeChangeLogic;
	var FightLG = INFO_CS.fightLogic;

	CircleManager.decreseStrength( obj, FightLG.fightLoseStrengthChange );
	CircleManager.decreaseSize( obj, FightLG.fightLoseSizeChange );

	obj.itemData.memory = obj.itemData.memory || { beaten:[], feared:[], wins:0, losses:0 };
	obj.itemData.memory.losses = (obj.itemData.memory.losses || 0) + 1;

	// Losing makes them more cautious: reduce speed slightly
	CircleManager.decreaseSpeed( obj, Util.decimalSet( (obj.itemData.speed || 1) * 0.05, 2 ) );
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
