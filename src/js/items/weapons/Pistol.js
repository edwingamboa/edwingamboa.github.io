/**
 * @ignore Created by Edwin Gamboa on 06/03/2016.
 */

var Weapon = require('./Weapon');

/**
 * Default number of bullets for this weapon.
 * @constant
 * @type {number}
 */
var PISTOL_NUMBER_OF_BULLETS = 20;
/**
 * Texture's key for this weapon.
 * @constant
 * @type {number}
 */
var PISTOL_KEY = 'pistol';
/**
 * Texture's key for this weapon bullets.
 * @constant
 * @type {number}
 */
var PISTOL_BULLET_KEY = 'bullet2';
/**
 * The time player is allowed to shoot again.
 * @constant
 * @type {number}
 */
var PISTOL_NEXT_FIRE = 1;
/**
 * This weapon bullets' speed
 * @constant
 * @type {number}
 */
var PISTOL_BULLET_SPEED = 400;
/**
 * Rate at which this weapon fires, the lower the number, the higher the firing
 * rate.
 * @constant
 * @type {number}
 */
var PISTOL_FIRE_RATE = 250;
/**
 * Damage that can cause this weapon bullets.
 * @constant
 * @type {number}
 */
var PISTOL_BULLET_POWER = 2;
/**
 * The price that this weapon costs.
 * @constant
 * @type {number}
 */
var PRICE = 30;

/**
 * Represents a Pistol, which is a  kind of a Weapon.
 * @class Pistol
 * @extends Weapon
 * @constructor
 * @param {number} x - Weapon's x coordinate within the game world.
 * @param {number} y - Weapon's y coordinate within the game world.
 * @param {boolean} infinite - Indicates weather this weapon has infinite
 * bullets or not.
 */
var Pistol = function(x, y, infinite) {
    Weapon.call(
        this,
        x,
        y,
        PISTOL_NUMBER_OF_BULLETS,
        PISTOL_KEY,
        PISTOL_BULLET_KEY,
        PISTOL_NEXT_FIRE,
        PISTOL_BULLET_SPEED,
        PISTOL_FIRE_RATE,
        PISTOL_BULLET_POWER,
        infinite,
        PRICE
    );
    this.name = 'Pistol';
};

Pistol.prototype = Object.create(Weapon.prototype);
Pistol.prototype.constructor = Pistol;

module.exports = Pistol;
