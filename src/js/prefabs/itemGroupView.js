/**
 * Created by Edwin Gamboa on 17/07/2015.
 */
var ItemGroupView;
ItemGroupView = function(level, x, y, imageKey, item, inventory) {
    Phaser.Sprite.call(this, level.game, x, y, 'itemGroupBackGround');
    this.healthPackIcon = level.game.make.sprite(this.width / 2,
        this.height / 2, imageKey);
    this.healthPackIcon.anchor.set(0.5, 0.5);
    this.useOneButton = level.game.make.sprite(this.width - 10,
        this.healthPackIcon.height + 20, 'useOneButton');
    this.useOneButton.anchor.set(1, 0.5);
    this.useOneButton.inputEnabled = true;
    this.useOneButton.input.priorityID = 2;
    this.useOneButton.events.onInputDown.add(this.useItem, this);

    this.amountAvailable = 0;
    this.amountAvailableText = level.game.make.text(10,
        this.healthPackIcon.height + 20, '' + this.amountAvailable);
    //Font style
    this.amountAvailableText.font = 'Arial';
    this.amountAvailableText.fontSize = 30;
    this.amountAvailableText.fontWeight = 'bold';
    this.amountAvailableText.fill = '#0040FF';
    this.amountAvailableText.anchor.set(0, 0.5);

    this.addChild(this.healthPackIcon);
    this.addChild(this.useOneButton);
    this.addChild(this.amountAvailableText);

    this.item = item;
    this.inventory = inventory;
};

ItemGroupView.prototype = Object.create(Phaser.Sprite.prototype);
ItemGroupView.prototype.constructor = ItemGroupView;

ItemGroupView.prototype.useItem = function() {
    if (this.amountAvailable > 0) {
        this.item.use();
        this.amountAvailable --;
        this.updateAmountAvailableText();
        this.inventory.close();
    }
};

ItemGroupView.prototype.updateAmountAvailableText = function() {
    this.amountAvailableText.text = '' + this.amountAvailable;
};

module.exports = ItemGroupView;
