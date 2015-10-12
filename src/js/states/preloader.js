/**
 * Created by Edwin Gamboa on 08/07/2015.
 */
var Preloader = function(game) {
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
        //Level assets
        this.game.load.image('ground', 'assets/images/platform.png');
        this.game.load.image('healthPack5', 'assets/images/healthPack5.png');
        this.game.load.image('healthPack20', 'assets/images/healthPack20.png');
        this.game.load.image('healthPack50', 'assets/images/healthPack50.png');
        this.game.load.image('useOneButton', 'assets/images/useOneButton.png');
        this.game.load.image('buyButton', 'assets/images/buyButton.png');
        this.game.load.image('inventory_button', 'assets/images/inventory.png');
        this.game.load.image('storeButton', 'assets/images/store.png');
        this.game.load.image('inventory_background',
            'assets/images/inventoryBackground.png');
        this.game.load.image('close', 'assets/images/close.png');
        this.game.load.image('itemGroupBackGround',
            'assets/images/itemGroupBackGround.png');
        this.game.load.image('dialog', 'assets/images/dialog.png');
        this.game.load.image('errorIcon', 'assets/images/errorIcon.png');
        this.game.load.image('successIcon', 'assets/images/successIcon.png');

        this.game.load.spritesheet('character', 'assets/sprites/character.png',
            64, 96);
        this.game.load.spritesheet('npc', 'assets/sprites/npc.png',
            64, 96);
        this.game.load.spritesheet('friend', 'assets/sprites/npc.png',
            64, 96);
        this.game.load.spritesheet('simple_enemy',
            'assets/sprites/simple_enemy.png', 64, 64);
        this.game.load.spritesheet('strong_enemy',
            'assets/sprites/strong_enemy.png', 64, 64);
        this.game.load.spritesheet('jeep', 'assets/sprites/jeep.png', 219.5,
            150);
        this.game.load.spritesheet('revolverSprite',
            'assets/sprites/revolver.png', 30, 16);
        this.game.load.spritesheet('machineGunSprite',
            'assets/sprites/machineGun.png', 60, 42);

        for (var i = 1; i <= 2; i++) {
            this.game.load.image('bullet' + i, 'assets/images/bullet' + i +
                '.png');
        }
        this.game.load.image('simpleWeapon',
            'assets/images/revolver.png');
        this.game.load.image('strongWeapon',
            'assets/images/machineGun.png');
        this.game.load.image('comic1', 'assets/images/comic1.png');
        this.game.load.image('comic2', 'assets/images/comic2.png');
        this.game.load.image('introLevelOne',
            'assets/images/introLevelOne.png');
        this.game.load.image('house', 'assets/images/house.png');
        this.game.load.image('openDoor', 'assets/images/openDoor.png');
        this.game.load.image('working', 'assets/images/working.png');
        this.game.load.image('addCashButton', 'assets/images/addCash.png');
        this.game.load.image('useButtonShade',
            'assets/images/useButtonShade.png');
        this.game.load.image('button', 'assets/images/button.png');
        this.game.load.image('mother', 'assets/images/mother.png');
        this.game.load.image('father', 'assets/images/father.png');
        this.game.load.image('daughter', 'assets/images/daughter.png');
        this.game.load.image('son', 'assets/images/son.png');

        this.game.load.image('wordField', 'assets/images/wordField.png');
        this.game.load.image('letterShade', 'assets/images/letterShade.png');
        this.game.load.image('transparent', 'assets/images/transparent.png');

        this.game.load.script('webfont',
            '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    },

    update: function() {
        if (!!this.ready) {
            //this.game.state.start('menu');
            this.game.state.start('levelOne');
        }
    },

    onLoadComplete: function() {
        this.ready = true;
    }
};

module.exports = Preloader;
