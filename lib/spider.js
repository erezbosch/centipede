(function () {
  window.Centipede = window.Centipede || {};
  var Spider = Centipede.Spider = function (options) {
    Centipede.MovingObject.call(this, {
      pos: options.pos,
      game: options.game,
      vel: [0, 0],
      radius: 20,
      color: options.color
    });
    this.dir = options.dir;
    this.max_vel = options.max_vel;
  };

  Centipede.Util.inherits(Spider, Centipede.MovingObject);

  Spider.prototype.angleToShip = function () {
    var xDiff = this.pos[0] - this.game.ship.pos[0];
    var yDiff = this.pos[1] - this.game.ship.pos[1];
    if (xDiff === 0 || Math.abs(yDiff / xDiff) > 10) {
      this.dir = yDiff < 0 ? Math.PI / 2 : -Math.PI / 2;
      return this.dir;
    }
    var angle = Math.atan(yDiff / xDiff);
    if (xDiff > 0) { angle -= Math.PI; }
    return angle;
  };

  Spider.prototype.turn = function () {
    amt = Math.min(Math.abs(this.angleToShip() - this.dir), Math.PI / 16);
    this.dir += this.angleToShip() > this.dir ? amt : -amt;
  };

  Spider.prototype.setVel = function () {
    var velX = this.max_vel * Math.cos(this.dir);
    var velY = this.max_vel * Math.sin(this.dir);
    this.vel = [velX, velY];
  };

  Spider.prototype.move = function () {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    this.turn();
    this.setVel();
  };

  Spider.prototype.draw = function (ctx) {
    ctx.beginPath();
    var x = this.pos[0];
    var y = this.pos[1];
    ctx.moveTo(
      x + this.radius * Math.cos(this.dir),
      y + this.radius * Math.sin(this.dir)
    );
    ctx.lineTo(
      x + this.radius * Math.cos(this.dir - (5 * Math.PI / 6)),
      y + this.radius * Math.sin(this.dir - (5 * Math.PI / 6))
    );
    ctx.lineTo(
      x + this.radius * Math.cos(this.dir + (Math.PI / 2)),
      y + this.radius * Math.sin(this.dir + (Math.PI / 2))
    );
    ctx.lineTo(
      x + this.radius * Math.cos(this.dir - (Math.PI / 2)),
      y + this.radius * Math.sin(this.dir - (Math.PI / 2))
    );
    ctx.lineTo(
      x + this.radius * Math.cos(this.dir + (5 * Math.PI / 6)),
      y + this.radius * Math.sin(this.dir + (5 * Math.PI / 6))
    );
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  };

  Spider.prototype.getHitByBullet = function () {
    this.game.remove(this);
    this.game.addSparks({
      pos: this.pos.slice(),
      amt: 48,
      color: this.color
    });
  };
})();
