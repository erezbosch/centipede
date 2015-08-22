(function () {
  window.Centipede = window.Centipede || {};
  Centipede.SQUARE_SIZE = 24;

  var Game = Centipede.Game = function (xDim, yDim) {
    this.xDim = xDim;
    this.yDim = yDim;
    this.level = 0;
    this.ship = new Centipede.Ship({
      pos: [xDim / 2, yDim * 3 / 4],
      game: this,
      fillColor: "#66a9fa",
      strokeColor: "#2222aa",
    });
    this.bullets = [];
    this.centipede = [];
    this.mushrooms = [];
    this.mushroomColor = Centipede.Util.randomHexColor();
    this.centipedeColor = Centipede.Util.randomHexColor();
    this.addMushrooms();
    this.score = 0;
    this.lives = 9;
    this.segmentsToAdd = 10;
  };

  Game.STARTING_CENTIPEDE_LENGTH = 10;

  Game.prototype.gameBoardSize = function () {
    return this.xDim * this.yDim / Math.pow(Centipede.SQUARE_SIZE, 2);
  };

  Game.prototype.nearestSquareCenter = function (pos) {
    var newPos = [];
    for (var i = 0; i < 2; i++) {
      var diff = (pos[i] - Centipede.SQUARE_SIZE / 2) % Centipede.SQUARE_SIZE;
      if (diff > Centipede.SQUARE_SIZE / 2) {
        newPos.push(pos[i] + Centipede.SQUARE_SIZE - diff);
      } else {
        newPos.push(pos[i] - diff);
      }
    }
    return newPos;
  };

  Game.prototype.randomHighPosition = function () {
    var x = Math.random() * this.xDim;
    var y = Math.random() * this.yDim / 2;
    return this.nearestSquareCenter([x, y]);
  };

  Game.prototype.topLeftEmpty = function () {
    return this.centipede.every(function (segment) {
      return segment.pos[0] + segment.radius > Centipede.SQUARE_SIZE ||
             segment.pos[1] - segment.radius > Centipede.SQUARE_SIZE;
    }, this);
  },

  Game.prototype.maybeAddSegment = function () {
    if (this.segmentsToAdd && this.topLeftEmpty()) {
      this.segmentsToAdd--;
      this.addSegment();
    }
  };

  Game.prototype.addSegment = function () {
    this.centipede.push(new Centipede.Segment({
      game: this,
      color: this.centipedeColor,
      vel: [12 + this.level * 0.2, 0],
    }));
  };

  Game.prototype.addMushrooms = function () {
    var positions = [];
    for (var i = 0; i < this.gameBoardSize() / 20; i++) {
      var pos;
      do {
        pos = this.randomHighPosition();
      } while (positions.indexOf(pos) !== -1);
      positions.push(pos);
      this.addMushroom({ pos: pos });
    }
  };

  Game.prototype.addMushroom = function (options) {
    this.mushrooms.push(new Centipede.Mushroom($.extend(options, {
      game: this,
      color: this.mushroomColor
    })));
  };

  Game.prototype.allObjects = function () {
    return this.bullets.concat(this.mushrooms, this.centipede, [this.ship]);
  };

  Game.prototype.draw = function (ctx) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, this.xDim, this.yDim);
    ctx.font = "24pt Arial ";
    ctx.fillStyle = "#00cc00";
    ctx.fillText("Score: " + this.score, this.xDim / 2 - 400, 80);
    ctx.fillStyle = "#0000cc";
    ctx.fillText("Level: " + this.level, this.xDim / 2 - 100, 80);
    ctx.fillStyle = "#cc0000";
    ctx.fillText("Lives: " + this.lives, this.xDim / 2 + 200, 80);
    this.allObjects().forEach(function(object) { object.draw(ctx); });
    if (this.lives <= 0) {
      ctx.fillStyle = "#000088";
      ctx.font = "100pt Arial ";
      ctx.fillText("You lose!", this.xDim / 2 - 200, this.yDim / 2 - 50);
      ctx.fillText("Refresh to play again!", 200, this.yDim - 200);
    }
  };

  Game.prototype.moveObjects = function () {
    this.allObjects().forEach(function (object) { object.move(); });
  };

  Game.prototype.checkCollisions = function () {
    var objects = this.allObjects();
    for (var i = 0; i < objects.length; i++) {
      for (var j = i + 1; j < objects.length; j++) {
        if (objects[i].isCollidedWith(objects[j])) {
          objects[i].collideWith(objects[j]);
        }
      }
    }
  };

  Game.prototype.step = function () {
    this.moveObjects();
    this.checkCollisions();
    this.ship.slowDown();
    this.maybeAddSegment();
    if (!this.centipede.length) { this.nextLevel(); }
  };

  Game.prototype.remove = function (object) {
    if (object instanceof Centipede.Segment) {
      this.centipede.splice(this.centipede.indexOf(object), 1);
      this.score += 10;
    } else if (object instanceof Centipede.Mushroom) {
      this.mushrooms.splice(this.mushrooms.indexOf(object), 1);
      this.score++;
    // } else if (object instanceof Centipede.Spider) {
    //   this.spider = null;
    //   this.score += 100;
    // setTimeout(function () {
    //   this.spider = new Centipede.Spider(
    //     // ...
    //   );
    // }.bind(this), Math.max(20000 - 100 * this.level, 2000));
    } else {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    }
  };

  Game.prototype.add = function (obj) {
    if (obj instanceof Centipede.Segment) {
      this.centipede.push(obj);
    } else if (obj instanceof Centipede.Mushroom) {
      this.mushrooms.push(obj);
    } else {
      this.bullets.push(obj);
    }
  };

  Game.prototype.nextLevel = function () {
    this.score += this.level * 10;
    this.level++;
    this.mushroomColor = Centipede.Util.randomHexColor();
    this.centipedeColor = Centipede.Util.randomHexColor();
    this.segmentsToAdd = Game.STARTING_CENTIPEDE_LENGTH + this.level;
  };

  Game.prototype.mushroomHealth = function () {
    return Math.max(Math.min(Math.floor(this.level / 10), 5), 2);
  };

  Game.prototype.isOutOfBounds = function (pos) {
    return pos[0] < 0 ||
           pos[1] < 0 ||
           pos[0] >= this.xDim ||
           pos[1] >= this.yDim;
  };

  Game.prototype.rightmostSquarePos = function () {
    var squarePos = this.xDim - (this.xDim % Centipede.SQUARE_SIZE);
    return squarePos + (Centipede.SQUARE_SIZE / 2);
  };

  Game.prototype.lowestSquarePos = function () {
    var squarePos = this.yDim - (this.yDim % Centipede.SQUARE_SIZE);
    return squarePos - (Centipede.SQUARE_SIZE / 2);
  };

  Game.prototype.topCentipedeLimit = function () {
    var squarePos = (this.yDim * 2/3) - (this.yDim % Centipede.SQUARE_SIZE);
    return squarePos - (Centipede.SQUARE_SIZE / 2);
  };
})();
