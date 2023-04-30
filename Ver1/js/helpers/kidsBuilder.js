
//	- KidsBuilder Class - Builder class for Kids Object

function KidsBuilder(stageObj, kids, canvasWidth, canvasHeight) 
{
    var me = this;
  
    me.stageObj = stageObj;
    me.kids = kids;
    me.kidNo = 0;
  
    me.createKids = function (kidsNum) {
      for (var i = 0; i < kidsNum; i++) {
        me.createKid();
      }
    };
  
    me.createKid = function (name) {
      if (!name) name = 'kid' + me.kidNo; // TODO: We can create kids with somewhat related to the attribute..
  
      // TODO: Need to randomly give diff attributes to the kids...
      var kidObj = me.createContainer(
        Kid,
        name,
        Builder.newAttribute(),
        Builder.newLocationXY(canvasWidth, canvasHeight)
      );
      me.stageObj.addChild(kidObj);
      me.kids.push(kidObj);
  
      me.kidNo++;
  
      return kidObj;
    };
  
    // Generic 'Container' class (of createjs) - Could be something other than Kid class
    me.createContainer = function (childClass, name, attribute, locationXY) {
      childClass.prototype = new createjs.Container();
      return new childClass(
        me.stageObj,
        name,
        attribute,
        locationXY.locX,
        locationXY.locY
      );
    };
}
  