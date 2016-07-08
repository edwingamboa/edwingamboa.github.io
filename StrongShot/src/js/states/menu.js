/**
 * @ignore Created by Edwin Gamboa on 08/07/2015.
 */

var Button = require('../util/Button');

/**
 * Game main menu. It allows the player to start a new game.
 * @class Menu
 * @constructor
 * @param {Phaser.Game} game - Phaser game object.
 */
var Menu = function(game) {
};

/**
 * Creates the buttons for the menu items.
 * @method Menu.create
 */
Menu.prototype.create = function() {
    this.game.stage.backgroundColor = '#000';
    var centerX = this.game.camera.width / 2;
    var centerY = this.game.camera.height / 2;

    var menuItem = new Button('New Game', this.newGame, this);
    menuItem.x = centerX - menuItem.width / 2;
    menuItem.y = centerY - menuItem.height;
    this.game.add.existing(menuItem);
    if (localStorage.getItem('level') !== null) {
        menuItem = new Button('Continue Playing', this.continuePlaying, this);
        menuItem.x = centerX - menuItem.width / 2;
        menuItem.y = centerY + menuItem.height;
        this.game.add.existing(menuItem);
    }
};

/**
 * Starts a new game.
 * @method Menu.newGame
 */
Menu.prototype.newGame = function() {
    localStorage.clear();
    this.game.state.start('intro');
};

/**
 * Continues a previous game.
 * @method Menu.continuePlaying
 */
Menu.prototype.continuePlaying = function() {
    this.game.state.start(localStorage.getItem('level'));
};

module.exports = Menu;
