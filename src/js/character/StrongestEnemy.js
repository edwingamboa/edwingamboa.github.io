/**
 * Created by Edwin Gamboa on 11/11/2015.
 */

var InteractionEnemy = require('./InteractionEnemy');
var MachineGun = require('../items/weapons/MachineGun');
var VerticalLayoutPopUp = require('../util/VerticalLayoutPopUp');
var InteractionManager = require('../util/InteractionManager');

/**
 * Texture key for a strong  enemy
 * @constant
 * @type {string}
 */
var SPRITE_KEY = 'strongestEnemy';
/**
 * Greatest health level of a strong enemy
 * @constant
 * @type {number}
 */
var MAX_HEALTH_LEVEL = 30;
/**
 * Lowest distance in which a strong enemy can detect the player.
 * @constant
 * @type {number}
 */
var MIN_RANGE_DETECTION = 800;
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
var MIN_RANGE_ATTACK = 500;
/**
 * Longest distance in which a simple enemy can shoot the player.
 * @constant
 * @type {number}
 */
var MAX_RANGE_ATTACK = 600;

/**
 * Represents the strongest enemies of the game.
 * @class StrongestEnemy
 * @extends Enemy
 * @param {number} x - Strongest enemy's x coordinate within the game world.
 * @param {number} y - Strongest enemy's y coordinate within the game world.
 * @constructor
 */
var StrongestEnemy = function(x, y) {
    var messages = ['Forgive me please! \nI can liberate your wife.',
		'But your children are not here. \nThey are somewhere else,' +
		'\nbut I do not know where',
        'I am not the boss, \nI work for someone else'];
    var titles = ['Forgive me', 'Look for your children', 'I am not the boss'];
    var imagesKeys = ['forgive', 'mother'];
    var intManager = new InteractionManager(messages, titles, imagesKeys);
    InteractionEnemy.call(
        this,
        SPRITE_KEY,
        MAX_HEALTH_LEVEL,
        x,
        y,
        MIN_RANGE_DETECTION,
        MAX_RANGE_DETECTION,
        MIN_RANGE_ATTACK,
        MAX_RANGE_ATTACK,
        intManager
    );
    this.useWeapon(new MachineGun(this, x, y, true));
};

StrongestEnemy.prototype = Object.create(InteractionEnemy.prototype);
StrongestEnemy.prototype.constructor = StrongestEnemy;

module.exports = StrongestEnemy;

