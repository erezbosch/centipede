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
    this.weapon = new Centipede.Weapon({
      rate: 200,
      speed: 8,
      ship: this,
      number: 1,
      game: this.game
    });
  };

  Centipede.Util.inherits(Ship, Centipede.MovingObject);
  Ship.RADIUS = 12;
  Ship.MAX_VEL = 10;

  Ship.prototype.fireBullet = function () {
    if (!this.invulnerable) {
      this.game.add(new Centipede.Bullet({
        game: this.game,
        vel: this.bulletVel,
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

  Ship.prototype.draw = function (ctx) {
    ctx.beginPath();
    var x = this.pos[0],
        y = this.pos[1];
    ctx.moveTo(x, y - this.radius / 2);
    ctx.lineTo(
      x - 20 * Math.cos(7 * Math.PI / 6),
      y - 20 * Math.sin(7 * Math.PI / 6)
    );
    ctx.lineTo(x, y);
    ctx.lineTo(
      x - 20 * Math.cos(-1 * Math.PI / 6),
      y - 20 * Math.sin(-1 * Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
    if (this.invulnerable) {
      // Shield
      ctx.strokeStyle = this.color;
      ctx.beginPath();
      ctx.arc(
        this.pos[0],
        this.pos[1],
        20,
        0,
        2 * Math.PI,
        false
      );
      ctx.stroke();
    }
  };

  Ship.prototype.move = function () {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    if (this.pos[0] + this.radius > this.game.xEnd) {
      this.pos[0] = this.game.xEnd - this.radius;
      this.vel[0] = this.vel[0] < 0 ? this.vel[0] : 0;
    } else if (this.pos[0] - this.radius < this.game.xStart) {
      this.pos[0] = this.radius + this.game.xStart;
      this.vel[0] = this.vel[0] > 0 ? this.vel[0] : 0;
    }
    if (this.pos[1] + this.radius > this.game.yEnd) {
      this.pos[1] = this.game.yEnd - this.radius;
      this.vel[1] = this.vel[1] < 0 ? this.vel[1] : 0;
    } else if (this.pos[1] - this.radius < this.game.topCentipedeLimit()) {
      this.pos[1] = this.game.topCentipedeLimit() + this.radius;
      this.vel[1] = this.vel[1] > 0 ? this.vel[1] : 0;
    }
  };

  Ship.prototype.collideWith = function (otherObject) {
    if ((otherObject instanceof Centipede.Segment ||
        otherObject instanceof Centipede.Spider ||
        otherObject instanceof Centipede.Dropper) && !this.invulnerable) {
      this.invulnerable = true;
      this.game.lives--;
      if (this.game.lives > 0) {
        setTimeout(function () { this.invulnerable = false; }.bind(this), 3000);
      }
    }
  };
})();
