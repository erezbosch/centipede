(function () {
  window.Centipede = window.Centipede || {};

  var Powerup = Centipede.Powerup = function (options) {
    Centipede.MovingObject.call(this, {
      pos: options.pos,
      game: options.game,
      vel: options.vel,
      radius: Powerup.RADIUS,
      color: options.color
    });
    this.attribute = options.attribute;
    this.effect = options.effect;
  };

  Centipede.Util.inherits(Powerup, Centipede.MovingObject);
  Powerup.RADIUS = 8;

  Powerup.prototype.collideWith = function (otherObject) {
    if (otherObject instanceof Centipede.Ship) {
      otherObject.weapon[this.attribute] += this.effect;
      this.game.remove(this);
    }
  };
})();