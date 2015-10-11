/**
 * Created by Edwin Gamboa on 16/07/2015.
 */
var HorizontalLayoutPopUp = require('../util/HorizontalLayoutPopUp');

var Dialog = function(level, iconKey, text, parent) {
    HorizontalLayoutPopUp.call(this, level, 'dialog', parent);

    this.icon = level.game.make.sprite(0, 0, iconKey);
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

Dialog.prototype.setText = function(text) {
    this.message.text = text;
};

module.exports = Dialog;
