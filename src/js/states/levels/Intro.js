/**
 * Created by Edwin Gamboa on 29/08/2015.
 */

var Button = require('../../util/Button');

/**
 * Number seconds to wait before changing the comic image or frame.
 * @constant
 * @type {number}
 */
var SECONDS_BETWEEN_FRAMES = 8;
/**
 * Number of images that contains this comic.
 * @constant
 * @type {number}
 */
var NUMBER_OF_COMIC_IMAGES = 7;
/**
 * Time in seconds to wait before showing a new word.
 * @type {number}
 */
var WORD_DELAY = 300;

/**
 * Manages Game Intro, in which is presented background game story.
 * @class Intro
 * @constructor
 * @param {Phaser.Game} game - Phaser Game object.
 */
var Intro = function(game) {};

/**
 * Creates the comic for the intro and a button to continue.
 * @method Intro.create
 */
Intro.prototype.create = function() {
    var centerX = this.game.camera.width / 2;
    var centerY = this.game.camera.height / 2;

    this.background = this.game.add.sprite(centerX, centerY,
        'comicBg');
    this.background.anchor.set(0.5, 0.7);

    this.changeComicImage('intro1');
    this.currentImage = 1;

    var continueButton = new Button('Continue', this.continue, this);
    continueButton.x = this.game.camera.width - 250;
    continueButton.y = this.game.camera.height - 60;
    this.game.add.existing(continueButton);

    this.game.time.events.repeat(Phaser.Timer.SECOND * SECONDS_BETWEEN_FRAMES,
        NUMBER_OF_COMIC_IMAGES, this.updateComic, this);

    this.scripts = [
        'Edwar gets home',
        'He parks his car and gets into his house',
        'Now he wants to eat something',
        'Edwar finds a piece of paper',
        'Someone kidnapped his family und he is now angry',
        'He needs a weapon to defend himself',
        'He will rescue his family, but that can be dangerous'
    ];
    this.comicText = this.game.add.text(100, 450, '',
        {font: '20px Arial', fill: '#FFFFFF'});
    this.game.add.existing(this.comicText);
    this.showScript(0);
};

/**
 * Allows the player to start level one.
 * @method Intro.continue
 */
Intro.prototype.continue = function() {
    //this.game.state.start('levelOne');
    //this.game.state.start('levelTwo');
    this.game.state.start('levelThree');
};

/**
 * Updates the image to be showed, in order to show the whole intro story. This
 * method is called every SECONDS_BETWEEN_FRAMES.
 * @method Intro.updateComic
 */
Intro.prototype.updateComic = function() {
    if (this.currentImage < NUMBER_OF_COMIC_IMAGES) {
        this.currentImage ++;
        this.changeComicImage('intro' + this.currentImage);
        this.showScript(this.currentImage - 1);
    }else {
        this.continue();
    }
};

/**
 * Changes the current image of the comic.
 * @method Intro.changeComicImage
 * @param {string} imageKey - New images' texture key.
 */
Intro.prototype.changeComicImage = function(imageKey) {
    var image = this.game.make.sprite(0, 0, imageKey);
    image.anchor.set(0.5, 0.5);
    if (this.background.children.length > 0) {
        this.background.removeChildren();
    }
    this.background.addChild(image);

};

/**
 * Shows the script that corresponds to an index in this.scripts array.
 * @method Intro.showScript
 * @param {number} index - Index of the script to be showed.
 */
Intro.prototype.showScript = function(index) {
    this.wordIndex = 0;
    this.comicText.text = '';
    this.line = this.scripts[index].split(' ');
    this.game.time.events.repeat(WORD_DELAY, this.line.length, this.nextWord,
        this);

};

/**
 * Adds a new word to the script showed on screen.
 * @method Intro.nextWord
 */
Intro.prototype.nextWord = function() {
    this.comicText.text = this.comicText.text.concat(this.line[this.wordIndex] +
        ' ');
    this.wordIndex++;
};

module.exports = Intro;
