/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var ItemsPopUp = require('../ItemsPopUp');
var StoreItem = require ('./StoreItem');

/**
 * View and control of the game store
 * @class Store
 * @extends StoreItem
 * @constructor
 */
var Store = function() {
    var tabsLabels = ['Health Packs', 'Weapons', 'Objects'];
    var categories = ['healthPacks', 'weapons', 'objects'];
    ItemsPopUp.call(this, tabsLabels, categories, 'Store');

    this.cash = level.game.make.text(this.width - 20, 58,
        'Cash: $ ' + level.player.score);
    this.cash.font = 'Shojumaru';
    this.cash.fontSize = 20;
    this.cash.fill = '#FFFFFF';
    this.cash.anchor.set(1, 0);
    this.addChild(this.cash);
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

module.exports = Store;
