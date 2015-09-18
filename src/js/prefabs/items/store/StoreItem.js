/**
 * Created by Edwin Gamboa on 17/07/2015.
 */
var ItemGroupView = require('../../items/ItemGroupView');

var StoreItem = function(level, item, parentView) {
    ItemGroupView.call(this, level, item, 'buyButton', parentView);
    this.updatePriceText();
};

StoreItem.prototype = Object.create(ItemGroupView.prototype);
StoreItem.prototype.constructor = StoreItem;

StoreItem.prototype.updatePriceText = function() {
    this.message.text = this.item.price;
};

StoreItem.prototype.buttonAction = function() {
    var succesfulPurchase = this.level.player.buyItem(this.item);
    if (succesfulPurchase) {
        this.item.use();
        this.level.updateScoreText();
        this.level.showSuccessMessage('Successful Purchase!', this.parent);
    }else {
        this.level.showErrorMessage('Not enough money.', this.parent);
    }
};

module.exports = StoreItem;
