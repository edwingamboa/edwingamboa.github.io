/**
 * Created by Edwin Gamboa on 16/07/2015.
 */
var PopUp = require('../util/PopUp');

var Dialog = function(level, iconKey, text, parent) {
    PopUp.call(this, level, 'dialog', parent);

    this.icon = level.game.make.sprite(this.xOrigin, this.yCenter, iconKey);
    this.icon.anchor.set(0, 0.5);

    this.message = level.game.make.text(this.xOrigin + this.icon.width + 10,
        this.yCenter, '');
    //Font style
    this.message.font = 'Arial';
    this.message.fontSize = 20;
    this.message.fill = '#000000';
    this.message.anchor.set(0, 0.5);

    this.message.text = text;

    this.addChild(this.message);
    this.addChild(this.icon);
};

Dialog.prototype = Object.create(PopUp.prototype);
Dialog.prototype.constructor = Dialog;

Dialog.prototype.setText = function(text) {
    this.message.text = text;
};

module.exports = Dialog;
