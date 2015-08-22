(function () {
  window.Centipede = window.Centipede || {};
  var Mushroom = Centipede.Mushroom = function (options) {
    Centipede.MovingObject.call(this, {
      pos: options.pos,
      game: options.game,
      vel: [0, 0],
      radius: Centipede.SQUARE_SIZE / 2,
      color: options.color
    });
    this.health = options.health;
  };

  Centipede.Util.inherits(Mushroom, Centipede.MovingObject);

  Mushroom.prototype.shiftColor = function (hexColor) {
    var shiftColor = hexColor.substring(0, 1);
    shiftColor += hexColor.substring(2, 7);
    return shiftColor + hexColor.substring(1, 2);
  };

  Mushroom.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.pos[0] - this.radius,
      this.pos[1] - this.radius,
      this.radius * 2,
      this.radius * 2
    );
  };

  Mushroom.prototype.getHitByBullet = function () {
    this.health--;
    if (this.health === 0) {
      this.game.remove(this);
      return;
    }
    this.color = this.shiftColor(this.color);
  };
})();
