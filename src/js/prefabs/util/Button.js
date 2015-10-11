/**
 * Created by Edwin Gamboa on 10/10/2015.
 */

var Button = function(level, text, action, parent, optionals) {
    var ops = optionals || [];
    var x = ops.x || 0;
    var y = ops.y || 0;

    Phaser.Sprite.call(this, level.game, x, y, 'button');

    this.text = level.game.make.text(this.width / 2, this.height / 2, text);
    this.text.anchor.set(0.5, 0.5);
    this.text.font = 'Shojumaru';
    this.text.fontSize = 20;
    this.text.fill = '#FFFFFF';

    this.inputEnabled = true;
    this.events.onInputDown.add(action, parent);

    this.addChild(this.text);
};

Button.prototype = Object.create(Phaser.Sprite.prototype);
Button.prototype.constructor = Button;

module.exports = Button;
