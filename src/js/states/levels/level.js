/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var Inventory = require('../../prefabs/inventory/Inventory');
var HealthPack = require('../../prefabs/inventory/HealthPack');
var Player = require('../../prefabs/character/Player');
var Revolver = require('../../prefabs/weapons/Revolver');
var MachineGun = require('../../prefabs/weapons/MachineGun');
var SimpleEnemy = require('../../prefabs/character/SimpleEnemy');
var StrongEnemy = require('../../prefabs/character/StrongEnemy');
var NPC = require('../../prefabs/character/NPC');
var PopUp = require('../../prefabs/util/PopUp');

var WORLD_WIDTH = 3000;
var WORLD_HEIGHT = 500;
var MIN_Y = WORLD_HEIGHT - 100;

var Level = function(game) {
    this.game = game;
};

Level.prototype.constructor = Level;

Level.prototype.preload = function() {
    this.game.stage.backgroundColor = '#82CAFA';
};

Level.prototype.create = function() {
    this.game.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.gameObjects = [];

    this.createHealthPacksGroup();
    this.createWeaponsGroup();
    this.createEnemiesGroup();
    this.addPlayer();
    this.addPlatforms();
    this.addTexts();
    this.addControls();
    this.addCamera();
    this.createInventory();
};

Level.prototype.update = function() {
    //Collisions
    this.game.physics.arcade.collide(this.gameObjects, this.platforms);
    this.game.physics.arcade.collide(this.player, this.enemies);
    this.game.physics.arcade.overlap(this.player, this.healthPacks,
        this.collectHealthPack, null, this);
    this.game.physics.arcade.overlap(this.player, this.weapons,
        this.collectWeapon, null, this);

    for (var playerWeaponKey in this.player.weapons) {
        this.game.physics.arcade.overlap(
            this.enemies,
            this.player.weapons[playerWeaponKey].bullets,
            this.bulletHitCharacter,
            null,
            this
        );
    }

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
        }
        if (distanceEnemyPlayer <= enemy.rangeAttack) {
            enemy.stop();
            enemy.currentWeapon.fire(this.player.x, this.player.y);
        }
    }

    var distanceNeighborPlayer = this.game.physics.arcade.distanceBetween(
        this.player, this.neighbor);
    if (distanceNeighborPlayer <= this.neighbor.width) {
        var comicOne = new PopUp(this, 'comic1');
        this.game.add.existing(comicOne);
        comicOne.open();
        if (this.player.x < this.neighbor.x) {
            this.player.x += 2 * this.neighbor.width;
        } else {
            this.player.x -= 2 * this.neighbor.width;
        }

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
        this.player.currentWeapon.fire(this.game.input.activePointer.worldX,
            this.game.input.activePointer.worldY);
        //  Add and update the score
        this.updateAmmoText();
    }
};

Level.prototype.createEnemiesGroup = function() {
    this.enemies = this.game.add.group();
    this.gameObjects.push(this.enemies);
};

Level.prototype.addSimpleEnemy = function(x) {
    this.enemies.add(new SimpleEnemy(this, x, MIN_Y, this.player));
};

Level.prototype.addStrongEnemy = function(x) {
    this.enemies.add(new StrongEnemy(this, x, MIN_Y, this.player));
};

Level.prototype.addNPC = function(x, y) {
    this.neighbor = new NPC(this, x, MIN_Y, this.player);
    this.game.add.existing(this.neighbor);
    this.gameObjects.push(this.neighbor);
};

Level.prototype.addPlatforms = function() {
    this.platforms = this.game.add.group();
    this.platforms.enableBody = true;

    this.ground = this.platforms.create(0, this.game.world.height - 64,
        'ground');
    this.ground.scale.setTo(10, 2);
    this.ground.body.immovable = true;

    this.ledge = this.platforms.create(400, 300, 'ground');
    this.ledge.body.immovable = true;
    this.ledge = this.platforms.create(-150, 200, 'ground');
    this.ledge.body.immovable = true;
};

Level.prototype.addPlayer = function() {
    this.player = new Player(this, this.game.input.activePointer);
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
    this.addHealthPack(new HealthPack('healthPack5', 5, 300,
        0.7 + Math.random() * 0.2, 500, 100, this));
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

Level.prototype.bulletHitCharacter = function(character, bullet) {
    character.decreaseHealthLevel(bullet.power);
    character.updateHealhtLevel();
    bullet.kill();
};

Level.prototype.collectWeapon = function(player, weapon) {
    this.weapons.remove(weapon);
    this.player.pickUpWeapon(weapon);
    this.updateAmmoText();
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

module.exports = Level;
