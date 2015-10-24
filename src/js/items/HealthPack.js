var Item = require('./Item');

/**
 * Rate use to calculate health pack prize, based on maxIncreasing value.
 * @constant
 * @type {number}
 */
var PRICE_INCREASE_RATE = 2;
/**
 * HealthPack's gravity value.
 * @constant
 * @type {number}
 */
var GRAVITY = 100;

/**
 * Represents a health pack that player can use to increase his/her current
 * health level.
 * @class HealthPack
 * @extends Item
 * @constructor
 * @param {number} x - HealthPack's x coordinate within the game world.
 * @param {number} y - HealthPack's y coordinate within the game world.
 * @param {number} maxIncreasing - Greatest value to increase when player uses
 * this HealthPack.
 */
var HealthPack = function(x, y, maxIncreasing) {
    Item.call(this, x, y, 'healthPack' + maxIncreasing,
        maxIncreasing * PRICE_INCREASE_RATE);
    this.body.gravity.y = GRAVITY;
    this.maxIncreasing = maxIncreasing;
    this.name = 'Health Pack';
    this.description = '+ ' + maxIncreasing + ' Health Level';
    this.category = 'healthPacks';
};

HealthPack.prototype = Object.create(Item.prototype);
HealthPack.prototype.constructor = HealthPack;

/**
 * Kills the this item whn player picks it up.
 * @method HealthPack.pickUp
 */
HealthPack.prototype.pickUp = function() {
    this.kill();
};

/**
 * Add this HealthPack to the game so that the player can pick it up.
 * @method HealthPack.use
 */
HealthPack.prototype.use = function() {
    if (!this.alive) {
        this.revive();
    }
    this.x = level.player.x;
    this.y = 50;
    level.addHealthPack(this);
};

module.exports = HealthPack;
