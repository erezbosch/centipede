(function () {
  window.Centipede = window.Centipede || {};
  var Segment = Centipede.Segment = function (options) {
    Centipede.MovingObject.call(this, {
      pos: [options.game.leftmostSquarePos(), options.game.highestSquarePos()],
      game: options.game,
      vel: options.vel,
      radius: Centipede.SQUARE_SIZE / 2,
      color: options.color
    });
  };

  Centipede.Util.inherits(Segment, Centipede.MovingObject);

  Segment.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.pos[0] - this.radius,
      this.pos[1] - this.radius,
      this.radius * 2,
      this.radius * 2
    );
  };

  Segment.prototype.getHitByBullet = function () {
    this.game.remove(this);
    this.game.addSparks({
      pos: this.pos.slice(),
      amt: 16,
      color: this.color
    });
    this.game.addMushroom({ pos: this.game.nearestSquareCenter(this.pos) });
  };

  Segment.prototype.move = function () {
    var newPos = [this.pos[0] + this.vel[0], this.pos[1] + this.vel[1]];
    var modified;
    if (this.hitBottomCorner(newPos)) {
      this.turnUp();
      modified = true;
    } else if (this.hitTopLimit(newPos)) {
      var temp1 = this.vel[0];
      this.vel[0] = -this.vel[1];
      this.vel[1] = temp1;
      modified = true;
    } else if (this.hitWall(newPos) || this.hitMushroom(newPos)) {
      if (this.pos[1] === this.game.lowestSquarePos()) {
        this.turnUp();
      } else {
        this.turnDown();
       }
       modified = true;
    } else if (this.reachedTargetRow(newPos)) {
      this.targetRow = null;
      this.vel[0] = -this.previousDir;
      this.vel[1] = 0;
      var newNewPos = [this.pos[0] + this.vel[0], this.pos[1] + this.vel[1]];
      if (this.hitMushroom(newNewPos) || this.hitWall(newNewPos)) {
        this.vel[0] *= -1;
      }
      modified = true;
    }
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    if (modified) { this.snapToSquare(); }
  };

  Segment.prototype.turnUp = function () {
    this.vel[1] = -Math.abs(this.vel[0]);
    this.vel[0] = 0;
  };

  Segment.prototype.turnDown = function () {
    this.targetRow = this.game.nearestSquareCenter(this.pos)[1] + 2 * this.radius;
    this.previousDir = this.vel[0];
    this.vel[0] = this.vel[1];
    this.vel[1] = Math.abs(this.previousDir);
  };

  Segment.prototype.reachedTargetRow = function (newPos) {
    return this.targetRow && newPos[1] > this.targetRow;
  };

  Segment.prototype.hitWall = function (newPos) {
    return (newPos[0] < this.game.leftmostSquarePos() && newPos[1] != this.game.highestSquarePos()) ||
           newPos[0] > this.game.rightmostSquarePos();
  };

  Segment.prototype.hitBottomCorner = function (newPos) {
    return this.hitWall(newPos) && this.pos[1] === this.game.lowestSquarePos();
  };

  Segment.prototype.hitTopLimit = function (newPos) {
    return newPos[1] < this.game.topCentipedeLimit() && this.vel[1] < 0;
  };

  Segment.prototype.hitMushroom = function (newPos) {
    var temp = this.pos.slice();
    this.pos = newPos;
    var isHit = this.game.mushrooms.some(function (mushroom) {
      return this.isCollidedWith(mushroom);
    }, this);
    this.pos = temp;
    return isHit && this.vel[0];
  };

  Segment.prototype.snapToSquare = function () {
    this.pos = this.game.nearestSquareCenter(this.pos);
  };
})();
