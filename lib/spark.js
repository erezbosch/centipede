(function () {
  window.Centipede = window.Centipede || {};

  var Spark = Centipede.Spark = function (options) {
    Centipede.MovingObject.call(this, {
      pos: options.pos,
      game: options.game,
      vel: options.vel,
      radius: Spark.RADIUS,
      color: options.color
    });
    this.gravitates = true;
  };

  Centipede.Util.inherits(Spark, Centipede.MovingObject);
  Spark.RADIUS = 3;
})();
