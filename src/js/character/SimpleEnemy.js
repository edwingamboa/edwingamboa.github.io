/**
 * Created by Edwin Gamboa on 23/07/2015.
 */
var Enemy = require('./Enemy');
var Revolver = require('../items/weapons/Revolver');

var SPRITE_KEY = 'simple_enemy';
var MAX_HEALTH_LEVEL = 5;
var MIN_RANGE_DETECTION = 200;
var MAX_RANGE_DETECTION = 700;
var MIN_RANGE_ATTACK = 50;
var MAX_RANGE_ATTACK = 300;

var SimpleEnemy = function(level, x, y) {
    Enemy.call(this,
        level,
        SPRITE_KEY,
        MAX_HEALTH_LEVEL,
        x,
        y,
        MIN_RANGE_DETECTION,
        MAX_RANGE_DETECTION,
        MIN_RANGE_ATTACK,
        MAX_RANGE_ATTACK);

    this.useWeapon(new Revolver(this, x, y, true));
};

SimpleEnemy.prototype = Object.create(Enemy.prototype);
SimpleEnemy.prototype.constructor = SimpleEnemy;

module.exports = SimpleEnemy;
