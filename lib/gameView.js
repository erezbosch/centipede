(function () {
  window.Centipede = window.Centipede || {};
  var GameView = Centipede.GameView = function (game, ctx) {
    this.game = game;
    this.ctx = ctx;
  };

  GameView.prototype.start = function () {
    this.listenToEvents();
    this.game.draw(this.ctx);
    window.setInterval(function () {
      this.game.step();
      this.game.draw(this.ctx);
    }.bind(this), 20);
  };

  GameView.prototype.listenToEvents = function () {
    var that = this;
    $('canvas').mousemove(function (e) {
      if (!that.game.mushrooms) { return; }
      var mousePos = [e.clientX - 510, e.clientY - 60];
      var collided = that.game.mushrooms.some(function (mushroom) {
        return mushroom.isCollidedWith({
          pos: mousePos,
          radius: that.game.ship.radius
        });
      });
      if (!collided) { that.game.ship.pos = mousePos; }
    });

    $('canvas').mousedown(function (e) {
      if (!that.game.lives) {
        that.game.ship && that.game.ship.weapon.stopFiring();
        that.game.reset();
      } else {
        that.game.ship.weapon.startFiring();
      }
    });

    $(document).mouseup(function (e) {
      that.game.ship.weapon.stopFiring();
    });

    $(document).keydown(function (e) {
      e.preventDefault();
      switch(e.which) {
        case 32: // space
          if (!that.game.lives) {
            that.game.ship && that.game.ship.weapon.stopFiring();
            that.game.reset();
          } else {
            that.game.ship.weapon.startFiring();
          }
          break;

        case 37: // left
          if (!that.game.ship) { return; }
          that.game.ship.power([-1, 0]);
          break;

        case 38: // up
          if (!that.game.ship) { return; }
          that.game.ship.power([0, -1]);
          break;

        case 39: // right
          if (!that.game.ship) { return; }
          that.game.ship.power([1, 0]);
          break;

        case 40: // down
          if (!that.game.ship) { return; }
          that.game.ship.power([0, 1]);
          break;

        default:
          return;
      }
    });

    $(document).keyup(function (e) {
      e.preventDefault();
      switch(e.which) {
        case 32: // space
          if (!that.game.ship) { return; }
          that.game.ship.weapon.stopFiring();
          break;

        default:
          return;
      }
    });
  };
})();
