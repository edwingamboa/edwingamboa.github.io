/**
 * Created by Edwin Gamboa on 16/07/2015.
 */
var Character = require('../prefabs/character');

var NPC;
NPC = function(level, target) {
    Character.call(this, level, level.game.camera.width / 2,
        level.game.camera.height - 150, 'npc', 250, 500, 100, 0.2, 300, target);
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);
};

NPC.prototype = Object.create(Character.prototype);
NPC.prototype.constructor = NPC;

module.exports = NPC;
