/**
 * Created by Edwin Gamboa on 08/07/2015.
 */
var Menu;
Menu = function(game) {};

Menu.prototype = {
    create: function() {
        var newGame = this.game.add.text(this.game.camera.width / 2,
                this.game.camera.height / 2, 'New Game');
        //Font style
        newGame.font = 'Arial';
        newGame.fontSize = 50;
        newGame.fontWeight = 'bold';
        newGame.fill = '#0040FF';
        newGame.anchor.set(0.5);
        newGame.inputEnabled = true;
        newGame.events.onInputDown.add(this.newGame, this);
    },

    newGame: function() {
        this.game.state.start('levelOne');
    }
};

module.exports = Menu;
