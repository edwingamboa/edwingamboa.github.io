/**
 * Created by Edwin Gamboa on 09/03/2016.
 */
/**
 * Represents a Sprite that triggers an action when player overlaps it.
 * @class TriggerSprite
 * @extends Phaser.Sprite
 * @constructor
 * @param {number} x - X coordinate within the world.
 * @param {number} y - Y coordinate within the world.
 * @param {string} backgroundKey - House texture key.
 * @param {function} action - Action to be triggered.
 * @param {object} parent - Object that has the action as function
 */
var TriggerSprite = function(x, y, backgroundKey, action, parent) {
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);
    this.anchor.set(0, 1);
    level.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.action = action;
    this.parentObject = parent;
};

TriggerSprite.prototype = Object.create(Phaser.Sprite.prototype);
TriggerSprite.prototype.constructor = TriggerSprite;

/**
 * Triggers the action related to this Sprite
 * @method TriggerSprite.triggerAction
 */
TriggerSprite.prototype.triggerAction = function() {
    this.action.call(this.parentObject);
};

module.exports = TriggerSprite;
