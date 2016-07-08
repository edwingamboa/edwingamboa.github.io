/**
 * @ignore Created by Edwin Gamboa on 16/07/2015.
 */
var Character = require('./Character');
var Dialog = require('../util/Dialog');

/**
 * Represents a non player character within the game, whom player will interact
 * with.
 * @class NPC
 * @extends Character
 * @constructor
 * @param {number} x - NPC's x coordinate within game world.
 * @param {number} y - NPC's y coordinate within game world.
 * @param {string} key - NPC's texture key.
 * shoot the player.
 * @param {InteractionManager} interactionManager - Interaction manager that
 * allows interaction with the player
 * @return {NPC}
 */
var NPC = function(x, y, key, interactionManager) {
    Character.call(this, x, y, key);
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);
    this.stopLeftFrameIndex = 0;
    this.stopRightFrameIndex = 5;
    this.frame = this.stopLeftFrameIndex;
    this.hadContactWithPlayer = false;
    this.interactionManager = interactionManager;
    return this;
};

NPC.prototype = Object.create(Character.prototype);
NPC.prototype.constructor = NPC;

/**
 * Lets the NPC to show the messages he has for the player. (Interaction)
 * @method NPC.openDialogs
 */
NPC.prototype.openDialogs = function() {
    this.interactionManager.openDialogs();
};

module.exports = NPC;
