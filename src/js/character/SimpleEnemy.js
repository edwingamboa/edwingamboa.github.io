/**
 * Created by Edwin Gamboa on 23/07/2015.
 */
var Enemy = require('./Enemy');
var Revolver = require('../items/weapons/Revolver');

/**
 * Texture key for a simple enemy
 * @constant
 * @type {string}
 */
var SPRITE_KEY = 'simple_enemy';
/**
 * Greatest health level of a simple enemy
 * @constant
 * @type {number}
 */
var MAX_HEALTH_LEVEL = 4;
/**
 * Lowest distance in which a simple enemy can detect the player.
 * @constant
 * @type {number}
 */
var MIN_RANGE_DETECTION = 200;
/**
 * Longest distance in which a simple enemy can detect the player.
 * @constant
 * @type {number}
 */
var MAX_RANGE_DETECTION = 700;
/**
 * Lowest distance in which a simple enemy can shoot the player.
 * @constant
 * @type {number}
 */
var MIN_RANGE_ATTACK = 100;
/**
 * Longest distance in which a simple enemy can shoot the player.
 * @constant
 * @type {number}
 */
var MAX_RANGE_ATTACK = 300;

/**
 * Represents the weakest enemies of the game.
 * @class SimpleEnemy
 * @extends Enemy
 * @param {number} x - Simple enemy's x coordinate within the game world.
 * @param {number} y - Simple enemy's y coordinate within the game world.
 * @constructor
 */
var SimpleEnemy = function(x, y) {
    Enemy.call(this,
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
