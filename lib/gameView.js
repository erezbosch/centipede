(function () {
  window.Centipede = window.Centipede || {};
  var GameView = Centipede.GameView = function (game, ctx) {
    this.game = game;
    this.ctx = ctx;
  };

  GameView.prototype.start = function () {
    this.bindControls();
    window.setInterval(function () {
      this.game.step();
      this.game.draw(this.ctx);
    }.bind(this), 20);
  };

  GameView.prototype.bindControls = function () {
    var that = this;
    $('canvas').mousemove(function (e) {
      var mousePos = [e.clientX - 510, e.clientY - 80];
      var collided = that.game.mushrooms.some(function (mushroom) {
        return mushroom.isCollidedWith({
          pos: mousePos,
          radius: that.game.ship.radius
        });
      });
      if (!collided) { that.game.ship.pos = mousePos; }
    });

    $('canvas').mousedown(function (e) {
      if (that.game.lives === 0) {
        that.game.ship.weapon.stopFiring();
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
          if (that.game.lives === 0) {
            that.game.ship.weapon.stopFiring();
            that.game.reset();
          } else {
            that.game.ship.weapon.startFiring();
          }
          break;

        case 37: // left
          that.game.ship.power([-1, 0]);
          break;

        case 38: // up
          that.game.ship.power([0, -1]);
          break;

        case 39: // right
          that.game.ship.power([1, 0]);
          break;

        case 40: // down
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
          that.game.ship.weapon.stopFiring();
          break;

        default:
          return;
      }
    });
  };
})();
