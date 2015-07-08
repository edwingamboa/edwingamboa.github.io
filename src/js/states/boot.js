/**
 * Created by Edwin Gamboa on 07/07/2015.
 */
var Boot;
Boot = function(game) {};

Boot.prototype = {
    preload: function() {
        this.load.image('loading', 'assets/images/loading.png');
        this.load.image('load_progress_bar_dark',
            'assets/images/progress_bar_bg.png');
        this.load.image('load_progress_bar',
            'assets/images/progress_bar_fg.png');
    },
    create: function() {
        this.game.input.maxPointers = 1;
        this.game.state.start('preloader');
    }
};

module.exports = Boot;
