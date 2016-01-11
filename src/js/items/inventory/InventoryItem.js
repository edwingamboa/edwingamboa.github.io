/**
 * Created by Edwin Gamboa on 17/07/2015.
 */
var ItemGroupView = require('../ItemGroupView');

/**
 * View an inventory item.
 * @class InventoryItem
 * @extends ItemGroupView
 * @constructor
 * @param {Item} item - Item to be displayed by this class.
 * @param {Inventory} parentView - View on which the item will be displayed.
 */
var InventoryItem = function(item, parentView) {
    ItemGroupView.call(this, item.key, 'Use', parentView);
    this.item = item;
    this.amountAvailable = 0;
    this.updateAmountAvailableText();
    this.setTitle(this.item.name);
    this.setDescription(this.item.description);
};

InventoryItem.prototype = Object.create(ItemGroupView.prototype);
InventoryItem.prototype.constructor = InventoryItem;

/**
 * Allows the player to use this item.
 * @method InventoryItem.buttonAction
 */
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

/**
 * Updates the remaining amount of this item.
 * @method InventoryItem.updateAmountAvailableText
 */
InventoryItem.prototype.updateAmountAvailableText = function() {
    this.setAuxText('x ' + this.amountAvailable);
};

module.exports = InventoryItem;
