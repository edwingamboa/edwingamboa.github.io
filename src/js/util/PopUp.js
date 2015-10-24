/**
 * Created by Edwin Gamboa on 16/07/2015.
 */
/**
 * Represents a pop up window.
 * @class PopUp
 * @extends Phaser.Sprite
 * @constructor
 * @param {string} backgroundKey - Background texture key.
 * @param {PopUP} [parent] - View that creates this PopUP.
 * @param {string} [title] - PopUp title.
 */
var PopUp = function(backgroundKey, parent, title) {
    Phaser.Sprite.call(this, level.game, 0, 0, backgroundKey);

    this.xCenter = this.width / 2;
    this.yCenter = this.height / 2;

    this.x = level.game.camera.width / 2 - this.xCenter;
    this.y = level.game.camera.height / 2 - this.yCenter;

    this.closeButton = level.game.make.sprite(this.width - 5, 5, 'close');
    this.closeButton.anchor.set(1, 0);
    this.closeButton.inputEnabled = true;
    this.closeButton.input.priorityID = 2;
    this.closeButton.events.onInputDown.add(this.close, this);

    if (title !== undefined) {
        this.title = level.game.make.text(this.xCenter, 10, title);
        this.title.font = 'Shojumaru';
        this.title.fontSize = 30;
        this.title.fill = '#FFFFFF';
        this.title.anchor.set(0.5, 0);
        this.addChild(this.title);
    }
    this.addChild(this.closeButton);

    this.fixedToCamera = true;
    this.visible = false;

    if (parent === undefined) {
        this.withoutParent = true;
    }else {
        this.withoutParent = false;
        this.parent = parent;
    }
};

PopUp.prototype = Object.create(Phaser.Sprite.prototype);
PopUp.prototype.constructor = PopUp;

/**
 * Closes or disposes this PopUp window.
 * @method PopUp.close
 */
PopUp.prototype.close = function() {
    this.visible = false;
    level.activePopUps --;
    if (level.activePopUps === 0) {
        level.resume();
    }
    this.kill();
};

/**
 * Opens or displays this PopUp window.
 * @method PopUp.open
 */
PopUp.prototype.open = function() {
    if (!this.alive) {
        this.revive();
    }if (level.activePopUps === 0) {
        level.pause();
    }
    level.activePopUps ++;
    this.bringToTop();
    this.visible = true;
};

/**
 * Remove all the elements that contains the PopUp
 * @method PopUp.removeAllElements
 */
PopUp.prototype.removeAllElements = function() {
    var index = 1;
    if (this.title !== undefined) {
        index = 2;
    }
    this.removeChildren(index);
    this.restartPositions();
};

module.exports = PopUp;
