/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var HealthPack = require('../inventory/HealthPack');
var PopUp = require('../util/PopUp');
var ItemGroupView = require('../inventory/ItemGroupView');

var Inventory = function(level) {
    PopUp.call(this, level, 'inventory_background');
    this.anchor.set(0.5, 0.5);

    this.level = level;

    this.healthPacks = [];
    this.items = [];
    this.createItemGroups();
};

Inventory.prototype = Object.create(PopUp.prototype);
Inventory.prototype.constructor = Inventory;

Inventory.prototype.addHealthPack = function(healthPack) {
    if (healthPack.maxIncreasing == 5) {
        this.healthPack5Group.amountAvailable ++;
        this.healthPack5Group.updateAmountAvailableText();
    }else if (healthPack.maxIncreasing == 20) {
        this.healthPacks[1]++;
    }else {
        this.healthPacks[2]++;
    }
};

Inventory.prototype.addItem = function(item) {
    if (this.items[item.key].item === undefined) {
        this.items[item.key].setItem(item);
    }
    this.items[item.key].amountAvailable ++;
    this.items[item.key].updateAmountAvailableText();
};

Inventory.prototype.createItemGroups = function() {
    this.items.healthPack5 = new ItemGroupView(this.level,
        -this.width / 2 + 20, -this.height / 2 + 20, 'healthPack5', this);
    this.addChild(this.items.healthPack5);

    this.items.simpleWeapon = new ItemGroupView(this.level,
        -this.width / 2 + 20, -this.height / 2 + 200, 'simpleWeapon', this);
    this.addChild(this.items.simpleWeapon);
};

Inventory.prototype.showHealthPacks = function() {
    //TODO
};

module.exports = Inventory;
