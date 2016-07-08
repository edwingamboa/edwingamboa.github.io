/**
 * @ignore Created by Edwin Gamboa on 15/10/2015.
 */

/**
 * Bar that shows the remaining part of a resource, for example a HealthBar.
 * @class ResourceBar
 * @extends Phaser.Sprite
 * @constructor
 * @param {number} x - X coordinate of the bar.
 * @param {number} y - Y coordinate of the bar.
 * @param {Object} [size.width] - Bar width.
 * @param {Object} [size.height] - Bar height.
 */
var ResourceBar = function(x, y, size) {
    Phaser.Sprite.call(this, level.game, x, y, 'healthBarBackground');
    this.bar = level.game.make.sprite(0, 0, 'healthBar');
    var sizeOps = size || [];
    if (sizeOps.width !== undefined && sizeOps.height !== undefined) {
        this.width =  sizeOps.width;
        this.height =  sizeOps.height;
    }
    this.addChild(this.bar);
};

ResourceBar.prototype = Object.create(Phaser.Sprite.prototype);
ResourceBar.prototype.constructor = ResourceBar;

/**
 * Updates the current level of the bar.
 * @method ResourceBar.updateResourceBarLevel
 * @param {number} barLevel - Number between 0 (0%) and 1 (100%), that
 * represents the bar current level.
 */
ResourceBar.prototype.updateResourceBarLevel = function(barLevel) {
    this.bar.scale.x = barLevel;
};

module.exports = ResourceBar;
