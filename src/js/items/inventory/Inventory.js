/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var ItemsPopUp = require('../ItemsPopUp');
var InventoryItem = require ('./InventoryItem');
var HealthPack = require('../HealthPack');
var Revolver = require('../weapons/Revolver');
var MachineGun = require('../weapons/MachineGun');

/**
 * Ui and control for the game Inventory.
 * @class Inventory
 * @extends ItemsPopUp
 * @constructor
 */
var Inventory = function() {
    var tabsLabels = ['Weapons', 'Health Packs', 'Vehicles'];
    var categories = ['weapons', 'healthPacks', 'transport'];
    ItemsPopUp.call(this, tabsLabels, categories, 'Inventory');
    this.loadInventory();
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
    localStorage.setItem(item.key + 'Item',
        this.items[item.category][item.key].amountAvailable);
};

/**
 * Loads an item to the inventory to be displayed for the player.
 * @method Inventory.loadItem
 * @param {Item} item - Item to be added to the inventory.
 */
Inventory.prototype.loadItem = function(item) {
    this.items[item.category][item.key] = new InventoryItem(item, this);
    this.items[item.category][item.key].amountAvailable =
        localStorage.getItem(item.key + 'Item');
    this.items[item.category][item.key].updateAmountAvailableText();
};

/**
 * Loads the player's inventory.
 * @method Store.createItemGroups
 */
Inventory.prototype.loadInventory = function() {
    var item;
    if (localStorage.getItem('revolverItem') !== null) {
        item = new Revolver(0, 0, false);
        this.loadItem(item);
    }
    if (localStorage.getItem('machineGunItem') !== null) {
        item = new MachineGun(0, 0, false);
        this.loadItem(item);
    }

    var healthPackTypes = [5, 20, 50];
    var i;
    var healthPackKey;
    for (i in healthPackTypes) {
        healthPackKey = 'healthPack' + healthPackTypes[i] + 'Item';
        if (localStorage.getItem(healthPackKey) !== null) {
            item = new HealthPack(0, 0, 5);
            this.loadItem(item);
        }
    }

    var carsKey = ['car', 'jeep', 'bus', 'truck', 'taxi', 'ambulance'];
    for (i in carsKey) {
        if (localStorage.getItem(carsKey[i] + 'Item') !== null) {
            item = level.createInteractiveCar(carsKey[i]);
            this.loadItem(item);
        }
    }
};

module.exports = Inventory;
