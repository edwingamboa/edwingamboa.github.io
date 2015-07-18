/**
 * Created by Edwin Gamboa on 16/07/2015.
 */
var PopUp;
PopUp = function(level, backgroundKey) {
    Phaser.Sprite.call(this, level.game, level.game.camera.width / 2,
        level.game.camera.height / 2, backgroundKey);
    this.anchor.set(0.5);

    this.closeButton = level.game.make.sprite(this.width / 2,
        -this.height / 2, 'close');
    this.closeButton.anchor.set(0.5);
    this.closeButton.inputEnabled = true;
    this.closeButton.input.priorityID = 2;
    this.closeButton.events.onInputDown.add(this.close, this);

    this.addChild(this.closeButton);

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
