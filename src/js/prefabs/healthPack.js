var HealthPack;
HealthPack = function(key, maxIncreasing, gravity, bounce, xPos, yPos, level) {
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

HealthPack.prototype = Object.create(Phaser.Sprite.prototype);
HealthPack.prototype.constructor = HealthPack;

HealthPack.prototype.pickUp = function() {
    this.kill();
};

HealthPack.prototype.use = function() {
    if (!this.alive) {
        this.revive();
    }
    this.x = this.level.player.x;
    this.level.addHealthPack(this);
};

module.exports = HealthPack;
