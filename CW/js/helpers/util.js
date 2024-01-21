
function Util() { };

// ---------------------------
// GET & CHECK Variable Types Check

Util.isTypeObject = function (obj) {
	// Array is also 'object' type, thus, check to make sure this is not array.
	if (Util.isTypeArray(obj)) return false;
	else return (obj !== undefined && obj !== null && typeof (obj) === 'object');
};

Util.isTypeArray = function (obj) {
	return (obj !== undefined && obj !== null && Array.isArray(obj));
};

Util.isTypeString = function (obj) {
	return (obj !== undefined && obj !== null && typeof (obj) === 'string');
};

// ---------------------------

Util.evalTryCatch = function( inputVal, option )
{
	var output = '';
	if ( !option ) option = {};

	if ( option.INFO_TempVars )
	{
		if ( !INFO.TempVars ) INFO.TempVars = {};  // INFO.TempVars is reserved for one time use Temporary varaibles - normally used on eval from conf..

		Object.keys( option.INFO_TempVars ).forEach( key => {
			INFO.TempVars[ key ] = option.INFO_TempVars[key];
		});
	}

	try
	{
		inputVal = Util.getEvalStr(inputVal); // Handle array into string joining
		if (inputVal) output = eval(inputVal);
	}
	catch( errMsg ) { console.error( 'ERROR in Util.evalTryCatch, ' + errMsg + ', inputVal: ' + inputVal ); }

	return output;
};


Util.getEvalStr = function (evalObj) 
{
	var evalStr = '';

	try {
		if ( evalObj )
		{
			if (Util.isTypeString(evalObj)) evalStr = evalObj;
			else if (Util.isTypeArray(evalObj)) evalStr = evalObj.join('\r\n');	
		}
	}
	catch (errMsg) {  console.log('ERROR in Util.getEvalStr, errMsg: ' + errMsg);  }

	return evalStr;
};

Util.onObjCreate_EvalFields = function( itemData )
{
	try
	{
		// itemData.onObjCreate_EvalFields = [ 'itemData.name', 'itemData.color' ];
		// spawnCircleProp.onObjCreate_EvalFields_Exceptions = [ 'itemData.color', 'itemData.team', 'itemData.startPosition' ];

		if ( !itemData.onObjCreate_EvalFields ) itemData.onObjCreate_EvalFields = [];
		if ( !itemData.onObjCreate_EvalFields_Exceptions ) itemData.onObjCreate_EvalFields_Exceptions = [];

		itemData.onObjCreate_EvalFields.forEach( itemStr => 
		{
			if ( itemData.onObjCreate_EvalFields_Exceptions.indexOf( itemStr ) >= 0 ) { }
			else
			{
				try 
				{
					var propStr = eval( itemStr );

					if ( Util.isTypeString( propStr ) ) eval( itemStr + ' = ' + propStr );
				}
				catch (errMsg) {  console.log( 'ERROR in Util.onObjCreate_EvalFields, evalKey operation, errMsg: ' + errMsg);  }
			}
		});

		delete itemData.onObjCreate_EvalFields;

	}
	catch (errMsg) {  console.log('ERROR in Util.onObjCreate_EvalFields, errMsg: ' + errMsg);  }
};


// ---------------------------

Util.decimalSet = function ( inputVal, decimal ) 
{
	var decimalFix;
	if ( !decimal ) decimalFix = 1;
	else if ( decimal === 1 ) decimalFix = 10;
	else if ( decimal >= 2 ) decimalFix = 100;  // if decimal place go over 2 place, cut off on 2
	
	return Math.round( inputVal * decimalFix ) / decimalFix ;
};


Util.getRandomInRange = function (start, end, option ) 
{
	if ( !option ) option = {};
	
	var range = end - start;

	var randRange = Util.decimalSet( Math.random() * range, option.decimal );

	return start + randRange;
};

Util.getRandomInList = function (list) 
{
	var randIndex = Util.getRandomInRange(0, list.length - 1);

	return list[randIndex];
};

Util.getRandomColorHex = function () 
{
	return '#' + Math.round(Math.random()*16777215).toString(16);
};

Util.cutDecimalPlace = function ( input, decimalPlace ) 
{
	return parseFloat( input.toFixed( decimalPlace ) );
};

// --------------------------------

Util.outputMsgAdd = function (msg, durationSec) 
{
	var divMsgTag = $('#divMsg');

	var quickMsgTag = $('<div class="quickMsg"></div>');
	quickMsgTag.text(msg);

	divMsgTag.append(quickMsgTag);

	if (durationSec) {
		setTimeout(function () {
			quickMsgTag.remove();
		}, durationSec * 1000);
	}
};


Util.getFromList = function (list, propertyName, value) {
	var item;

	if (list) {
		// If propertyName being compare to has not been passed, set it as 'id'.
		if (propertyName === undefined) {
			propertyName = "id";
		}

		for (i = 0; i < list.length; i++) {
			var listItem = list[i];

			if (listItem[propertyName] && listItem[propertyName] === value) {
				item = listItem;
				break;
			}
		}
	}

	return item;
};

Util.RemoveFromArrayAll = function (list, propertyName, value, option ) 
{
	if ( !option ) option = {};

	try {
		if (list) {
			for (var i = list.length - 1; i >= 0; i--) {
				var arrItem = list[i];

				if (arrItem[propertyName] === value) {
					if ( option.runFunc ) runFunc( arrItem );
					list.splice(i, 1);
				}
			}
		}
	}
	catch (errMsg) { console.log('ERROR in Util.RemoveFromArrayAll, ' + errMsg); }
};

Util.sortByKey = function (array, key, noCase, order, emptyStringLast) 
{
	try 
	{
		if (array && key) 
		{
			if (array.length == 0 || array[0][key] === undefined) return array;
			else 
			{

				// NOTE: no need to 'return' <-- this makes changes on the array itself!!!
				return array.sort(function (a, b) 
				{
					var x = a[key];
					var y = b[key];

					if (x === undefined) x = "";
					if (y === undefined) y = "";

					if ( noCase ) {
						x = x.toLowerCase();
						y = y.toLowerCase();
					}

					if (emptyStringLast !== undefined && emptyStringLast && (x == "" || y == "")) {
						if (x == "" && y == "") return 0;
						else if (x == "") return 1;
						else if (y == "") return -1;
					}
					else 
					{
						if (order === undefined || order === "asc" || order === "Acending" || order === "Ascending" ) return Util.sortCompare(x, y);
						else if ( order === "desc" || order === "Decending" || order === "Descending" ) return Util.sortCompare(y, x);
					}
				});
			}
		}
		else return array;
	}
	catch (errMsg) {
		console.log('ERROR in Util.sortByKey, ' + errMsg);
		return array;
	}
};


// For reverse or decending order, call param reversed: Util.sortCompare( y, x )
Util.sortCompare = function (x, y) {
	var returnVal = 0;

	try {
		if (x < y) returnVal = -1;
		else if (x > y) returnVal = 1;
		else returnVal = 0;
	}
	catch (errMsg) {
		console.log('ERROR in Util.sortCompare, ' + errMsg);
	}

	return returnVal;
};


Util.RemoveValInArray = function (list, value) {
	var index;

	if (list && value !== undefined) 
	{		
		var index = list.indexOf( value );
		if ( index >= 0 ) list.splice( index, 1 );
	}

	return index;
};

// --------------------------

Util.populateSelect = function ( selectTag, selectText, jsonArr ) 
{
	selectTag.empty();
	selectTag.append('<option value="">' + selectText + '</option>');

	if ( jsonArr ) 
	{
		jsonArr.forEach( item => 
		{
			var option = $( '<option></option>' );

			option.attr( "value", item.value ).text( item.text );

			selectTag.append( option );
		});
	}
};

// ----------------------------------
// JSON Deep Copy Related

// Handles both object and array
Util.cloneJson = function (jsonObj) {
	var newJsonObj;

	if (jsonObj) {
		try {
			newJsonObj = JSON.parse(JSON.stringify(jsonObj));
		}
		catch (errMsg) {
			console.log('ERROR in Util.cloneJson, errMsg: ' + errMsg);
		}
	}

	return newJsonObj;
};

// ----------------------------------
// JSON Merge Related

Util.mergeJson = function (destObj, srcObj) {
	if (srcObj) {
		for (var key in srcObj) {
			destObj[key] = srcObj[key];
		}
	}

	return destObj;
};


Util.mergeDeep = function (dest, obj, option) 
{
	if ( !option ) option = {};

	Object.keys(obj).forEach(key => {

		var dVal = dest[key];
		var oVal = obj[key];

		if (Util.isTypeArray(dVal) && Util.isTypeArray(oVal)) {
			if (option && option.arrOverwrite && oVal.length > 0) dest[key] = oVal;
			else Util.mergeArrays(dVal, oVal);
		}
		else if (Util.isTypeObject(dVal) && Util.isTypeObject(oVal)) {
			Util.mergeDeep(dVal, oVal, option);
		}
		else {
			if (option && option.keepTargetVal && dest[key] ) { } // with Option, keep original if both exists
			else dest[key] = oVal;
		}
	});
};

// --------------------------------

Util.getObjSubset = function( dataJson, propList )
{
	var objSubset = {};

	for( var propName in dataJson )
	{
		if ( propList.indexOf( propName ) >= 0 ) objSubset[ propName ] = dataJson[ propName ];
	}

	return objSubset;
};


Util.getArrProp_UniqueVals = function ( arr, prop ) 
{
	var uniqueVals = [];

	arr.forEach( item => 
	{
		var val = item[ prop ];

		if ( val ) {
			if ( uniqueVals.indexOf( val ) === -1 ) uniqueVals.push( val );
		}
	});

	return uniqueVals;
};
