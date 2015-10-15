/**
 * Created by Edwin Gamboa on 17/07/2015.
 */
var GridLayoutPanel = require('../util/GridLayoutPanel');
var Button = require('../util/Button');

var ItemGroupView = function(iconKey, buttonText, parentView) {
    Phaser.Sprite.call(this, level.game, 0, 0, 'itemGroupBackGround');
    this.icon = level.game.make.sprite(10, 10, iconKey);
    this.message = level.game.make.text(0, 0, '');
    this.message.font = 'Arial';
    this.message.fontSize = 30;
    this.message.fill = '#0040FF';
    this.messageBackground = new GridLayoutPanel('letterShade');
    this.messageBackground.addElement(this.message);

    this.messageBackground.x = 10;
    this.messageBackground.y = this.icon.y + this.icon.height + 10;

    this.button = new Button(buttonText, this.buttonAction, this);
    this.button.x = this.messageBackground.x + this.messageBackground.width +
        10;
    this.button.y = this.icon.y + this.icon.height + 10;

    this.addChild(this.icon);
    this.addChild(this.messageBackground);
    this.addChild(this.button);
    this.parent = parentView;
};

ItemGroupView.prototype = Object.create(Phaser.Sprite.prototype);
ItemGroupView.prototype.constructor = ItemGroupView;

ItemGroupView.prototype.buttonAction = function() {

};

module.exports = ItemGroupView;
