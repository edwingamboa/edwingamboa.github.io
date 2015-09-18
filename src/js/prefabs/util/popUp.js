/**
 * Created by Edwin Gamboa on 16/07/2015.
 */
var MARGIN = 10;
var PopUp = function(level, backgroundKey, parent) {
    Phaser.Sprite.call(this, level.game, level.game.camera.width / 2,
        level.game.camera.height / 2, backgroundKey);

    this.anchor.set(0.5, 0.5);

    this.xOrigin = -this.width / 2 + MARGIN;
    this.yOrigin = -this.height / 2 + MARGIN;

    this.xCenter = 0;
    this.yCenter = 0;

    this.closeButton = level.game.make.sprite(-this.xOrigin,
        this.yOrigin, 'close');
    this.closeButton.anchor.set(0.5);
    this.closeButton.inputEnabled = true;
    this.closeButton.input.priorityID = 2;
    this.closeButton.events.onInputDown.add(this.close, this);

    this.addChild(this.closeButton);

    this.fixedToCamera = true;
    this.visible = false;

    if (parent === undefined) {
        this.withoutParent = true;
    }else {
        this.withoutParent = false;
        this.parent = parent;
    }

    this.level = level;
};

PopUp.prototype = Object.create(Phaser.Sprite.prototype);
PopUp.prototype.constructor = PopUp;

PopUp.prototype.close = function() {
    this.visible = false;
    if (this.withoutParent) {
        this.level.resume();
    }
    this.kill();
};

PopUp.prototype.open = function() {
    if (!this.alive) {
        this.revive();
    }
    this.level.pause();
    this.bringToTop();
    this.visible = true;
};

module.exports = PopUp;
