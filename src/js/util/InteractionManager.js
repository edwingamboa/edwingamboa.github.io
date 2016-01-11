/**
 * Created by Edwin Gamboa on 20/12/2015.
 */

var VerticalLayoutPopUp = require('../util/VerticalLayoutPopUp');

/**
 * Represents a sequence of messages that should be devlivvered to the player.
 * @class InteractionManager
 * @constructor
 * @param {Array} messages - Messages that should be delivered the player.
 * @param {Array} titles - Title associated to each message.
 * @param {Array} imagesKeys - Icon associated to each message.
 * @param {Array} vocabularyItems - Vocabulary that is delivered to the player
 * with the messages
 */
var InteractionManager = function(messages, titles, imagesKeys,
                                  vocabularyItems) {
    this.dialogs = [];
    var i;
    var tempDialog;
    for (i in messages) {
        tempDialog =  new VerticalLayoutPopUp('mediumPopUpBg', null, titles[i]);
        var dialogImage = level.game.make.sprite(0, 0, imagesKeys[i]);
        var dialogText = level.game.make.text(0, 0, messages[i]);
        dialogText.font = level.font;
        dialogText.fontSize = 20;
        dialogText.fill = '#000000';
        dialogText.align = 'center';
        tempDialog.addElement(dialogImage);
        tempDialog.addElement(dialogText);
        this.dialogs.push(tempDialog);
        level.game.add.existing(tempDialog);
    }
    this.vocabuaryItems = vocabularyItems || [];
};

/**
 * Lets the enemy to show the messages he has for the player. (Interaction)
 * @method  InteractionEnemy.openDialogs
 */
InteractionManager.prototype.openDialogs = function() {
    var i;
    for (i = this.dialogs.length - 1; i >= 0; i--) {
        this.dialogs[i].open();
    }
    for (i = 0; i < this.vocabuaryItems.length; i++) {
        level.myVocabulary.addItem(this.vocabuaryItems[i]);
    }
};

module.exports = InteractionManager;
