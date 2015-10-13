/**
 * Created by Edwin Gamboa on 13/10/2015.
 */

/**
 * Tha class Utilities contains different functions or utilities that are useful
 * within other classes.
 * @param {Level} level object to acces game level elements.
 * @constructor
 */
var Utilities = function(level) {
    this.level = level;
};

/**
 * Returns a list with random indexes for an array of length = size
 * @param {number} size array's length
 * @returns {Array} array containing the random indexes
 */
Utilities.prototype.randomIndexesArray = function(size) {
    var randomIndex;
    var randomIndexes = [];
    var indexes = [];
    var  i;
    for (i = 0; i < size; i++) {
        indexes.push(i);
    }
    for (i = 0; i < size; i++) {
        randomIndex = this.level.game.rnd.integerInRange(0, indexes.length - 1);
        randomIndexes.push(indexes[randomIndex]);
        indexes.splice(randomIndex, 1);
    }
    return randomIndexes;
};

module.exports = Utilities;
