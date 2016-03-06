/**
 * @ignore Created by Edwin Gamboa on 06/03/2016.
 */

var Weapon = require('./Weapon');

/**
 * Default number of bullets for this weapon.
 * @constant
 * @type {number}
 */
var CARBINE_NUMBER_OF_BULLETS = 30;
/**
 * Texture's key for this weapon.
 * @constant
 * @type {number}
 */
var CARBINE_KEY = 'carbine';
/**
 * Texture's key for this weapon bullets.
 * @constant
 * @type {number}
 */
var CARBINE_BULLET_KEY = 'bullet2';
/**
 * The time player is allowed to shoot again.
 * @constant
 * @type {number}
 */
var CARBINE_NEXT_FIRE = 1;
/**
 * This weapon bullets' speed
 * @constant
 * @type {number}
 */
var CARBINE_BULLET_SPEED = 400;
/**
 * Rate at which this weapon fires, the lower the number, the higher the firing
 * rate.
 * @constant
 * @type {number}
 */
var CARBINE_FIRE_RATE = 270;
/**
 * Damage that can cause this weapon bullets.
 * @constant
 * @type {number}
 */
var CARBINE_BULLET_POWER = 3;
/**
 * The price that this weapon costs.
 * @constant
 * @type {number}
 */
var PRICE = 90;

/**
 * Represents a Carbine, which is a  kind of a Weapon.
 * @class Carbine
 * @extends Weapon
 * @constructor
 * @param {number} x - Weapon's x coordinate within the game world.
 * @param {number} y - Weapon's y coordinate within the game world.
 * @param {boolean} infinite - Indicates weather this weapon has infinite
 * bullets or not.
 */
var Carbine = function(x, y, infinite) {
    Weapon.call(
        this,
        x,
        y,
        CARBINE_NUMBER_OF_BULLETS,
        CARBINE_KEY,
        CARBINE_BULLET_KEY,
        CARBINE_NEXT_FIRE,
        CARBINE_BULLET_SPEED,
        CARBINE_FIRE_RATE,
        CARBINE_BULLET_POWER,
        infinite,
        PRICE
    );
    this.name = 'Carbine';
};

Carbine.prototype = Object.create(Weapon.prototype);
Carbine.prototype.constructor = Carbine;

module.exports = Carbine;
