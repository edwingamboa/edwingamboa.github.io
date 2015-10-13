/**
 * Created by Edwin Gamboa on 13/10/2015.
 */

/**
 * Controls draggable elements that are dropped in some destinations.
 * @param destinations {Array} Destinations where the elements can be dropped.
 * @constructor
 */
var DragAndDropController = function(destinations) {
    this.destinations = destinations;
};

/**
 * Adds a draggable element to a destination.
 * @param element {Phaser.Sprite} element to be added.
 * @param destinationIndex {string} index (key) to of the destination, where the
 * element will be added.
 */
DragAndDropController.prototype.addToADestination = function(element,
                                                             destinationIndex) {
    element.x = 0;
    element.y = 0;
    this.destinations[destinationIndex].addChild(element);
};

/**
 * Controls where to locate an element after it is dropped by the player.
 * @param element {Phaser.Sprite} Dropped element to locate
 */
DragAndDropController.prototype.fixLocation = function(element) {
    var key;
    for (key in this.destinations) {
        if (element.overlap(this.destinations[key]) &&
            this.destinations[key].children.length === 0) {
            this.addToADestination(element, key);
            return;
        }
    }
    this.returnElementToSource(element);
};

/**
 * Determines whether all the destinations have the correct element as children.
 * @returns {boolean}
 */
DragAndDropController.prototype.elementsInCorrectDestination = function() {
    var key;
    for (key in this.destinations) {
        if (this.destinations[key].children[0].code !==
            this.destinations[key].code) {
            return false;
        }
    }
    return true;
};

/**
 * Determines whether any destination is empty.
 * @returns {boolean}
 */
DragAndDropController.prototype.emptyDestinations = function() {
    var key;
    for (key in this.destinations) {
        if (this.destinations[key].children[0] === undefined) {
            return true;
        }
    }
    return false;
};

/**
 * Locates an element within its source container.
 * @param element {Phaser.Sprite} element to relocate.
 */
DragAndDropController.prototype.returnElementToSource = function(element) {
    element.x = element.sourceX;
    element.y = element.sourceY;
    element.source.addChild(element);
};

module.exports = DragAndDropController;
