/**
 * Created by Edwin Gamboa on 15/10/2015.
 */

var ItemGroupView = require('../../items/ItemGroupView');

/**
 * Represents a challenge within the EnglishChallengesMenu.
 * @class MenuItem
 * @extends ItemGroupView
 * @constructor
 * @param {EnglishChallenge} challenge - Challenge that can be accessed through
 * this item.
 * @param {PopUp} parentView - PopUp that contains this item.
 */
var MenuItem = function(challenge, parentView) {
    ItemGroupView.call(this, challenge.englishChallenge.iconKey, 'Play',
        parentView);

    this.challenge = challenge;
    this.updateScoreText();
    this.setTitle(challenge.englishChallenge.name);
    this.setDescription(challenge.englishChallenge.description);
};

MenuItem.prototype = Object.create(ItemGroupView.prototype);
MenuItem.prototype.constructor = MenuItem;

/**
 * Called when the play button is clicked. It close the menu (PopUp), creates
 * a new challenge and displays it to the player.
 * @method MenuItem.buttonAction
 */
MenuItem.prototype.buttonAction = function() {
    this.parentView.close();
    this.challenge.newChallenge();
    this.challenge.open();
};

/**
 * Updates the text that shows the number of points that player can get, after
 * completing the challenge.
 * @method MenuItem.updateScoreText
 */
MenuItem.prototype.updateScoreText = function() {
    this.setAuxText('+ $' + this.challenge.englishChallenge.score);
};

module.exports = MenuItem;

