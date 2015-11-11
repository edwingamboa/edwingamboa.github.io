/**
 * Created by Edwin Gamboa on 19/10/2015.
 */

var PopUp = require('../util/PopUp');
var GridLayoutPanel = require('../util/GridLayoutPanel');
var Button = require('../util/Button');
var HealthPack = require('./HealthPack');
var Revolver = require('./weapons/Revolver');
var MachineGun = require('./weapons/MachineGun');

/**
 * View that contains a menu of items, grouped by category.
 * @class ItemsPopUp
 * @extends PopUp
 * @constructor
 * @param {Object[]} tabsLabels - Items categories names.
 * @param {Object[]} categories - Items categories (code Names).
 * @param {string} title - This view's title.
 */
var ItemsPopUp = function(tabsLabels, categories, title) {
    PopUp.call(this, 'popUpBg', null, title);

    this.items = [];
    var i;
    var tab;
    var x = 20;
    for (i = 0; i < tabsLabels.length; i++) {
        tab = new Button(tabsLabels[i], this.showTab, this, 'tabBg');
        tab.category = categories[i];
        tab.x = x;
        tab.y = 58;
        x += tab.width + 2;
        this.addChild(tab);
        this.items[categories[i]] = [];
    }

    var dimensions = {numberOfColumns: 4, numberOfRows: 2};
    this.panel = new GridLayoutPanel('popUpPanelBg', dimensions);
    this.panel.x = 20;
    this.panel.y = 100;
    this.createItemGroups();
    this.fillPanel(categories[0]);
    this.addChild(this.panel);
};

ItemsPopUp.prototype = Object.create(PopUp.prototype);
ItemsPopUp.prototype.constructor = ItemsPopUp;

/**
 * Displays a tab's content, before that it cleans the current content.
 * @method ItemsPopUp.showTab
 * @param {Button} tab - Button that represents a tab on the view.
 */
ItemsPopUp.prototype.showTab = function(tab) {
    var key;
    for (key in this.panel.children) {
        this.panel.children[key].kill();
    }
    this.panel.removeAllElements();
    this.fillPanel(tab.category);
};

/**
 * Fills the main panel with the items that belongs to a category.
 * @method ItemsPopUp.fillPanel
 * @param {string} category - Categories code name or key.
 */
ItemsPopUp.prototype.fillPanel = function(category) {
    var key;
    for (key in this.items[category]) {
        if (!this.items[category][key].alive) {
            this.items[category][key].revive();
        }
        this.panel.addElement(this.items[category][key]);
    }
};

/**
 * Creates all items views.
 * @method ItemsPopUp.createItemGroups
 */
ItemsPopUp.prototype.createItemGroups = function() {
    var revolverItem = new Revolver(0, 0, false);
    this.addItem(revolverItem);
    var machineGunItem = new MachineGun(0, 0, false);
    this.addItem(machineGunItem);
    var healthPackItem = new HealthPack(0, 0, 5);
    this.addItem(healthPackItem);
    healthPackItem = new HealthPack(0, 0, 20);
    this.addItem(healthPackItem);
};

module.exports = ItemsPopUp;
