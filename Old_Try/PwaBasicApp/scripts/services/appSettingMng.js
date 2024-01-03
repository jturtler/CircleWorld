// ============================
// = NOTE:
//
//    Handle saving/loading of last accessed app setting data.
//
// ============================

function AppSettingMng() {};

AppSettingMng.key = "noteAppSetting";
AppSettingMng.storageTypeStr = StorageMng.StorageType_LocalStorage;  // Store this setting val on localStorage for now.

AppSettingMng.initialJson = { storageType: '', extraDataSize: 0 }; 

// --------------------------------------------------
AppSettingMng.getSettingJson = async function( callBack )
{
  return StorageMng.getItem( AppSettingMng.storageTypeStr, AppSettingMng.key, callBack );
};

AppSettingMng.saveSettingJson = async function( jsonVal, callBack )
{
  // jsonVal - should be changed..
  return StorageMng.setItem( AppSettingMng.storageTypeStr, AppSettingMng.key, jsonVal, callBack );
};

// ---------------------------------

// Get Initial Json
AppSettingMng.getInitialJson = function()
{
  // Need to get independent object, not same referenced one.
  var jsonStr = JSON.stringify( AppSettingMng.initialJson );
  return JSON.parse( jsonStr );
};
