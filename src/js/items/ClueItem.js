/**
 * Created by Edwin Gamboa on 08/12/2015.
 */
var VocabularyItem = require('./VocabularyItem');

/**
 * Item that represents a clue for the player.
 * @class ClueItem
 * @extends Item
 * @constructor
 * @param {number} x - ClueItem's x coordinate within the game world.
 * @param {number} y - ClueItem's y coordinate within the game world.
 * @param {string} key - ClueItem's texture
 * @param {string} dialogMessage - Message to be displayed on this item's
 * dialog.
 * @param {string} name - ClueItem's name.
 * @param {string} description - ClueItem's name.
 * @param {number} categoryIndex - Index of the category to which this item.
 */
var ClueItem = function(x,
                        y,
                        key,
                        dialogMessage,
                        name,
                        description,
                        categoryIndex) {
    VocabularyItem.call(this, x, y, key, dialogMessage, name, description,
        categoryIndex);
    var scale = 50 / this.height;
    this.scale.y = scale;
    this.scale.x = scale;
};

ClueItem.prototype = Object.create(VocabularyItem.prototype);
ClueItem.prototype.constructor = ClueItem;

/**
 * Kills the this item whn player picks it up.
 * @method ClueItem.pickUp
 */
ClueItem.prototype.pickUp = function() {
    this.kill();
    this.popUp.open();
};

module.exports = ClueItem;

