/**
 * Created by Edwin Gamboa on 10/10/2015.
 */

var Button = function(text, action, parent, iconKey) {
    var key = iconKey || 'button';
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
