/**
 * Created by Edwin Gamboa on 13/10/2015.
 */

var GridLayoutPopUp = require('../../util/GridLayoutPopUp');
var EnglishChallenge = require('../../englishChallenges/EnglishChallenge');
var DragAndDropController = require('./DragAndDropController');

/**
 * Represents an EnglishChallenge that have draggable elements, which need to be
 * arranged in a certain destinations.
 * @param level {Level} level Object to access game level elements
 * @param iconKey {string} Texture�s key of the Challenge icon
 * @param challengeName {string} Challenge name to show in UI.
 * @param score {number} Score to be increased in case of success.
 * @param dimensions {Array} Array containing number of rows and columns needed
 * for the challenge UI.
 * @constructor
 */
var DragAndDropChallenge = function(level, iconKey, challengeName, score,
                                    dimensions) {
    GridLayoutPopUp.call(this, level, 'inventory_background', dimensions);
    this.englishChallenge = new EnglishChallenge(
        level,
        iconKey,
        challengeName,
        score
    );
    this.level = level;
    this.destinations = [];
    this.dragAndDropControl = new DragAndDropController(this.destinations);
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

module.exports = DragAndDropChallenge;
