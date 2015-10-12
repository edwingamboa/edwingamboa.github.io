/**
 * Created by Edwin Gamboa on 17/07/2015.
 */
var ItemGroupView = require('../ItemGroupView');

var InventoryItem = function(level, item, parentView) {
    ItemGroupView.call(this, level, item, 'Use', parentView);

    this.amountAvailable = 0;
    this.updateAmountAvailableText();
};

InventoryItem.prototype = Object.create(ItemGroupView.prototype);
InventoryItem.prototype.constructor = InventoryItem;

InventoryItem.prototype.buttonAction = function() {
    if (this.amountAvailable > 0) {
        this.item.use();
        this.amountAvailable --;
        this.updateAmountAvailableText();
        this.parent.close();
    }
};

InventoryItem.prototype.updateAmountAvailableText = function() {
    this.message.text = '' + this.amountAvailable;
};

module.exports = InventoryItem;
