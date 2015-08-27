(function () {
  window.Centipede = window.Centipede || {};
  var GameView = Centipede.GameView = function (game, ctx) {
    this.game = game;
    this.ctx = ctx;
  };

  GameView.prototype.start = function () {
    this.listenToEvents();
    this.game.draw(this.ctx);
    var that = this;
    setTimeout(function () {
      window.setInterval(function () {
        that.game.step();
        that.game.draw(that.ctx);
      }, 20);
    }, 100);

  };

  GameView.prototype.listenToEvents = function () {
    var that = this;
    $('canvas').mousemove(function (e) {
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
