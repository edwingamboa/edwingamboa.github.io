/**
 * @ignore Created by Edwin Gamboa on 08/07/2015.
 */
/**
 * Phaser state to load all assets.
 * @class Preloader
 * @constructor
 * @param {Phaser.Game} game - Phaser game object.
 */
var Preloader = function(game) {
    this.ready = false;
};

/**
 * Manages this state behavior.
 * @method Preloader.preload
 */
Preloader.prototype.preload = function() {
    this.displayLoadScreen();
    this.loadAssets();
};

/**
 * Displays loading bar while assets load.
 * @method Preloader.displayLoadScreen
 */
Preloader.prototype.displayLoadScreen = function() {
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
};

/**
 * Loads game assets.
 * @method Preloader.loadAssets
 */
Preloader.prototype.loadAssets = function() {
    //UI assets
    this.game.load.spritesheet('arrowKeysJump',
        'assets/sprites/arrowKeysJump.png', 122, 80);
    this.game.load.spritesheet('arrowKeysMove',
        'assets/sprites/arrowKeysMove.png', 122, 80);
    this.game.load.spritesheet('arrowKeysRun',
        'assets/sprites/arrowKeysRun.png', 190, 80);
    this.game.load.spritesheet('spaceBar', 'assets/sprites/spaceBar.png',
        138, 80);
    this.game.load.spritesheet('arrowDown', 'assets/sprites/arrowDown.png',
        77, 90);
    //Level assets
    this.game.load.image('gas', 'assets/images/gas.png');
    this.game.load.image('worldBg', 'assets/images/worldBg.png');
    this.game.load.image('ground', 'assets/images/platform.png');
    this.game.load.image('healthPack5', 'assets/images/healthPack5.png');
    this.game.load.image('healthPack20', 'assets/images/healthPack20.png');
    this.game.load.image('healthPack50', 'assets/images/healthPack50.png');
    this.game.load.image('inventory_button', 'assets/images/inventory.png');
    this.game.load.image('storeButton', 'assets/images/store.png');
    this.game.load.image('store', 'assets/images/storeBig.png');
    this.game.load.image('popUpBg',
        'assets/images/popUpBg.png');
    this.game.load.image('close', 'assets/images/close.png');
    this.game.load.image('itemGroupBg', 'assets/images/itemGroupBg.png');
    this.game.load.image('myVocabularyItemBg',
        'assets/images/myVocabularyItemBg.png');
    this.game.load.image('dialogBgSmall', 'assets/images/dialogBgSmall.png');
    this.game.load.image('dialogBg', 'assets/images/dialogBg.png');
    this.game.load.image('errorIcon', 'assets/images/errorIcon.png');
    this.game.load.image('successIcon', 'assets/images/successIcon.png');

    this.game.load.spritesheet('character', 'assets/sprites/character.png',
        64, 96);
    this.game.load.spritesheet('wife', 'assets/sprites/wife.png',
        64, 96);
    this.game.load.spritesheet('npc', 'assets/sprites/npc.png',
        64, 96);
    this.game.load.spritesheet('friend', 'assets/sprites/npc.png',
        64, 96);
    this.game.load.spritesheet('daughter', 'assets/sprites/daughter.png',
        40, 60);
    this.game.load.spritesheet('son', 'assets/sprites/son.png',
        40, 60);

    this.game.load.spritesheet('simple_enemy',
        'assets/sprites/simple_enemy.png', 64, 64);
    this.game.load.spritesheet('strong_enemy',
        'assets/sprites/strong_enemy.png', 64, 64);
    this.game.load.spritesheet('strongestEnemy',
        'assets/sprites/strongestEnemy.png', 80, 80);

    this.game.load.spritesheet('jeep', 'assets/sprites/jeep.png', 219.5, 150);
    this.game.load.spritesheet('bus', 'assets/sprites/bus.png', 400, 180);
    this.game.load.spritesheet('taxi', 'assets/sprites/taxi.png', 215, 100);
    this.game.load.spritesheet('truck', 'assets/sprites/truck.png', 400, 239);
    this.game.load.spritesheet('car', 'assets/sprites/car.png', 237, 100);
    this.game.load.spritesheet('ambulance', 'assets/sprites/ambulance.png', 300,
        144);

    this.game.load.spritesheet('revolver', 'assets/sprites/revolver.png',
        54, 30);
    this.game.load.spritesheet('machineGun',
        'assets/sprites/machineGun.png', 43, 40);
    this.game.load.spritesheet('pistol',
        'assets/sprites/pistol.png', 47, 30);
    this.game.load.spritesheet('carbine',
        'assets/sprites/carbine.png', 119, 30);
    this.game.load.spritesheet('rifle',
        'assets/sprites/rifle.png', 137, 35);

    var i;
    for (i = 1; i <= 2; i++) {
        this.game.load.image('bullet' + i, 'assets/images/bullet' + i +
            '.png');
    }
    this.game.load.image('simpleWeapon',
        'assets/images/revolver.png');
    this.game.load.image('strongWeapon',
        'assets/images/machineGun.png');
    this.game.load.image('house', 'assets/images/house.png');
    this.game.load.image('openDoor', 'assets/images/openDoor.png');
    this.game.load.image('working', 'assets/images/working.png');
    this.game.load.image('addCashButton', 'assets/images/addCash.png');
    this.game.load.image('addCashBig', 'assets/images/addCashBig.png');
    this.game.load.image('myVocabularyButton',
        'assets/images/myVocabulary.png');
    this.game.load.image('button', 'assets/images/button.png');
    this.game.load.image('iconButton', 'assets/images/iconButton.png');
    this.game.load.image('toolsBar', 'assets/images/toolsBar.png');

    this.game.load.image('lettersBg', 'assets/images/lettersBg.png');
    this.game.load.image('wordsBg', 'assets/images/wordsBg.png');
    this.game.load.image('wordBg', 'assets/images/wordBg.png');
    this.game.load.image('spaceBg', 'assets/images/spaceBg.png');
    this.game.load.image('letterBg', 'assets/images/letterBg.png');
    this.game.load.image('transparent', 'assets/images/transparent.png');
    this.game.load.image('healthBarBackground',
        'assets/images/healthBarBackground.png');
    this.game.load.image('healthBar', 'assets/images/healthBar.png');

    this.game.load.image('healthPack5Icon',
        'assets/icons/healthPack5Icon.png');
    this.game.load.image('healthPack20Icon',
        'assets/icons/healthPack20Icon.png');
    this.game.load.image('revolverIcon', 'assets/icons/revolverIcon.png');
    this.game.load.image('machineGunIcon', 'assets/icons/machineGunIcon.png');
    this.game.load.image('unscramble', 'assets/icons/unscramble.png');
    this.game.load.image('contexts', 'assets/icons/contexts.png');
    this.game.load.image('imageWord', 'assets/icons/imageWord.png');
    this.game.load.image('health', 'assets/icons/health.png');
    this.game.load.image('ammo', 'assets/icons/ammo.png');
    this.game.load.image('money', 'assets/icons/money.png');
    this.game.load.image('learned', 'assets/icons/learned.png');

    this.game.load.image('popUpPanelBg',
        'assets/images/popUpPanelBg.png');
    this.game.load.image('tabBg', 'assets/images/tabBg.png');
    this.game.load.image('contextBg', 'assets/images/contextBg.png');
    this.game.load.image('englishChallengePanelBg',
        'assets/images/englishChallengePanelBg.png');
    this.game.load.image('imageWordBg', 'assets/images/imageWordBg.png');

    this.game.load.image('forgive', 'assets/images/vocabulary/forgive.png');
    this.game.load.image('bookStore', 'assets/images/vocabulary/bookStore.png');
    this.game.load.image('playground',
        'assets/images/vocabulary/playground.png');
    this.game.load.image('zoo', 'assets/images/vocabulary/zoo.png');
    this.game.load.image('gasStation',
        'assets/images/vocabulary/gasStation.png');

    this.game.load.image('bank', 'assets/images/vocabulary/bank.png');
    this.game.load.image('coffeeShop',
        'assets/images/vocabulary/coffeeShop.png');
    this.game.load.image('hospital', 'assets/images/vocabulary/hospital.png');
    this.game.load.image('school', 'assets/images/vocabulary/school.png');
    this.game.load.image('factory', 'assets/images/vocabulary/factory.png');

    this.game.load.image('fireStation',
        'assets/images/vocabulary/fireStation.png');
    this.game.load.image('policeStation',
        'assets/images/vocabulary/policeStation.png');
    this.game.load.image('hotel', 'assets/images/vocabulary/hotel.png');
    this.game.load.image('superMarket',
        'assets/images/vocabulary/superMarket.png');

    this.game.load.image('trees', 'assets/images/trees.png');
    this.game.load.image('surrender', 'assets/images/surrender.png');
    this.game.load.image('orangeHouse',
        'assets/images/vocabulary/orangeHouse.png');
    this.game.load.image('greenHouse',
        'assets/images/vocabulary/greenHouse.png');
    this.game.load.image('whiteHouse',
        'assets/images/vocabulary/whiteHouse.png');
    this.game.load.image('yellowHouse',
        'assets/images/vocabulary/yellowHouse.png');
    this.game.load.image('redHouse',
        'assets/images/vocabulary/redHouse.png');
    this.game.load.image('blueHouse',
        'assets/images/vocabulary/blueHouse.png');
    this.game.load.image('nameBoard',
        'assets/images/vocabulary/nameBoard.png');
    this.game.load.image('necklace', 'assets/images/vocabulary/necklace.png');
    this.game.load.image('glasses', 'assets/images/vocabulary/glasses.png');
    this.game.load.image('watch', 'assets/images/vocabulary/watch.png');
    this.game.load.image('ring', 'assets/images/vocabulary/ring.png');
    this.game.load.image('cap', 'assets/images/vocabulary/cap.png');
    this.game.load.image('bracelet', 'assets/images/vocabulary/bracelet.png');
    this.game.load.image('family', 'assets/images/vocabulary/family.png');
    this.game.load.image('mother', 'assets/images/vocabulary/mother.png');
    this.game.load.image('father', 'assets/images/vocabulary/father.png');
    this.game.load.image('husband', 'assets/images/vocabulary/father.png');
    this.game.load.image('child', 'assets/images/vocabulary/child.png');
    this.game.load.image('kid', 'assets/images/vocabulary/child.png');
    this.game.load.image('parent', 'assets/images/vocabulary/parent.png');
    this.game.load.image('comicBg', 'assets/images/comics/comicBg.png');
    var key;
    for (i = 1; i <= 7; i++) {
        key = 'intro' + i;
        this.game.load.image(key, 'assets/images/comics/' + key + '.png');
    }

    this.game.load.image('mediumPopUpBg', 'assets/images/mediumPopUpBg.png');
    this.game.load.image('emptyRoom', 'assets/images/emptyRoom.png');
};

/**
 * Starts menu state.
 * @method Preloader.update
 */
Preloader.prototype.update = function() {
    if (!!this.ready) {
        this.game.state.start('menu');
        level = this.game.state.states.levelOne;

    }
};

/**
 * Indicates that assets are already load.
 * @method Preloader.onLoadComplete
 */
Preloader.prototype.onLoadComplete = function() {
    this.ready = true;
};

module.exports = Preloader;
