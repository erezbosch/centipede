(function () {
  window.Centipede = window.Centipede || {};
  var Ship = Centipede.Ship = function (options) {
    Centipede.MovingObject.call(this, {
      pos: options.pos,
      game: options.game,
      vel: [0, 0],
      radius: Ship.RADIUS,
      color: options.fillColor
    });

    this.strokeColor = options.strokeColor;
  };

  Centipede.Util.inherits(Ship, Centipede.MovingObject);

  Ship.RADIUS = 20;
  Ship.MAX_VEL = 10;

  Ship.prototype.fireBullet = function () {
      if (!this.invulnerable) {
        this.game.add(new Centipede.Bullet({
          game: this.game,
          vel: this.bulletVel(),
          pos: this.pos.slice()
          })
        );
      }
  };

  Ship.prototype.power = function (impulse) {
    this.vel[0] += impulse[0];
    this.vel[1] += impulse[1];
    for (var i = 0; i < 2; i++) {
      if (this.vel[i] > Ship.MAX_VEL) {
        this.vel[i] = Ship.MAX_VEL;
      } else if (this.vel[i] < -Ship.MAX_VEL) {
        this.vel[i] = -Ship.MAX_VEL;
      }
    }
  };

  Ship.prototype.slowDown = function (amount) {
    amount = amount || 0.02;
    for (var i = 0; i < 2; i++) {
      if (Math.abs(this.vel[i]) < amount) {
        this.vel[i] = 0;
      } else {
        this.vel[i] *= 1 - amount;
      }
    }
  };

  Ship.prototype.bulletVel = function () {
    return [0, -10];
  };

  Ship.prototype.shiftColor = function (hexColor) {
    var shiftColor = hexColor.substring(0, 1);
    shiftColor += hexColor.substring(3, 7);
    return shiftColor + hexColor.substring(1, 3);
  };

  Ship.prototype.draw = function (ctx) {
    ctx.beginPath();
    var x = this.pos[0],
        y = this.pos[1];
    ctx.moveTo(
      x - this.radius * Math.cos(Math.PI / 2),
      y - this.radius * Math.sin(Math.PI / 2)
    );
    ctx.lineTo(
      x - this.radius * Math.cos(5 * Math.PI / 4),
      y - this.radius * Math.sin(5 * Math.PI / 4)
    );
    ctx.lineTo(
      x - this.radius * Math.cos(-1 * Math.PI / 4),
      y - this.radius * Math.sin(-1 * Math.PI / 4)
    );
    ctx.closePath();
    if (this.invulnerable) {
      ctx.fillStyle = this.shiftColor(this.color);
      ctx.strokeStyle = this.shiftColor(this.strokeColor);
    } else {
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.strokeColor;
    }
    ctx.fill();
    ctx.stroke();
  };
})();
