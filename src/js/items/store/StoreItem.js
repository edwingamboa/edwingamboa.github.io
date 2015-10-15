/**
 * Created by Edwin Gamboa on 17/07/2015.
 */
var ItemGroupView = require('../ItemGroupView');

var StoreItem = function(item, parentView) {
    ItemGroupView.call(this, item.key, 'Buy', parentView);
    this.item = item;
    this.updatePriceText();
};

StoreItem.prototype = Object.create(ItemGroupView.prototype);
StoreItem.prototype.constructor = StoreItem;

StoreItem.prototype.updatePriceText = function() {
    this.message.text = this.item.price;
};

StoreItem.prototype.buttonAction = function() {
    var successfulPurchase = level.player.buyItem(this.item);
    if (successfulPurchase) {
        this.item.use();
        level.updateScoreText();
        level.showSuccessMessage('Successful Purchase!', this.parent);
    }else {
        level.showErrorMessage('Not enough money.', this.parent);
    }
};

module.exports = StoreItem;
