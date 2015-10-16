/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var GridLayoutPopUp = require('../../util/GridLayoutPopUp');
var StoreItem = require ('./StoreItem');
var HealthPack = require('../HealthPack');
var Revolver = require('../weapons/Revolver');

var Store = function() {
    var dimensions = {numberOfColumns: 5, numberOfRows: 2};
    GridLayoutPopUp.call(this, 'inventory_background', 'Store', dimensions);

    this.healthPacks = [];
    this.items = [];
    this.createItemGroups();
};

Store.prototype = Object.create(GridLayoutPopUp.prototype);
Store.prototype.constructor = Store;

Store.prototype.addHealthPack = function(healthPack) {
    if (healthPack.maxIncreasing == 5) {
        this.healthPack5Group.amountAvailable ++;
        this.healthPack5Group.updateAmountAvailableText();
    }else if (healthPack.maxIncreasing == 20) {
        this.healthPacks[1]++;
    }else {
        this.healthPacks[2]++;
    }
};

Store.prototype.addItem = function(item) {
    if (this.items[item.key].item === undefined) {
        this.items[item.key].setItem(item);
    }
    this.items[item.key].amountAvailable ++;
    this.items[item.key].updateAmountAvailableText();
};

Store.prototype.createItemGroups = function() {
    var healthPackItem = new HealthPack(0, 0, 5);
    this.items.healthPack5 = new StoreItem(healthPackItem, this);
    this.addElement(this.items.healthPack5);

    var revolverItem = new Revolver(0, 0, false);
    this.items.simpleWeapon = new StoreItem(revolverItem, this);
    this.addElement(this.items.simpleWeapon);
};

Store.prototype.showHealthPacks = function() {
    //TODO
};

module.exports = Store;
