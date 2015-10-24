/**
 * Created by Edwin Gamboa on 16/07/2015.
 */
var Character = require('./Character');

/**
 * Represents a non player character within the game, whom player will interact
 * with.
 * @class NPC
 * @extends Character
 * @constructor
 * @param {number} x - NPC's x coordinate within game world.
 * @param {number} y - NPC's y coordinate within game world.
 * @param {string} key - NPC's texture key.
 * @param {string} comicKey - Texture key of the comic that represents the
 * interaction between this NPC and the player.
 */
var NPC = function(x, y, key, comicKey) {
    Character.call(this, x, y, key);
    this.comicKey = comicKey;
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);
};

NPC.prototype = Object.create(Character.prototype);
NPC.prototype.constructor = NPC;

module.exports = NPC;
