/**
 * @ignore Created by Edwin Gamboa on 22/06/2015.
 */
var ItemsPopUp = require('../ItemsPopUp');
var StoreItem = require ('./StoreItem');
var HealthPack = require('../HealthPack');
var Revolver = require('../weapons/Revolver');
var MachineGun = require('../weapons/MachineGun');

/**
 * View and control of the game store
 * @class Store
 * @extends ItemsPopUp
 * @constructor
 */
var Store = function() {
    var tabsLabels = ['Weapons', 'Health Packs', 'Vehicles'];
    var categories = ['weapons', 'healthPacks', 'transport'];
    ItemsPopUp.call(this, tabsLabels, categories, 'Store');

    var cashIcon = level.game.make.sprite(this.width - 190, 60, 'money');
    var scale = 30 / cashIcon.height;
    cashIcon.scale.x = scale;
    cashIcon.scale.y = scale;
    cashIcon.anchor.set(1, 0);
    this.addChild(cashIcon);

    this.cash = level.game.make.text(this.width - 180, 60,
        'Money: $ ' + level.player.score);
    this.cash.font = level.font;
    this.cash.fontSize = 20;
    this.cash.fill = '#FFFFFF';
    this.cash.stroke = '#000';
    this.cash.strokeThickness = 3;
    this.addChild(this.cash);
    this.createItems();
};

Store.prototype = Object.create(ItemsPopUp.prototype);
Store.prototype.constructor = Store;

/**
 * Add an item to the store to be displayed for the user.
 * @method Store.addItem
 * @param {Item} item - Item to be added to the inventory.
 */
Store.prototype.addItem = function(item) {
    if (this.items[item.category][item.key] === undefined) {
        this.items[item.category][item.key] = new StoreItem(item, this);
    }
};

/**
 * Updates player score or money text on main GUI and on store
 * @method Store.updateMoney
 */
Store.prototype.updateMoney = function() {
    level.updateScoreText();
    this.cash.text = 'Money: $ ' + level.player.score;
};

/**
 * Creates all items views.
 * @method Store.createItemGroups
 */
Store.prototype.createItems = function() {
    var revolverItem = new Revolver(0, 0, false);
    this.addItem(revolverItem);
    var machineGunItem = new MachineGun(0, 0, false);
    this.addItem(machineGunItem);

    var healthPackItem = new HealthPack(0, 0, 5);
    this.addItem(healthPackItem);
    healthPackItem = new HealthPack(0, 0, 20);
    this.addItem(healthPackItem);
    healthPackItem = new HealthPack(0, 0, 50);
    this.addItem(healthPackItem);

    var carsKey = ['car', 'jeep', 'bus', 'truck', 'taxi', 'ambulance'];
    var i;
    for (i in carsKey) {
        this.addItem(level.createInteractiveCar(carsKey[i]));
    }
};

/**
 * Opens the store, before that updates the current money
 * @method Enemy.killCharacter
 */
Store.prototype.open = function() {
    this.updateMoney();
    ItemsPopUp.prototype.open.call(this);
};
module.exports = Store;
