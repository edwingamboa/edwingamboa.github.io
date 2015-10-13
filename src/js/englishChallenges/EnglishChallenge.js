/**
 * Created by Edwin Gamboa on 13/10/2015.
 */

/**
 * Represents an EnglishChallenge within the game. An EnglishChallenge is used,
 * by the player to increase his/her score in a faster way.
 * @param level {Level} level Object to access game level elements
 * @param iconKey {string} Texture's key for the icon of the challenge
 * @param name {string} Name of the challenge
 * @param score {number} Score to be increased in case of success.
 * @constructor
 */
var EnglishChallenge = function(level, iconKey, name, score) {
    this.level = level;
    this.icon = this.level.game.make.sprite(10, 10, iconKey);
    this.name = name;
    this.score = score;
};

/**
 * Increases player score and shows a success message. It is called when player
 * overcome the challenge successfully.
 * @param parent Parent Ui to show dalog
 */
EnglishChallenge.prototype.success = function(parent) {
    this.level.increaseScore(this.score);
    this.level.showSuccessMessage('Well done! You got ' + this.score +
        ' points.', parent);
};

/**
 * Shows a failure message. It is called when player has completed the challenge
 * but in a wrong way.
 * @param parent Parent Ui to show dalog
 */
EnglishChallenge.prototype.failure = function(parent) {
    this.level.showErrorMessage('Sorry! Try Again.', parent);
};

/**
 * Shows a failure message. It is called when player has not completed the
 * challenge.
 * @param parent Parent Ui to show dalog
 */
EnglishChallenge.prototype.incomplete = function(parent) {
    this.level.showErrorMessage('The challenge is not complete.', parent);
};

module.exports = EnglishChallenge;
