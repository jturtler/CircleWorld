//	- PhysicsHandler	- Class to manage physical related decision/detection --> collision with something..  detect bounds..
//						- Based on each object location..

function PhysicsHandler(stageObj, canvas_width, canvas_height) 
{
  var me = this;

  me.stageObj = stageObj;
  me.canvas_width = canvas_width;
  me.canvas_height = canvas_height;
  //me.proxyDistance = 100;
  //me.runOnce = true;

  me.performPhysics = function (kids) 
  {
    // reset
    var objInProxyList = {};

    // go through each kids and perform physics related tasks..
    kids.forEach((kid) => 
    {
      me.wallReachedNotify(kid, me.canvas_width, me.canvas_height);

      me.collectObjectProximity(kid, kids, objInProxyList);
    });

    // Draw line btween
    me.proxyLinesDraw(objInProxyList, me.stageObj);
    // https://7thzero.com/blog/how-draw-line-using-createjs-easeljs

    // Interests Build up
    me.kidsReact_InProxy( objInProxyList );

    // Decide on Action - from Interests
    kids.forEach( kid => 
    {
      kid.decideInterest();
    });

  };

  me.wallReachedNotify = function (kid, canvas_width, canvas_height) 
  {
    var ObjectLoc_Left = kid.x - kid.size;
    var ObjectLoc_Right = kid.x + kid.size;
    var ObjectLoc_Top = kid.y - kid.size;
    var ObjectLoc_Bottom = kid.y + kid.size;

    // When reaching left wall, we only notify it if it reach the position of 0 or less
    //	And the direction was left (minus), not right or straight down.
    if ( ObjectLoc_Left <= 0 && kid.movementX < 0 ) kid.addNotice_WallTouched('reachedWall_Left');
    else if ( ObjectLoc_Right >= canvas_width && kid.movementX > 0 ) kid.addNotice_WallTouched('reachedWall_Right');
    else if ( ObjectLoc_Top <= 0 && kid.movementY < 0 ) kid.addNotice_WallTouched('reachedWall_Top');
    else if ( ObjectLoc_Bottom >= canvas_height && kid.movementY > 0 ) kid.addNotice_WallTouched('reachedWall_Bottom');
  };

  me.collectObjectProximity = function (kid, kids, objInProxyList) 
  {
    kids.forEach((otherKid) => 
    {
      if (kid != otherKid) 
      {
        var distBtw = me.getDistance(kid, otherKid);

        if (distBtw < me.getProxyDistance( kid, otherKid ) ) 
        {
          var orderedCombo = me.getObj_OrderedCombo(kid, otherKid, distBtw);

          // Only add if not already in - find by key (property)
          if (!objInProxyList[orderedCombo.key])
            objInProxyList[orderedCombo.key] = orderedCombo.objs;
        }
      }
    });
  };


  me.getProxyDistance = function( kid1, kid2 )
  {
    var proxyDistance = 100;
    // Rather than using 100 as proxy distance, let's calculate the proxy - relative to object size(radius)
    // If radius is '10', the detection range could be 2 ~ 3 times the radius.. (of bigger object..)

    // In later time, the detection range should be for each object.  
    var biggerObjSize = ( kid1.size > kid2.size ) ? kid1.size : kid2.size;

    if ( biggerObjSize < 40 )
    {
      proxyDistance = 100;
    }
    else if ( biggerObjSize > 40 )
    {
      proxyDistance = biggerObjSize * 2.5;
    }

    return proxyDistance;
  };


  me.getObj_OrderedCombo = function (obj1, obj2, distance) 
  {
    var orderedCombo = { key: '', objs: {} };

    if (obj1.name < obj2.name) {
      orderedCombo.key = obj1.name + ':' + obj2.name;
      orderedCombo.objs.obj1 = obj1;
      orderedCombo.objs.obj2 = obj2;
    } else {
      orderedCombo.key = obj2.name + ':' + obj1.name;
      orderedCombo.objs.obj1 = obj2;
      orderedCombo.objs.obj2 = obj1;
    }

    orderedCombo.objs.distance = distance;

    return orderedCombo;
  };

  me.getDistance = function (obj1, obj2) {
    var xA = obj1.x;
    var yA = obj1.y;
    var xB = obj2.x;
    var yB = obj2.y;

    var xDiff = xA - xB;
    var yDiff = yA - yB;

    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  };


  me.proxyLinesDraw = function( objInProxyList, stageObj) 
  {
    Object.keys(objInProxyList).forEach((key) => 
    {
      var proxyData = objInProxyList[key];

      if (proxyData && proxyData.obj1 && proxyData.obj2) 
      {
        var obj1 = proxyData.obj1;
        var obj2 = proxyData.obj2;

        GraphicsService.addLineDraw( stageObj, obj1, obj2, Constants.COLOR_PROXYLINE );
      }
    });
  };

  // -------------------------------

  me.kidsReact_InProxy = function( objInProxyList )
  {
    // 'interestList' in each object will be reset after each move?

    Object.keys(objInProxyList).forEach((key) => 
    {
      var proxyData = objInProxyList[key];

      if (proxyData && proxyData.obj1 && proxyData.obj2) 
      {
        var obj1 = proxyData.obj1;
        var obj2 = proxyData.obj2;
        
        obj1.addInterest( obj2, proxyData.distance );
        obj2.addInterest( obj1, proxyData.distance );
      }
    });

  };

}
