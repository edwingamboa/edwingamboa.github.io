/**
 * Created by Edwin Gamboa on 23/07/2015.
 */
var Enemy = require('../character/Enemy');
var Revolver = require('../weapons/Revolver');

var SIMPLE_ENEMY_SPRITE_KEY = 'simple_enemy';
var SIMPLE_ENEMY_MAX_HEALTH_LEVEL = 70;
var SIMPLE_ENEMY_RANGE_DETECTION = 700;
var SIMPLE_ENEMY_RANGE_ATTACK = 300;

var SimpleEnemy = function(level, x, y, target) {
    Enemy.call(this,
        level,
        SIMPLE_ENEMY_SPRITE_KEY,
        SIMPLE_ENEMY_MAX_HEALTH_LEVEL,
        x,
        y,
        target,
        SIMPLE_ENEMY_RANGE_DETECTION,
        SIMPLE_ENEMY_RANGE_ATTACK);

    this.addWeapon(new Revolver(this, this, x, y, true));
    this.updateCurrentWeapon('simpleWeapon');
};

SimpleEnemy.prototype = Object.create(Enemy.prototype);
SimpleEnemy.prototype.constructor = SimpleEnemy;

module.exports = SimpleEnemy;
