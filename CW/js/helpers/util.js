
function Util() { };

// ---------------------------
// GET & CHECK Variable Types Check

Util.isTypeObject = function (obj) {
	// Array is also 'object' type, thus, check to make sure this is not array.
	if (Util.isTypeArray(obj)) return false;
	else return (obj !== undefined && typeof (obj) === 'object');
};

Util.isTypeArray = function (obj) {
	return (obj !== undefined && Array.isArray(obj));
};

Util.isTypeString = function (obj) {
	return (obj !== undefined && typeof (obj) === 'string');
};

// ---------------------------

Util.evalTryCatch = function( inputVal )
{
	try
	{
		inputVal = Util.getEvalStr(inputVal); // Handle array into string joining
		if (inputVal) eval(inputVal);
	}
	catch( errMsg ) { console.error( 'ERROR in Util.evalTryCatch, ' + errMsg ); }
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


// ---------------------------

Util.getRandomInRange = function (start, end) 
{
	var range = end - start;

	var randRange = Math.floor(Math.random() * range);

	return start + randRange;
};

Util.getRandomInList = function (list) 
{
	var randIndex = Util.getRandomInRange(0, list.length - 1);

	return list[randIndex];
};

Util.getRandomColorHex = function () 
{
	return '#' + Math.floor(Math.random()*16777215).toString(16);
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