/**
 * Created by Edwin Gamboa on 16/07/2015.
 */
var HorizontalLayoutPopUp = require('./HorizontalLayoutPopUp');

/**
 * View for a Dialog.
 * @class Dialog
 * @extends PopUp
 * @constructor
 * @param {string} iconKey - Background texture key.
 * @param {string} text - Text to be through the dialog.
 * @param {PopUp} [parent = null] - View that generates the Dialog.
 */
var Dialog = function(iconKey, text, parent) {
    HorizontalLayoutPopUp.call(this, 'dialogBg', parent, null, 20);

    this.icon = level.game.make.sprite(0, 0, iconKey);
    var scale;
    if (this.icon.width > 100) {
        scale = this.icon.width / 100;
    }else {
        scale = 100 / this.icon.width;
    }
    this.icon.scale.setTo(scale, scale);

    this.message = level.game.make.text(0, 0, '');
    this.message.font = 'Arial';
    this.message.fontSize = 20;
    this.message.fill = '#000000';
    this.message.text = text;

    this.addElement(this.icon);
    this.addElement(this.message);
};

Dialog.prototype = Object.create(HorizontalLayoutPopUp.prototype);
Dialog.prototype.constructor = Dialog;

/**
 * Sets the text to be diaplayed through this dialog.
 * @method Dialog.setText
 * @param text
 */
Dialog.prototype.setText = function(text) {
    this.message.text = text;
};

module.exports = Dialog;
