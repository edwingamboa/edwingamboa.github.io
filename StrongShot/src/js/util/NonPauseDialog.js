/**
 * @ignore Created by Edwin Gamboa on 06/03/2016.
 */

var VerticalLayoutPopUp = require('./VerticalLayoutPopUp');

/**
 * Represents a game weapon for characters.
 * @class NonPauseDialog
 * @extends VerticalLayoutPopUp
 * @constructor
 * @param {number} x - X coordinate to locate the dialog.
 * @param {number} y - Y coordinate to locate the dialog.
 * @param {string} backgroundKey - Texture key for the dialog's background.
 * @param {Sprite} parent - Parent view of this dialog.
 * @param {string} title - Title of this dialog.
 * @param {number} margin - Margin between the elements of this dialog.
 * @param {string} text - Message of this dialog.
 * @param {string} iconKey - Texture key for the image or icon of this dialog.
 * @param {boolean} animated - Indicates if the icon should be animated.
 * @param {boolean} fixedToCamera - Indicates if the dialog should be fixed to
 * the camera.
 */
var NonPauseDialog = function(x, y, backgroundKey, parent, title, margin, text,
                              iconKey, animated, fixedToCamera) {
    VerticalLayoutPopUp.call(this, backgroundKey, parent, title, margin);
    this.x = x;
    this.y = y;
    this.icon = level.game.make.sprite(0, 0, iconKey);
    var dialogText = level.game.make.text(0, 0, text);
    dialogText.font = level.font;
    dialogText.fontSize = 16;
    dialogText.fill = '#000000';
    dialogText.align = 'center';
    this.addElement(this.icon);
    this.addElement(dialogText);
    if (animated) {
        this.icon.animations.add('animation', [0, 1], 1, true);
        this.icon.animations.play('animation');
    }
    this.fixedToCamera = fixedToCamera;
    this.visible = false;
    level.addObject(this);
};

NonPauseDialog.prototype = Object.create(VerticalLayoutPopUp.prototype);
NonPauseDialog.prototype.constructor = NonPauseDialog;

/**
 * Closes or disposes this PopUp window.
 * @method NonPauseDialog.close
 */
NonPauseDialog.prototype.close = function() {
    this.visible = false;
    this.kill();
};

/**
 * Opens or displays this PopUp window.
 * @method NonPauseDialog.open
 */
NonPauseDialog.prototype.open = function() {
    if (!this.alive) {
        this.revive();
    }
    this.bringToTop();
    this.visible = true;
};

module.exports = NonPauseDialog;
