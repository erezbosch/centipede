(function () {
  window.Centipede = window.Centipede || {};

  var MovingObject = Centipede.MovingObject = function (options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.color = options.color;
    this.game = options.game;
  };

  MovingObject.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      this.pos[0],
      this.pos[1],
      this.radius,
      0,
      2 * Math.PI,
      false
    );
    ctx.fill();
  };

  MovingObject.prototype.move = function () {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    this.gravitates && this.gravitate();
    if (this.game.isOutOfBounds(this.pos)) { this.game.remove(this); }
  };

  MovingObject.prototype.isCollidedWith = function (otherObject) {
    var xDistance = this.pos[0] - otherObject.pos[0];
    var yDistance = this.pos[1] - otherObject.pos[1];
    var distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    return distance < (this.radius + otherObject.radius);
  };

  MovingObject.prototype.collideWith = function (otherObject) {};

  MovingObject.prototype.getHitByBullet = function () {
    this.game.remove(this);
  };

  MovingObject.prototype.gravitate = function () {
    this.vel[1]+= this.accel || 0.1 * (Centipede.squareSize / 24);
  };

  MovingObject.prototype.bounceOffWall = function () {
    var newX = this.pos[0] + this.vel[0];
    if (newX > this.game.xEnd || newX < this.game.xStart) {
      this.vel[0] *= -1;
    }
  };
})();
