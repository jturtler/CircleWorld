function GlobalSettings() { };

// ------------------------------------

GlobalSettings.DefaultJson = {

	"preRunEval": [
		" /* ShortCut INFO variables to long named ones.. */ ",
		" INFO.CIR_SETS = INFO.GlobalSettings.CircleSettings; ",
		" INFO.WIN_SizeUpR = INFO.CIR_SETS.fightLogic.fightWinSizeChangeRate; ",
		" INFO.WIN_SpeedDownR = INFO.CIR_SETS.fightLogic.fightWinSizeChangeRate; ",
		" INFO.LOS_SizeUpR = INFO.CIR_SETS.fightLogic.fightLoseSizeChangeRate; "
	],

	"CircleSettings": 
	{
		"ageLogic": {
			"ageIncreaseCheckInTickEval": "( StageManager.frameCount % Math.round( createjs.Ticker.framerate ) === 0 ) ? true: false;",
			"NOTE": "Aged in every 'framerate'th time <-- which is once per second. ",
			"ageIncreaseActionsEval": " INFO.TempVars.obj.itemData.strength += INFO.TempVars.obj.itemData.strengthChangeRate; ",
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
				" INFO.TempVars.movement.x = -INFO.TempVars.movement.x; INFO.TempVars.movement.y = -INFO.TempVars.movement.y; ",
				" CommonObjManager.highlightSeconds( INFO.TempVars.obj, { color: MovementHelper.circleHighlightColor, timeoutSec: 1, shape: 'circle', sizeRate: 1.4 } ); "
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
			"chaseTargetEval": " ( INFO.TempVars.srcObj.itemData.color !== INFO.TempVars.trgObj.itemData.color && INFO.TempVars.srcObj.itemData.width_half > INFO.TempVars.trgObj.itemData.width_half ) ",
			"chaseMovementEval": " 'NOT YET IMPLEMENTED.. ' ", 
			"onCollision": "fight"
		},
		"fightLogic": {
			"fightWinSizeChangeRate": 0.2,
			"fightLoseSizeChangeRate": 0.7,
			"winEval": [
				" INFO.TempVars.winObj.itemData.strength++; ",
				" INFO.TempVars.winObj.itemData.width_half += INFO.WIN_SizeUpR; ",
				" INFO.TempVars.winObj.itemData.speed -= ( INFO.WIN_SizeUpR * INFO.WIN_SpeedDownR ); ",
				" CircleManager.adjustSizeMax( INFO.TempVars.winObj ); ",
				" CircleManager.adjustSpeedMin( INFO.TempVars.winObj ); ",
				" if ( INFO.TempVars.winObj.ref_Shape ) CircleManager.drawCircleShape( INFO.TempVars.winObj.ref_Shape, INFO.TempVars.winObj.itemData ); "
			],
			"loseEval": [
				" INFO.TempVars.loseObj.itemData.strength--; ",
				" INFO.TempVars.loseObj.itemData.width_half -= INFO.LOS_SizeUpR; ",
				" CircleManager.adjustSizeMin( INFO.TempVars.loseObj ); ",
				" if ( INFO.TempVars.loseObj.itemData.strength <= 0 ) { INFO.TempVars.loseObj.itemData.strength = 0; INFO.TempVars.loseObj.itemData.width_half = 0; } ",
				" if ( INFO.TempVars.loseObj.ref_Shape ) CircleManager.drawCircleShape( INFO.TempVars.loseObj.ref_Shape, INFO.TempVars.loseObj.itemData ); "
			]
		},
		"sizeChangeLogic": {
			"speedDownRate_bySizeUp": 0.2,
			"speedMin": 2.5,
			"width_halfMax": 25
		}
	}
};

// Used to set as INFO.GlobalSettings and use the values through out the App code.
// In Config.json, this can be overwritten..

// ------------------------------------
