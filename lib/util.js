(function () {
  window.Centipede = window.Centipede || {};
  var Util = Centipede.Util = function () {};

  Util.inherits = function (ChildClass, ParentClass) {
    var Surrogate = function () {};
    Surrogate.prototype = ParentClass.prototype;
    ChildClass.prototype = new Surrogate();
    ChildClass.prototype.constructor = ChildClass;
  }
})()
