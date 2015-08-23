(function () {
  window.Centipede = window.Centipede || {};
  var GameView = Centipede.GameView = function(game, ctx) {
    this.game = game;
    this.ctx = ctx;
  };

  GameView.prototype.start = function () {
    this.addKeyBindings();
    window.setInterval(function () {
      this.game.step();
      this.game.draw(this.ctx);
    }.bind(this), 20);
  };

  GameView.prototype.addKeyBindings = function () {
    var that = this;
    $(document).keydown(function (e) {
      e.preventDefault();
      switch(e.which) {
        case 32: // space
          that.game.ship.weapon.startFiring();
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
