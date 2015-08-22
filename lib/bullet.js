(function () {
  window.Centipede = window.Centipede || {};

  var Bullet = Centipede.Bullet = function (options) {
    Centipede.MovingObject.call(this, {
      pos: options.pos,
      game: options.game,
      vel: options.vel,
      radius: Bullet.RADIUS,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16)
    });
  }

  Centipede.Util.inherits(Bullet, Centipede.MovingObject);
  Bullet.RADIUS = 5;

  Bullet.prototype.collideWith = function (otherObject) {
    if (!(otherObject instanceof Centipede.Ship) &&
        !(otherObject instanceof Centipede.Bullet)) {
      otherObject.getHitByBullet();
      this.game.remove(this);
    }
  }
})()
