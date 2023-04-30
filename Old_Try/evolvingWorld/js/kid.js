//  - Kids Class 		- Kids object...

function Kid(stage, name, attribute, locationX, locationY) {
  var me = this;

  // New
  me.stage = stage;
  me.canvasBoundsX = stage.canvas.width;
  me.canvasBoundsY = stage.canvas.height;

  me.name = name;

  me.attribute = attribute;

  me.size; // radius
  me.color;
  me.speed;

  me.x = locationX;
  me.y = locationY;

  me.wallTouches = [];
  // ----------------------------

  me.movementX;
  me.movementY;

  me.directionAngle;  // NEW
  me.changeAngle = 0;  // OBSOLETE

  me.interestList = [];

  me.currentInterest;

  me.maxTickAngleChange = 5;  // max angle change per tick is 5 degree.  If frameRate is 10, we have 10 tick per sec.  thus, 50 degree per sec max changing angle.

  // ----------------------------

  me.tickCount = 0;
  me.age = 0;
  me.agingSpeed = 40; // frameRate = 10 (per seconds). Thus, every 4 seconds, it ages.. But, we should not conver to seconds
  //   since we can later use 'frameRate' to speed up / speed down...

  me.middleAge = 10;
  me.sizeIncreaseRate = 2;

  me.sizeMax = 60;
  me.power = 0;


  me.directionChange_Rate = 20;    // NEW
  me.directionChange_DegreeLimit = 45;    // NEW // +/- 30 degree


  me.flashActionNextId = 0;
  me.flashAction = {}; // id: { count: 0, action: "", color: "", sizePercentage: "" };

  me.collision;
  me.printStatus = false;

  me.died = false;

  // --------------------
  // Object Layer
  me.label = new createjs.Text(name, 'normal 11px Arial', 'White');
  me.shape = new createjs.Shape();

  // --------------------------------------------
  // ----- Methods ------------------------------

  me.initializeObj = function () {
    // Expand the attribute
    me.color = me.attribute.color;
    me.speed = me.attribute.speed;
    me.size = me.attribute.size;

    me.setUpShape();
    me.setUpLabel();

    me.addChild(me.shape, me.label);

    //me.setLocation(me.x, me.y);

    me.directionAngle = Math.random() * 360;
    me.setDirectionXY_ByAngle( me.directionAngle, me.speed );

    me.setUpClick();
  };

  // ----------------------------------------------
  // -- Events

  me.setUpClick = function () {
    me.shape.addEventListener('click', me.performClick);
  };

  // On click, show the click reaction
  me.performClick = function () {
    console.log('click test: ' + me.name);

    Util.outputMsgAdd(JSON.stringify(me.getObjQuickInfo()), 10);
  };

  // -----------------------------------
  // --- Actions

  me.performNext = function () 
  {
    
    if ( me.currentInterest ) {
      //console.log( "me.performNext - currentInterest: " );
      //console.log( me.currentInterest );
    }


    // 1nd. Based on Interest, perform absorbing?
    me.Interest_Absorb( me.currentInterest );

    // 2st, make the directional location one movement - based on wall touch, interest..
    // Move Next, Change Direction, etc..
    me.moveNext( me.wallTouches, me.currentInterest, me.speed );

    // --------------

    me.tickCount++;

    var newAge = Math.floor( me.tickCount / me.agingSpeed );
    me.changeByAge(newAge);  // Not too good...  Changes age & size..

    // Direction
    //me.setDirectionChange_InFrequency( me.tickCount, me.directionChange_Rate, me.directionChange_DegreeLimit );

    // -----------------------

    if (me.size <= 0) 
    {
      me.deleteThisKid(me.stage);
      me.died = true;
    } 
    else 
    {
      // paint over - after clearing
      me.paintClear(me.shape.graphics);
      me.paintShape(me.color, me.size, me.shape.graphics);

      me.displayFlash(me.flashAction);
    }


    // Clear wallTouches after each perform
    me.wallTouches = [];
    me.interestList = [];
  };

  // -------------------------------------------
       
  me.addInterest = function( targetObj, distance )
  {
    me.interestList.push( { 'targetObj': targetObj, 'distance': distance } );
  };


  me.decideInterest = function()
  {
    // Interest Priority: 'fear' > 'hunger' > 'procreate' > 'wonder'
    //
    //    'fear' condition: 
    //          - diff color, larger than me --> run away from enemy
    //    'hunger' condition:
    //          - energy level down..  food/other smaller obj near by  --> Go toward to it..  (if health level reach 0, really slow moving?  hibernation?)
    //    'procreate' condition:
    //          - same color, on procreate turned on --> go toward to it
    //    'wonder' condition:
    //          - 

    // reset the interest..
    me.currentInterest = undefined;


    me.interestList.forEach( interest => {
      
      var targetObj = interest.targetObj;

      // fear case..
      if ( targetObj.color !== me.color && targetObj.size > me.size )  // Consider power level as well?
      {
        if ( !me.checkCurrInterestType( me.currentInterest, [ 'fear' ] ) )
        {
          me.currentInterest = interest;
          me.currentInterest.type = 'fear';
        }
      }
      //else if ( me.energy < me.energyHungerLvl )
      else if ( targetObj.color !== me.color && targetObj.size < me.size ) // Consider power level as well?
      {
        // Absorb the other one..  
        // NOTE: this only allows one ABSORB at a time!!!  Maybe it should do multiple absorb later?
        if ( !me.checkCurrInterestType( me.currentInterest, [ 'fear', 'hunger' ] ) )
        {
          me.currentInterest = interest;
          me.currentInterest.type = 'hunger';
        }
      }

    });

    // This 'finalIntest/currentInterest' will impect how 'performNext' will be done..  move in some other way..
    if ( me.currentInterest ) 
    {
      // Draw line for hunger following to target..
      if ( me.currentInterest.type === 'hunger' ) GraphicsService.addLineDraw( me.stage, me, me.currentInterest.targetObj, Constants.COLOR_HUNGERLINE );
    }
  };


  me.checkCurrInterestType = function( currentInterest, checkTypeArr )
  {
    return ( currentInterest && checkTypeArr.indexOf( currentInterest.type ) >= 0 );
  };


  me.Interest_Absorb = function( currentInterest )
  {
    if ( currentInterest && currentInterest.type === 'hunger' 
      && me.targetInTouch( currentInterest.distance, currentInterest.targetObj ) )
    {
      me.absorbTarget( currentInterest.targetObj );
    }
  };


  me.absorbTarget = function( targetObj )
  {
    // TODO: Absorbed energy goes to energy refurnish..
    // Rest goes to increase size?
    targetObj.size = targetObj.size - 2;

    if ( me.size < me.sizeMax ) me.size++;      
    else 
    {
      me.power++;
      me.setLabelChange( 'P' + me.power );
    }
  }; 


  me.targetInTouch = function( distance, target )
  {
    return ( distance <= ( me.size + target.size ) );
  };


  // ------------  Flash Action Related ---------

  me.addFlashAction = function (count, action, color, sizePercentage) 
  {
    me.flashAction[me.flashActionNextId] = {
      count: count,
      action: action,
      color: color,
      sizePercentage: sizePercentage,
    };

    me.flashActionNextId++;
  };

  me.removeFlashAction = function (id) 
  {
    delete me.flashAction[id];
  };

  me.displayFlash = function (flashAction) 
  {
    // For each flash action, paint them.
    for ( var propName in flashAction ) 
    {
      var item_flash = flashAction[propName];

      // Take care of flash handling
      if ( item_flash.count > 0 ) 
      {
        item_flash.count--;

        // remove the
        if (item_flash.action == 'innerCircle') 
        {
          var newSize = Math.floor(me.size / (100 / item_flash.sizePercentage));
          me.paintShape(item_flash.color, newSize, me.shape.graphics);
        } 
        else if (item_flash.action == 'outerCircle') 
        {
          // 'sizePercentage' should be changed to 'addedSize'
          var newSize = me.size + item_flash.sizePercentage;
          me.paintShape(item_flash.color, newSize, me.shape.graphics);
          me.paintShape(me.color, me.size, me.shape.graphics);
        }

        if (item_flash.count <= 0) 
        {
          me.removeFlashAction(propName);
        }
      }
    }
  };

  // -----------------

  me.changeByAge = function (newAge) {
    // If age is changed, set size accordingly
    if (newAge != me.age) {
      var ageDiff = newAge - me.age;

      me.age = newAge;

      // Add short term flash when age is changed.
      me.addFlashAction(2, 'outerCircle', Constants.COLOR_AGING, 2);

      me.size = me.setSizeByAgeChange(me.size, ageDiff, newAge, me.middleAge);

      //me.setLabelChange( me.age );
    }
  };

  me.setSizeByAgeChange = function (size, ageChange, newAge, middleAge) {
    // for now, simply increase size 1 as age gets one older.
    var sizeChange = ageChange * me.sizeIncreaseRate;

    // if the age is over the middle Age, shrink size rather than increase.
    if (newAge > middleAge) sizeChange = sizeChange * -1;

    var newSize = size + sizeChange;

    return newSize;
  };

  // ----------------------------
  me.setDirectionChange_InFrequency = function( tickCount, directionChange_Rate, directionChange_DegreeLimit )
  {
    if ( tickCount !== 0 )
    {
      var remainder = tickCount % directionChange_Rate;

      if ( remainder === 0 )
      {        
       // Angles ranging: +30  ~ -30 
        me.changeAngle = ( ( directionChange_DegreeLimit * 2 ) * Math.random() ) - directionChange_DegreeLimit;

        // TODO: Replace Random with the objects nearby location direction?

        me.directionAngle += me.changeAngle;
        
        // Since angles are always positive, add 360 and divide by 360 to get only remainder.
        me.directionAngle = ( me.directionAngle + 360 ) % 360;
        
        me.setDirectionXY_ByAngle( me.directionAngle, me.speed );
      }  
    }
  };


  // ----------------------------

  me.paintClear = function (graphics) {
    if (graphics !== undefined) {
      graphics.clear();
    }
  };

  // me.shape.graphics
  me.paintShape = function (color, size, graphics) {
    if (graphics !== undefined) {
      graphics.beginFill(color);
      graphics.drawCircle(0, 0, size);
      graphics.endFill();
    }
  };

  me.setLabelChange = function ( moreStr ) {
    me.label.text = me.name + '[' + moreStr + ']'; // + "\n" + age;
  };

  // ----------------------------------
  // ---- Movement Related -----
  
  me.setDirectionXY_ByAngle = function( angle, speed ) 
  {
    var anglePi = Math.PI * ( angle / 180 );

    me.movementX = Math.cos(anglePi) * speed;
    me.movementY = Math.sin(anglePi) * speed;
  };

  
  me.getAngleFromDirectionXY = function( movementX, movementY )
  {
    var angle = ( Math.atan2( movementY, movementX ) / Math.PI ) * 180;

    // QUESTION: Why I have to do this? 0 - 270.. somehow, 280 => -10..  () -0 ~ -90
    if ( angle < 0 )
    {
      angle = angle + 360;
    }

    return angle;
  };

  
  me.getAngleToTarget = function( targetObj )
  {
    var movementX = targetObj.x - me.x;
    var movementY = targetObj.y - me.y;
    
    var angle = ( Math.atan2( movementY, movementX ) / Math.PI ) * 180;

    // QUESTION: Why I have to do this? 0 - 270.. somehow, 280 => -10..  () -0 ~ -90
    if ( angle < 0 )
    {
      angle = angle + 360;
    }

    return angle;
  };


  me.getAngleCurr = function()
  {
    return me.getAngleFromDirectionXY( me.movementX, me.movementY );
  };

  me.getAngleTowardTarget = function( targetAngle, currAngle, maxAngle )
  {
    // paramInputs: 45, 130, 5
    // targetAngle = 45, currentAngle = 130, maxAngle = 5
    // we want to change to 45 evantually..

    // 45 - 130 = -85, but with max 5 at a time, the new angle is 130 - 5

    // 1st is target, 2nd is currAngle..
    // 100 - 30 = 70, but should limit to 5 degree each tick, thus, angle 5, thus, 30 + 5

    // 340 - 10 = 330  <-- but over 180, thus need to go the other way.. (angle direction)  
    //    330 - 360 = -30..  --> -5(max), 10 - 5..   

    // 10 - 350 = -340.  Because less than -180, switch.  -340 + 360 = 20..  


    // 1. Get simple angle diff number;
    var angleDiff = targetAngle - currAngle;

    // 2. Switch angle diff direction (if large) to smaller angle diff direction.
    if ( angleDiff > 180 ) angleDiff = angleDiff - 360;
    else if ( angleDiff < -180 ) angleDiff = angleDiff + 360;

    // 3. Limit the angle diff to max angle.
    if ( angleDiff > 0 && angleDiff > maxAngle ) angleDiff = maxAngle;
    if ( angleDiff < 0 && angleDiff > (-maxAngle) ) angleDiff = (-maxAngle);

    return angleDiff;
  };


  me.getAngleAwayTarget = function( targetAngle, currAngle, maxAngle )
  {
    // 45, 130, 5
    // want to go to 45 + 180 = 225 % 360 = 225 <-- new targetAngle..
    var newTargetAngle = ( targetAngle + 180 ) % 360;
    
    return me.getAngleTowardTarget( newTargetAngle, currAngle, maxAngle );
  };


  me.setDirection_moveAwayTarget = function( targetObj, speed )
  {
    var angleToTarget = me.getAngleToTarget( targetObj );
    var currAngle = me.getAngleCurr();

    var angleChange = me.getAngleAwayTarget( angleToTarget, currAngle, me.maxTickAngleChange );

    var newAngle = ( currAngle + angleChange + 360 ) % 360;
            
    me.setDirectionXY_ByAngle( newAngle, speed );
  };


  me.setDirection_moveTowardTarget = function( targetObj, speed )
  {
    var angleToTarget = me.getAngleToTarget( targetObj );
    var currAngle = me.getAngleCurr();

    var angleChange = me.getAngleTowardTarget( angleToTarget, currAngle, me.maxTickAngleChange );

    var newAngle = ( currAngle + angleChange + 360 ) % 360;
            
    me.setDirectionXY_ByAngle( newAngle, speed );
  };

  // ------------------------------------

  me.setDirection_Bounce = function (wallTouches) 
  {
    var bBounce = false;
  
    if ( wallTouches.indexOf('reachedWall_Left') >= 0 ) 
    {
      me.movementX = -me.movementX;
      bBounce = true;
    } 
    else if ( wallTouches.indexOf('reachedWall_Right') >= 0 ) 
    {
      me.movementX = -me.movementX;
      bBounce = true;
    } 
    else if ( wallTouches.indexOf('reachedWall_Top') >= 0 ) 
    {
      me.movementY = -me.movementY;
      bBounce = true;
    } 
    else if ( wallTouches.indexOf('reachedWall_Bottom') >= 0 ) 
    {
      me.movementY = -me.movementY;
      bBounce = true;
    }

    if ( bBounce )
    { 
      me.directionAngle = me.getAngleFromDirectionXY( me.movementX, me.movementY );
    }
  };


  me.moveNext = function( wallTouches, currentInterest, speed ) 
  {
    if ( wallTouches.length > 0 )
    {
      // sets me.movementX, me.movementY
      me.setDirection_Bounce( wallTouches );
    }
    else if ( currentInterest )
    {
      if ( currentInterest.type === 'fear' )
      {
        // Need to move away from it..  But can not turn right away..  Need to turn gradually..
        //currentInterest.targetObj
        me.setDirection_moveAwayTarget( currentInterest.targetObj, speed );

        me.addFlashAction( 1, 'innerCircle', Constants.COLOR_FEAR, Constants.FILL_PERCENT_FEAR );
      }
      else if ( currentInterest.type === 'hunger' )
      {
        // Move toward to it.
        //currentInterest.targetObj
        me.setDirection_moveTowardTarget( currentInterest.targetObj, speed );

        me.addFlashAction( 1, 'innerCircle', Constants.COLOR_CHASE, Constants.FILL_PERCENT_CHASE );        
      }
    }
    
    me.setLocation( me.x + me.movementX, me.y + me.movementY );
  };


  me.setLocation = function( locX, locY ) 
  {
    if ( locX ) me.x = locX;
    if ( locY ) me.y = locY;
  };

  // -----------------------------------------
  // ---- Setup Methods -----

  me.setUpLabel = function () {
    me.label.textAlign = 'center';
    me.label.textBaseline = 'middle';
  };

  me.setUpShape = function () {
    if (me.shape.graphics !== undefined) {
      me.shape.graphics.beginFill(me.color).drawCircle(0, 0, me.size);
    }
  };

  me.deleteThisKid = function (stage) {
    stage.removeChild(me);
  };

  // -----------------------------------------
  // ---- Others Methods -----

  me.addNotice_WallTouched = function ( notice ) 
  {
    me.wallTouches.push( notice );
  };

  me.getObjQuickInfo = function () 
  {

    var interestType = ( me.currentInterest ) ? me.currentInterest.type: '';

    return {
      name: me.name,
      age: me.age,
      size: me.size,
      power: me.power,      
      speed: me.speed,
      interest: interestType,
      angle: me.directionAngle.toFixed(0),
      changeAngle: me.changeAngle,
      attr: me.attribute,
      loc: [me.x.toFixed(0), me.y.toFixed(2)],
    };
  };

  // -----------------------------------------

  me.initializeObj();
}
