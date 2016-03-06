/**
 * @ignore Created by Edwin Gamboa on 06/03/2016.
 */

var Weapon = require('./Weapon');

/**
 * Default number of bullets for this weapon.
 * @constant
 * @type {number}
 */
var RIFLE_NUMBER_OF_BULLETS = 30;
/**
 * Texture's key for this weapon.
 * @constant
 * @type {number}
 */
var RIFLE_KEY = 'rifle';
/**
 * Texture's key for this weapon bullets.
 * @constant
 * @type {number}
 */
var RIFLE_BULLET_KEY = 'bullet1';
/**
 * The time player is allowed to shoot again.
 * @constant
 * @type {number}
 */
var RIFLE_NEXT_FIRE = 1;
/**
 * This weapon bullets' speed
 * @constant
 * @type {number}
 */
var RIFLE_BULLET_SPEED = 400;
/**
 * Rate at which this weapon fires, the lower the number, the higher the firing
 * rate.
 * @constant
 * @type {number}
 */
var RIFLE_FIRE_RATE = 270;
/**
 * Damage that can cause this weapon bullets.
 * @constant
 * @type {number}
 */
var RIFLE_BULLET_POWER = 4;
/**
 * The price that this weapon costs.
 * @constant
 * @type {number}
 */
var PRICE = 120;

/**
 * Represents a Rifle, which is a  kind of a Weapon.
 * @class Rifle
 * @extends Weapon
 * @constructor
 * @param {number} x - Weapon's x coordinate within the game world.
 * @param {number} y - Weapon's y coordinate within the game world.
 * @param {boolean} infinite - Indicates weather this weapon has infinite
 * bullets or not.
 */
var Rifle = function(x, y, infinite) {
    Weapon.call(
        this,
        x,
        y,
        RIFLE_NUMBER_OF_BULLETS,
        RIFLE_KEY,
        RIFLE_BULLET_KEY,
        RIFLE_NEXT_FIRE,
        RIFLE_BULLET_SPEED,
        RIFLE_FIRE_RATE,
        RIFLE_BULLET_POWER,
        infinite,
        PRICE
    );
    this.name = 'Rifle';
};

Rifle.prototype = Object.create(Weapon.prototype);
Rifle.prototype.constructor = Rifle;

module.exports = Rifle;
