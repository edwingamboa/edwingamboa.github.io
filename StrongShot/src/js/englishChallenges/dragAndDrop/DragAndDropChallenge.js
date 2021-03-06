/**
 * @ignore Created by Edwin Gamboa on 13/10/2015.
 */

var VerticalLayoutPopUp = require('../../util/VerticalLayoutPopUp');
var VerticalLayoutPanel = require('../../util/VerticalLayoutPanel');
var EnglishChallenge = require('../EnglishChallenge');
var DragAndDropController = require('./DragAndDropController');
var Button = require('../../util/Button');

/**
 * Represents the UI for an EnglishChallenge that have draggable elements, which
 * need to be arranged in a certain destinations.
 * @class DragAndDropChallenge
 * @extends VerticalLayoutPopUp
 * @constructor
 * @param {string} iconKey - Texture key of the Challenge icon
 * @param {string} challengeName - Challenge name to show in UI.
 * @param {number} score - Score to be increased in case of success.
 * @param {string} description - Description of the challenge.
 */
var DragAndDropChallenge = function(iconKey, challengeName, description,
                                    score) {
    VerticalLayoutPopUp.call(this, 'popUpBg', null, challengeName, 5);
    this.englishChallenge = new EnglishChallenge(
        iconKey,
        challengeName,
        description,
        score
    );
    this.vocabularyItems = [];
    this.destinations = [];
    this.elements = [];
    this.dragAndDropControl = new DragAndDropController(this);
    this.mainPanel = new VerticalLayoutPanel('popUpPanelBg');
    this.addElement(this.mainPanel);
    this.confirmButton = new Button('Confirm', this.confirm, this);
    this.addElement(this.confirmButton);
};

DragAndDropChallenge.prototype = Object.create(VerticalLayoutPopUp.prototype);
DragAndDropChallenge.prototype.constructor = DragAndDropChallenge;

/**
 * Controls whether the Challenge is completed and successfully overcome.
 * messages
 * @method DragAndDropChallenge.confirm
 */
DragAndDropChallenge.prototype.confirm = function() {
    if (this.dragAndDropControl.emptyDestinations()) {
        this.englishChallenge.incomplete(this);
        return;
    }
    if (!this.dragAndDropControl.elementsInCorrectDestination()) {
        this.englishChallenge.failure(this);
        return;
    }
    this.englishChallenge.success();
    var i;
    for (i in this.vocabularyItems) {
        level.myVocabulary.markAsLearned(this.vocabularyItems[i]);
    }
    //this.clearChallenge();
    this.close();
};

/**
 * Clear all the containers and elements of the challenge, so that a new
 * challenge can be created.
 * @method DragAndDropChallenge.clearChallenge
 */
DragAndDropChallenge.prototype.clearChallenge = function() {
    if (this.mainPanel.children.length > 0) {
        this.mainPanel.removeAllElements();
    }
    if (this.elements.length > 0) {
        var ie;
        for (ie in this.elements) {
            this.elements[ie].kill();
        }
        this.elements.splice(0, this.elements.length);
    }
    if (this.destinations.length > 0) {
        var id;
        for (id in this.elements) {
            this.elements[id].kill();
        }
        this.destinations.splice(0, this.destinations.length);
    }
};

module.exports = DragAndDropChallenge;
