(function () {
  window.Centipede = window.Centipede || {};
  var Dropper = Centipede.Dropper = function (options) {
    Centipede.MovingObject.call(this, {
      pos: options.pos,
      game: options.game,
      vel: options.vel,
      radius: Dropper.RADIUS,
      color: Dropper.COLOR
    });
    this.dir = Math.random() * 2 * Math.PI;
    this.rotation = 0.05;
    this.gravitates = true;
    this.accel = options.accel;
    this.mushroomColor = Centipede.Util.randomHexColor()
  };

  Dropper.RADIUS = Centipede.SQUARE_SIZE;
  Dropper.COLOR = '#ffff77';
  Centipede.Util.inherits(Dropper, Centipede.MovingObject);

  Dropper.prototype.move = function () {
    this.bounceOffWall();
    Centipede.MovingObject.prototype.move.call(this);
    this.dir += this.rotation;
    this.maybeAddMushroom();
  };

  Dropper.prototype.maybeAddMushroom = function () {
    if (Math.random() > 0.9) {
      var squarePos = this.game.nearestSquareCenter(this.pos);
      this.game.addMushroom({ pos: squarePos, color: this.mushroomColor });
    }
  };

  Dropper.prototype.draw = function (ctx) {
    ctx.beginPath();
    var x = this.pos[0];
    var y = this.pos[1];
    ctx.moveTo(
      x + this.radius * Math.cos(this.dir),
      y + this.radius * Math.sin(this.dir)
    );
    ctx.lineTo(
      x + this.radius * Math.cos(this.dir - (4 * Math.PI / 5)),
      y + this.radius * Math.sin(this.dir - (4 * Math.PI / 5))
    );
    ctx.lineTo(
      x + this.radius * Math.cos(this.dir + (2 * Math.PI / 5)),
      y + this.radius * Math.sin(this.dir + (2 * Math.PI / 5))
    );
    ctx.lineTo(
      x + this.radius * Math.cos(this.dir - (2 * Math.PI / 5)),
      y + this.radius * Math.sin(this.dir - (2 * Math.PI / 5))
    );
    ctx.lineTo(
      x + this.radius * Math.cos(this.dir + (4 * Math.PI / 5)),
      y + this.radius * Math.sin(this.dir + (4 * Math.PI / 5))
    );
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  };

  Dropper.prototype.getHitByBullet = function () {
    this.game.remove(this);
    this.game.raiseScore(100);
    this.game.addSparks({
      pos: this.pos.slice(),
      amt: 48,
      color: this.color
    });
  };
})();
