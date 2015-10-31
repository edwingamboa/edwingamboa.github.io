/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var ItemsPopUp = require('../ItemsPopUp');
var InventoryItem = require ('./InventoryItem');

/**
 * Ui and control for the game Inventory.
 * @class Inventory
 * @extends ItemsPopUp
 * @constructor
 */
var Inventory = function() {
    var tabsLabels = ['Weapons', 'Health Packs', 'Objects'];
    var categories = ['weapons', 'healthPacks', 'objects'];
    ItemsPopUp.call(this, tabsLabels, categories, 'Inventory');
};

Inventory.prototype = Object.create(ItemsPopUp.prototype);
Inventory.prototype.constructor = Inventory;

/**
 * Adds a new item to the inventory to be displayed for the player.
 * @method Inventory.addItem
 * @param {Item} item - Item to be added to the inventory.
 */
Inventory.prototype.addItem = function(item) {
    if (this.items[item.category][item.key] === undefined) {
        this.items[item.category][item.key] = new InventoryItem(item, this);
    }
    this.items[item.category][item.key].amountAvailable ++;
    this.items[item.category][item.key].updateAmountAvailableText();
};

module.exports = Inventory;
