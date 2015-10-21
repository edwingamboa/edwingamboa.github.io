/**
 * Created by Edwin Gamboa on 11/10/2015.
 */
var PopUp = require('./PopUp');
var Horizontalayout = require('./HorizontalLayout');

var HorizontalLayoutPopUP = function(backgroundKey, parent, title) {
    PopUp.call(this, backgroundKey, parent, title);
    this.layout = new Horizontalayout(this);
};

HorizontalLayoutPopUP.prototype = Object.create(PopUp.prototype);
HorizontalLayoutPopUP.prototype.constructor = HorizontalLayoutPopUP;

HorizontalLayoutPopUP.prototype.addElement = function(element) {
    this.layout.addElement(element);
};

/**
 * Restarts the positions x and y to the origin, so that next elements will be
 * added in the first position.
 */
HorizontalLayoutPopUP.prototype.restartPositions = function() {
    this.layout.restartPosition();
};

module.exports = HorizontalLayoutPopUP;

