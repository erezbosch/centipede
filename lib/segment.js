(function () {
  window.Centipede = window.Centipede || {};
  var Segment = Centipede.Segment = function (options) {
    var radius = Centipede.SQUARE_SIZE / 2;
    Centipede.MovingObject.call(this, {
      pos: [radius, radius],
      game: options.game,
      vel: options.vel,
      radius: radius,
      color: options.color
    });
  };

  Centipede.Util.inherits(Segment, Centipede.MovingObject);

  Segment.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.pos[0] - this.radius,
      this.pos[1] - this.radius,
      this.radius * 2,
      this.radius * 2
    );
  };

  Segment.prototype.getHitByBullet = function () {
    this.game.remove(this);
    this.game.addMushroom({ pos: this.game.nearestSquareCenter(this.pos) });
  };
})();
