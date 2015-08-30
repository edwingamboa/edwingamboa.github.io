/**
 * Created by Edwin Gamboa on 29/08/2015.
 */
var PopUp = require('../util/PopUp');

var DEFAULT_CAR_SPEED = 400;
var DEFAULT_CAR_MAX_SPEED = 500;
var CAR_GRAVITY = 30000;

var InteractiveCar = function(level, x, y, backgroundKey) {
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
    this.anchor.set(0, 1);

    this.level = level;
    this.occupied = false;
};

InteractiveCar.prototype = Object.create(Phaser.Sprite.prototype);
InteractiveCar.prototype.constructor = InteractiveCar;

InteractiveCar.prototype.getOn = function() {
    this.level.player.relocate(this.x, this.y - 10);
    this.level.player.changeSpeed(DEFAULT_CAR_SPEED, DEFAULT_CAR_MAX_SPEED);
    this.level.player.changeGravity(CAR_GRAVITY);
    this.occupied = true;
};

InteractiveCar.prototype.update = function() {
    if (this.occupied) {
        this.x = this.level.player.x;
        //this.y = this.level.player.y;
    }
};

module.exports = InteractiveCar;
