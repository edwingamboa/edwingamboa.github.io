/**
 * Created by Edwin Gamboa on 08/10/2015.
 */

var GridLayoutPopUp = require('../util/GridLayoutPopUp');
var Button = require('../util/Button');

var FamilyEC = function(level) {
    this.score = 30;
    var dimensions = {numberOfColumns: 3, numberOfRows: 3};
    GridLayoutPopUp.call(this, level, 'inventory_background', dimensions);

    this.level = level;

    var familyKeys = ['mother', 'son', 'daughter'];
    var familyMembersCells = [];
    var familyMembersLabels = [];
    this.shades = [];

    for (var key in familyKeys) {
        var cell = this.level.game.make.sprite(0, 0, 'itemGroupBackGround');
        cell.anchor.set(0.5, 0);
        var familyMember = this.level.game.make.sprite(0, 0, familyKeys[key]);
        familyMember.anchor.set(0.5, 0);
        var shade = this.level.game.make.sprite(0, familyMember.height + 10,
            'useButtonShade');
        shade.anchor.set(0.5, 0);
        shade.code = key;

        this.shades.push(shade);
        cell.addChild(familyMember);
        cell.addChild(shade);

        var label = this.level.game.make.text(0, 0, familyKeys[key]);
        //Font style
        label.font = 'Shojumaru';
        label.fontSize = 20;
        label.fill = '#0040FF';
        label.inputEnabled = true;
        label.input.enableDrag(true, true);
        label.events.onDragStart.add(this.bringItemToTop, this);
        label.events.onDragStop.add(this.fixLocation, this);
        label.anchor.set(0.5, 0);
        label.code = key;
        familyMembersCells.push(cell);
        familyMembersLabels.push(label);
    }

    for (var familyMemberCell in familyMembersCells) {
        this.addElement(familyMembersCells[familyMemberCell]);
    }

    var randomIndex;
    var indexes = [];
    for (var familyMemberLabelIndex in familyMembersLabels) {
        indexes.push(familyMemberLabelIndex);
    }
    for (var familyMemberLabel in familyMembersLabels) {
        randomIndex = level.game.rnd.integerInRange(0,
            indexes.length - 1);
        this.addElement(familyMembersLabels[indexes[randomIndex]]);
        //this.addElement(familyMembersLabels[familyMemberLabel]);
        familyMembersLabels[indexes[randomIndex]].initialX =
            familyMembersLabels[indexes[randomIndex]].x;
        familyMembersLabels[indexes[randomIndex]].initialY =
            familyMembersLabels[indexes[randomIndex]].y;

        indexes.splice(randomIndex, 1);
    }

    this.confirmButton = new Button(this.level, 'Confirm', this.confirm, this);
    this.addElement(this.confirmButton);
};

FamilyEC.prototype = Object.create(GridLayoutPopUp.prototype);
FamilyEC.prototype.constructor = FamilyEC;

FamilyEC.prototype.fixLocation = function(item) {
    for (var shade in this.shades) {
        if (item.overlap(this.shades[shade]) &&
            this.shades[shade].children.length === 0) {
            item.x = 0;
            item.y = 0;
            this.shades[shade].addChild(item);
            return;
        }
        this.addChild(item);
        item.x = item.initialX;
        item.y = item.initialY;
    }
};

FamilyEC.prototype.bringItemToTop = function(item) {
    if (FamilyEC.prototype.isPrototypeOf(item.parent)) {
        this.addChild(item);
    }else {
        this.addChild(item.parent.parent);
    }
};

FamilyEC.prototype.confirm = function() {
    var correct = true;
    for (var shade in this.shades) {
        if (this.shades[shade].children[0] === undefined) {
            this.level.showErrorMessage('The challenge is not complete.', this);
            return;
        }
        var letter = this.shades[shade].children[0];
        if (this.shades[shade].children[0].code !== shade) {
            this.level.showErrorMessage('Sorry! Try Again.', this);
            return;
        }
    }
    this.level.increaseScore(this.score);
    this.level.showSuccessMessage('Well done! You got ' + this.score +
        ' points.', this);
    this.close();
};
module.exports = FamilyEC;
