/**
 * Created by Edwin Gamboa on 08/07/2015.
 */
/**
 * Game main menu. It allows the player to start a new game.
 * @class Menu
 * @constructor
 * @param {Phaser.Game} game - Phaser game object.
 */
var Menu = function(game) {};

/**
 * Creates the buttons for the menu items.
 * @method Menu.create
 */
Menu.prototype.create = function() {
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
};

/**
 * Starts a new game.
 * @method Menu.newGame
 */
Menu.prototype.newGame = function() {
    this.game.state.start('levelOneIntro');
};

module.exports = Menu;
