/**
 * Created by Edwin Gamboa on 06/11/2015.
 */
var Item = require('./Item');

/**
 * Item that represents a clue for the player.
 * @class ClueItem
 * @extends Item
 * @constructor
 * @param {number} x - ClueItem's x coordinate within the game world.
 * @param {number} y - ClueItem's y coordinate within the game world.
 * @param {string} key - ClueItem's texture
 * @param {PopUP} popUP - PopUp that contains the clue or message.
 * for the player.
 * @param {string} name - ClueItem's name.
 * @param {string} description - ClueItem's name.
 * @param {string} category - Vocabulary category to which this item belongs.
 */
var ClueItem = function(x, y, key, popUP, name, description, category) {
    Item.call(this, x, y, key, 0);
    this.name = name;
    this.description = description;
    this.popUp = popUP;
    level.game.add.existing(this.popUp);
    this.category = category || 'other';
};

ClueItem.prototype = Object.create(Item.prototype);
ClueItem.prototype.constructor = ClueItem;

/**
 * Kills the this item whn player picks it up.
 * @method ClueItem.pickUp
 */
ClueItem.prototype.pickUp = function() {
    this.kill();
    this.popUp.open();
};

/**
 * Add this ClueItem to the game so that the player can pick it up.
 * @method ClueItem.use
 */
ClueItem.prototype.use = function() {
    this.popUp.open();
};

module.exports = ClueItem;

