// -------------------------------------------
// -- ConfigManager Class/Methods

function ConfigManager() {}

// ==== Methods ======================

ConfigManager.loadConfigFile = function( configFileName, returnFunc )
{    
	$.getJSON( configFileName, function( dataJson )
	{
		returnFunc( dataJson );

  	}).fail( err => {
		alert( 'ERROR in ConfigManager.loadConfig, ' + err );
  	});
};