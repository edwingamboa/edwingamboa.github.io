/**
 * @ignore Created by Edwin Gamboa on 19/10/2015.
 */

var PopUp = require('../util/PopUp');
var GridLayoutPanel = require('../util/GridLayoutPanel');
var Button = require('../util/Button');

/**
 * View that contains a menu of items, grouped by category.
 * @class ItemsPopUp
 * @extends PopUp
 * @constructor
 * @param {Object[]} tabsLabels - Items categories names.
 * @param {Object[]} categories - Items categories (code Names).
 * @param {string} title - This view's title.
 * @param {numner} columns - Number of columns for the main panel
 * @param {numner} rows - number of rows for the main panel
 */
var ItemsPopUp = function(tabsLabels,
                          categories,
                          title,
                          columns,
                          rows
) {
    PopUp.call(this, 'popUpBg', null, title);

    this.items = [];
    var i;
    var tab;
    var x = 20;
    for (i = 0; i < tabsLabels.length; i++) {
        tab = new Button(tabsLabels[i], this.showTab, this, 'tabBg');
        tab.category = categories[i];
        tab.x = x;
        tab.y = 60;
        x += tab.width + 2;
        this.addChild(tab);
        this.items[categories[i]] = [];
    }

    var dimensions = {numberOfColumns: columns || 4, numberOfRows: rows || 2};
    this.panel = new GridLayoutPanel('popUpPanelBg', dimensions);
    this.panel.x = 20;
    this.panel.y = 100;
    this.firstCategory = categories[0];
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
 * Opens the PopItem showing first tab.
 * @method ItemsPopUp.open
 */
ItemsPopUp.prototype.open = function() {
    this.panel.removeAllElements();
    this.fillPanel(this.firstCategory);
    PopUp.prototype.open.call(this);
};

module.exports = ItemsPopUp;
