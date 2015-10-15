/**
 * Created by Edwin Gamboa on 29/08/2015.
 */
var Store = require('../items/store/Store');

var InteractiveHouse = function(x, y, backgroundKey) {
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);

    this.anchor.set(0, 0);

    this.openDoorButton = level.game.make.sprite(this.width / 2,
        -this.height / 2, 'openDoor');
    this.openDoorButton.anchor.set(0.5);
    this.openDoorButton.inputEnabled = true;
    this.openDoorButton.input.priorityID = 2;
    this.openDoorButton.events.onInputDown.add(this.openActivity, this);

    this.addChild(this.openDoorButton);
};

InteractiveHouse.prototype = Object.create(Phaser.Sprite.prototype);
InteractiveHouse.prototype.constructor = InteractiveHouse;

InteractiveHouse.prototype.openActivity = function() {
    var popUp = new Store(level);
    level.game.add.existing(popUp);
    popUp.open();
};

module.exports = InteractiveHouse;
