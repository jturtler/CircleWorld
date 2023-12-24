
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
