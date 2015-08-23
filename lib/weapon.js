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
    var bulletPos = [this.ship.pos[0], this.ship.pos[1] + this.ship.radius / 2];
    var bulletVel = [0, -this.speed + this.ship.vel[1]];
    this.game.bullets.push(new Centipede.Bullet({
      game: this.game,
      pos: bulletPos,
      vel: bulletVel,
    }));
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
