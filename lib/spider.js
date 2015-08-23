(function () {
  window.Centipede = window.Centipede || {};
  var Spider = Centipede.Spider = function (options) {
    Centipede.MovingObject.call(this, {
      pos: options.pos,
      game: options.game,
      vel: [0, 0],
      radius: 10,
      color: options.color
    });
    this.dir = options.dir;
  };

  Centipede.Util.inherits(Spider, Centipede.MovingObject);

  Spider.prototype.power = function (impulse) {
    this.vel[0] += impulse[0];
    this.vel[1] += impulse[1];
  };

  Spider.prototype.angleToShip = function () {
    var xDiff = this.pos[0] - this.game.ship.pos[0];
    var yDiff = this.pos[1] - this.game.ship.pos[1];
    var angle = Math.atan(yDiff / xDiff);
    if (xDiff > 0) { angle = Math.PI - angle; }
    if (angle > Math.PI) { angle -= 2 * Math.PI; }
    return angle;
  };

  Spider.prototype.turn = function () {
    var amt = Math.PI / 8;
    this.dir += this.angleToShip() > this.dir ? amt : -amt;
  };

  Spider.prototype.accelerate = function () {
    var velX = -1 * Math.cos(this.dir);
    var velY = -1 * Math.sin(this.dir);
    this.power([velX, velY]);
  };

  Spider.prototype.draw = function (ctx) {
    ctx.beginPath();
    var x = this.pos[0];
    var y = this.pos[1];
    ctx.moveTo(
      x - this.radius * Math.cos(this.dir),
      y - this.radius * Math.sin(this.dir)
    );
    ctx.lineTo(
      x - this.radius * Math.cos(this.dir + (3 * Math.PI / 4)),
      y - this.radius * Math.sin(this.dir + (3 * Math.PI / 4))
    );
    ctx.lineTo(
      x - this.radius * Math.cos(this.dir - (3 * Math.PI / 4)),
      y - this.radius * Math.sin(this.dir - (3 * Math.PI / 4))
    );
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  };
})();
