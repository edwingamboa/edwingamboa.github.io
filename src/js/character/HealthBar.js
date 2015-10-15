/**
 * Created by Edwin Gamboa on 15/10/2015.
 */

var HealthBar = function(x, y, size) {
    Phaser.Sprite.call(this, level.game, x, y, 'healthBarBackground');
    this.bar = level.game.make.sprite(0, 0, 'healthBar');
    var sizeOps = size || [];
    var width = sizeOps.width || 1;
    var height = sizeOps.height || 1;

    this.addChild(this.bar);
};

HealthBar.prototype = Object.create(Phaser.Sprite.prototype);
HealthBar.prototype.constructor = HealthBar;

HealthBar.prototype.updateHealthBarLevel = function(barLevel) {
    this.bar.scale.x = barLevel;
};

module.exports = HealthBar;
