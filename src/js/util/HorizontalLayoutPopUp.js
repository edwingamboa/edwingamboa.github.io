/**
 * Created by Edwin Gamboa on 11/10/2015.
 */
var PopUp = require('./PopUp');
var Horizontalayout = require('./HorizontalLayout');

/**
 * Represents a PopUp that arranges its elements using an HorizontalLayout.
 * @class HorizontalLayoutPopUP
 * @extends PopUp
 * @constructor
 * @param {string} backgroundKey - Background texture's key.
 * @param {PopUp} parent - View that creates this PopUp.
 * @param {string} title - PopUp title.
 */
var HorizontalLayoutPopUP = function(backgroundKey, parent, title) {
    PopUp.call(this, backgroundKey, parent, title);
    this.layout = new Horizontalayout(this);
};

HorizontalLayoutPopUP.prototype = Object.create(PopUp.prototype);
HorizontalLayoutPopUP.prototype.constructor = HorizontalLayoutPopUP;

/**
 * Adds an element to the PopUp.
 * @method HorizontalLayoutPopUP.addElement
 * @param {Phaser.Sprite} element - Element to be added.
 */
HorizontalLayoutPopUP.prototype.addElement = function(element) {
    this.layout.addElement(element);
};

/**
 * Restarts the positions x and y to the origin, so that next elements will be
 * added in the first position.
 * @method HorizontalLayoutPopUP.restartPositions
 */
HorizontalLayoutPopUP.prototype.restartPositions = function() {
    this.layout.restartPosition();
};

module.exports = HorizontalLayoutPopUP;

