// ============================
// = NOTE:
//
//    LocalStorage:
//      - put data in individual data?  Or put it in one data per app?
//
// ============================

function NoteStorageMng() {};

NoteStorageMng.key = "noteList";
NoteStorageMng.initialList = { noteList: [], lastIndex: 0 };

// --------------------------------------------------

// --- GET (READ)
// GET 
NoteStorageMng.getItem = async function( storageTypeStr, callBack )
{
  return StorageMng.getItem( storageTypeStr, NoteStorageMng.key, callBack );
};

// --- SET (SAVE) (CREATE/UPDATE)

// SET 
NoteStorageMng.setItem = async function( storageTypeStr, jsonVal, callBack )
{
  return StorageMng.setItem( storageTypeStr, NoteStorageMng.key, jsonVal, callBack );
};

// -----------------------------------------

// Get Initial List Json
NoteStorageMng.getInitialList = function()
{
  // Need to get independent object, not same referenced one.
  var listStr = JSON.stringify( NoteStorageMng.initialList );
  return JSON.parse( listStr );
};
