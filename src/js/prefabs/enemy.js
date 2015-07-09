/**
 * Created by Edwin Gamboa on 08/07/2015.
 */
var Character = require('../prefabs/character');

var Enemy;
Enemy = function(game, spriteKey, maxHealthLevel, x, y) {
    Character.call(this, game, x, y, spriteKey, 250,
        500, 100, 0.2, 300);
    this.animations.add('left', [0, 1], 10, true);
    this.animations.add('right', [2, 3], 10, true);
};

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

module.exports = Enemy;
