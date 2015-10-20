/**
 * Created by Edwin Gamboa on 17/07/2015.
 */
var ItemGroupView = require('../ItemGroupView');

var InventoryItem = function(item, parentView) {
    ItemGroupView.call(this, item.key + 'Icon', 'Use', parentView);

    this.item = item;
    this.amountAvailable = 0;
    this.updateAmountAvailableText();
    this.setTitle(this.item.name);
    this.setDescription(this.item.description);
};

InventoryItem.prototype = Object.create(ItemGroupView.prototype);
InventoryItem.prototype.constructor = InventoryItem;

InventoryItem.prototype.buttonAction = function() {
    if (this.amountAvailable > 0) {
        this.item.use();
        this.amountAvailable --;
        this.updateAmountAvailableText();
        this.parentView.close();
    }else {
        level.showErrorMessage('You do not have more of this item.',
            this.parent);
    }
};

InventoryItem.prototype.updateAmountAvailableText = function() {
    this.setAuxText('x ' + this.amountAvailable);
};

module.exports = InventoryItem;
