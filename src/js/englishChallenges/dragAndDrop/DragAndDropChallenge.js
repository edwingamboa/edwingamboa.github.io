/**
 * Created by Edwin Gamboa on 13/10/2015.
 */

var GridLayoutPopUp = require('../../util/GridLayoutPopUp');
var EnglishChallenge = require('../../englishChallenges/EnglishChallenge');
var DragAndDropController = require('./DragAndDropController');

/**
 * Represents an EnglishChallenge that have draggable elements, which need to be
 * arranged in a certain destinations.
 * @param iconKey {string} Texture key of the Challenge icon
 * @param challengeName {string} Challenge name to show in UI.
 * @param score {number} Score to be increased in case of success.
 * @param dimensions {Array} Array containing number of rows and columns needed
 * for the challenge UI.
 * @constructor
 */
var DragAndDropChallenge = function(iconKey, challengeName, score,
                                    dimensions) {
    GridLayoutPopUp.call(this, 'inventory_background', dimensions);
    this.englishChallenge = new EnglishChallenge(
        iconKey,
        challengeName,
        score
    );
    this.destinations = [];
    this.elements = [];
    this.dragAndDropControl = new DragAndDropController(this);
};

DragAndDropChallenge.prototype = Object.create(GridLayoutPopUp.prototype);
DragAndDropChallenge.prototype.constructor = DragAndDropChallenge;

/**
 * Controls if the Challenge is complete and successfully overcome.
 * messages
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
    this.close(this);
};

/**
 * Clear all the containers and elements of the challenge, so that a new
 * challenge can be created.
 */
DragAndDropChallenge.prototype.clearChallenge = function() {
    if (this.children.length > 1) {
        this.removeAllElements();
    }
    if (this.elements.length > 0) {
        this.elements.splice(0, this.elements.length);
    }
    if (this.destinations.length > 0) {
        this.destinations.splice(0, this.destinations.length);
    }
};

module.exports = DragAndDropChallenge;
