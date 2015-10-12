/**
 * Created by Edwin Gamboa on 11/10/2015.
 */
/**
 * Created by Edwin Gamboa on 16/07/2015.
 */
var PopUp = require('./PopUp');
var Horizontalayout = require('./HorizontalLayout');

var HorizontalLayoutPopUP = function(level, backgroundKey, parent) {
    PopUp.call(this, level, backgroundKey, parent);
    this.layout = new Horizontalayout(this);
};

HorizontalLayoutPopUP.prototype = Object.create(PopUp.prototype);
HorizontalLayoutPopUP.prototype.constructor = HorizontalLayoutPopUP;

HorizontalLayoutPopUP.prototype.addElement = function(element) {
    this.layout.addElement(element);
};

module.exports = HorizontalLayoutPopUP;

