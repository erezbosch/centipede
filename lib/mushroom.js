(function () {
  window.Centipede = window.Centipede || {};
  var Mushroom = Centipede.Mushroom = function (options) {
    Centipede.MovingObject.call(this, {
      pos: options.pos,
      game: options.game,
      vel: [0, 0],
      radius: Centipede.squareSize / 2,
      color: options.color
    });
    this.health = this.game.mushroomHealth();
    this.initialHealth = this.health;
    this.holeCoords = [];
  };

  Centipede.Util.inherits(Mushroom, Centipede.MovingObject);

  Mushroom.prototype.shiftColor = function (hexColor) {
    var shiftColor = hexColor.substring(0, 1);
    shiftColor += hexColor.substring(2, 7);
    return shiftColor + hexColor.substring(1, 2);
  };

  Mushroom.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color.slice();
    ctx.fillRect(this.pos[0] - 2, this.pos[1], 4, this.radius);
    ctx.beginPath();
    ctx.ellipse(
      this.pos[0],
      this.pos[1] - this.radius / 2,
      this.radius,
      this.radius / 2,
      0,
      0,
      2 * Math.PI,
      false
    );
    ctx.fill();
    if (this.initialHealth === this.health) { return; }
    ctx.fillStyle = '#000000';
    var holeSize = (6 - (0.5 * this.initialHealth)) * Centipede.squareSize / 24;
    for (var i = 0; i < this.initialHealth - this.health; i++) {
      while (this.holeCoords.length < i + 1) {
        this.holeCoords.push(
          Math.random() * this.radius * 1.5 + this.pos[0] - this.radius * 0.75
        );
      }
      ctx.beginPath();
      ctx.arc(
        this.holeCoords[i],
        this.pos[1] - this.radius * (0.9 - 0.04 * holeSize),
        holeSize,
        0,
        2 * Math.PI,
        false
      );
      ctx.fill();
    }
  };

  Mushroom.prototype.getHitByBullet = function () {
    this.health--;
    this.game.addSparks({
      pos: this.pos.slice(),
      amt: 7,
      color: this.color
    });
    this.game.raiseScore(1);
    if (this.health === 0) {
      this.game.remove(this);
      Centipede.sfx.killMushroom();
      if (Math.random() > 0.9) { this.game.addPowerup(this.pos.slice()); }
      return;
    }
    Centipede.sfx.hitMushroom();
    this.color = this.shiftColor(this.color);
  };

  Mushroom.prototype.collideWith = function (otherObject) {
    if (otherObject instanceof Centipede.Ship && !otherObject.invulnerable) {
      otherObject.pos[0] -= otherObject.vel[0];
      otherObject.pos[1] -= otherObject.vel[1];
    }
  };
})();
