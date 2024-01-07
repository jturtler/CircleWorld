function GlobalSettings() { };

// ------------------------------------

GlobalSettings.DefaultJson = {

	"preRunEval": [
		" /* ShortCut INFO variables to long named ones.. */ ",
		" INFO.CIR_SETS = INFO.GlobalSettings.CircleSettings; ",
		" INFO.C_Size = INFO.CIR_SETS.sizeChangeLogic; "
	],

	"CircleSettings": 
	{
		"ageLogic": {
			"ageIncreaseCheckInTickEval": "( StageManager.frameCount % Math.round( createjs.Ticker.framerate ) === 0 ) ? true: false;",
			"NOTE": "Aged in every 'framerate'th time <-- which is once per second. ",
			"ageIncreaseActionsEval": [
				" var obj = INFO.TempVars.obj; ",
				" var itemData = obj.itemData; ",
				" itemData.width_half += CircleManager.adjustUpWhenMax( obj, 'width_half', INFO.C_Size.width_half_UpByAge ); ",
				" itemData.strength += CircleManager.adjustUpWhenMax( obj, 'strength', itemData.strengthChangeRate ); ",

				" if ( !itemData.sizeMaxReached && itemData.width_half >= INFO.C_Size.width_halfMax ) { ", 
				"    itemData.sizeMaxReached = true; ",
				"    itemData.behaviors.proxyDistance += INFO.CIR_SETS.proxyDetectionLogic.proxyDistance; ",
				"    itemData.team = ''; ",
				"    CommonObjManager.drawShapeLine_Obj( obj, { color: 'black', sizeRate: 1.3, sizeOffset: 1, shape: 'circle' } ); ",
				" } ",

				" if ( !itemData.strengthMaxReached && itemData.strength >= INFO.C_Size.strengthMax ) { ", 
				"    itemData.strengthMaxReached = true; ",
				"    CommonObjManager.drawShapeLine_Obj( obj, { color: 'white', sizeRate: 1.7, sizeOffset: 2, shape: 'circle' } ); ",
				" } "

			],
			"atAgeChanges": {
				"5": [
					{ "bounceActionBehaviorSet": true }
				],
				"10": [
					{ "innerCircleAdd": true, "settingName": "innerCircle_W4CR" },
					{ "proxyDetectionBehaviorSet": true },
					{ "chaseActionBehaviorSet": true }
				]
			}
		},
		"bounceActionLogic": {
			"bounceLogicEval": [
				" INFO.TempVars.movement.x = -INFO.TempVars.movement.x; ",
				" INFO.TempVars.movement.y = -INFO.TempVars.movement.y; ",
				" CommonObjManager.highlightForPeriod( INFO.TempVars.obj, { color: 'yellow', shape: 'circle', endCount: 10, sizeRate: 1.3, sizeOffset: 1 } ); "
			]
		},
		"innerCircle_W4CR": { 
			"width_half": 4, 
			"color": "[RandomColorHex]"
		},
		"proxyDetectionLogic": {
			"proxyDistance": 100
		},
		"chaseActionLogic": {
			"angleChangeMax_perTick": 0.4,
			"chaseTargetEval": " ( ( !INFO.TempVars.srcObj.itemData.team || INFO.TempVars.srcObj.itemData.team !== INFO.TempVars.trgObj.itemData.team ) && ( INFO.TempVars.srcObj.itemData.width_half > INFO.TempVars.trgObj.itemData.width_half || INFO.TempVars.srcObj.itemData.width_half >= INFO.C_Size.width_halfMax ) ) ",
			"chaseMovementEval": " 'NOT YET IMPLEMENTED.. ' ", 
			"onCollision": "fight"
		},
		"fightLogic": {
			"fightWinSizeChange": 0.3,
			"fightLoseSizeChange": 0.6,
			"fightWinStrengthChange": 0.3,
			"fightLoseStrengthChange": 0.6,
			"winEval": [
				" var winObjT = INFO.TempVars.winObj; ",
				" CircleManager.winStatusChanges( winObjT ); ",
				" if ( winObjT.ref_Shape ) CircleManager.drawCircleShape( winObjT.ref_Shape, winObjT.itemData ); "
			],
			"loseEval": [
				" var loseObjT = INFO.TempVars.loseObj; ",
				" CircleManager.loseStatusChanges( loseObjT ); ",
				" if ( loseObjT.ref_Shape ) CircleManager.drawCircleShape( loseObjT.ref_Shape, loseObjT.itemData ); "
			]
		},
		"sizeChangeLogic": {
			"speedDownRate_bySizeUp": 0.1,
			"speedMin": 4,
			"width_halfMax": 30,
			"width_half_UpByAge": 0.4,
			"strengthMax": 150,
			"downRateWhenMax": 0.2
		}
	}

};

// Used to set as INFO.GlobalSettings and use the values through out the App code.
// In Config.json, this can be overwritten..

// ------------------------------------
