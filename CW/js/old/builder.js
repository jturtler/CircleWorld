//	- Builder Class 	- Util For Attribtue & Location generator class

function Builder() {}

Builder.OBJ_COLOR_LIST = ['#7C9AFC', '#A0DE8F', '#F0F58C', 'Orange'];

Builder.newAttribute = function () {
  var attrJson = {};

  attrJson.speed = Util.getRandomInRange(5, 8);
  attrJson.size = Util.getRandomInRange(4, 20); // radius
  attrJson.color = Util.getRandomInList(Builder.OBJ_COLOR_LIST);

  return attrJson;
};

Builder.newLocationXY = function (canvasWidth, canvasHeight) {
  var offset = 10;
  return {
    locX: Util.getRandomInRange(offset, canvasWidth - offset),
    locY: Util.getRandomInRange(offset, canvasHeight - offset),
  };
};
