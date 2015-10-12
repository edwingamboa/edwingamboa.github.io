/**
 * Created by Edwin Gamboa on 10/10/2015.
 */

var Button = function(level, text, action, parent, optionals) {
    var ops = optionals || [];
    var x = ops.x || 0;
    var y = ops.y || 0;

    Phaser.Sprite.call(this, level.game, x, y, 'transparent');

    this.text = level.game.make.text(10, 10, text);
    this.text.font = 'Shojumaru';
    this.text.fontSize = 20;
    this.text.fill = '#FFFFFF';

    this.background = level.game.make.sprite(0, 0, 'button');

    this.inputEnabled = true;
    this.events.onInputDown.add(action, parent);

    var scale = (this.text.width + 20) / this.background.width;
    this.background.scale.x = scale;

    //this.background.width = this.text.width + 20;

    this.addChild(this.background);
    this.addChild(this.text);
};

Button.prototype = Object.create(Phaser.Sprite.prototype);
Button.prototype.constructor = Button;

module.exports = Button;
