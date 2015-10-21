/**
 * Created by Edwin Gamboa on 11/10/2015.
 */
var MARGIN = 10;

var HorizontalLayout = function(parent, margin) {
    this.margin = margin || MARGIN;
    this.currentX = this.margin;
    this.parent = parent;
};

HorizontalLayout.prototype.constructor = HorizontalLayout;

HorizontalLayout.prototype.addElement = function(element) {
    element.x = this.currentX;
    this.currentX += element.width + this.margin ;
    element.y = this.parent.height / 2 - element.height / 2;

    this.parent.addChild(element);
};

HorizontalLayout.prototype.restartPosition = function() {
    this.currentX = this.margin;
};

module.exports = HorizontalLayout;
