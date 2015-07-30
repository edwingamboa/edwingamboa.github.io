/**
 * Created by Edwin Gamboa on 23/07/2015.
 */
var Enemy = require('../character/Enemy');
var MachineGun = require('../weapons/MachineGun');

var STRONG_ENEMY_SPRITE_KEY = 'strong_enemy';
var STRONG_ENEMY_MAX_HEALTH_LEVEL = 150;
var STRONG_ENEMY_RANGE_DETECTION = 1400;
var STRONG_ENEMY_RANGE_ATTACK = 600;

var StrongEnemy = function(level, x, y, target) {
    Enemy.call(this,
        level,
        STRONG_ENEMY_SPRITE_KEY,
        STRONG_ENEMY_MAX_HEALTH_LEVEL,
        x,
        y,
        target,
        STRONG_ENEMY_RANGE_DETECTION,
        STRONG_ENEMY_RANGE_ATTACK);

    this.addWeapon(new MachineGun(this, x, y, true));
    this.updateCurrentWeapon('strongWeapon');
};

StrongEnemy.prototype = Object.create(Enemy.prototype);
StrongEnemy.prototype.constructor = StrongEnemy;

module.exports = StrongEnemy;
