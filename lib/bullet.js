(function () {
  window.Centipede = window.Centipede || {};

  var Bullet = Centipede.Bullet = function (options) {
    Centipede.MovingObject.call(this, {
      pos: options.pos,
      game: options.game,
      vel: options.vel,
      radius: Bullet.RADIUS,
      color: Centipede.Util.randomHexColor()
    });
  };

  Centipede.Util.inherits(Bullet, Centipede.MovingObject);
  Bullet.RADIUS = 5;

  Bullet.prototype.collideWith = function (otherObject) {
    if (otherObject instanceof Centipede.Spider ||
        otherObject instanceof Centipede.Mushroom ||
        otherObject instanceof Centipede.Segment ||
        otherObject instanceof Centipede.Dropper) {
      otherObject.getHitByBullet();
      this.game.remove(this);
    }
  };
})();
