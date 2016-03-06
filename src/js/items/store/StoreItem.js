/**
 * @ignore Created by Edwin Gamboa on 17/07/2015.
 */
var ItemGroupView = require('../ItemGroupView');

/**
 * View for a Store item.
 * @class StoreItem
 * @extends ItemGroupView
 * @constructor
 * @param {Item} item - Item to be displayed by this class.
 * @param {Store} parentView - View on which the item will be displayed.
 */
var StoreItem = function(item, parentView) {
    ItemGroupView.call(this, item.key, 'Buy', parentView);
    this.item = item;
    this.updatePriceText();
    this.setTitle(this.item.name);
    this.setDescription(this.item.description);
};

StoreItem.prototype = Object.create(ItemGroupView.prototype);
StoreItem.prototype.constructor = StoreItem;

/**
 * Updates the price of the item to be displayed.
 * @method StoreItem.updatePriceText
 */
StoreItem.prototype.updatePriceText = function() {
    this.setAuxText('$ ' + this.item.price);
};

/**
 * Allows the player to buy this item.
 * @method StoreItem.buttonAction
 */
StoreItem.prototype.buttonAction = function() {
    var successfulPurchase = level.player.buyItem(this.item);
    if (successfulPurchase) {
        this.item.use();
        level.showSuccessMessage('Successful Purchase!', this.parent);
        this.parentView.updateMoney();
    }else {
        level.showErrorMessage('You do not have enough money.', this.parent);
    }
};

module.exports = StoreItem;
