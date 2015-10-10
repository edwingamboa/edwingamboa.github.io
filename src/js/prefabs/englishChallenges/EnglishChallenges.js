/**
 * Created by Edwin Gamboa on 10/10/2015.
 */
var GridLayoutPopUp = require('../util/GridLayoutPopUp');

var EnglishChallenges = function(level) {
    GridLayoutPopUp.call(this, level, 'inventory_background');

    this.level = level;
    this.createGames();
};

EnglishChallenges.prototype = Object.create(GridLayoutPopUp.prototype);
EnglishChallenges.prototype.constructor = EnglishChallenges;

EnglishChallenges.prototype.createGames = function() {

    var healthPackItem = new HealthPack(this.level, 0, 0, 5);
    this.items.healthPack5 = new EnglishChallengesItem(this.level,
        healthPackItem,
        this);
    this.addElement(this.items.healthPack5);

    var revolverItem = new Revolver(this.level, 0, 0, false);
    this.items.simpleWeapon = new EnglishChallengesItem(this.level,
        revolverItem,
        this);
    this.addElement(this.items.simpleWeapon);
};

EnglishChallenges.prototype.showHealthPacks = function() {
    //TODO
};

module.exports = EnglishChallenges;
