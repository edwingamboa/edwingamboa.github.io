var Item = require('./Item');

var PRCE_INCREASE_RATE = 10;
var GRAVITY = 300;

var HealthPack = function(x, y, maxIncreasing) {
    Item.call(this, x, y, 'healthPack' + maxIncreasing,
        maxIncreasing * PRCE_INCREASE_RATE);
    this.body.gravity.y = GRAVITY;
    this.maxIncreasing = maxIncreasing;
};

HealthPack.prototype = Object.create(Item.prototype);
HealthPack.prototype.constructor = HealthPack;

HealthPack.prototype.pickUp = function() {
    this.kill();
};

HealthPack.prototype.use = function() {
    if (!this.alive) {
        this.revive();
    }
    this.x = level.player.x;
    this.y = 50;
    level.addHealthPack(this);
};

module.exports = HealthPack;
