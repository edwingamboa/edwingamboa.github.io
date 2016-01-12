/**
 * @ignore Created by Edwin Gamboa on 08/12/2015.
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
 * @param {InteractionManager} interactionManager - Object that allows
 * displaying player's messages
 */
var ClueItem = function(x,
                        y,
                        key,
                        interactionManager) {
    VocabularyItem.call(this, x, y, key);
    var scale = 30 / this.height;
    this.scale.y = scale;
    this.scale.x = scale;
    this.interactionManager = interactionManager;
};

ClueItem.prototype = Object.create(VocabularyItem.prototype);
ClueItem.prototype.constructor = ClueItem;

/**
 * Kills the this item whn player picks it up.
 * @method ClueItem.pickUp
 */
ClueItem.prototype.pickUp = function() {
    this.kill();
    this.interactionManager.openDialogs();
};

/**
 * Displays this house dialog
 * @method ClueItem.openActivity
 */
ClueItem.prototype.openActivity = function() {
    this.interactionManager.openDialogs();
};

module.exports = ClueItem;

