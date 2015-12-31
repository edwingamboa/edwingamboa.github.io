/**
 * Created by Edwin Gamboa on 06/12/2015.
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
var SPRITE_KEY = 'friend';
/**
 * Greatest health level of a strong enemy
 * @constant
 * @type {number}
 */
var MAX_HEALTH_LEVEL = 40;
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
var MIN_RANGE_ATTACK = 600;
/**
 * Longest distance in which a simple enemy can shoot the player.
 * @constant
 * @type {number}
 */
var MAX_RANGE_ATTACK = 800;

/**
 * Represents the strongest enemies of the game.
 * @class Friend
 * @extends Enemy
 * @param {number} x - Strongest enemy's x coordinate within the game world.
 * @param {number} y - Strongest enemy's y coordinate within the game world.
 * @constructor
 */
var Friend = function(x, y) {
    var messages = ['Message 1', 'Message 2'];
    var titles = ['Title 1', 'Title 2'];
    var imagesKeys = ['Key 1', 'Key 2'];
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

Friend.prototype = Object.create(InteractionEnemy.prototype);
Friend.prototype.constructor = Friend;

module.exports = Friend;
