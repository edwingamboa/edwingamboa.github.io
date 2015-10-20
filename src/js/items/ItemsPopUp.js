/**
 * Created by Edwin Gamboa on 19/10/2015.
 */

var PopUp = require('../util/PopUp');
var GridLayoutPanel = require('../util/GridLayoutPanel');
var Button = require('../util/Button');
var HealthPack = require('./HealthPack');
var Revolver = require('./weapons/Revolver');

var ItemsPopUp = function(tabsLabels, categories) {
    PopUp.call(this, 'inventory_background', null, 'ItemsPopUp');

    this.items = [];
    var i;
    var tab;
    var x = 20;
    for (i = 0; i < tabsLabels.length; i++) {
        tab = new Button(tabsLabels[i], this.showTab, this, 'tab');
        tab.category = categories[i];
        tab.x = x;
        tab.y = 58;
        x += tab.width + 2;
        this.addChild(tab);
        this.items[categories[i]] = [];
    }

    var dimensions = {numberOfColumns: 5, numberOfRows: 1};
    this.panel = new GridLayoutPanel('inventoryPanelBg', dimensions);
    this.panel.x = 20;
    this.panel.y = 100;
    this.createItemGroups();
    this.fillPanel(categories[0]);
    this.addChild(this.panel);
};

ItemsPopUp.prototype = Object.create(PopUp.prototype);
ItemsPopUp.prototype.constructor = ItemsPopUp;

ItemsPopUp.prototype.showTab = function(tab) {
    var key;
    for (key in this.panel.children) {
        this.panel.children[key].kill();
    }
    this.panel.removeAllElements();
    this.fillPanel(tab.category);
};

ItemsPopUp.prototype.fillPanel = function(category) {
    var key;
    for (key in this.items[category]) {
        if (!this.items[category][key].alive) {
            this.items[category][key].revive();
        }
        this.panel.addElement(this.items[category][key]);
    }
};

ItemsPopUp.prototype.createItemGroups = function() {
    var revolverItem = new Revolver(0, 0, false);
    this.addItem(revolverItem);
    var healthPackItem = new HealthPack(0, 0, 5);
    this.addItem(healthPackItem);
    healthPackItem = new HealthPack(0, 0, 20);
    this.addItem(healthPackItem);
};

module.exports = ItemsPopUp;
