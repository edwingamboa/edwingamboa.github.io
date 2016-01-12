/**
 * @ignore Created by Edwin Gamboa on 29/08/2015.
 */
var VocabularyItem = require('../items/vocabularyItems/VocabularyItem');
var Button = require('../util/Button');

/**
 * Represents a House, which player can interact with.
 * @class InteractiveHouse
 * @extends Phaser.Sprite
 * @constructor
 * @param {number} x - House x coordinate within the world.
 * @param {number} y - House y coordinate within the world.
 * @param {string} backgroundKey - House texture key.
 * @param {InteractionManager} interactionManager - Interaction manager that
 * allows interaction with the player.
 */
var InteractiveHouse = function(x, y, backgroundKey, interactionManager) {
    VocabularyItem.call(this, x, y, backgroundKey, true);
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
