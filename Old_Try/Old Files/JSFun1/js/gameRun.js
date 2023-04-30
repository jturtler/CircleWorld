
// CreateJS / easelJS Referenece Doc:
// http://www.createjs.com/getting-started

// ------------------------------------------
// -- Overall Design / Psudo Code
// ------------------------------------------
//
// init()
// {
//	 Setups ( Stage/Objects )
//
//   Render ( all by time interval )
// }
//
// ------------------------------------------


// Todo:
//		- Add boundary bounce
//		- Life indicator number show
//		- Life span (grow and die & rebirth) (or baby offspring)
//		- Collision action
//		- Click action
//		- Code by 'State' - 'Action'.  States: Stand/Walk/Run, Fight/Follow


// -----------------------------------------

var _keycode_w = 87;
var _keycode_a = 65;
var _keycode_s = 83;
var _keycode_d = 68;

var _bStop = false;

var _stage;
var _canvasBounds; 

var _startingPoint1 = { "locX": 200, "locY": 200 };
var _startingPoint2 = { "locX": 100, "locY": 100 };
var _initialSize = 15;

// -----------------------------------------

function init() 
{
	// -- Setup Stage and Objects
	var stage = setUp_StageAndObjects();

	// -- Render Objects In Stage
	setUp_Rendering( stage );


	setUpKeyDownAction( stage );
}

// -----------------------------------------


// ---------------------------------------------------
// -- Setups: Setup Stage and Objects, Setup Rendering

function setUp_StageAndObjects()
{
	var stage = new createjs.Stage( "demoCanvas" );

	var kid1 = createContainer( Kid, stage, "kid1", _initialSize, "Yellow", _startingPoint2, 4);
	var kid2 = createContainer( Kid, stage, "kid2", _initialSize, "Blue", _startingPoint1, -3);

	stage.addChild( kid1 );
	stage.addChild( kid2 );

	return stage;
}

function setUp_Rendering( stage )
{
	createjs.Ticker.framerate = 10;

	createjs.Ticker.addEventListener( "tick", handleRender );

	function handleRender( event ) 
	{
		if ( !_bStop )
		{
			//createjs.Ticker.setPause( false );
			//createjs.Ticker.setPaused( true );

			for ( i = 0; i < stage.numChildren; i++ )
			{
				stage.getChildAt( i ).performNext();
				//stage.getChildAt( i ).x += 3;
			}

			stage.update();
		}
	}
}



function setUpKeyDownAction( stage )
{
	window.onkeydown = function( event )
	{
		handleKeyDown( event, stage );	
	};


	outputMsgAdd( "Key: 's' to stop/start, 'a' to add new kid" );
}


// Handle Key Down Function
function handleKeyDown( event, stage ) 
{
    switch( event.keyCode ) 
	{
        case _keycode_s: 
			
			_bStop = !_bStop;

			var msg = ( _bStop ) ? "Stopped" : "Started";
			//createjs.Ticker.setPaused( _bStop );
			outputMsgAdd( msg );

			return false;
		case _keycode_a:
			
			addKid( stage );
			
			return false;
    }
}

function addKid( stage )
{
	var newKidName = "kid" + ( stage.numChildren + 1 );

	var newKid = createContainer( Kid, stage, newKidName, _initialSize, "Blue", _startingPoint1, -3);

	stage.addChild( newKid );

	outputMsgAdd( "Added " + newKidName );
}

function outputMsgAdd( msg )
{
	var outputDiv = document.getElementById( "divMsg" );
	
	outputDiv.innerHTML = msg + "<br>" + outputDiv.innerHTML;
}

// -- Setups: Setup Stage and Objects, Setup Rendering
// ---------------------------------------------------


// --------------------------------------
// -- Kids Class
function Kid( stage, name, size, color, locationX, locationY, speed )
{
	var me = this;

	me.stage = stage;
	me.canvasBoundsX = stage.canvas.width;
	me.canvasBoundsY = stage.canvas.height;

	me.name = name;
	me.size = size;  // radius
	me.color = color;
	me.locationX = locationX;
	me.locationY = locationY;
	me.speed = speed;
	me.movementX;
	me.movementY;

	me.tickCount = 0;
	me.age = 0;
	me.agingSpeed = 40;	// higher would make it age slower.
	me.middleAge = 5;
	me.sizeIncreaseRate = 2;

	me.flashActionNextId = 0;
	me.flashAction = {};  // id: { count: 0, action: "", color: "", sizePercentage: "" };

	me.collision;
	me.printStatus = false;

	// --------------------
	// Object Layer
	me.label = new createjs.Text( name, "normal 11px Arial", "White");
	me.shape = new createjs.Shape();


	// --------------------------------------------
	// ----- Methods ------------------------------

	// ----------------------------------------------
	// -- Events

	me.setUpClick = function()
	{
		me.shape.addEventListener( "click", me.performClick );
	}


	// On click, show the click reaction
	me.performClick = function()
	{
		console.log( 'click test: ' + me.name );

		me.addFlashAction( 10, "smallCircle", "Red", 50 );

		me.setDirection_Random( me.speed );
	}


	// -----------------------------------
	// --- Actions

	me.performNext = function()
	{
		me.tickCount++;
		var newAge = Math.floor( me.tickCount / me.agingSpeed );
		
		me.changeByAge( newAge );

		if ( me.size <= 0 )
		{
			me.deleteThisKid( me.stage );
		}	
		else
		{
			// paint over - after clearing
			me.paintClear( me.shape.graphics );
			me.paintShape( me.color, me.size, me.shape.graphics );

			me.displayFlash( me.flashAction );

			me.moveNext();
		}
	}


	// ------------  Flash Action Related ---------

	me.addFlashAction = function( count, action, color, sizePercentage )
	{
		me.flashAction[ me.flashActionNextId ] = { "count": count, "action": action, "color": color, "sizePercentage": sizePercentage };

		me.flashActionNextId++;	
	}

	me.removeFlashAction = function( id )
	{
		delete me.flashAction[ id ];
	}

	me.displayFlash = function( flashAction )
	{
		// For each flash action, paint them.
		for ( var propName in flashAction )
		{
			var item_flash = flashAction[ propName ];

			// Take care of flash handling
			if ( item_flash.count > 0 ) 
			{
				item_flash.count--;

				// remove the 
				if ( item_flash.action == "smallCircle" )
				{
					var newSize = Math.floor( me.size / ( 100 / item_flash.sizePercentage ) );
					me.paintShape( item_flash.color, newSize, me.shape.graphics );
				}

				if ( item_flash.count <= 0 )
				{
					me.removeFlashAction( propName );
				}
			}
		}
	}


	// -----------------

	me.changeByAge = function( newAge )
	{
		// If age is changed, set size accordingly
		if ( newAge != me.age )
		{
			var ageDiff = newAge - me.age;

			me.age = newAge;

			// Add short term flash when age is changed.
			me.addFlashAction( 6, "smallCircle", "Gray", 80 );

			me.size = me.setSizeByAgeChange( me.size, ageDiff, newAge, me.middleAge );

			console.log( 'new size: ' + me.size );

			me.setLabelChange( me.age );
		}
	}


	me.setSizeByAgeChange = function( size, ageChange, newAge, middleAge )
	{
		// for now, simply increase size 1 as age gets one older.
		var sizeChange = ageChange * me.sizeIncreaseRate;

		// if the age is over the middle Age, shrink size rather than increase.
		if ( newAge > middleAge ) sizeChange = sizeChange * -1;

		var newSize = size + sizeChange;

		return newSize;
	}


	me.paintClear = function( graphics )
	{
		if ( graphics !== undefined )
		{
			graphics.clear();
		}
	}

	
	// me.shape.graphics
	me.paintShape = function( color, size, graphics )
	{
		if ( graphics !== undefined )
		{
			graphics.beginFill( color );
			graphics.drawCircle( 0, 0, size );
			graphics.endFill();
		}
	}

	me.setLabelChange = function( age )
	{
		me.label.text = me.name + "\n" + age;
	}

	// ----------------------------------
	// ---- Movement Related -----


	me.setDirection_Random = function( speed )
	{
		var angle = Math.random() * Math.PI * 2;

		me.movementX = Math.cos( angle ) * speed;
		me.movementY = Math.sin( angle ) * speed;
	}

	me.setDirection_Bounce = function( bounceDirection )
	{
		if ( bounceDirection == "x" )
		{
			me.movementX = -me.movementX;
		}
		else if ( bounceDirection == "y" )
		{
			me.movementY = -me.movementY;
		}
	}

	me.moveNext = function()
	{
		me.setLocation( me.x + me.movementX, me.y + me.movementY );
	}


	me.setLocation = function( locX, locY )
	{
		if ( locX !== undefined )
		{
			me.x = locX;

			if ( ( me.x - me.size ) <= 0 
				|| ( me.x + me.size ) >= me.canvasBoundsX )
			{
				me.setDirection_Bounce( "x" );
			}
		}

		if ( locY !== undefined )
		{
			me.y = locY;

			if ( ( me.y - me.size ) <= 0 
				|| ( me.y + me.size ) >= me.canvasBoundsY )
			{
				me.setDirection_Bounce( "y" );
			}
		}
	}


	// -----------------------------------------
	// ---- Setup Methods -----

	me.setUpLabel = function()
	{
		me.label.textAlign = "center";
		me.label.textBaseline = "middle";
	}


	me.setUpShape = function()
	{
		if ( me.shape.graphics !== undefined )
		{
			me.shape.graphics.beginFill( me.color ).drawCircle( 0, 0, me.size );
		}
	}


	me.deleteThisKid = function( stage )
	{
		stage.removeChild( me );
	}

	// -----------------------------------------

	me.initializeObj = function()
	{
		me.setUpShape();
		me.setUpLabel();

		me.addChild( me.shape, me.label );

		me.setLocation( me.locationX, me.locationY );

		me.setDirection_Random( me.speed );

		me.setUpClick();
	}

	me.initializeObj();
}


// --------------------------------------
// -- Util Methods

function createContainer( childClass, stage, name, size, color, locationXY, movement ) 
{
  childClass.prototype = new createjs.Container();
  return new childClass( stage, name, size, color, locationXY.locX, locationXY.locY, movement );
}


// -- Util Methods
// --------------------------------------

