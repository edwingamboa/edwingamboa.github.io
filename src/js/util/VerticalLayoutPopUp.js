/**
 * Created by Edwin Gamboa on 21/10/2015.
 */
var PopUp = require('./PopUp');
var VerticalLayout = require('./VerticalLayout');

var VerticalLayoutPopUP = function(backgroundKey, parent, title) {
    PopUp.call(this, backgroundKey, parent, title);
    var yOrigin = this.title.y + this.title.height || 0;
    this.layout = new VerticalLayout(this, null, yOrigin);
};

VerticalLayoutPopUP.prototype = Object.create(PopUp.prototype);
VerticalLayoutPopUP.prototype.constructor = VerticalLayoutPopUP;

VerticalLayoutPopUP.prototype.addElement = function(element) {
    this.layout.addElement(element);
};

/**
 * Restarts the positions x and y to the origin, so that next elements will be
 * added in the first position.
 */
VerticalLayoutPopUP.prototype.restartPositions = function() {
    this.layout.restartPosition();
};

module.exports = VerticalLayoutPopUP;
