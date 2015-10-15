/**
 * Created by Edwin Gamboa on 29/08/2015.
 */
var PopUp = require('../util/PopUp');

var DEFAULT_CAR_SPEED = 400;
var DEFAULT_CAR_MAX_SPEED = 500;
var CAR_GRAVITY = 30000;

var InteractiveCar = function(x, y, backgroundKey) {
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);

    this.anchor.set(0, 0);

    this.getOnButton = level.game.make.sprite(this.width / 2,
        -this.height, 'openDoor');
    this.getOnButton.anchor.set(0.5);
    this.getOnButton.inputEnabled = true;
    this.getOnButton.input.priorityID = 2;
    this.getOnButton.events.onInputDown.add(this.getOn, this);

    this.addChild(this.getOnButton);

    level.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.anchor.set(0.5, 1);
    this.animations.add('left', [0], 10, true);
    this.animations.add('right', [1], 10, true);
    this.occupied = false;
};

InteractiveCar.prototype = Object.create(Phaser.Sprite.prototype);
InteractiveCar.prototype.constructor = InteractiveCar;

InteractiveCar.prototype.getOn = function() {
    level.player.relocate(this.x, this.y - 100);
    level.player.changeSpeed(DEFAULT_CAR_SPEED, DEFAULT_CAR_MAX_SPEED);
    level.player.changeGravity(CAR_GRAVITY);
    this.occupied = true;
};

InteractiveCar.prototype.update = function() {
    if (this.occupied) {
        this.body.velocity.x = level.player.body.velocity.x;
        if (this.body.velocity.x < 0) {
            this.animations.play('left');
        }else {
            this.animations.play('right');
        }
    }
};

InteractiveCar.prototype.isStopped = function() {
    return this.body.velocity.x === 0;
};

module.exports = InteractiveCar;
