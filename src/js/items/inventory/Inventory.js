/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var ItemsPopUp = require('../ItemsPopUp');
var InventoryItem = require ('./InventoryItem');

var Inventory = function() {
    var tabsLabels = ['Health Packs', 'Weapons', 'Objects'];
    var categories = ['healthPacks', 'weapons', 'objects'];
    ItemsPopUp.call(this, tabsLabels, categories);
};

Inventory.prototype = Object.create(ItemsPopUp.prototype);
Inventory.prototype.constructor = Inventory;

Inventory.prototype.addItem = function(item) {
    if (this.items[item.category][item.key] === undefined) {
        this.items[item.category][item.key] = new InventoryItem(item, this);
    }
    this.items[item.category][item.key].amountAvailable ++;
    this.items[item.category][item.key].updateAmountAvailableText();
};

module.exports = Inventory;
