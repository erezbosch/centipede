(function () {
  window.Centipede = window.Centipede || {};

  var Game = Centipede.Game = function () {
    this.organizeCanvas();
  };

  Game.STARTING_CENTIPEDE_LENGTH = 10;

  Game.prototype.organizeCanvas = function () {
    this.setSquareSize();
    this.xDim = 25 * Centipede.squareSize;
    this.yStart = 1.5 * Centipede.squareSize;
    this.yDim = this.yStart + 30 * Centipede.squareSize;
    this.yEnd = this.yDim;
    this.xStart = (this.xDim / 2) - 12.5 * Centipede.squareSize;
    this.xEnd = (this.xDim / 2) + 12.5 * Centipede.squareSize;
    Centipede.canvasEl.width = this.xDim;
    Centipede.canvasEl.height = this.yDim;
  };

  Game.prototype.setSquareSize = function () {
    var xSpace = window.innerWidth - 540;
    var ySpace = window.innerHeight - 80;
    var yLimitedSize = Math.floor(ySpace / 31.5);
    var xLimitedSize = Math.floor(xSpace / 25);
    Centipede.squareSize = Math.min(24, yLimitedSize, xLimitedSize);
  };

  Game.prototype.reset = function () {
    this.hasStarted = true;
    Centipede.timers.forEach(function (timer) { clearTimeout(timer); });
    this.level = 0;
    this.ship = new Centipede.Ship({
      pos: [
              this.xStart + ((this.xEnd - this.xStart) / 2),
              this.yStart + ((this.yEnd - this.yStart) * 3 / 4)
           ],
      game: this,
      color: "#ffffff"
    });
    this.bullets = [];
    this.centipede = [];
    this.mushrooms = [];
    this.spiders = [];
    this.powerups = [];
    this.sparks = [];
    this.droppers = [];
    this.centipedeColor = Centipede.Util.randomHexColor();
    this.mushroomColor = Centipede.Util.randomHexColor();
    this.addMushrooms();
    this.mushroomColor = Centipede.Util.randomHexColor();
    this.score = 0;
    this.lives = 3;
    this.segmentsToAdd = 10;
    Centipede.timers.push(setTimeout(this.addSpider.bind(this), 30000));
    Centipede.timers.push(setTimeout(this.addDropper.bind(this), 20000));
  };

  Game.prototype.addSpider = function () {
    var xPos = Math.random() > 0.5 ? this.xStart : this.xEnd;
    var yPos = Math.random() * ((this.yEnd - this.yStart) / 2);
    yPos += this.yStart + (this.yEnd / 4);
    this.spiders.push(new Centipede.Spider({
      pos: [xPos, yPos],
      game: this,
      color: Centipede.Util.randomHexColor(),
      dir: xPos === this.xStart ? 0 : -Math.PI,
      maxVel: 2 + this.level * 0.5,
    }));
    Centipede.timers.push(
      setTimeout(
        this.addSpider.bind(this),
        Math.max(200 - this.level, 20) * 100
      )
    );
  };

  Game.prototype.addDropper = function () {
    var xPos = Math.random() * (this.xEnd - this.xStart) + this.xStart;
    var yPos = this.highestSquarePos();
    this.droppers.push(new Centipede.Dropper({
      pos: [xPos, yPos],
      game: this,
      vel: [Math.random() * (this.level / 4) - (this.level / 8), 0],
      accel: (0.05 + this.level * 0.01) * Centipede.squareSize / 24
     }));
     Centipede.timers.push(
       setTimeout(
         this.addDropper.bind(this),
         Math.random() * (200 - this.level) * 100
       )
     );
  };

  Game.prototype.addSparks = function (options) {
    for (var i = 0; i < options.amt; i++) { this.addSpark(options); }
  };

  Game.prototype.addSpark = function (options) {
    var spark = new Centipede.Spark({
      game: this,
      pos: options.pos.slice(),
      vel: [
        (Math.random() - 0.5) * (Centipede.squareSize / 24),
        (Math.random() - 0.5) * (Centipede.squareSize / 24)
      ],
      color: options.color,
    });
    this.sparks.push(spark);
  };

  Game.prototype.addPowerup = function (pos) {
    var types = {
      rate: [-50, 50],
      number: [1],
      speed: [2 * (Centipede.squareSize / 24), -2 * (Centipede.squareSize / 24)]
    };
    if (this.ship.weapon.rate <= 100) { types.rate = [50]; }
    var attr, selection;
    do {
      selection = Math.floor(Math.random() * Object.keys(types).length);
      attr = Object.keys(types)[selection];
    } while (attr === 'number' && Math.random() < 0.5);
    var effect = types[attr][Math.floor(Math.random() * types[attr].length)];
    var quality = attr === 'rate' ? -effect : effect;
    var color = quality > 0 ? '#66ff66' : '#ff6666';
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
      (Math.random() * 3 - 1.5) * (Centipede.squareSize / 24),
      (Math.random() * 5 - 5) * (Centipede.squareSize / 24)
    ];
  };

  Game.prototype.gameBoardSize = function () {
    var area = (this.xEnd - this.xStart) * (this.yEnd - this.yStart);
    return area / Math.pow(Centipede.squareSize, 2);
  };

  Game.prototype.nearestSquareCenter = function (pos) {
    var newPos = [];
    for (var i = 0; i < 2; i++) {
      var offset = i === 0 ? this.xStart : this.yStart;
      var coord = pos[i] - offset;
      var diff = (coord - Centipede.squareSize / 2) % Centipede.squareSize;
      if (diff > Centipede.squareSize / 2) {
        newPos.push(pos[i] + Centipede.squareSize - diff);
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
      return segment.pos[0] >= this.xStart + 3 * segment.radius ||
             segment.pos[1] >= this.yStart + 3 * segment.radius;
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
      vel: [(5 + this.level * 0.5) * (Centipede.squareSize / 24), 0],
    }));
    Centipede.sfx.addSegment();
  };

  Game.prototype.addMushrooms = function () {
    var positions = [];
    for (var i = 0; i < this.gameBoardSize() / 12; i++) {
      var pos;
      do {
        pos = this.randomHighPosition();
      } while (positions.indexOf(pos) !== -1 ||
        (pos[0] <= this.xStart + Centipede.squareSize &&
         pos[1] <= this.yStart + Centipede.squareSize));
      positions.push(pos);
      this.addMushroom({ pos: pos });
    }
  };

  Game.prototype.addMushroom = function (options) {
    this.mushrooms.push(new Centipede.Mushroom($.extend(options, {
      game: this,
      color: options.color || this.mushroomColor.slice()
    })));
  };

  Game.prototype.allObjects = function () {
    return this.sparks.concat(
      this.bullets,
      this.powerups,
      this.mushrooms,
      [this.ship],
      this.centipede,
      this.spiders,
      this.droppers
    );
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, this.xEnd, this.yEnd);
    ctx.fillStyle = "#444444";
    ctx.fillRect(0, 0, this.xEnd, this.yStart);
    ctx.fillStyle = "#22ff22";
    ctx.font = Centipede.squareSize + "pt Arial ";
    ctx.textAlign = 'center';
    if (this.hasStarted) {
      var infoText = "Score: " + this.score + "      " + "Level: " + this.level;
      infoText += "      " + "Lives: " + this.lives;
      ctx.fillText(
        infoText,
        0.5 * (this.xEnd - this.xStart) + this.xStart,
        1.25 * Centipede.squareSize
      );
    }
    ctx.fillStyle = "#000000";
    ctx.fillRect(
      this.xStart,
      this.yStart,
      this.xEnd - this.xStart,
      this.yEnd - this.yStart
    );
    if (this.lives && this.hasStarted) {
      this.allObjects().forEach(function(object) { object.draw(ctx); });
    } else if (!this.hasStarted) {
      ctx.fillStyle = "#ffffff";
      ctx.fillText(
        "Click to play!",
        (this.xEnd - this.xStart) / 2 + this.xStart,
        (this.yEnd - this.yStart) * 0.5 + this.yStart
      );
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillText(
        "You lose!",
        (this.xEnd - this.xStart) / 2 + this.xStart,
        (this.yEnd - this.yStart) * 0.45 + this.yStart
      );
      ctx.fillText(
        "Click to play again!",
        (this.xEnd - this.xStart) / 2 + this.xStart,
        (this.yEnd - this.yStart) * 0.55 + this.yStart
      );
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
    if (this.lives) {
      this.moveObjects();
      this.checkCollisions();
      this.ship.slowDown();
      this.maybeAddSegment();
      if (!this.centipede.length) { this.nextLevel(); }
    }
  };

  Game.prototype.raiseScore = function (amt) {
    if (this.lives > 0) { this.score += amt; }
  };

  Game.prototype.remove = function (obj) {
    if (obj instanceof Centipede.Segment) {
      this.centipede.splice(this.centipede.indexOf(obj), 1);
    } else if (obj instanceof Centipede.Mushroom) {
      this.mushrooms.splice(this.mushrooms.indexOf(obj), 1);
    } else if (obj instanceof Centipede.Spider) {
      this.spiders.splice(this.spiders.indexOf(obj), 1);
    } else if (obj instanceof Centipede.Powerup) {
      this.powerups.splice(this.powerups.indexOf(obj), 1);
    } else if (obj instanceof Centipede.Spark) {
      this.sparks.splice(this.sparks.indexOf(obj), 1);
    } else if (obj instanceof Centipede.Dropper) {
      this.droppers.splice(this.droppers.indexOf(obj), 1);
    } else {
      this.bullets.splice(this.bullets.indexOf(obj), 1);
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
    this.raiseScore(this.level * 10);
    this.level++;
    this.mushroomColor = Centipede.Util.randomHexColor();
    this.centipedeColor = Centipede.Util.randomHexColor();
    this.segmentsToAdd = Game.STARTING_CENTIPEDE_LENGTH + this.level;
  };

  Game.prototype.mushroomHealth = function () {
    return Math.min(Math.floor(2 + (this.level / 4)), 5);
  };

  Game.prototype.isOutOfBounds = function (pos) {
    return pos[0] < this.xStart ||
           pos[1] < this.yStart ||
           pos[0] >= this.xEnd ||
           pos[1] >= this.yEnd;
  };

  Game.prototype.rightmostSquarePos = function () {
    return this.xEnd - Centipede.squareSize / 2;
  };

  Game.prototype.leftmostSquarePos = function () {
    return this.xStart + Centipede.squareSize / 2;
  };

  Game.prototype.lowestSquarePos = function () {
    return this.yEnd - Centipede.squareSize / 2;
  };

  Game.prototype.highestSquarePos = function () {
    return this.yStart + Centipede.squareSize / 2;
  };

  Game.prototype.topCentipedeLimit = function () {
    var twoThirds = ((this.yEnd - this.yStart) * 2/3) + this.yStart;
    var squarePos = twoThirds - (twoThirds % Centipede.squareSize);
    return squarePos + (Centipede.squareSize / 2);
  };
})();
