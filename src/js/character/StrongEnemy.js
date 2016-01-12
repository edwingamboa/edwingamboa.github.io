/**
 * @ignore Created by Edwin Gamboa on 23/07/2015.
 */
var Enemy = require('./Enemy');
var MachineGun = require('../items/weapons/MachineGun');

/**
 * Texture key for a strong  enemy
 * @constant
 * @type {string}
 */
var SPRITE_KEY = 'strong_enemy';
/**
 * Greatest health level of a strong enemy
 * @constant
 * @type {number}
 */
var MAX_HEALTH_LEVEL = 8;
/**
 * Lowest distance in which a strong enemy can detect the player.
 * @constant
 * @type {number}
 */
var MIN_RANGE_DETECTION = 400;
/**
 * Lowest distance in which a strong enemy can shoot the player.
 * @constant
 * @type {number}
 */
var MAX_RANGE_DETECTION = 1000;
/**
 * Longest distance in which a simple enemy can detect the player.
 * @constant
 * @type {number}
 */
var MIN_RANGE_ATTACK = 200;
/**
 * Longest distance in which a simple enemy can shoot the player.
 * @constant
 * @type {number}
 */
var MAX_RANGE_ATTACK = 600;

/**
 * Represents the strongest enemies of the game.
 * @class StrongEnemy
 * @extends Enemy
 * @param {number} x - Strong enemy's x coordinate within the game world.
 * @param {number} y - Strong enemy's y coordinate within the game world.
 * @constructor
 */
var StrongEnemy = function(x, y) {
    Enemy.call(
        this,
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
