(function () {
  window.Centipede = window.Centipede || {};
  var Game = Centipede.Game = function (xDim, yDim) {
    this.xDim = xDim;
    this.yDim = yDim;
    this.addCentipede();
    this.ship = new Centipede.Ship({
      pos: [xDim / 2, yDim / 2],
      game: this,
      fillColor: "#ffff00",
      strokeColor: "#0000cc",
    });
    this.bullets = [];
    this.score = 0;
    this.lives = 9;
    this.level = 0;
  };

  Game.prototype.addCentipede = function () {
    Centipede = [];
    for (var i = 0; i < Math.pow(this.level, 2) + 10; i++) {
      this.addAsteroid({ pos: this.randomPosition(), vel: 4 + this.level });
    }
    this.Centipede = Centipede;
  }

  Game.prototype.addAsteroid = function (options) {
    Centipede.push(new Centipede.Asteroid({
      pos: options.pos,
      game: this,
      radius: options.radius,
      vel: options.vel
    }));
  }

  Game.prototype.allObjects = function () {
    return this.bullets.concat(this.Centipede, this.ships);
  }

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, this.xDim, this.yDim);
    var i = this.ships[0].freeTicks > 0 ? this.lostLifeImg : this.backgroundImg;
    ctx.drawImage(i, 0, 0, this.xDim, this.yDim);
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
  }

  Game.prototype.moveObjects = function () {
    this.allObjects().forEach(function(object) { object.move(); });
  }

  Game.prototype.wrap = function (pos) {
    if (pos[0] < 0) {
      pos[0] += this.xDim;
    }
    if (pos[1] < 0) {
      pos[1] += this.yDim;
    }
    return [pos[0] % this.xDim, pos[1] % this.yDim];
  }

  Game.prototype.checkCollisions = function () {
    var objects = this.allObjects();
    for (var i = 0; i < objects.length; i++) {
      for (var j = i + 1; j < objects.length; j++) {
        if (objects[i].isCollidedWith(objects[j])) {
          objects[i].collideWith(objects[j]);
        }
      }
    }
  }

  Game.prototype.step = function () {
    this.moveObjects();
    this.checkCollisions();
    if (this.Centipede.length <= 1) {
      this.level++;
      this.addCentipede();
    }
    if (this.ships[0].freeTicks > 0) {
      this.ships[0].freeTicks--;
    }
  }

  Game.prototype.splitAsteroid = function (asteroid) {
    var numTimes = Math.floor(Math.random() * 4) + 1;
    for (var i = 0; i < numTimes; i++) {
      this.addAsteroid({
        pos: asteroid.pos,
        game: asteroid.game,
        radius: Math.random(10) + 5,
        vel: 4 + this.level
      });
    }
  }

  Game.prototype.remove = function (object) {
    if (object instanceof Centipede.Asteroid) {
      if (object.radius >= 18) {
        this.splitAsteroid(object);
      }
      this.Centipede.splice(this.Centipede.indexOf(object), 1);
      this.score++;
    } else {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    }
  };

  Game.prototype.add = function (obj) {
    if (obj instanceof Centipede.Asteroid) {
      this.Centipede.push(obj);
    } else {
      this.bullets.push(obj);
    }
  };

  Game.prototype.isOutOfBounds = function (pos) {
    return pos[0] < 0 ||
           pos[1] < 0 ||
           pos[0] >= this.xDim ||
           pos[1] >= this.yDim;
  }

  Game.prototype.addBackground = function () {
    var img = new Image();
    img.src = './dessert.jpg';
    return img;
  };

  Game.prototype.addLostLifeImg = function () {
    var img = new Image();
    img.src = './chard.jpg';
    return img;
  };
})()
