
//	- StageObjectBuilder Class - Builder class for Stage Object

function StageObjectBuilder() {};

// NOTE: These are not 'stageObj', but are definition of obj inner info..

StageObjectBuilder.createStageObjs_Samples = function( objNum )
{
  var stageObjs = [];

  for (var i = 0; i < objNum; i++) {
    stageObjs.push( StageObjectBuilder.createStageObj( { objType: 'circle' } ) );
  }

  return stageObjs;
};


StageObjectBuilder.createStageObj = function( option )
{
  var stageObj = {};
  
  var OBJ_COLOR_LIST = ['#7C9AFC', '#A0DE8F', '#F0F58C', 'Orange'];

  if ( option.objType ) stageObj = option.objType;

  stageObj.speed = Util.getRandNumBtw(5, 8);  // TODO: 'Sample' obj should be used later..
  stageObj.size = Util.getRandNumBtw(4, 20); // radius
  stageObj.color = Util.getRandFromList( OBJ_COLOR_LIST );
  stageObj.x = 100;
  stageObj.y = 100;
  
  return stageObj;
};


/*
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
*/