/**
 * Created by Edwin Gamboa on 17/07/2015.
 */
var ItemGroupView = function(level,
                             item,
                             buttonKey,
                             parentView) {
    Phaser.Sprite.call(this, level.game, 0, 0, 'itemGroupBackGround');
    this.anchor.set(0.5, 0);
    this.icon = level.game.make.sprite(0, 10, item.key);
    this.icon.anchor.set(0.5, 0);
    this.button = level.game.make.sprite(-15, this.height - 5, buttonKey);
    this.button.anchor.set(0, 1);
    this.button.inputEnabled = true;
    this.button.input.priorityID = 2;
    this.button.events.onInputDown.add(this.buttonAction, this);

    this.message = level.game.make.text(-20, this.height - 5,
        '' + this.amountAvailable);
    //Font style
    this.message.font = 'Arial';
    this.message.fontSize = 30;
    this.message.fontWeight = 'bold';
    this.message.fill = '#0040FF';
    this.message.anchor.set(1, 1);

    this.addChild(this.icon);
    this.addChild(this.message);
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
