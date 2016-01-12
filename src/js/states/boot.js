/**
 * @ignore Created by Edwin Gamboa on 07/07/2015.
 */

/**
 * Phaser state to boot game.
 * @class Boot
 * @constructor
 * @param {Phaser.Game} game - Phaser game object.
 */
var Boot = function(game) {};

/**
 * Loads assets for preload screen.
 * @method Boot.preload
 */
Boot.prototype.preload = function() {
    this.load.image('loading', 'assets/images/loading.png');
    this.load.image('load_progress_bar_dark',
        'assets/images/progress_bar_bg.png');
    this.load.image('load_progress_bar',
        'assets/images/progress_bar_fg.png');
};

/**
 * Starts preloader state.
 * @method Boot.create
 */
Boot.prototype.create = function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preloader');
};

module.exports = Boot;
