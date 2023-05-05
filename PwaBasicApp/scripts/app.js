// -------------------------------------------
// -- App Class/Methods
// -- Thoughts on Organizing ----------
//    - With React Like, we could have 'init/construct', 'render', 'event' phase
//    - Other way of class methods/structure dividing?
//    * Throw Exception in Async/Promise - Use Reject -> https://www.valentinog.com/blog/throw-async/
// ------------------------------------

function App()
{
	var me = this;

	// --- Tags ------------------------------------

  // -- 'Note' Input & List Related --
	me.btnMainInputBtn_AddTag = $( '#btnMainInputBtn_Add' );
	me.mainInputTag = $( '#mainInput' );
	me.divMainListTag = $( '#divMainList' );
	me.divResultTag = $( '#divResult' );

  // -- 'Storage' type selection Related
  me.selStorageTag = $( '#selStorage' );
  me.btnCopyToOtherTag = $( '#btnCopyToOther' );   

  // -- 'MoreFeature' Show/Hide Related --
  me.divMoreFeatureTag = $( '#divMoreFeature' );
	me.spanExpandSignTag = $( '#spanExpandSign' );
  me.divHiddenPartTag = $( '#divHiddenPart' );

  // -- 'Note' Auto/Bulk Generate Related --
  me.inputNoteGen_PreNameTag = $( '#inputNoteGen_PreName' );
  me.inputNoteGen_ItemNumberTag = $( '#inputNoteGen_ItemNumber' );
  me.btnGenNoteItemsTag = $( '#btnGenNoteItems' );

  // -- 'Note Extra Data' Set Related --
  me.setExtraDataInputTag = $( '#setExtraDataInput' );
  me.btnExtraDataUpdateTag = $( '#btnExtraDataUpdate' );

  // -- 'RepeatUpdate' Related --
  me.inputSetRepeatUpdateTag = $( '#inputSetRepeatUpdate' );
  me.inputRepeatUpdateTimeDelayTag = $( '#inputRepeatUpdateTimeDelay' );
  me.btnRepeatUpdateTag = $( '#btnRepeatUpdate' );
  me.btnRepeatStopTag = $( '#btnRepeatStop' );

	// --- App variables ---------------
  me.noteListJson;  // Main Note Data Json - noteListJson with some structure
  me.appSettingsJson;  // App Settings Data Json - with some structure

  me.storageType = StorageMng.StorageType_LocalStorage; // default selection?  Could be undefined or empty String?

  me.extraData_OneSize = "0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789";

  me.extraDataStr = "";
  me.repeatStop = false;

	// =============================================

  // me.initialize = function() {};
  
  // Use 'run' name instead?
  me.run = function()
	{
    //console.log( 'Running App' );
   
    try
    {
      me.runCallBackTest();

      // Retrieve AppSetting Data or Get Initial Data
      me.getInitialAppSettingsLoad( function( appSettingsJson ) {

        me.appSettingsJson = appSettingsJson;
        me.applyAppSettingsData( appSettingsJson );
        console.log( me.appSettingsJson );  

        // Retrieve NoteList Data or Get Initial Data
        me.getInitialNoteListDataLoad( me.storageType, function( noteListJson ) {

          console.log( noteListJson );
          me.noteListJson = noteListJson;

          // Sample test error thrown under this method..
          me.render();
        });    

      });
    }
    catch( err )
    {
      alert( "Error Caught in 'run': " + err ); 
    }
  
  };

  // Entire app display..
	me.render = function() // - Need this if we need to call rendering often/from other place..
  {
    me.selStorageTag.val( me.appSettingsJson.storageType );

    me.populateNoteList( me.noteListJson );
      
    me.displayAppResultNote();

    me.displayHiddenPartData();

    //me.throwError();
  };

  me.throwError = function()
  {
    throw "Error Test";
  }

	// =============================================
	// === EVENT HANDLER METHODS ===================

	me.btnMainInputBtn_AddTag.click( function() {

    var inputNoteVal = Util.trim( me.mainInputTag.val() );

    if ( !inputNoteVal ) alert( 'Empty value not allowed!' );
    else
    {
      me.addNote( me.mainInputTag.val() );

      me.populateNoteList( me.noteListJson );  
    }
  });

  me.selStorageTag.change( function() {

    var selStorageType = me.selStorageTag.val();
    me.appSettingsJson.storageType = selStorageType;
    me.saveCurrentAppSettings().then( () => {

      me.setStorageType( selStorageType );

      me.run();
    });
  });


  me.btnCopyToOtherTag.click( function() {

    var copyToStorageType = ( me.storageType === StorageMng.StorageType_LocalStorage ) ? StorageMng.StorageType_IndexedDB : StorageMng.StorageType_LocalStorage;

    me.saveNoteListInStorage( copyToStorageType, me.noteListJson ).then( () => 
    {
      alert( 'Copied data to localStoage' );      
    }).catch( function( err ) {
      alert( 'Failed to save to localStorage. ErrMsg: ' + err );
    });

  });


  me.divMoreFeatureTag.click( function() {

    me.switchDivHiddenPart( me.spanExpandSignTag, me.divHiddenPartTag );
  });

  
  me.btnGenNoteItemsTag.click( function() 
  {
    var preName = me.inputNoteGen_PreNameTag.val();
    var genItemNum = Number( me.inputNoteGen_ItemNumberTag.val() );
    
    // me.initNoteListData()
    me.noteListJson = NoteStorageMng.getInitialList();
    //var noteArr = me.noteListJson.noteList;

    for ( i = 0; i < genItemNum; i++ )
    {
      // me.addNote( 'noteStr' );  <-- with extra...
      me.addNewItem( me.noteListJson, preName + '_' + i );
    }

    // Save only once at the end?
    me.saveNoteListInStorage( me.storageType, me.noteListJson ).then( () => {

      me.render();
    });

  });
  

  me.btnExtraDataUpdateTag.click( function() 
  {
    // NOTE: This should be CallBacks or Promise, so that each step finishes and call next ones..
    
    me.sizeMeasureStr( JSON.stringify( me.noteListJson ), function( size ) {

      console.log( 'PREVIOUS total me.noteListJson size = ' + size );      

      // Save the changes <-- but this will be done a bit later since saving is delayed operation (async..)
      me.appSettingsJson.extraDataSize = Number( me.setExtraDataInputTag.val() );
      me.saveCurrentAppSettings().then( () => {

        // for performance reason, set the value string to global variable.    
        me.setExtraDataBySize( me.appSettingsJson.extraDataSize );

        // Make Changes to actual data in noteListJson (each item) 
        me.noteListJson.noteList.forEach( function( item ) {
          me.changeExtraDataSize( item );
        });
        
        // After all this, save to storage
        me.saveNoteListInStorage( me.storageType, me.noteListJson ).then( () => {

          me.sizeMeasureStr( JSON.stringify( me.noteListJson ), function( size ) {
            console.log( 'AFTER [Size: ' + me.appSettingsJson.extraDataSize + '], total me.noteListJson size = ' + size );
          } );  
        }).catch( function(err) {

          alert( 'Failed to apply Updated Extra Data.  ErrMsg: ' + err );
        });
      });
    } );
  });

  
  me.btnRepeatUpdateTag.click( function() 
  {
    var repeatNum = me.inputSetRepeatUpdateTag.val();
    var timeDelay = me.inputRepeatUpdateTimeDelayTag.val();

    me.repeatStop = false;

    me.performRecurrCallBack( me.btnExtraDataUpdateTag, timeDelay, 0, repeatNum, function( endingMsg ) {

      var finishMsg = 'Finished Repeat Update: ' + endingMsg;
      console.log( finishMsg );
      alert( finishMsg );
    });

  });

  me.btnRepeatStopTag.click( function() {
    me.repeatStop = true;
  });

	// =============================================

	// =============================================
	// === OTHER INTERNAL/EXTERNAL METHODS =========

  // ---------------------------------
  // AppSettings Data Save Related 
  me.applyAppSettingsData = function( appSettingsJson )
  {
    me.setStorageType( appSettingsJson.storageType );

    me.setExtraDataBySize( appSettingsJson.extraDataSize );
  };

  me.setStorageType = function( selStorageType )
  {
    if ( selStorageType === 'idb' ) me.storageType = StorageMng.StorageType_IndexedDB;
    else me.storageType = StorageMng.StorageType_LocalStorage;
    // even if 'selStorageType' is empty, set it as 'localStorage'
  }

  me.saveCurrentAppSettings = async function()
  {
    // Call for save
    return AppSettingMng.saveSettingJson( me.appSettingsJson );
    //.then( function( val ) {
    //}).catch( function( err ) {
  };

  // ---------------------------------
  // 'RepeatUpdate' related methods

  me.performRecurrCallBack = function( btnTag, delayTime, i, total, returnFunc ) 
  {
    // If it reaches the end or repeatStop has been called, end the recurrsion.
    if ( i >= total || me.repeatStop ) returnFunc( ' ===> Reached End, count: ' + total );
    else
    {
      console.log( ' ===> Update clicking for index: ' + i );

      btnTag.click();

      setTimeout( function() {
        me.performRecurrCallBack( btnTag, delayTime, i + 1, total, returnFunc );
      }, delayTime );
  
    }
  };

  // ---------------------------------
  // 'Render' related methods? 

  me.populateNoteList = function( noteListJson )
  {
    // Clear mainDiv html
    me.divMainListTag.html( '' );

    // Populate item as HTML tag
    noteListJson.noteList.forEach( function( item ) {
      me.populateNoteTag( item, me.divMainListTag );
    });

    // NOTE: Consider 'var' string templating...

    //HtmlTemplate.getTemplateFileWithJsonList( "template/noteItem.html", noteListJson.noteList, function( divTag ) {
        // var itemTag = divTag.find(".divNoteItem");
    //    me.divMainListTag.append( divTag );
    //});
  };
  
  me.populateNoteTag = function( item, divMainListTag )
  {
    // TODO: Should use Template!!!!
    var itemTag = $( '<div class="divNoteItem" keyIndex="' + item.keyIndex + '" >' + item.note + '</div>' );

    // Add click event as well here.
    itemTag.click( me.handleClick_NoteItemTag );

    divMainListTag.append( itemTag );
  };

  me.handleClick_NoteItemTag = function()
  {
    var selectedNoteItemTag = $( this );

    // Add class
    me.clearMark_AllNoteItems();
    me.markOneNoteItem( selectedNoteItemTag );

    console.log( me.getNoteItemByKeyIndex( me.noteListJson, selectedNoteItemTag.attr( 'keyIndex' ) ) );  
  };

  me.clearMark_AllNoteItems = function()
  {
    $( 'div.divNoteItem' ).removeClass( 'itemMarked' );
  };

  me.markOneNoteItem = function( noteItemTag )
  {
    noteItemTag.addClass( 'itemMarked' );
  };

  me.getNoteItemByKeyIndex = function( noteListJson, i )
  {    
    return Util.getFromList( noteListJson.noteList, Number( i ), 'keyIndex' );
  };


  me.displayAppResultNote = function()
  {
    me.divResultTag.html( '' );

    me.divResultTag.append( '<div>storageType: ' + me.storageType + '</div>' );
    //me.divResultTag.append( '<div>storageType: ' + me.storageType + '</div>' );
  };

  me.displayHiddenPartData = function()
  {
    var size = ( me.appSettingsJson.extraDataSize ) ? me.appSettingsJson.extraDataSize : 0;

    me.setExtraDataInputTag.val( size );
  };

  // ---------------------------------
  // Add New Related

  me.addNote = function( noteVal )
  {    
    // Add new item in Json
    var noteListJson_Changed = me.addNewItem( me.noteListJson, noteVal );

    // Save to storage
    // CallBack Call
    //NoteStorageMng.setItem( me.storageType, noteListJson_Changed, function( err, val ) { }

    // Promise Call
    me.saveNoteListInStorage( me.storageType, noteListJson_Changed );
  };

  
  me.saveNoteListInStorage = async function( storageType, noteListJson )
  {
    return NoteStorageMng.setItem( storageType, noteListJson );
    //.then( function( val ) {
    //}).catch( function( err ) {
   
  }

  me.addNewItem = function( noteListJson, noteVal )
  {
    var newIndexNo = me.getLastIndex( noteListJson ) + 1;

    var newNoteItem = { keyIndex: newIndexNo, note: noteVal, extraData: me.extraDataStr };  // need to add extra data here as well..

    noteListJson.noteList.push( newNoteItem );

    noteListJson.lastIndex = newIndexNo;

    return noteListJson;
  };

  me.getLastIndex = function( noteListJson )
  {
    var lastIndex = noteListJson.lastIndex;
    return ( lastIndex ) ? lastIndex : 0;
  };


  // ---------------------------------
  // Initial AppSettings & Note List Data Related

  me.getInitialAppSettingsLoad = function( returnFunc ) 
  {
    // function( appSettingsJson ) {
    AppSettingMng.getSettingJson().then( function( val ) {

      var jsonData = ( val ) ? val : AppSettingMng.getInitialJson();

      returnFunc( jsonData );

    }).catch( function( err ) {
      console.log( 'getInitialAppSettingsLoad Error Catch!' );
      console.log( err );
    });      
  };


  // Get Initial Note List Data Load - after load, save to App Variable which keeps updated data.
  //  - If data is empty, set the data up with initial json structure.
  me.getInitialNoteListDataLoad = function( storageType, returnFunc )
  {
    // If empty (1st time use), get pre-defined initial data.

    // Promise Call
    NoteStorageMng.getItem( storageType ).then( function( val ) {

      var jsonListData = ( val ) ? val : NoteStorageMng.getInitialList();
      returnFunc( jsonListData );

    }).catch( function( err ) {
      console.log( 'getInitialDataLoad Error Catch!' );
      console.log( err );
      throw err;
    });

    // CallBack Call
    //NoteStorageMng.getItem( me.storageType, function( err, val ) {
    //  var jsonListData = ( val ) ? val : NoteStorageMng.getInitialList();
    //  returnFunc( jsonListData );  });

  };

  // ---------------------------------
  // OTHERS ETC.. Related

  me.switchDivHiddenPart = function( spanExpandSignTag, divHiddenPartTag )
  {
    var expanded = spanExpandSignTag.attr( 'expanded' );

    if ( expanded === 'Y' ) 
    {
      divHiddenPartTag.hide( 400 );
      spanExpandSignTag.html( '[+]' ).attr( 'expanded', 'N' );
    }
    else 
    {
      divHiddenPartTag.show( 400 );
      spanExpandSignTag.html( '[-]' ).attr( 'expanded', 'Y' );
    }
  };

  
  me.changeExtraDataSize = function( item )
  {
    item.extraData = me.extraDataStr;    
  };


  me.setExtraDataBySize = function( size )
  {
    // 'size' could be undefined?
    if ( size )
    {
      me.extraDataStr = "";

      for ( i = 0; i < size; i++ )
      {
        // 100 char.
        me.extraDataStr += me.extraData_OneSize;
      }
  
      me.sizeMeasureStr( me.extraDataStr, function( size ) {
        console.log( 'Each Note ExtraData size = ' + size );
      });  
    }
  };

  
  me.sizeMeasureStr = function( allStrings, returnFunc ) 
  {
    var size = 3 + ( ( allStrings.length * 16 ) / ( 8 * 1024 ) ) + ' KB';

    if ( returnFunc ) returnFunc( size );
    else console.log( 'size = ' + size );
  };

  // -----------------------------
  // --- Call Back & Test Related  
  me.runCallBackTest = function()
  {
    me.callBackTest( function() {
      console.log( "test 1" );
      me.callBackTest( function() {
        console.log( "test 2" );
        //me.throwError();
        setTimeout( function() {
          // Now, this goes to different time stream..
          console.log( 'after test timeout ' );
        }, 1000 );
      });
    });
  
    console.log( "test 3" );
  };


  me.callBackTest = function( returnFunc )
  {
    // some processing...
    try
    {
      returnFunc();
    }
    catch( err )
    {
      console.log( 'callBackTest ErrCatch: ' + err );
      throw err;
    }
  };


	// ======================================

	//me.initialize();
}


// ==========================================
// Test Note
/*

me.testIDB = function()
{
    //,
    //localforage.WEBSQL,
    //localforage.LOCALSTORAGE

  localforage.setDriver( localforage.INDEXEDDB ).then(function() {
  //localforage.setDriver([localforage.INDEXEDDB]).then(function() {

    var key = 'STORE_KEY2';
    // var value = 'What we save offline';
    var value = 'asdf';
    value[0] = 65
    // var value = undefined;
    var UNKNOWN_KEY = 'unknown_key';
  
    localforage.setItem(key, value, function() {
      console.log('Using:' + localforage.driver());
      console.log('Saved: ' + value);
  
      localforage.getItem(key).then(function(readValue) {
        console.log('Read: ', readValue);
      });
  
      // Since this key hasn't been set yet, we'll get a null value
      localforage.getItem(UNKNOWN_KEY, function(err, readValue) {
        console.log('Result of reading ' + UNKNOWN_KEY, readValue);
      });
    });
  });
};

// console.log( 'localForage indexedDB support: ' + localforage.supports(localforage.INDEXEDDB) );

// READY
localforage.ready().then(function() {
    // This code runs once localforage
    // has fully initialized the selected driver.
    console.log(localforage.driver()); // LocalStorage
}).catch(function (e) {
    console.log(e); // `No available storage method found.`
    // One of the cases that `ready()` rejects,
    // is when no usable storage driver is found
});
// Even though localForage queues up all of its data API method calls, ready() provides a way to determine whether the asynchronous driver initialization process has finished. That’s useful in cases like when we want to know which driver localForage has settled down using.

*/