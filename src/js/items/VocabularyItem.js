/**
 * Created by Edwin Gamboa on 06/11/2015.
 */
var Item = require('./Item');
var VerticalLayoutPopUp = require ('../util/VerticalLayoutPopUp');

/**
 * Item that represents a clue for the player.
 * @class VocabularyItem
 * @extends Item
 * @constructor
 * @param {number} x - VocabularyItem's x coordinate within the game world.
 * @param {number} y - VocabularyItem's y coordinate within the game world.
 * @param {string} key - VocabularyItem's texture
 * @param {string} name - VocabularyItem's name.
 * @param {string} definition - VocabularyItem's description.
 * @param {number} categoryIndex - Index of the category to which this item
 * belongs.
 * @param {boolean} openImmediately - Indicates whether this vocabulary item
 * should display the message when the player picksItUp
 * @param {number} [price = 0] - The price of this item
 */
var VocabularyItem = function(x,
                              y,
                              key,
                              name,
                              definition,
                              categoryIndex,
                              openImmediately,
                              price) {
    Item.call(this, x, y, key, price || 0);
    this.categoryIndex = categoryIndex;
    this.name = name;
    this.definition = definition;
    this.makeDialog();
    this.openImmediately = openImmediately || false;
};

VocabularyItem.prototype = Object.create(Item.prototype);
VocabularyItem.prototype.constructor = VocabularyItem;

/**
 * Displays the definition of this VocabularyItem
 * @method VocabularyItem.use
 */
VocabularyItem.prototype.show = function() {
    this.popUp.open();
};

/**
 * Makes the dialog that is delivered to the player when he checks a vocabulary.
 * @method VocabularyItem.makeDialog
 */
VocabularyItem.prototype.makeDialog = function() {
    this.popUp = new VerticalLayoutPopUp('mediumPopUpBg', null, this.name);
    var icon = level.game.make.sprite(0, 0, this.key);
    if (icon.height > 200) {
        var scale = 200 / icon.height;
        icon.scale.x = scale;
        icon.scale.y = scale;
    }
    var dialogText = level.game.make.text(0, 0, this.definition);
    dialogText.font = level.font;
    dialogText.fontSize = 20;
    dialogText.fill = '#000000';
    dialogText.align = 'center';
    this.popUp.addElement(icon);
    this.popUp.addElement(dialogText);
    level.game.add.existing(this.popUp);
};

module.exports = VocabularyItem;

