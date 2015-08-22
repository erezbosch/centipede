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
          that.game.ship.fireBullet();
          break;

        case 37: // left
          break;

        case 38: // up
          break;

        case 39: // right
          break;

        case 40: // down
          break;

        default:
          that.game.ship.slowDown();
          return;
      }
    });
  };
})();
