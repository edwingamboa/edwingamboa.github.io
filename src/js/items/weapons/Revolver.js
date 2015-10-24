/**
 * Created by Edwin Gamboa on 23/07/2015.
 */
var Weapon = require('./Weapon');

/**
 * Default number of bullets for this weapon.
 * @constant
 * @type {number}
 */
var REVOLVER_NUMBER_OF_BULLETS = 20;
/**
 * Texture's key for this weapon
 * @constant
 * @type {number}
 */
var REVOLVER_KEY = 'revolver';
/**
 * Texture's key for this weapon bullets.
 * @constant
 * @type {number}
 */
var REVOLVER_BULLET_KEY = 'bullet1';
/**
 * The time player is allowed to shoot again.
 * @constant
 * @type {number}
 */
var REVOLVER_NEXT_FIRE = 1;
/**
 * This weapon bullets' speed
 * @constant
 * @type {number}
 */
var REVOLVER_BULLET_SPEED = 400;
/**
 * Rate at which this weapon fires, the lower the number, the higher the firing
 * rate.
 * @constant
 * @type {number}
 */
var REVOLVER_FIRE_RATE = 250;
/**
 * Damage that can cause this weapon bullets.
 * @constant
 * @type {number}
 */
var REVOLVER_BULLET_POWER = 1;
/**
 * The price that this weapon costs.
 * @constant
 * @type {number}
 */
var PRICE = 20;

/**
 * Represents a Revolver, which is a  kind of a Weapon.
 * @class Revolver
 * @extends Weapon
 * @constructor
 * @param {number} x - Weapon's x coordinate within the game world.
 * @param {number} y - Weapon's y coordinate within the game world.
 * @param {boolean} infinite - Indicates weather this weapon has infinite
 * bullets or not.
 */
var Revolver = function(x, y, inifinite) {
    Weapon.call(
        this,
        x,
        y,
        REVOLVER_NUMBER_OF_BULLETS,
        REVOLVER_KEY,
        REVOLVER_BULLET_KEY,
        REVOLVER_NEXT_FIRE,
        REVOLVER_BULLET_SPEED,
        REVOLVER_FIRE_RATE,
        REVOLVER_BULLET_POWER,
        inifinite,
        PRICE
    );
    this.name = 'Revolver';
};

Revolver.prototype = Object.create(Weapon.prototype);
Revolver.prototype.constructor = Revolver;

module.exports = Revolver;
