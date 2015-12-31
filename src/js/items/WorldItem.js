/**
 * Created by Edwin Gamboa on 08/12/2015.
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
 * @param {string} dialogMessage - Message to be displayed on this item's
 * dialog.
 * @param {string} name - WorldItem's name.
 * @param {string} description - WorldItem's name.
 * @param {string} category - Vocabulary category to which this item belongs.
 */
var WorldItem = function(x,
                         y,
                         key,
                         name,
                         description,
                         category) {
    VocabularyItem.call(this, x, y, key, name, description,
        category);
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
