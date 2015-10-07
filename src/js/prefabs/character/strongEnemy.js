/**
 * Created by Edwin Gamboa on 23/07/2015.
 */
var Enemy = require('../character/Enemy');
var MachineGun = require('../items/weapons/MachineGun');

var SPRITE_KEY = 'strong_enemy';
var MAX_HEALTH_LEVEL = 150;
var MIN_RANGE_DETECTION = 1000;
var MIN_RANGE_ATTACK = 600;
var MAX_RANGE_DETECTION = 1000;
var MAX_RANGE_ATTACK = 600;

var StrongEnemy = function(level, x, y) {
    Enemy.call(
        this,
        level,
        SPRITE_KEY,
        MAX_HEALTH_LEVEL,
        x,
        y,
        MIN_RANGE_DETECTION,
        MAX_RANGE_DETECTION,
        MIN_RANGE_ATTACK,
        MAX_RANGE_ATTACK
    );

    this.useWeapon(new MachineGun(this, x, y, true));
};

StrongEnemy.prototype = Object.create(Enemy.prototype);
StrongEnemy.prototype.constructor = StrongEnemy;

module.exports = StrongEnemy;
