/**
 * Created by Edwin Gamboa on 10/10/2015.
 */

/**
 * Represents a Button for the views.
 * @class Button
 * @extends Phaser.Sprite
 * @constructor
 * @param {string} text - Buttons label.
 * @param {function} action - Action to be carried out when button is clicked.
 * @param {Phaser.Sprite} parent - View that contains this button.
 * @param {string} buttonKey - Button's texture key.
 */
var Button = function(text, action, parent, buttonKey) {
    var key = buttonKey || 'button';
    Phaser.Sprite.call(this, level.game, 0, 0, key);

    this.text = level.game.make.text(this.width / 2, this.height / 2, text);
    this.text.anchor.set(0.5, 0.5);
    this.text.font = 'Shojumaru';
    this.text.fontSize = 18;
    this.text.fill = '#FFFFFF';

    this.inputEnabled = true;
    this.events.onInputDown.add(action, parent);

    var scale = (this.text.width + 20) / this.width;
    this.scale.x = scale;
    this.addChild(this.text);
    this.text.scale.x = 1 / scale;
};

Button.prototype = Object.create(Phaser.Sprite.prototype);
Button.prototype.constructor = Button;

module.exports = Button;
