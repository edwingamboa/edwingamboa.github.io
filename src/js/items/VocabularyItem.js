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
 * @param {string} dialogMessage - Message to be displayed on this item's
 * dialog.
 * @param {string} name - VocabularyItem's name.
 * @param {string} description - VocabularyItem's name.
 * @param {string} category - Vocabulary category to which this item belongs.
 */
var VocabularyItem = function(x,
                              y,
                              key,
                              dialogMessage,
                              name,
                              description,
                              category) {
    Item.call(this, x, y, key, 0);
    this.dialogMessage = dialogMessage;
    this.category = category || 'other';
    this.name = name;
    this.description = description;
    this.makeDialog();
};

VocabularyItem.prototype = Object.create(Item.prototype);
VocabularyItem.prototype.constructor = VocabularyItem;

/**
 * Add this VocabularyItem to the game so that the player can pick it up.
 * @method VocabularyItem.use
 */
VocabularyItem.prototype.use = function() {
    this.popUp.open();
    var category = level.myVocabulary.randomVocabularyItems(1);
};

/**
 * Makes the dialog that is delivered to the player when he checks a vocabulary.
 * @method VocabularyItem..makeDialog
 */
VocabularyItem.prototype.makeDialog = function() {
    this.popUp = new VerticalLayoutPopUp('mediumPopUpBg', null, this.name);
    var icon = level.game.make.sprite(0, 0, this.key);
    if (icon.height > 200) {
        var scale = 200 / icon.height;
        icon.scale.x = scale;
        icon.scale.y = scale;
    }
    var dialogText = level.game.make.text(0, 0, this.dialogMessage);
    dialogText.font = 'Arial';
    dialogText.fontSize = 20;
    dialogText.fill = '#000000';
    dialogText.align = 'center';
    this.popUp.addElement(icon);
    this.popUp.addElement(dialogText);
    level.game.add.existing(this.popUp);
};

module.exports = VocabularyItem;

