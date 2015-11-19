/**
 * Created by Edwin Gamboa on 16/07/2015.
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
 * @param {string} message - Message that the NPC will tell to the player.
 * @return {NPC}
 */
var NPC = function(x, y, key, message) {
    Character.call(this, x, y, key);
    this.message = message;
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);
    this.stopLeftFrameIndex = 0;
    this.stopRightFrameIndex = 5;
    this.frame = this.stopRightFrameIndex;
    this.hadContactWithPlayer = false;
    return this;
};

NPC.prototype = Object.create(Character.prototype);
NPC.prototype.constructor = NPC;

/**
 * Shows the message that thhis NPC has for the Character
 * @method NPC.showMessage
 */
NPC.prototype.showMessage = function() {
    if (this.body.velocity.x > 0) {
        this.stop();
    }
    var dialog = new Dialog(this.key, this.message);
    level.game.add.existing(dialog);
    dialog.open();
    this.hadContactWithPlayer = true;
};

module.exports = NPC;
