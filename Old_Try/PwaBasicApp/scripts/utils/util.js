
// -------------------------------------------
// -- Utility Class/Methods

function Util() {}


Util.disableTag = function( tag, isDisable )
{
	tag.prop('disabled', isDisable);
}

Util.sortByKey = function( array, key, noCase, order, emptyStringLast ) 
{
	if ( array.length == 0 || array[0][key] === undefined ) return array;
	else
		{
		return array.sort( function( a, b ) {
		
			var x = a[key]; 
			var y = b[key];

			if ( x === undefined ) x = "";
			if ( y === undefined ) y = "";

			if ( noCase !== undefined && noCase )
			{
				x = x.toLowerCase();
				y = y.toLowerCase();
			}

			if ( emptyStringLast !== undefined && emptyStringLast && ( x == "" || y == "" ) ) 
			{
				if ( x == "" && y == "" ) return 0;
				else if ( x == "" ) return 1;
				else if ( y == "" ) return -1;
			}
			else
			{
				if ( order === undefined )
				{
					return ( ( x < y ) ? -1 : ( ( x > y ) ? 1 : 0 ) );
				}
				else
				{
					if ( order == "Acending" ) return ( ( x < y ) ? -1 : ( ( x > y ) ? 1 : 0 ) );
					else if ( order == "Decending" ) return ( ( x > y ) ? -1 : ( ( x < y ) ? 1 : 0 ) );
				}
			}
		});
	}
};

Util.sortByKey_Reverse = function( array, key ) {
	return array.sort( function( b, a ) {
		var x = a[key]; var y = b[key];
		return ( ( x < y ) ? -1 : ( ( x > y ) ? 1 : 0 ) );
	});
};

Util.searchByName = function( array, propertyName, value )
{
	for( var i in array ){
		if( array[i][propertyName] == value ){
			return array[i];
		}
	}
	return "";
};

Util.trim = function( input )
{
	return input.replace( /^\s+|\s+$/gm, '' );
};

Util.trimTags = function( tags )
{
	tags.each( function() {
		$( this ).val( Util.trim( $( this ).val() ) );
	});
};

Util.replaceAllRegx = function( fullText, strReplacing, strReplacedWith )
{
	var rePattern = new RegExp( strReplacing, "g" );
	return fullText.replace( rePattern, strReplacedWith );
};

Util.replaceAll = function( fullText, keyStr, replaceStr )
{
	var index = -1;
	do {
		fullText = fullText.replace( keyStr, replaceStr );
		index = fullText.indexOf( keyStr, index + 1 );
	} while( index != -1 );

	return fullText;
};

Util.stringSearch = function( inputString, searchWord )
{
	if( inputString.search( new RegExp( searchWord, 'i' ) ) >= 0 )
	{
		return true;
	}
	else
	{
		return false;
	}
};

Util.upcaseFirstCharacterWord = function( text ){
	var result = text.replace( /([A-Z])/g, " $1" );
	return result.charAt(0).toUpperCase() + result.slice(1); 
};


Util.startsWith = function( input, suffix )
{
    return ( Util.checkValue( input ) && input.substring( 0, suffix.length ) == suffix );
};

Util.endsWith = function( input, suffix ) 
{
    return ( Util.checkValue( input ) && input.indexOf( suffix, input.length - suffix.length ) !== -1 );
};

Util.clearList = function( selector ) {
	selector.children().remove();
};

Util.moveSelectedById = function( fromListId, targetListId ) {
	return !$('#' + fromListId + ' option:selected').remove().appendTo('#' + targetListId ); 
};

Util.selectAllOption = function ( listTag ) {
	listTag.find('option').attr('selected', true);
};

Util.unselectAllOption = function ( listTag ) {
	listTag.find('option').attr('selected', true);
};

Util.getDeepCopy = function( obj )
{
	// Does not work..
	return $.extend( true, {}, obj );
};

Util.getObjectFromStr = function( str )
{
	return $.parseJSON( str );
};

Util.valueEscape = function( input )
{
	//input.replaceAll( '\', '\\' );
	//input = input.replace( "'", "\'" );
	input = input.replace( '"', '\"' );

	return input;
};

Util.valueUnescape = function( input )
{
	//input.replaceAll( '\', '\\' );
	//input = input.replace( "\'", "'" );
	input = input.replace( '\"', '"' );

	return input;
};

Util.reverseArray = function( arr )
{
	return arr.reverse();
};

// ----------------------------------
// Check Variable Related
Util.getProperValue = function( val )
{
	Util.getNotEmpty( val );
}

Util.getNotEmpty = function( input ) {

	if ( Util.checkDefined( input ) )
	{
		return input
	}
	else return "";
};

Util.checkDefined = function( input ) {

	if( input !== undefined && input != null ) return true;
	else return false;
};

Util.checkValue = function( input ) {

	if ( Util.checkDefined( input ) && input.length > 0 ) return true;
	else return false;
};

Util.checkDataExists = function( input ) {

	return Util.checkValue( input );
};

Util.checkData_WithPropertyVal = function( arr, propertyName, value ) 
{
	var found = false;

	if ( Util.checkDataExists( arr ) )
	{
		for ( i = 0; i < arr.length; i++ )
		{
			var arrItem = arr[i];
			if ( Util.checkDefined( arrItem[ propertyName ] ) && arrItem[ propertyName ] == value )
			{
				found = true;
				break;
			}
		}
	}

	return found;
};

Util.isInt = function(n){
    return Number(n) === n && n % 1 === 0;
};

Util.isNumeric = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

Util.getNum = function( n ) {
	var val = 0;
	
	try { 
		if ( n ) val = Number( n ); 
	}
	catch ( err ) { }
	
	return val;
};
// Check Variable Related
// ----------------------------------

// ----------------------------------
// List / Array Related

Util.RemoveFromArray = function( list, propertyName, value )
{
	var index;

	$.each( list, function( i, item )
	{
		if ( item[ propertyName ] == value ) 
		{
			index = i;
			return false;
		}
	});

	if ( index !== undefined ) 
	{
		list.splice( index, 1 );
	}

	return index;
};

Util.getFromListByName = function( list, name )
{
	var item;

	for( i = 0; i < list.length; i++ )
	{
		if ( list[i].name == name )
		{
			item = list[i];
			break;
		}
	}

	return item;
};

Util.getFromList = function( list, value, propertyName )
{
	var item;

	if ( list )
	{
		// If propertyName being compare to has not been passed, set it as 'id'.
		if ( propertyName === undefined )
		{
			propertyName = "id";
		}

		for( i = 0; i < list.length; i++ )
		{
			var listItem = list[i];

			if ( listItem[propertyName] && listItem[propertyName] === value )
			{
				item = listItem;
				break;
			}
		}
	}

	return item;
};


Util.getMatchData = function( settingData, matchSet )
{
	var returnData = new Array();
	
	$.each( settingData, function( i, item )
	{
		var match = true;

		for ( var propName in matchSet )
		{
			if ( matchSet[ propName ] != item[ propName ] ) 
			{
				match = false;
				break;
			}
		}

		if ( match )
		{
			returnData.push( item );
		}
	});

	return returnData;
};


Util.getFirst = function( inputList ) 
{
	var returnVal;

	if( inputList !== undefined && inputList != null && inputList.length > 0 )
	{
		returnVal = inputList[0];
	}
	
	return returnVal;
};


// $.inArray( item_event.trackedEntityInstance, personList ) == -1

Util.checkExistInList = function( list, value, propertyName )
{
	var item = Util.getFromList( list, value, propertyName );

	if ( item === undefined ) return false;
	else return true;
};


Util.checkEmptyId_FromList = function( list )
{
	return ( Util.getFromList( list, '' ) !== undefined );
};

Util.jsonObjToThisArray = function( jsonObj, inputStructure, namedArrStructure )
{
	// planned use: blockList will 'unpack' a complex json payload back into a single array 
	recurseInputArr = function( arrItem, arrObj, itm, callBack )
	{
		if ( arrObj[ (itm + 1) ] )
		{
			recurseInputArr( arrItem[ arrObj[ itm] ], arrObj, (itm + 1), callBack )
		}
		else
		{
			if ( callBack ) callBack( arrItem, arrObj[ itm] )
		}
	}

	var arrInp = inputStructure.split( '.' );
	var itm = 0;
	var thisItem = jsonObj[ arrInp[ itm] ];
	
	console.log( jsonObj );
	console.log( arrInp[ itm] );

	if ( arrInp[ (itm + 1) ] )
	{
		recurseInputArr( thisItem, arrInp, (itm + 1), function( innerData, innerSpec ){

			console.log( innerData );
			console.log( innerSpec );

		} )
	}
	else
	{
		console.log( thisItem );
		console.log( 'stopped here' );
	}
	


}

Util.jsonToArray = function( jsonData, structureConfig )
{
	//parameter structureConfig (optional), e.g. 'name:value', or 'id:val', etc;
	//to do: make recursive in the presence of nested json objects (typeOf obj === "object" )
	var strucConfArr = ( structureConfig ? structureConfig.split( ':' ) : undefined );
	var arrRet = [];
	var fldExcl = 'userName,password,';

	for( var keyName in jsonData )
	{
		if ( fldExcl.indexOf( keyName ) < 0 )
		{
			var obj = jsonData[ keyName ];

			if ( strucConfArr )
			{
				var jDat = { [ strucConfArr[ 0 ] ]: keyName, [ strucConfArr[ 1 ] ]: obj };
			}
			else
			{
				var jDat = { [ keyName ]: obj };
			}
	
			arrRet.push ( jDat );
		}
	}

	return arrRet;
};

// List / Array Related
// ----------------------------------

Util.getURLParameterByName = function( url, name )
{
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(url);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

Util.getURLParameterByVariables = function( url, name )
{
	var result = [];
	var idx = 0;
	var pairs = url.split("&");
	for( var i=0; i< pairs.length; i++ ){
		var pair = pairs[i].split("=");
		if( pair[0] == name ){
			result[idx] = pair[1];
			idx++;
		}
	}
	return result;
};

Util.getURL_pathname = function( loc )
{
	// '/api/apps/NetworkListing/index.html', loc = 4 by - '', 'api', 'apps', 'NetworkListing'
	var pathName = "";
	var strSplits = window.location.pathname.split( '/' );

	if ( strSplits.length >= loc )
	{
		pathName = strSplits[ loc - 1 ];
	}

	return pathName;
};


Util.copyProperties = function( source, dest )
{
	for ( var key in source )
	{
		dest[ key ] = source[ key ];
	}
};

Util.RemoveFromArray = function( list, propertyName, value )
{
	var index;

	$.each( list, function( i, item )
	{
		if ( item[ propertyName ] == value ) 
		{
			index = i;
			return false;
		}
	});

	if ( index !== undefined ) 
	{
		list.splice( index, 1 );
	}

	return index;
};

Util.getObjPropertyCount = function( list )
{
	var count = 0;

	for ( var prop in list )
	{
		count++;
	}

	return count;
};

// Check Variable or List Related
// -------
