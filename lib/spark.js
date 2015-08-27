(function () {
  window.Centipede = window.Centipede || {};

  var Spark = Centipede.Spark = function (options) {
    Centipede.MovingObject.call(this, {
      pos: options.pos,
      game: options.game,
      vel: options.vel,
      radius: Centipede.squareSize / 8,
      color: options.color
    });
    this.gravitates = true;
  };

  Centipede.Util.inherits(Spark, Centipede.MovingObject);
})();
