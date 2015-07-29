/**
 * Created by Edwin Gamboa on 16/07/2015.
 */
var Character = require('../character/Character');

var NPC;
NPC = function(level, x, y, target) {
    Character.call(this, level, x, y, 'npc', target);
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);
};

NPC.prototype = Object.create(Character.prototype);
NPC.prototype.constructor = NPC;

module.exports = NPC;
