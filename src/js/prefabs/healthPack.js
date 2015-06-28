var Item = require('./item');

var HealthPack;
HealthPack = function(game, key, maxIncreasing, gravity, bounce, xPos,
                      yPos) {
    Item.call(this, game, 'Health Pack');
    Phaser.Sprite.call(this, game, xPos, yPos, key);
    this.anchor.set(0.5);
    this.maxIncreasing = maxIncreasing;
    this.game.physics.arcade.enable(this);
    this.body.bounce.y = bounce;
    this.body.gravity.y = gravity;
    this.body.collideWorldBounds = true;
    return this;
};

HealthPack.prototype = Object.create(Item.prototype);
HealthPack.prototype.constructor = HealthPack;

HealthPack.prototype.pickUp = function() {
    this.kill();
};

module.exports = HealthPack;
