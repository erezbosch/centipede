(function () {
  window.Centipede = window.Centipede || {};
  var Game = Centipede.Game = function (xDim, yDim) {
    this.xDim = xDim;
    this.yDim = yDim;
    this.ship = new Centipede.Ship({
      pos: [xDim / 2, yDim / 2],
      game: this,
      fillColor: "#ffff00",
      strokeColor: "#0000cc",
    });
    this.bullets = [];
    this.centipede = [];
    this.mushrooms = [];
    this.addMushrooms();
    this.score = 0;
    this.lives = 9;
    this.level = 0;
  };

  Game.STARTING_CENTIPEDE_LENGTH = 10;
  Game.SQUARE_SIZE = 10;

  Game.prototype.gameBoardSize = function () {
    return this.xDim * this.yDim / Math.pow(this.SQUARE_SIZE, 2);
  };

  Game.prototype.randomHighPosition = function () {
    
  };

  Game.prototype.addMushrooms = function () {
    for (var i = 0; i < this.gameBoardSize() / 10; i++) {
      this.addMushroom();
    }
  };

  Game.prototype.addMushroom = function (options) {
    this.mushrooms.push(new Centipede.Mushroom({
      pos: this.randomHighPosition(),
      game: this
    }));
  };

  Game.prototype.allObjects = function () {
    return this.bullets.concat(this.centipede, [this.ship]);
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, this.xDim, this.yDim);
    ctx.font = "44pt Arial ";
    ctx.fillStyle = "#000000";
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
    if (!this.centipede.length) { this.level++; }
  };

  Game.prototype.remove = function (object) {
    if (object instanceof Centipede.Segment) {
      this.centipede.splice(this.centipede.indexOf(object), 1);
      this.score += 10;
    } else if (object instanceof Centipede.Mushroom) {
      this.mushrooms.splice(this.mushrooms.indexOf(object), 1);
      this.score++;
    } else if (object instanceof Centipede.Spider) {
      this.spider = null;
      this.score += 100;
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

  Game.prototype.isOutOfBounds = function (pos) {
    return pos[0] < 0 ||
           pos[1] < 0 ||
           pos[0] >= this.xDim ||
           pos[1] >= this.yDim;
  };
})();
