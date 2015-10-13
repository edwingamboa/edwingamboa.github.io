/**
 * Created by Edwin Gamboa on 11/10/2015.
 */
var MARGIN = 10;

var HorizontalLayout = function(parent) {
    this.currentY = MARGIN;
    this.parent = parent;
};

HorizontalLayout.prototype.constructor = HorizontalLayout;

HorizontalLayout.prototype.addElement = function(element) {
    element.x = this.currentY;
    this.currentY += element.width + MARGIN;
    element.y = this.parent.height / 2 - element.height / 2;

    this.parent.addChild(element);
};

module.exports = HorizontalLayout;
