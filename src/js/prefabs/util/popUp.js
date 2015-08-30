/**
 * Created by Edwin Gamboa on 16/07/2015.
 */
var PopUp = function(level, backgroundKey) {
    Phaser.Sprite.call(this, level.game, level.game.camera.width / 2,
        level.game.camera.height / 2, backgroundKey);

    this.bringToTop();
    this.anchor.set(0.5);

    this.openDoorButton = level.game.make.sprite(this.width / 2,
        -this.height / 2, 'close');
    this.openDoorButton.anchor.set(0.5);
    this.openDoorButton.inputEnabled = true;
    this.openDoorButton.input.priorityID = 2;
    this.openDoorButton.events.onInputDown.add(this.close, this);

    this.addChild(this.openDoorButton);

    this.fixedToCamera = true;
    this.visible = false;

    this.level = level;
};

PopUp.prototype = Object.create(Phaser.Sprite.prototype);
PopUp.prototype.constructor = PopUp;

PopUp.prototype.close = function() {
    this.level.resume();
    this.visible = false;
};

PopUp.prototype.open = function() {
    this.level.pause();
    this.visible = true;
};

module.exports = PopUp;
