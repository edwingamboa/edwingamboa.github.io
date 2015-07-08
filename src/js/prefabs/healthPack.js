var Item = require('./item');

var HealthPack;
HealthPack = function(key, maxIncreasing, gravity, bounce, xPos, yPos, level) {
    Item.call(this, level.game, 'Health Pack');
    Phaser.Sprite.call(this, level.game, xPos, yPos, key);
    this.anchor.set(0.5);
    this.maxIncreasing = maxIncreasing;
    level.game.physics.arcade.enable(this);
    this.body.bounce.y = bounce;
    this.body.gravity.y = gravity;
    this.body.collideWorldBounds = true;
    this.level = level;
    return this;
};

HealthPack.prototype = Object.create(Item.prototype);
HealthPack.prototype.constructor = HealthPack;

HealthPack.prototype.pickUp = function() {
    this.kill();
};

HealthPack.prototype.use = function() {
    this.level.addHealthPack(this);
};

module.exports = HealthPack;
