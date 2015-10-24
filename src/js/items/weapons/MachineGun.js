/**
 * Created by Edwin Gamboa on 23/07/2015.
 */
var Weapon = require('./Weapon');

/**
 * Default number of bullets for this weapon.
 * @constant
 * @type {number}
 */
var MACHINE_GUN_NUMBER_OF_BULLETS = 30;
/**
 * Texture's key for this weapon.
 * @constant
 * @type {number}
 */
var MACHINE_GUN_KEY = 'machineGun';
/**
 * Texture's key for this weapon bullets.
 * @constant
 * @type {number}
 */
var MACHINE_GUN_BULLET_KEY = 'bullet2';
/**
 * The time player is allowed to shoot again.
 * @constant
 * @type {number}
 */
var MACHINE_GUN_NEXT_FIRE = 1;
/**
 * This weapon bullets' speed
 * @constant
 * @type {number}
 */
var MACHINE_GUN_BULLET_SPEED = 700;
/**
 * Rate at which this weapon fires, the lower the number, the higher the firing
 * rate.
 * @constant
 * @type {number}
 */
var MACHINE_GUN_FIRE_RATE = 100;
/**
 * Damage that can cause this weapon bullets.
 * @constant
 * @type {number}
 */
var MACHINE_GUN_BULLET_POWER = 10;
/**
 * The price that this weapon costs.
 * @constant
 * @type {number}
 */
var PRICE = 100;

/**
 * Represents a MachineGun, which is a  kind of a Weapon.
 * @class MachineGun
 * @extends Weapon
 * @constructor
 * @param {number} x - Weapon's x coordinate within the game world.
 * @param {number} y - Weapon's y coordinate within the game world.
 * @param {boolean} infinite - Indicates weather this weapon has infinite
 * bullets or not.
 */
var MachineGun = function(x, y, infinite) {
    Weapon.call(
        this,
        x,
        y,
        MACHINE_GUN_NUMBER_OF_BULLETS,
        MACHINE_GUN_KEY,
        MACHINE_GUN_BULLET_KEY,
        MACHINE_GUN_NEXT_FIRE,
        MACHINE_GUN_BULLET_SPEED,
        MACHINE_GUN_FIRE_RATE,
        MACHINE_GUN_BULLET_POWER,
        infinite,
        PRICE
    );
    this.name = 'Machine Gun';
};

MachineGun.prototype = Object.create(Weapon.prototype);
MachineGun.prototype.constructor = MachineGun;

module.exports = MachineGun;
