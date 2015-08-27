(function () {
  window.Centipede = window.Centipede || {};

  var Weapon = Centipede.Weapon = function (options) {
    this.rate = options.rate;
    this.speed = options.speed;
    this.number = options.number;
    this.ship = options.ship;
    this.game = options.game;
  };

  Weapon.prototype.fire = function () {
    var bulletPos = [this.ship.pos[0], this.ship.pos[1] - this.ship.radius / 8];
    var bulletAngle = (Math.PI - 0.1 * (this.number - 1)) / 2;
    for (var i = 0; i < this.number; i++) {
      var bulletVelX = this.speed * Math.cos(bulletAngle);
      var bulletVelY = -this.speed * Math.sin(bulletAngle);
      bulletAngle += 0.1;
      this.game.bullets.push(new Centipede.Bullet({
        game: this.game,
        pos: bulletPos.slice(),
        vel: [bulletVelX, bulletVelY],
      }));
    }
    Centipede.sfx.fire();
  };

  Weapon.prototype.startFiring = function () {
    if (!this._firingInterval) {
      this.fire();
      this._firingInterval = setInterval(this.fire.bind(this), this.rate);
    };
  };

  Weapon.prototype.stopFiring = function () {
    clearInterval(this._firingInterval);
    this._firingInterval = null;
  };
})();
