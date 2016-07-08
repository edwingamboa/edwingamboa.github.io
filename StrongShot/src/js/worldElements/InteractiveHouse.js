/**
 * @ignore Created by Edwin Gamboa on 29/08/2015.
 */

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
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);
    this.anchor.set(0, 1);
    level.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.interactionManager = interactionManager;
};

InteractiveHouse.prototype = Object.create(Phaser.Sprite.prototype);
InteractiveHouse.prototype.constructor = InteractiveHouse;

/**
 * Displays this house dialog
 * @method InteractiveHouse.openActivity
 */
InteractiveHouse.prototype.openActivity = function() {
    level.interactiveBuldings.remove(this);
    level.addObject(this);
    this.interactionManager.openDialogs();
};

/**
 * Creates an animated arrow to show when the pop up displays. It can be used
 * to indicate or point something to the user
 * @param {number} x - Arrow x coordinate within the world.
 * @param {number} y - Arrow y coordinate within the world.
 */
InteractiveHouse.prototype.createAnimatedArrow = function(x, y) {
    var animatedArrow = level.game.make.sprite(x, y, 'arrowDown');
    animatedArrow.anchor.set(0, 1);
    animatedArrow.animations.add('animation', [0, 1, 2, 3, 4, 5], 4, true);
    animatedArrow.animations.play('animation');
    var lastDialogIndex = this.interactionManager.dialogs.length - 1;
    this.interactionManager.dialogs[lastDialogIndex].addChild(animatedArrow);
};

module.exports = InteractiveHouse;
