function idbManager() {}

// -------------------------------------
// ---- Overall Data Save/Get/Delete ---

idbManager.addData = function( dbPromise ) 
{
    dbPromise.then( function( db ) {
        var transaction = db.transaction( ['people'], 'readwrite' );
        var store = transaction.objectStore( 'people' );
        store.add( { name: 'Fred' } );
        return transaction.complete;
    });
};

idbManager.readData = function( dbPromise ) 
{
    dbPromise.then( function( db ) {
        var tx = db.transaction( ['people'], 'read' );
        var store = tx.objectStore( 'people' );
        return store.get( 'Fred' );
    });
};


idbManager.updateData = function( dbPromise ) 
{
    dbPromise.then( function( db ) {
        var tx = db.transaction( ['people'], 'readwrite' );
        var store = tx.objectStore( 'people' );
        var item = { name: 'Fred', email: 'fred@fred.com' };
        store.put( item );
        return tx.complete;
    });
};

idbManager.deleteData = function( dbPromise ) 
{
    dbPromise.then( function( db ) {
        var transaction = db.transaction( ['people'], 'readwrite' );
        var store = transaction.objectStore( 'people' );
        store.delete( 'Fred' );
        return tx.complete;
    });
};


// --------------------------------------------

idbManager.getAllData = function( dbPromise ) 
{
    dbPromise.then( function( db ) {
        var transaction = db.transaction( ['people'], 'readOnly' );
        var store = transaction.objectStore( 'people' );
        return store.getAll();
    });
};

// Use of cursor..
idbManager.getCursor_Read = function( dbPromise ) 
{
    dbPromise.then( function( db ) {
        var transaction = db.transaction( ['people'], 'readOnly' );
        var store = transaction.objectStore( 'people' );
        return store.openCursor();
    });
};


idbManager.getCursor_Read = function( dbPromise ) 
{
    idbManager.getCursor_Read( dbPromise ).then( function showItems( cursor ) {
        if ( !cursor ) { return; }

        // each property in this json object and display them..
        for ( var field in cursor.value ) 
        { console.log( cursor.value[ field ] ); }

        return cursor.continue().then( showItems );
    });
};
