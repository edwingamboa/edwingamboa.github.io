/**
 * @ignore Created by Edwin Gamboa on 08/12/2015.
 */
var VocabularyItem = require('./VocabularyItem');

/**
 * Item that represents a clue for the player.
 * @class WorldItem
 * @extends Item
 * @constructor
 * @param {number} x - VocabularyItem's x coordinate within the game world.
 * @param {number} y - VocabularyItem's y coordinate within the game world.
 * @param {string} key - WorldItem's texture
 */
var WorldItem = function(x, y, key) {
    VocabularyItem.call(this, x, y, key);
};

WorldItem.prototype = Object.create(VocabularyItem.prototype);
WorldItem.prototype.constructor = WorldItem;

/**
 * Kills this item when player picks it up.
 * @method WorldItem.pickUp
 */
WorldItem.prototype.pickUp = function() {
    level.vocabularyItems.remove(this);
    level.addObject(this);
};

module.exports = WorldItem;
