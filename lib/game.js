(function () {
  window.Centipede = window.Centipede || {};
  Centipede.SQUARE_SIZE = 24;

  var Game = Centipede.Game = function (xDim, yDim) {
    this.xDim = xDim;
    this.yDim = yDim;
    this.yStart = 100;
    this.yEnd = 100 + 30 * Centipede.SQUARE_SIZE;
    this.xStart = (xDim / 2) - 12.5 * Centipede.SQUARE_SIZE;
    this.xEnd = (xDim / 2) + 12.5 * Centipede.SQUARE_SIZE;
    this.level = 0;
    this.ship = new Centipede.Ship({
      pos: [
              this.xStart + ((this.xEnd - this.xStart) / 2),
              this.yStart + ((this.yEnd - this.yStart) * 3 / 4)
           ],
      game: this,
      fillColor: "#66a9fa",
      strokeColor: "#2222aa",
    });
    this.bullets = [];
    this.centipede = [];
    this.mushrooms = [];
    this.spiders = [];
    this.powerups = [];
    this.sparks = [];
    this.mushroomColor = Centipede.Util.randomHexColor();
    this.centipedeColor = Centipede.Util.randomHexColor();
    this.addMushrooms();
    this.mushroomColor = Centipede.Util.randomHexColor();
    this.score = 0;
    this.lives = 9;
    this.segmentsToAdd = 10;
    setTimeout(this.addSpider.bind(this), 20000);
  };

  Game.STARTING_CENTIPEDE_LENGTH = 10;

  Game.prototype.addSpider = function () {
    var xPos = Math.random() > 0.5 ? this.xStart : this.xEnd;
    var yPos = Math.random() * ((this.yEnd - this.yStart) * 0.5);
    yPos += this.yStart + (this.yEnd * 0.25);
    this.spiders.push(new Centipede.Spider({
      pos: [xPos, yPos],
      game: this,
      color: Centipede.Util.randomHexColor(),
      dir: xPos === this.xStart ? 0 : -Math.PI,
      max_vel: 1 + this.level * 0.2,
    }));
    setTimeout(this.addSpider.bind(this), Math.max(200 - this.level, 20) * 100);
  };

  Game.prototype.addSparks = function (options) {
    for (var i = 0; i < options.amt; i++) { this.addSpark(options); }
  };

  Game.prototype.addSpark = function (options) {
    var spark = new Centipede.Spark({
      game: this,
      pos: options.pos.slice(),
      vel: [Math.random() - 0.5, Math.random() - 0.5],
      color: options.color,
    });
    this.sparks.push(spark);
  };

  Game.prototype.addPowerup = function (pos) {
    var types = {
      rate: [100, -50],
      number: [1],
      speed: [2, -1],
    };
    var attr, selection;
    do {
      selection = Math.floor(Math.random() * Object.keys(types).length);
      attr = Object.keys(types)[selection];
    } while (attr === 'number' && Math.random() < 0.8);
    var effect = types[attr][Math.floor(Math.random() * types[attr].length)];
    var color = effect > 0 ? '#66ff66' : '#ff6666';
    this.powerups.push(new Centipede.Powerup({
      game: this,
      pos: pos,
      vel: this.randomVel(),
      attribute: attr,
      effect: effect,
      color: color
    }));
  };

  Game.prototype.randomVel = function () {
    return [
      Math.random() * 3 - 1.5,
      Math.random() * (5 + this.level * 0.25) - (5 + this.level * 0.25)
    ];
  };

  Game.prototype.gameBoardSize = function () {
    var area = (this.xEnd - this.xStart) * (this.yEnd - this.yStart);
    return area / Math.pow(Centipede.SQUARE_SIZE, 2);
  };

  Game.prototype.nearestSquareCenter = function (pos) {
    var newPos = [];
    for (var i = 0; i < 2; i++) {
      var offset = i === 0 ? this.xStart : this.yStart;
      var coord = pos[i] - offset;
      var diff = (coord - Centipede.SQUARE_SIZE / 2) % Centipede.SQUARE_SIZE;
      if (diff > Centipede.SQUARE_SIZE / 2) {
        newPos.push(pos[i] + Centipede.SQUARE_SIZE - diff);
      } else {
        newPos.push(pos[i] - diff);
      }
    }
    return newPos;
  };

  Game.prototype.randomHighPosition = function () {
    var x = Math.random() * (this.xEnd - this.xStart) + this.xStart;
    var y = Math.random() * ((this.yEnd - this.yStart) / 2) + this.yStart;
    return this.nearestSquareCenter([x, y]);
  };

  Game.prototype.topLeftEmpty = function () {
    return this.centipede.every(function (segment) {
      return segment.pos[0] > this.xStart + 3 * segment.radius ||
             segment.pos[1] > this.yStart + 3 * segment.radius;
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
      vel: [4 + this.level * 0.2, 0],
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
    return this.bullets.concat(
      this.sparks,
      this.powerups,
      this.mushrooms,
      this.centipede,
      this.spiders,
      [this.ship]
    );
  };

  Game.prototype.draw = function (ctx) {
    ctx.fillStyle = "#660000";
    ctx.fillRect(0, 0, this.xDim, this.yDim);
    ctx.fillStyle = "#000000";
    ctx.fillRect(this.xStart, this.yStart, this.xEnd - this.xStart, this.yEnd - this.yStart);
    ctx.font = "24pt Arial ";
    ctx.fillStyle = "#22ff22";
    ctx.fillText("Score: " + this.score, this.xDim / 2 - 400, 80);
    ctx.fillStyle = "#2222ff";
    ctx.fillText("Level: " + this.level, this.xDim / 2 - 100, 80);
    ctx.fillStyle = "#ff2222";
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
    } else if (object instanceof Centipede.Spider) {
      this.spiders.splice(this.spiders.indexOf(object), 1);
      this.score += 100;
    } else if (object instanceof Centipede.Powerup) {
      this.powerups.splice(this.powerups.indexOf(object), 1);
    } else if (object instanceof Centipede.Spark) {
      this.sparks.splice(this.sparks.indexOf(object), 1);
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
    return pos[0] < this.xStart ||
           pos[1] < this.yStart ||
           pos[0] >= this.xEnd ||
           pos[1] >= this.yEnd;
  };

  Game.prototype.rightmostSquarePos = function () {
    return this.xEnd - Centipede.SQUARE_SIZE / 2;
  };

  Game.prototype.leftmostSquarePos = function () {
    return this.xStart + Centipede.SQUARE_SIZE / 2;
  };

  Game.prototype.lowestSquarePos = function () {
    return this.yEnd - Centipede.SQUARE_SIZE / 2;
  };

  Game.prototype.highestSquarePos = function () {
    return this.yStart + Centipede.SQUARE_SIZE / 2;
  };

  Game.prototype.topCentipedeLimit = function () {
    var twoThirds = ((this.yEnd - this.yStart) * 2/3) + this.yStart;
    var squarePos = twoThirds - (twoThirds % Centipede.SQUARE_SIZE);
    return squarePos + (Centipede.SQUARE_SIZE / 2);
  };
})();
