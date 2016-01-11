/**
 * Created by Edwin Gamboa on 21/10/2015.
 */
var PopUp = require('./PopUp');
var VerticalLayout = require('./VerticalLayout');

/**
 * PopUp view that uses a VerticalLayout to arrange its elements.
 * @class VerticalLayoutPopUP
 * @extends PopUp
 * @constructor
 * @param {string} backgroundKey - Background texture's key.
 * @param {PopUp} [parent] - View that creates this PopUp.
 * @param {string} title - Title for this PopUp.
 * @param {number} margin - Margin or space between elements, optional.
 */
var VerticalLayoutPopUP = function(backgroundKey, parent, title, margin) {
    PopUp.call(this, backgroundKey, parent, title);
    var yOrigin = this.title.y + this.title.height || 0;
    this.layout = new VerticalLayout(this, margin, yOrigin);
};

VerticalLayoutPopUP.prototype = Object.create(PopUp.prototype);
VerticalLayoutPopUP.prototype.constructor = VerticalLayoutPopUP;

/**
 * Adds an element to the PopUp.
 * @method VerticalLayoutPopUP.addElement
 * @param {Phaser.Sprite} element - Element to be added to the PopUp.
 */
VerticalLayoutPopUP.prototype.addElement = function(element) {
    this.layout.addElement(element);
};

/**
 * Restarts the positions x and y to the origin, so that next elements will be
 * added in the first position.
 * @method VerticalLayoutPopUP.restartPositions
 */
VerticalLayoutPopUP.prototype.restartPositions = function() {
    this.layout.restartPosition();
};

module.exports = VerticalLayoutPopUP;
