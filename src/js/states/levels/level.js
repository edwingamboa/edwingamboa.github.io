/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var Inventory = require('../../prefabs/items/inventory/Inventory');
var Store = require('../../prefabs/items/store/Store');
var HealthPack = require('../../prefabs/items/HealthPack');
var Player = require('../../prefabs/character/Player');
var Revolver = require('../../prefabs/items/weapons/Revolver');
var MachineGun = require('../../prefabs/items/weapons/MachineGun');
var SimpleEnemy = require('../../prefabs/character/SimpleEnemy');
var StrongEnemy = require('../../prefabs/character/StrongEnemy');
var NPC = require('../../prefabs/character/NPC');
var PopUp = require('../../prefabs/util/PopUp');
var InteractiveCar = require ('../../prefabs/worldElements/InteractiveCar');
var Dialog = require('../../prefabs/util/Dialog');

var Level = function(game) {
    this.game = game;
};

Level.prototype.constructor = Level;

Level.prototype.preload = function() {
    this.game.stage.backgroundColor = '#82CAFA';
    this.WORLD_WIDTH = 8000;
    this.WORLD_HEIGHT = 500;
    this.GROUND_HEIGHT = this.WORLD_HEIGHT - 60;
};

Level.prototype.create = function() {
    this.game.world.setBounds(0, 0, this.WORLD_WIDTH, this.WORLD_HEIGHT);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.gameObjects = [];

    this.createHealthPacksGroup();
    this.createWeaponsGroup();
    this.createEnemiesGroup();
    this.createNpcsGroup();
    this.createCarsGroup();
    this.addPlayer();
    this.addPlatforms();
    this.addTexts();
    this.addControls();
    this.addCamera();
    this.createInventory();
    this.createStore();
};

Level.prototype.updateEnemies = function() {
    for (var i = 0; i < this.enemies.children.length; i++) {
        var enemy = this.enemies.children[i];
        for (var enemyWeaponKey in enemy.weapons) {
            this.game.physics.arcade.overlap(
                this.player,
                enemy.weapons[enemyWeaponKey].bullets,
                this.bulletHitCharacter,
                null,
                this);
        }
        var distanceEnemyPlayer = this.game.physics.arcade.distanceBetween(
            this.player, enemy);
        if (distanceEnemyPlayer <= enemy.rangeDetection &&
            distanceEnemyPlayer > enemy.rangeAttack) {
            this.game.physics.arcade.moveToXY(
                enemy,
                this.player.x + enemy.rangeAttack,
                enemy.y);
            enemy.rotateWeapon(this.player.x, this.player.y);
        }
        if (distanceEnemyPlayer <= enemy.rangeAttack) {
            enemy.stop();
            enemy.fireToXY(this.player.x, this.player.y);
        }
    }
};

Level.prototype.updateNpcs = function() {
    for (var i = 0; i < this.npcs.children.length; i++) {
        var npc = this.npcs.children[i];

        var distanceNpcPlayer = this.game.physics.arcade.distanceBetween(
            this.player, npc);
        if (distanceNpcPlayer <= npc.width) {
            var comic = new PopUp(this, npc.comicKey);
            this.game.add.existing(comic);
            comic.open();
            if (this.player.x < npc.x) {
                this.player.x += 2 * npc.width;
            } else {
                this.player.x -= 2 * npc.width;
            }

        }
    }
};

Level.prototype.update = function() {
    //Collisions
    this.updateEnemies();
    this.updateNpcs();

    this.game.physics.arcade.collide(this.gameObjects, this.platforms);
    this.game.physics.arcade.collide(this.player, this.enemies);
    this.game.physics.arcade.overlap(this.player, this.healthPacks,
        this.collectHealthPack, null, this);
    this.game.physics.arcade.overlap(this.player, this.weapons,
        this.collectWeapon, null, this);
    this.game.physics.arcade.overlap(this.cars, this.enemies,
        this.crashEnemy, null, this);

    for (var playerWeaponKey in this.player.weapons) {
        this.game.physics.arcade.overlap(
            this.enemies,
            this.player.weapons[playerWeaponKey].bullets,
            this.bulletHitCharacter,
            null,
            this
        );
    }

    this.game.physics.arcade.overlap(this.player, this.healthPacks,
        this.collectHealthPack, null, this);

    if (this.cursors.left.isDown) {
        this.xDirection = -1;
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.X)) {
            this.player.runLeft();
        } else {
            this.player.moveLeft();
        }
    } else if (this.cursors.right.isDown) {
        this.xDirection = 1;
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.X)) {
            this.player.runRight();
        } else {
            this.player.moveRight();
        }
    } else {
        this.player.stop();
    }
    if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.jump();
    }
    if (this.cursors.up.isDown && this.player.body.touching.down) {
        //this.player.crouch();
    }
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        this.player.fireToXY(
            this.game.input.activePointer.worldX,
            this.game.input.activePointer.worldY);
        //  Add and update the score
        this.updateAmmoText();
    }
};

Level.prototype.createEnemiesGroup = function() {
    this.enemies = this.game.add.group();
    this.gameObjects.push(this.enemies);
};

Level.prototype.createNpcsGroup = function() {
    this.npcs = this.game.add.group();
    this.gameObjects.push(this.npcs);
};

Level.prototype.createCarsGroup = function() {
    this.cars = this.game.add.group();
    this.gameObjects.push(this.cars);
};

Level.prototype.addSimpleEnemy = function(x) {
    this.enemies.add(new SimpleEnemy(this, x, this.GROUND_HEIGHT - 100));
};

Level.prototype.addStrongEnemy = function(x) {
    this.enemies.add(new StrongEnemy(this, x, this.GROUND_HEIGHT - 100));
};

Level.prototype.addNPC = function(x, key, comicKey) {
    this.npcs.add(new NPC(this, x, this.GROUND_HEIGHT - 100, key, comicKey));
};

Level.prototype.addCar = function(x, key) {
    this.cars.add(new InteractiveCar(this, x, this.GROUND_HEIGHT, key));
};

Level.prototype.addPlatforms = function() {
    this.platforms = this.game.add.group();
    this.platforms.enableBody = true;

    this.ground = this.platforms.create(0, this.game.world.height - 64,
        'ground');
    this.ground.scale.setTo(40, 2);
    this.ground.body.immovable = true;

    this.ledge = this.platforms.create(400, 300, 'ground');
    this.ledge.body.immovable = true;
    this.ledge = this.platforms.create(-150, 200, 'ground');
    this.ledge.body.immovable = true;
};

Level.prototype.addObject = function(object) {
    //var object = this.game.add.sprite(x, y, key);
    //object.anchor.setTo(0, 0);
    this.game.add.existing(object);
};

Level.prototype.addPlayer = function() {
    this.player = new Player(this);
    this.game.add.existing(this.player);
    this.gameObjects.push(this.player);
    this.player.addWeapon(new Revolver(this, 700, 100, false));
    this.player.updateCurrentWeapon('simpleWeapon');
};

Level.prototype.addTexts = function() {
    //The score
    this.scoreText = this.game.add.text(this.game.camera.width - 300, 16,
        'Score: ' + this.player.score, {fontSize: '32px', fill: '#000'});
    this.scoreText.fixedToCamera = true;

    //The ammo
    this.ammoText = this.game.add.text(this.game.camera.width - 300,
        this.game.camera.height - 50,
        'Ammo: ' + this.player.currentWeapon.numberOfBullets,
        {
            fontSize: '32px',
            fill: '#000'
        });
    this.ammoText.fixedToCamera = true;

    //The health level
    this.healthLevelText = this.game.add.text(16, 16, 'Health: ' +
        this.player.healthLevel, {fontSize: '32px', fill: '#000'});
    this.healthLevelText.fixedToCamera = true;
};

Level.prototype.addControls = function() {
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.changeKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    this.changeKey.onDown.add(this.player.nextWeapon, this.player);
};

Level.prototype.addCamera = function() {
    this.game.renderer.renderSession.roundPixels = true;
    this.game.camera.follow(this.player);
};

Level.prototype.createHealthPacksGroup = function() {
    this.healthPacks = this.game.add.group();
    this.gameObjects.push(this.healthPacks);
    this.addHealthPack(new HealthPack(this, 500, 10, 5, this));
};

Level.prototype.createWeaponsGroup = function() {
    this.weapons = this.game.add.group();
    this.gameObjects.push(this.weapons);
};

Level.prototype.createInventory = function() {
    this.inventory = new Inventory(this);
    this.game.add.existing(this.inventory);

    this.inventoryButton = this.game.add.button(50,
        this.game.camera.height - 30, 'inventory_button',
        this.inventory.open, this.inventory);
    this.inventoryButton.anchor.setTo(0.5, 0.5);
    this.inventoryButton.fixedToCamera = true;
    this.inventoryButton.input.priorityID = 1;
};

Level.prototype.createStore = function() {
    this.store = new Store(this);
    this.game.add.existing(this.store);

    this.storeButton = this.game.add.button(110,
        this.game.camera.height - 30, 'storeButton',
        this.store.open, this.store);
    this.storeButton.anchor.setTo(0.5, 0.5);
    this.storeButton.fixedToCamera = true;
    this.storeButton.input.priorityID = 1;
};

Level.prototype.bulletHitCharacter = function(character, bullet) {
    character.decreaseHealthLevel(bullet.power);
    character.updateHealhtLevelText();
    bullet.kill();
};

Level.prototype.collectWeapon = function(player, weapon) {
    this.weapons.remove(weapon);
    this.player.useWeapon(weapon);
    this.updateAmmoText();
};

Level.prototype.crashEnemy = function(car, enemy) {
    if (!car.isStopped()) {
        enemy.killCharacter();
    }
};

Level.prototype.collectHealthPack = function(player, healthPack) {
    if (!this.player.fullHealthLevel()) {
        this.increaseHealthLevel(healthPack.maxIncreasing);
    } else {
        this.inventory.addItem(healthPack);
    }
    healthPack.pickUp();
};

Level.prototype.updateAmmoText = function() {
    this.ammoText.text = 'Ammo: ' +
        this.player.currentWeapon.numberOfBullets;
};

Level.prototype.updateScoreText = function() {
    this.scoreText.text = 'Score: ' + this.player.score;
};

Level.prototype.updateHealthLevelText = function() {
    if (this.player.healthLevel <= 0) {
        this.game.state.start('menu');
    }
    this.healthLevelText.text = 'Health: ' + this.player.healthLevel;
};

Level.prototype.increaseHealthLevel = function(increase) {
    this.player.increaseHealthLevel(increase);
    this.updateHealthLevelText();
};

Level.prototype.increaseScore = function(increase) {
    this.player.increaseScore(increase);
    this.updateScoreText();
};

Level.prototype.render = function() {
    this.game.debug.cameraInfo(this.game.camera, 32, 32);
};

Level.prototype.addHealthPack = function(healthPack) {
    this.healthPacks.add(healthPack);
};

Level.prototype.addRevolver = function(x, y, infiniteAmmo) {
    this.weapons.add(new Revolver(this, x, y, infiniteAmmo));
};

Level.prototype.addMachineGun = function(x, y, infiniteAmmo) {
    this.weapons.add(new MachineGun(this, x, y, infiniteAmmo));
};

Level.prototype.pause = function() {
    this.game.physics.arcade.isPaused = true;
};

Level.prototype.resume = function() {
    this.game.physics.arcade.isPaused = false;
};

Level.prototype.showErrorMessage = function(errorMessage, parent) {
    var errorDialog = new Dialog(this, 'errorIcon', errorMessage, parent);
    this.game.add.existing(errorDialog);
    errorDialog.open();
};

Level.prototype.showSuccessMessage = function(successMessage, parent) {
    var successDialog = new Dialog(this, 'successIcon', successMessage, parent);
    this.game.add.existing(successDialog);
    successDialog.open();
};

module.exports = Level;
