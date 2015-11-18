/**
 * Created by Edwin Gamboa on 13/11/2015.
 */
var NPC = require('./NPC');

/**
 * Represents a non player character within the game, whom player will interact
 * with.
 * @class NPC
 * @extends Character
 * @constructor
 * @param {number} x - WifeNPC's x coordinate within game world.
 * @param {number} y - WifeNPC's y coordinate within game world.
 * @param {string} key - WifeNPC's texture key.
 * @param {string} message - Message that the NPC will tell to the player.
 * @return {WifeNPC}
 */
var WifeNPC = function(x, y, key, message) {
    return NPC.call(this, x, y, key, message);
};

WifeNPC.prototype = Object.create(NPC.prototype);
WifeNPC.prototype.constructor = WifeNPC;

/**
 * Shows the message that thhis NPC has for the Character
 * @method NPC.showMessage
 */
WifeNPC.prototype.showMessage = function() {
    NPC.prototype.showMessage.call(this);
    this.stop();
    level.metWife = true;
};

/**
 * Update animations of the wife.
 * @method WifeNPC.update
 */
WifeNPC.prototype.update = function() {
    if (this.body.velocity.x > 0) {
        this.animations.play('right');
    }else if (this.body.velocity.x < 0) {
        this.animations.play('left');
    }
};

module.exports = WifeNPC;
