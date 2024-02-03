
function OtherObjManager() { };

// Create a type of objects..  - like dark block..

// ------------------------------------
OtherObjManager.objType = 'otherObj';

OtherObjManager.otherObjProp_DEFAULT = {
	name: " CommonObjManager.getUniqueObjName( { type: OtherObjManager.objType } ); ",
	width_half: 8,
	speed: 0,
	strength: 0.1,
	strengthIncrease: 0,
	color: "black",
	team: "",
	onObjCreate_EvalFields: [ "itemData.name" ] //, "itemData.color", "itemData.team" ]	
};

// ------------------------------------

OtherObjManager.getContainers = function()
{
	return StageManager.getStageChildrenContainers( OtherObjManager.objType );
};

OtherObjManager.removeAllContainers = function()
{
	StageManager.removeStageChildrenContainers( OtherObjManager.objType );
};

// ------------------------------------

OtherObjManager.createObj = function ( inputJson )
{
	if ( !inputJson ) inputJson = {};
 
	// 1st, merge with DEFAULT prop.  2nd, merge with 'inputJson' prop.
	var objProp = ( INFO.baseOtherObjProp ) ? Util.cloneJson( INFO.baseOtherObjProp ): Util.cloneJson( OtherObjManager.otherObjProp_DEFAULT );
	Util.mergeJson( objProp, inputJson );
	
	Util.onObjCreate_EvalFields( objProp );


	// Get 'itemData' & 'container' created by common method.
	var container = CommonObjManager.createObj( objProp );

	var itemData = container.itemData;
	itemData.objType = OtherObjManager.objType;


	// -- SET EVENTS SECTION ---
	//		- Default event handler ('onFrameChange', 'onClick' )
	//itemData.onFrameMove_ClassBase = container => {};
	//if ( !itemData.onCanvasSizeChanged ) itemData.onCanvasSizeChanged = container => OtherObjManager.repositionContainer( container );

	if ( !itemData.onClick ) itemData.onClick = ( e ) => {  CommonObjManager.clickObjectEvent( e );  };
	if ( !itemData.onDblClick ) itemData.onDblClick = ( e ) => {  CommonObjManager.dblClickObjectEvent( e );  };

	//if ( itemData.onClick ) container.addEventListener("click", itemData.onClick );
	//if ( itemData.onDblClick ) container.addEventListener("dblclick", itemData.onDblClick );
	
	OtherObjManager.setObjShapes( container );

	return container;
};


OtherObjManager.setObjShapes = function ( container ) 
{
	var itemData = container.itemData;

	var width_half = itemData.width_half;

	// 'Portal' Shape Add
	var shape = new createjs.Shape();
	shape.graphics.beginFill(itemData.color).drawRect( -width_half, -width_half, width_half, width_half );
	container.ref_ShapeRect = shape;
	container.addChild( shape );
};


OtherObjManager.repositionPortals = function( portalContainerList )
{
	// RePosition only the ones without 'positionFixed': true.
	var containers = portalContainerList.filter( container => ( !container.itemData.positionFixed ) );
	var offset = 100;

	var positionCenter = AppUtil.getPosition_Center();
	var canvasHtml = WorldRender.infoJson.canvasHtml;


	if ( containers.length === 1 ) Util.mergeJson( containers[0], positionCenter );
	else if ( containers.length === 2 )
	{
		Util.mergeJson( containers[0], { x: offset, y: positionCenter.y } );
		Util.mergeJson( containers[1], { x: canvasHtml.width - offset, y: positionCenter.y } );
	}
	else if ( containers.length === 3 )
	{
		Util.mergeJson( containers[0], { x: offset, y: offset } );
		Util.mergeJson( containers[1], { x: canvasHtml.width - offset, y: offset } );
		Util.mergeJson( containers[2], { x: canvasHtml.width - offset, y: canvasHtml.height - offset } );
	}
	else if ( containers.length === 4 )
	{
		Util.mergeJson( containers[0], { x: offset, y: offset } );
		Util.mergeJson( containers[1], { x: canvasHtml.width - offset, y: offset } );
		Util.mergeJson( containers[2], { x: canvasHtml.width - offset, y: canvasHtml.height - offset } );
		Util.mergeJson( containers[3], { x: offset, y: canvasHtml.height - offset } );
	}
	else if ( containers.length === 5 )
	{
		Util.mergeJson( containers[0], { x: offset, y: offset } );
		Util.mergeJson( containers[1], { x: canvasHtml.width - offset, y: offset } );
		Util.mergeJson( containers[2], { x: canvasHtml.width - offset, y: canvasHtml.height - offset } );
		Util.mergeJson( containers[3], { x: offset, y: canvasHtml.height - offset } );
		Util.mergeJson( containers[4], positionCenter );
	}
	else if ( containers.length > 6 )
	{
		Util.mergeJson( containers[0], { x: offset, y: offset } );
		Util.mergeJson( containers[1], { x: canvasHtml.width - offset, y: offset } );
		Util.mergeJson( containers[2], { x: canvasHtml.width - offset, y: canvasHtml.height - offset } );
		Util.mergeJson( containers[3], { x: offset, y: canvasHtml.height - offset } );
		Util.mergeJson( containers[4], positionCenter );

		for ( var i = 5; i < containers.length; i++ ) {  Util.mergeJson( containers[i], AppUtil.getPosition_Random() );  }
	}
};
