/**
 * @ignore Created by Edwin Gamboa on 10/07/2015.
 */

/**
 * Controls a bullet from a weapon.
 * @class Bullet
 * @extends Phaser.Sprite
 * @constructor
 * @param {number} power - Damage that can cause this bullet.
 * @param {string} imageKey - Texture's key of this bullet.
 */
var Bullet = function(power, imageKey) {
    Phaser.Sprite.call(this, level.game, 0, 0, imageKey);
    this.power = power;

    level.game.physics.arcade.enable(this);
    this.anchor.setTo(0, 0.5);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;
};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

module.exports = Bullet;
