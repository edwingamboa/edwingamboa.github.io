/**
 * Created by Edwin Gamboa on 29/08/2015.
 */
var VocabularyItem = require('../items/VocabularyItem');
var Button = require('../util/Button');

/**
 * Represents a House, which player can interact with.
 * @class InteractiveHouse
 * @extends Phaser.Sprite
 * @constructor
 * @param {number} x - House x coordinate within the world.
 * @param {number} y - House y coordinate within the world.
 * @param {string} backgroundKey - House texture key.
 * @param {string} vocabularyMessage - Message to be displayed on this item's
 * dialog.
 * @param {string} vocabularyName - VocabularyItem's name.
 * @param {string} vocabularyDescription - VocabularyItem's name.
 * @param {number} categoryIndex - Index of the category to which this item
 * belongs.
 * @param {InteractionManager} interactionManager - Interaction manager that
 * allows interaction with the player the house.
 */
var InteractiveHouse = function(x, y, backgroundKey, vocabularyName,
                                vocabularyDescription, categoryIndex,
                                interactionManager) {
    VocabularyItem.call(this, x, y, backgroundKey, vocabularyName,
        vocabularyDescription, categoryIndex, true);
    this.interactionManager = interactionManager;
};

InteractiveHouse.prototype = Object.create(VocabularyItem.prototype);
InteractiveHouse.prototype.constructor = InteractiveHouse;

/**
 * Displays this house dialog
 * @method InteractiveHouse.openActivity
 */
InteractiveHouse.prototype.openActivity = function() {
    this.interactionManager.openDialogs();
};

/**
 * Kills this item when player picks it up.
 * @method WorldItem.pickUp
 */
InteractiveHouse.prototype.pickUp = function() {
    this.openActivity();
    level.vocabularyItems.remove(this);
    level.addObject(this);
};

module.exports = InteractiveHouse;
