/**
 * Created by Edwin Gamboa on 08/10/2015.
 */

var GridLayoutPopUp = require('../util/GridLayoutPopUp');
var Button = require('../util/Button');
var Utilities = require('../util/Utilities');
var VerticalLayoutPanel = require('../util/VerticalLayoutPanel');
var EnglishChallenge = require('../englishChallenges/EnglishChallenge');

var ImageWordMatch = function(level) {
    this.englishChallenge = new EnglishChallenge(
        level,
        'mother',
        'Word-Image Match',
        10
    );
    var utils = new Utilities(level);
    var dimensions = {numberOfColumns: 3, numberOfRows: 3};
    GridLayoutPopUp.call(this, level, 'inventory_background', dimensions);

    this.level = level;

    var familyKeys = ['mother', 'son', 'daughter'];
    var familyMembersCells = [];
    var familyMembersLabels = [];
    this.shades = [];

    for (var key in familyKeys) {
        var cell = new VerticalLayoutPanel(this.level, 'itemGroupBackGround');
        var familyMember = this.level.game.make.sprite(0, 0, familyKeys[key]);
        var shade = this.level.game.make.sprite(0, 0, 'useButtonShade');
        shade.code = key;

        this.shades.push(shade);
        cell.addElement(familyMember);
        cell.addElement(shade);

        var label = this.level.game.make.text(0, 0, familyKeys[key]);
        //Font style
        label.font = 'Shojumaru';
        label.fontSize = 20;
        label.fill = '#0040FF';
        label.inputEnabled = true;
        label.input.enableDrag(true, true);
        label.events.onDragStart.add(this.bringItemToTop, this);
        label.events.onDragStop.add(this.fixLocation, this);
        label.code = key;
        familyMembersCells.push(cell);
        familyMembersLabels.push(label);
    }

    for (var familyMemberCell in familyMembersCells) {
        this.addElement(familyMembersCells[familyMemberCell]);
    }

    var randomIndexes = utils.randomIndexesArray(familyMembersLabels.length);
    var index;
    for (index in randomIndexes) {
        this.addElement(familyMembersLabels[randomIndexes[index]]);
        familyMembersLabels[randomIndexes[index]].initialX =
            familyMembersLabels[randomIndexes[index]].x;
        familyMembersLabels[randomIndexes[index]].initialY =
            familyMembersLabels[randomIndexes[index]].y;
    }

    this.confirmButton = new Button(this.level, 'Confirm', this.confirm, this);
    this.addElement(this.confirmButton);
};

ImageWordMatch.prototype = Object.create(GridLayoutPopUp.prototype);
ImageWordMatch.prototype.constructor = ImageWordMatch;

ImageWordMatch.prototype.fixLocation = function(item) {
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

ImageWordMatch.prototype.bringItemToTop = function(item) {
    if (ImageWordMatch.prototype.isPrototypeOf(item.parent)) {
        this.addChild(item);
    }else {
        this.addChild(item.parent.parent);
    }
};

ImageWordMatch.prototype.confirm = function() {
    var correct = true;
    for (var shade in this.shades) {
        if (this.shades[shade].children[0] === undefined) {
            this.englishChallenge.incomplete(this);
            return;
        }
        var letter = this.shades[shade].children[0];
        if (this.shades[shade].children[0].code !== shade) {
            this.englishChallenge.failure(this);
            return;
        }
    }
    this.englishChallenge.success();
    this.close(this);
};
module.exports = ImageWordMatch;
