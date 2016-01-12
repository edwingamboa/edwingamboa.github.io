/**
 * @ignore Created by Edwin Gamboa on 25/10/2015.
 */

/**
 * Represents a board for streets and city places names.
 * @class NameBoard
 * @extends Phaser.Sprite
 * @param {number} x - Board x coordinate within the world.
 * @param {number} y - Board y coordinate within the world.
 * @param {string} name - Text to be showed on the Board.
 * @constructor
 */
var NameBoard = function(x, y, name) {
    Phaser.Sprite.call(this, level.game, x, y, 'nameBoard');
    this.anchor.set(0.5, 1);

    this.message = level.game.make.text(0, -this.height + 10, name);
    this.message.font = level.font;
    this.message.fontSize = 16;
    this.message.fill = '#FFFFFF';
    this.message.anchor.set(0.5, 0);

    this.addChild(this.message);
};

NameBoard.prototype = Object.create(Phaser.Sprite.prototype);
NameBoard.prototype.constructor = NameBoard;

module.exports = NameBoard;
