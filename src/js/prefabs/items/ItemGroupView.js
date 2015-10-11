/**
 * Created by Edwin Gamboa on 17/07/2015.
 */
var GridLayoutPanel = require('../util/GridLayoutPanel');
var ItemGroupView = function(level,
                             item,
                             buttonKey,
                             parentView) {
    Phaser.Sprite.call(this, level.game, 0, 0, 'itemGroupBackGround');
    this.icon = level.game.make.sprite(10, 10, item.key);
    this.message = level.game.make.text(0, 0, '');
    this.message.font = 'Arial';
    this.message.fontSize = 30;
    this.message.fill = '#0040FF';
    this.messageBackground = new GridLayoutPanel(level, 'letterShade');
    this.messageBackground.addElement(this.message);

    this.messageBackground.x = 10;
    this.messageBackground.y = this.icon.y + this.icon.height + 10;

    this.button = level.game.make.sprite(this.messageBackground.x +
        this.messageBackground.width + 10,
        this.icon.y + this.icon.height + 10, buttonKey);
    this.button.inputEnabled = true;
    this.button.input.priorityID = 2;
    this.button.events.onInputDown.add(this.buttonAction, this);

    this.addChild(this.icon);
    this.addChild(this.messageBackground);
    this.addChild(this.button);
    this.parent = parentView;
    this.item = item;
    this.level = level;
};

ItemGroupView.prototype = Object.create(Phaser.Sprite.prototype);
ItemGroupView.prototype.constructor = ItemGroupView;

ItemGroupView.prototype.buttonAction = function() {

};

module.exports = ItemGroupView;
