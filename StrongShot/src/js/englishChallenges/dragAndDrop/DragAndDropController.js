/**
 * @ignore Created by Edwin Gamboa on 13/10/2015.
 */
var Utilities = require('../../util/Utilities');

/**
 * Controls draggable elements that are dropped in some destinations.
 * @class DragAndDropController
 * @constructor
 * @param {Phaser.Sprite} container - Sprite tha contains the draggable
 * elements, their initial location (source) and their possible destinations.
 */
var DragAndDropController = function(container) {
    this.container = container;
};

DragAndDropController.prototype.constructor = DragAndDropController;

/**
 * Adds a draggable element to a destination.
 * @method DragAndDropController.addToADestination
 * @param {Phaser.Sprite} element - element to be added.
 * @param {string} destinationIndex - index (key) to of the destination, where
 * the element will be added.
 */
DragAndDropController.prototype.addToADestination = function(element,
                                                             destinationIndex) {
    this.container.destinations[destinationIndex].restartPosition();
    this.container.destinations[destinationIndex].addElement(element);
};

/**
 * Controls where to locate an element after it is dropped by the player.
 * @method DragAndDropController.fixLocation
 * @param {Phaser.Sprite} element - Dropped element to locate
 */
DragAndDropController.prototype.fixLocation = function(element) {
    var key;
    for (key in this.container.destinations) {
        if (element.overlap(this.container.destinations[key]) &&
            this.container.destinations[key].children.length === 0) {
            this.addToADestination(element, key);
            return;
        }
    }
    this.returnElementToSource(element);
};

/**
 * Determines whether all the destinations have the correct element as children.
 * @method DragAndDropController.elementsInCorrectDestination
 * @returns {boolean} - true if elements are correctly arranged, otherwise
 * false.
 */
DragAndDropController.prototype.elementsInCorrectDestination = function() {
    var key;
    for (key in this.container.destinations) {
        if (this.container.destinations[key].children[0].code !==
            this.container.destinations[key].code) {
            return false;
        }
    }
    return true;
};

/**
 * Determines whether any destination is empty.
 * @method DragAndDropController.emptyDestinations
 * @returns {boolean} - true if any destination is empty, otherwise false
 */
DragAndDropController.prototype.emptyDestinations = function() {
    var key;
    for (key in this.container.destinations) {
        if (this.container.destinations[key].children[0] === undefined) {
            return true;
        }
    }
    return false;
};

/**
 * Locates an element within its source container.
 * @method DragAndDropController.returnElementToSource
 * @param {Phaser.Sprite} element - element to relocate.
 */
DragAndDropController.prototype.returnElementToSource = function(element) {
    element.x = element.sourceX;
    element.y = element.sourceY;
    this.container.source.addChild(element);
};

/**
 * Add every element to the source but in a random order.
 * @method DragAndDropController.addElementsToSourceRandomly
 */
DragAndDropController.prototype.addElementsToSourceRandomly = function() {
    var utils = new Utilities();
    var rdmIndexes = utils.randomIndexesArray(this.container.elements.length);
    var index;
    for (index in rdmIndexes) {
        this.container.source.addElement(
            this.container.elements[rdmIndexes[index]]);
        this.container.elements[rdmIndexes[index]].sourceX =
            this.container.elements[rdmIndexes[index]].x;
        this.container.elements[rdmIndexes[index]].sourceY =
            this.container.elements[rdmIndexes[index]].y;
    }
};
module.exports = DragAndDropController;
