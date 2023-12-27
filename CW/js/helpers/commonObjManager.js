
function CommonObjManager() { };

CommonObjManager.selectedContainer;
CommonObjManager.selectedContainer_highlightShape;
CommonObjManager.selectedColor = 'yellow';


// ------------------------------------

CommonObjManager.highlightSeconds = function( container, option )
{
	try
	{
		if ( !option ) option = {};
		if ( !option.color ) option.color = 'yellow';
		if ( !option.timeoutSec ) option.timeoutSec = 1;
		if ( !option.shape ) option.shape = 'circle';  // rect, etc..
		if ( !option.sizeRate ) option.sizeRate = 2;
		// shape: 'circle/rect/etc..', timeout
	
		var itemData = container.itemData;
	
		var width_full = itemData.width_half * option.sizeRate;
	
		var highlightShape = new createjs.Shape();
		if ( option.shape === 'rect' )
		{
			var width_double = width_full * 2;
			highlightShape.graphics.setStrokeStyle(1).beginStroke( option.color ).drawRect( -width_full, -width_double, width_double, width_double * 2 );
		}
		else if ( option.shape === 'circle' )
		{	
			highlightShape.graphics.setStrokeStyle(1).beginStroke( option.color ).drawCircle(0, 0, width_full );
		}

		
		container.addChild( highlightShape );
		
		container.ref_highlightShape = highlightShape;	

		/*
		container.highlight_removal_timeoutCall = ( container ) => {
			if ( container.ref_highlightShape )
			{
				container.removeChild( container.ref_highlightShape );
				delete container.ref_highlightShape;
			}
		};
		*/
		
		setTimeout( () => {

			if ( container.ref_highlightShape )
			{
				container.removeChild( container.ref_highlightShape );
				// delete container.ref_highlightShape;
			}
		}, option.timeoutSec * 1000 );
	
	}
	catch( errMsg ) {  console.error( 'ERROR in CommonObjManager.highlightSeconds, ' + errMsg ); }
};


// ---------------------------------

CommonObjManager.clickObjectEvent = function ( e ) 
{
	var container = e.currentTarget;

	if ( container.itemData ) 
	{
		var itemData = container.itemData;
		console.log( itemData );


		// Clear other selections..
		CommonObjManager.clearPrevSelection();


		CommonObjManager.selectedContainer = container;
		
		var offset = 4;
		var size = itemData.width_half + offset;
		var widthHeight = size * 2;

		var selectedShape = new createjs.Shape();
		selectedShape.graphics.setStrokeStyle(1).beginStroke( CommonObjManager.selectedColor ).drawRect( -size, -size, widthHeight, widthHeight );	
		container.addChild( selectedShape );

		CommonObjManager.selectedContainer_shape = selectedShape;


		StageManager.stage.update(); // This could be optional
	}
};

CommonObjManager.clearPrevSelection = function () 
{
	if ( CommonObjManager.selectedContainer && CommonObjManager.selectedContainer_shape )
	{
		CommonObjManager.selectedContainer.removeChild( CommonObjManager.selectedContainer_shape );
	}
};
