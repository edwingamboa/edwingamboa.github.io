/**
 * @ignore Created by Edwin Gamboa on 10/01/2016.
 */
var VerticalLayoutPanel = require('../util/VerticalLayoutPanel');
/**
 * Represents a Button with an Icon for the views.
 * @class IconButton
 * @extends Phaser.Sprite
 * @constructor
 * @param {string} text - Buttons label.
 * @param {string} iconKey - Buttons icon texture.
 * @param {function} action - Action to be carried out when button is clicked.
 * @param {Phaser.Sprite} parent - View that contains this button.
 * @param {string} buttonKey - Button's texture key.
 */
var IconButton = function(text, iconKey, action, parent, buttonKey) {
    var key = buttonKey || 'iconButton';
    VerticalLayoutPanel.call(this, key, 5);

    this.icon = level.game.make.sprite(0, 0, iconKey);
    this.text = level.game.make.text(0, 0, text);
    this.text.font = level.font;
    this.text.fontSize = 14;
    this.text.fill = '#FFFFFF';
    this.text.stroke = '#000000';
    this.text.strokeThickness = 3;

    this.inputEnabled = true;
    this.events.onInputDown.add(action, parent);
    this.addElement(this.icon);
    this.addElement(this.text);
};

IconButton.prototype = Object.create(VerticalLayoutPanel.prototype);
IconButton.prototype.constructor = IconButton;

module.exports = IconButton;
