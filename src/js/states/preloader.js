/**
 * Created by Edwin Gamboa on 08/07/2015.
 */
var Preloader;
Preloader = function(game) {
    this.ready = false;
};

Preloader.prototype = {
    preload: function() {
        this.displayLoadScreen();
        this.loadAssets();
    },

    displayLoadScreen: function() {
        var centerX = this.game.camera.width / 2;
        var centerY = this.game.camera.height / 2;

        this.loading = this.game.add.sprite(centerX, centerY - 20, 'loading');
        this.loading.anchor.setTo(0.5, 0.5);

        this.barBg = this.game.add.sprite(centerX, centerY + 40,
            'load_progress_bar_dark');
        this.barBg.anchor.setTo(0.5, 0.5);

        this.bar = this.game.add.sprite(centerX - 192, centerY + 40,
            'load_progress_bar');
        this.bar.anchor.setTo(0, 0.5);
        this.load.setPreloadSprite(this.bar);

        // onLoadComplete is dispatched when the final file in the load queue
        // has been loaded/failed. addOnce adds that function as a callback,
        // but only to fire once.
        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    },

    loadAssets: function() {
        //Menu assets
        //LevelOne assets
        this.game.load.image('ground', 'assets/images/platform.png');
        this.game.load.image('healthPack', 'assets/images/healthPack.png');
        this.game.load.image('inventory_button', 'assets/images/inventory.png');
        this.game.load.image('inventory_background',
            'assets/images/inventory_background.png');
        this.game.load.image('close', 'assets/images/close.png');
        this.game.load.spritesheet('character', 'assets/sprites/character.png',
            32, 48);
        for (var i = 1; i <= 2; i++) {
            this.game.load.image('bullet' + i, 'assets/images/bullet' + i +
                '.png');
        }
    },

    update: function() {
        if (!!this.ready) {
            this.game.state.start('menu');
        }
    },

    onLoadComplete: function() {
        this.ready = true;
    }
};

module.exports = Preloader;
