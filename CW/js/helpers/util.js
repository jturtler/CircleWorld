
function Util() { }

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

// JSON Deep Copy Related
// ----------------------------------
