/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var ItemsPopUp = require('../ItemsPopUp');
var StoreItem = require ('./StoreItem');

var Store = function() {
    var tabsLabels = ['Health Packs', 'Weapons', 'Objects'];
    var categories = ['healthPacks', 'weapons', 'objects'];
    ItemsPopUp.call(this, tabsLabels, categories);

    this.cash = level.game.make.text(this.width - 20, 58,
        '$ ' + level.player.score);
    this.cash.font = 'Arial';
    this.cash.fontSize = 25;
    this.cash.fill = '#000000';
    this.cash.anchor.set(1, 0);
    this.addChild(this.cash);
};

Store.prototype = Object.create(ItemsPopUp.prototype);
Store.prototype.constructor = Store;

Store.prototype.addItem = function(item) {
    if (this.items[item.category][item.key] === undefined) {
        this.items[item.category][item.key] = new StoreItem(item, this);
    }
};

Store.prototype.showHealthPacks = function() {
    //TODO
};

module.exports = Store;
