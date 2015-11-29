/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var Inventory = require('../../items/inventory/Inventory');
var Store = require('../../items/store/Store');
var MyVocabulary = require('../../items/vocabulary/MyVocabulary');
var HealthPack = require('../../items/HealthPack');
var Player = require('../../character/Player');
var Revolver = require('../../items/weapons/Revolver');
var MachineGun = require('../../items/weapons/MachineGun');
var SimpleEnemy = require('../../character/SimpleEnemy');
var StrongestEnemy = require('../../character/StrongestEnemy');
var StrongEnemy = require('../../character/StrongEnemy');
var NPC = require('../../character/NPC');
var PopUp = require('../../util/PopUp');
var InteractiveCar = require ('../../worldElements/InteractiveCar');
var Dialog = require('../../util/Dialog');
var EnglishChallengesMenu =
    require('../../englishChallenges/menu/EnglishChallengesMenu');
var ResourceBar = require('../../util/ResourceBar');
var NameBoard = require('../../worldElements/NameBoard');

/**
 * Represents a game level.
 * @class Level
 * @constructor
 * @param {Phaser.Game} game - Phaser game object.
 */
var Level = function(game) {
    this.game = game;
};

Level.prototype.constructor = Level;

/**
 * Sets world background and size.
 * @method Level.preload
 */
Level.prototype.preload = function() {
    this.game.stage.backgroundColor = '#C7D2FC';

    this.WORLD_WIDTH = 8000;
    this.WORLD_HEIGHT = 500;
    this.GROUND_HEIGHT = this.WORLD_HEIGHT - 100;
};

/**
 * Create all basic game elements, i.e. Palyer, ground, inventory, store, items,
 * characters, etc.
 * @method Level.create
 */
Level.prototype.create = function() {
    this.game.world.setBounds(0, 0, this.WORLD_WIDTH, this.WORLD_HEIGHT);
    this.backgroundImage = this.game.add.tileSprite(0, 0, this.WORLD_WIDTH,
        400, 'worldBg');
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.gameObjects = [];
    this.activePopUps = 0;
    this.xDirection = 1;
    this.createBackObjectsGroup();
    this.createHealthPacksGroup();
    this.createOtherItemsGroup();
    this.createCarsGroup();
    this.createNpcsGroup();
    this.createEnemiesGroup();
    this.addPlayer();
    this.createWeaponsGroup();
    this.addPlatforms();
    this.addTexts();
    this.addHealthBar();
    this.addControls();
    this.addCamera();
    this.createInventory();
    this.createMyVocabulary ();
    this.createEnglishChallengesMenu();
    this.createStore();
    this.updateHealthLevel();
};

/**
 * Updates the enemies, the they behave and display.
 * @method Level.updateEnemies
 */
Level.prototype.updateEnemies = function() {
    var i;
    for (i = 0; i < this.enemies.children.length; i++) {
        var enemy = this.enemies.children[i];
        for (var enemyWeaponKey in enemy.weapons) {
            this.game.physics.arcade.overlap(
                this.playerCharacters,
                enemy.weapons[enemyWeaponKey].bullets,
                this.bulletHitCharacter,
                null,
                this);
        }
        var distanceEnemyPlayer = this.game.physics.arcade.distanceBetween(
            this.player, enemy);
        if (distanceEnemyPlayer <= enemy.rangeAttack) {
            enemy.stop();
            enemy.fireToXY(this.player.x, this.player.y);
        }else if (distanceEnemyPlayer <= enemy.rangeDetection) {
            this.game.physics.arcade.moveToXY(
                enemy,
                this.player.x + enemy.rangeAttack,
                enemy.y);
            enemy.rotateWeapon(this.player.x, this.player.y);
        }
    }
};

/**
 * Updates the non player characters, the they behave and display.
 * @method Level.updateNpcs
 */
Level.prototype.updateNpcs = function() {
    for (var i = 0; i < this.npcs.children.length; i++) {
        var npc = this.npcs.children[i];

        var distanceNpcPlayer = this.game.physics.arcade.distanceBetween(
            this.player, npc);
        if (distanceNpcPlayer <= npc.width) {
            npc.showMessage();
            if (this.player.x < npc.x) {
                this.player.x += 2 * npc.width;
            } else {
                this.player.x -= 2 * npc.width;
            }

        }
    }
};

/**
 * Deals with characters updating, collisions and overlaps. Moreover it deals
 * with game input.
 * @method Level.update
 */
Level.prototype.update = function() {
    if (this.playerWins()) {
        this.nextLevel();
    }
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
    this.game.physics.arcade.overlap(this.player, this.vocabularyItems,
        this.collectVocabularyItem, null, this);
    for (var playerWeaponKey in this.player.weapons) {
        this.game.physics.arcade.overlap(
            this.enemies,
            this.player.weapons[playerWeaponKey].bullets,
            this.bulletHitCharacter,
            null,
            this
        );
    }
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
        this.player.fireToXY(this.player.x + (100 * this.xDirection));
        //  Add and update the score
        this.updateAmmoText();
    }
};

/**
 * Adds palyer health bar to the game scene.
 * @method Level.addHealthBar
 */
Level.prototype.addHealthBar = function() {
    this.healthBar = new ResourceBar(this.healthIcon.x +
        this.healthIcon.width / 2 + 10,
        this.healthLevelText.y + 2);
    this.addObject(this.healthBar);
    this.healthBar.fixedToCamera = true;
};

/**
 * Creates a Phaser group to manage enemies.
 * @method Level.createBackObjectsGroup
 */
Level.prototype.createBackObjectsGroup = function() {
    this.backObjects = this.game.add.group();
};

/**
 * Creates a Phaser group to manage enemies.
 * @method Level.createEnemiesGroup
 */
Level.prototype.createEnemiesGroup = function() {
    this.enemies = this.game.add.group();
    this.gameObjects.push(this.enemies);
};

/**
 * Creates a Phaser group to manage non player characters.
 * @method Level.createNpcsGroup
 */
Level.prototype.createNpcsGroup = function() {
    this.npcs = this.game.add.group();
    this.gameObjects.push(this.npcs);
};

/**
 * Creates a Phaser group to manage interactive cars.
 * @method Level.createCarsGroup
 */
Level.prototype.createCarsGroup = function() {
    this.cars = this.game.add.group();
    this.gameObjects.push(this.cars);
};

/**
 * Adds a new SimpleEnemy to enemies group.
 * @method Level.addSimpleEnemy
 * @param {number} x - X coordinate within the world where the enemy should
 * appear.
 */
Level.prototype.addSimpleEnemy = function(x) {
    this.enemies.add(new SimpleEnemy(x, this.GROUND_HEIGHT - 100));
};

/**
 * Adds a new StrongestEnemy to enemies group.
 * @method Level.addStrongestEnemy
 * @param {number} x - X coordinate within the world where the enemy should
 * appear.
 */
Level.prototype.addStrongestEnemy = function(x) {
    this.enemies.add(new StrongestEnemy(x, this.GROUND_HEIGHT - 100));
};

/**
 * Adds a new StrongEnemy to enemies group.
 * @method Level.addStrongEnemy
 * @param {number} x - X coordinate within the world where the enemy should
 * appear.
 */
Level.prototype.addStrongEnemy = function(x) {
    this.enemies.add(new StrongEnemy(x, this.GROUND_HEIGHT - 100));
};

/**
 * Adds a new non player character to npcs group.
 * @method Level.addNPC
 * @param {number} x - X coordinate within the world where the character should
 * appear.
 * @param {string} key - NPC texture key.
 * @param {string} comicKey - Texture key of the comic that represents the
 * interaction between this NPC and the player.
 * @return {NPC} - Added NPC;
 */
Level.prototype.addNPC = function(x, key, comicKey) {
    var npc = new NPC(x, this.GROUND_HEIGHT - 100, key, comicKey);
    this.npcs.add(npc);
    return npc;
};

/**
 * Adds a new InteractiveCar to enemies group.
 * @method Level.addCar
 * @param {number} x - X coordinate within the world where the car should
 * appear.
 * @param {string} key - Car texture key.
 */
Level.prototype.addCar = function(x, key) {
    this.cars.add(new InteractiveCar(x, this.GROUND_HEIGHT, key));
};

/**
 * Adds the ground to the game world.
 * @method Level.addPlatforms
 */
Level.prototype.addPlatforms = function() {
    this.platforms = this.game.add.group();
    this.platforms.enableBody = true;

    this.ground = this.platforms.create(0, this.GROUND_HEIGHT, 'ground');
    var yScale = 100 / this.ground.height;
    var xScale = this.WORLD_WIDTH / this.ground.width;
    this.ground.scale.setTo(xScale, yScale);
    this.ground.body.immovable = true;

    /*
    this.ledge = this.platforms.create(400, 300, 'ground');
    this.ledge.body.immovable = true;
    this.ledge = this.platforms.create(-150, 200, 'ground');
    this.ledge.body.immovable = true;
    */
};

/**
 * Adds a new object (Sprite) to the world.
 * @method Level.addObject
 * @param {Phaser.Sprite} object - Object to be added.
 */
Level.prototype.addObject = function(object) {
    this.backObjects.add(object);
};

/**
 * Adds the player to the game world and a Phaser group for characters
 * controlled by player (When he has to protect i.e. his wife.)
 * @method Level.addPlayer
 */
Level.prototype.addPlayer = function() {
    this.playerCharacters = this.game.add.group();
    this.player = new Player(this);
    this.playerCharacters.add(this.player);
    this.gameObjects.push(this.playerCharacters);
    this.player.useWeapon(new Revolver(700, 100, false));
};

/**
 * Adds a character that will be controlled by player
 * (When he has to protect i.e. his wife.)
 * @method Level.addPlayerCharacter
 * @param {Character} character - Character to be protected by player.
 */
Level.prototype.addPlayerCharacter = function(character) {
    this.playerCharacters.add(character);
};

/**
 * Adds score, ammo and health level text to the game scene.
 * @method Level.addTexts
 */
Level.prototype.addTexts = function() {
    //The score
    this.scoreIcon = this.game.add.sprite(this.game.camera.width - 150, 10,
        'money');
    this.scoreIcon.fixedToCamera = true;
    this.scoreIcon.anchor.set(0.5, 0);
    this.scoreLabel = this.game.add.text(this.scoreIcon.x,
        this.scoreIcon.y + this.scoreIcon.height,
        'Money', {fontSize: '16px', fill: '#000'});
    this.scoreLabel.fixedToCamera = true;
    this.scoreLabel.anchor.set(0.5, 0);
    this.scoreText = this.game.add.text(this.scoreIcon.x + 60, 10,
        '' + this.player.score, {fontSize: '32px', fill: '#000'});
    this.scoreText.fixedToCamera = true;
    this.scoreText.anchor.set(0.5, 0);

    //The ammo
    this.ammoIcon = this.game.add.sprite(this.game.camera.width - 150,
        this.game.camera.height - 70,
        'ammo');
    this.ammoIcon.fixedToCamera = true;
    this.ammoIcon.anchor.set(0.5, 0);
    this.ammoLabel = this.game.add.text(this.ammoIcon.x,
        this.ammoIcon.y + this.ammoIcon.height,
        'Ammo', {fontSize: '16px', fill: '#000'});
    this.ammoLabel.fixedToCamera = true;
    this.ammoLabel.anchor.set(0.5, 0);
    this.ammoText = this.game.add.text(this.ammoIcon.x + 60,
        this.game.camera.height - 60,
        '' + this.player.currentWeapon.numberOfBullets,
        {
            fontSize: '32px',
            fill: '#000'
        });
    this.ammoText.fixedToCamera = true;
    this.ammoText.anchor.set(0.5, 0);

    //The health level
    this.healthIcon = this.game.add.sprite(40, 10,
        'health');
    this.healthIcon.fixedToCamera = true;
    this.healthIcon.anchor.set(0.5, 0);
    this.healthLabel = this.game.add.text(this.healthIcon.x,
        this.healthIcon.y + this.healthIcon.height,
        'Health', {fontSize: '16px', fill: '#000'});
    this.healthLabel.fixedToCamera = true;
    this.healthLabel.anchor.set(0.5, 0);
    this.healthLevelText = this.game.add.text(this.healthIcon.x + 60, 16,
        ' ', {fontSize: '32px', fill: '#000'});
    this.healthLevelText.fixedToCamera = true;
    this.healthLevelText.anchor.set(0.5, 0);
};

/**
 * Add input to the game.
 * @method Level.addControls
 */
Level.prototype.addControls = function() {
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.changeKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    this.changeKey.onDown.add(this.player.nextWeapon, this.player);
};

/**
 * Adds a camera to the game, it will follow player.
 * @method Level.addCamera
 */
Level.prototype.addCamera = function() {
    this.game.renderer.renderSession.roundPixels = true;
    this.game.camera.follow(this.player);
};

/**
 * Creates a Phaser group to manage health packs.
 * @method Level.createHealthPacksGroup
 */
Level.prototype.createHealthPacksGroup = function() {
    this.healthPacks = this.game.add.group();
    this.gameObjects.push(this.healthPacks);
};

/**
 * Creates a Phaser group to manage other items.
 * @method Level.createOtherItemsGroup
 */
Level.prototype.createOtherItemsGroup = function() {
    this.vocabularyItems = this.game.add.group();
    this.gameObjects.push(this.vocabularyItems);
};

/**
 * Creates a Phaser group to manage health packs.
 * @method Level.createWeaponsGroup
 */
Level.prototype.createWeaponsGroup = function() {
    this.weapons = this.game.add.group();
    this.gameObjects.push(this.weapons);
};

/**
 * Creates the game inventory and a button to access it.
 * @method Level.createInventory
 */
Level.prototype.createInventory = function() {
    this.inventory = new Inventory(this);
    this.game.add.existing(this.inventory);

    this.inventoryButton = this.game.add.button(50,
        this.game.camera.height - 70, 'inventory_button',
        this.inventory.open, this.inventory);
    this.inventoryButton.anchor.setTo(0.5, 0);
    this.inventoryButton.fixedToCamera = true;
    this.inventoryButton.input.priorityID = 1;
    this.inventoryButtonLabel = this.game.add.text(this.inventoryButton.x,
        this.inventoryButton.y + this.inventoryButton.height,
        'Inventory', {fontSize: '16px', fill: '#000'});
    this.inventoryButtonLabel.fixedToCamera = true;
    this.inventoryButtonLabel.anchor.set(0.5, 0);
};

/**
 * Creates the game Store and a button to access it.
 * @method Level.createStore
 */
Level.prototype.createStore = function() {
    this.store = new Store(this);
    this.game.add.existing(this.store);

    this.storeButton = this.game.add.button(130,
        this.game.camera.height - 70, 'storeButton',
        this.store.open, this.store);
    this.storeButton.anchor.setTo(0.5, 0);
    this.storeButton.fixedToCamera = true;
    this.storeButton.input.priorityID = 1;
    this.storeButtonLabel = this.game.add.text(this.storeButton.x,
        this.storeButton.y + this.storeButton.height,
        'Store', {fontSize: '16px', fill: '#000'});
    this.storeButtonLabel.fixedToCamera = true;
    this.storeButtonLabel.anchor.set(0.5, 0);
};

/**
 * Creates the English challenges menu and a button to access it.
 * @method Level.createEnglishChallengesMenu
 */
Level.prototype.createEnglishChallengesMenu = function() {
    this.englishChallengeMenu = new EnglishChallengesMenu();
    this.game.add.existing(this.englishChallengeMenu);

    this.addCashButton = this.game.add.button(210,
        this.game.camera.height - 70, 'addCashButton',
        this.englishChallengeMenu.open, this.englishChallengeMenu);
    this.addCashButton.anchor.setTo(0.5, 0);
    this.addCashButton.fixedToCamera = true;
    this.addCashButton.input.priorityID = 1;
    this.addCashButtonLabel = this.game.add.text(this.addCashButton.x,
        this.addCashButton.y + this.addCashButton.height,
        'Add Money', {fontSize: '16px', fill: '#000'});
    this.addCashButtonLabel.fixedToCamera = true;
    this.addCashButtonLabel.anchor.set(0.5, 0);

};

/**
 * Creates the game vocabulary list and a button to access it.
 * @method Level.createMyVocabulary
 */
Level.prototype.createMyVocabulary = function() {
    this.myVocabulary = new MyVocabulary(this);
    this.game.add.existing(this.myVocabulary);

    this.myVocabularyButton = this.game.add.button(320,
        this.game.camera.height - 70, 'myVocabularyButton',
        this.myVocabulary.open, this.myVocabulary);
    this.myVocabularyButton.anchor.setTo(0.5, 0);
    this.myVocabularyButton.fixedToCamera = true;
    this.myVocabularyButton.input.priorityID = 1;
    this.myVocabularyButtonLabel = this.game.add.text(this.myVocabularyButton.x,
        this.myVocabularyButton.y + this.myVocabularyButton.height,
        'My Vocabulary', {fontSize: '16px', fill: '#000'});
    this.myVocabularyButtonLabel.fixedToCamera = true;
    this.myVocabularyButtonLabel.anchor.set(0.5, 0);
};

/**
 * Decrease the health level of character that was impacted with a bullet.
 * @method Level.bulletHitCharacter
 * @param {Character} character - Character that was impacted.
 * @param {Bullet} bullet - Bullet that impacts the character.
 */
Level.prototype.bulletHitCharacter = function(character, bullet) {
    character.decreaseHealthLevel(bullet.power);
    character.updateHealthLevel();
    bullet.kill();
};

/**
 * Allows the player to pick uo a weapon and use it.
 * @method Level.collectWeapon
 * @param {Player} player - Game main player.
 * @param {Weapon} weapon - Weapon to be picked up.
 */
Level.prototype.collectWeapon = function(player, weapon) {
    this.weapons.remove(weapon);
    this.player.useWeapon(weapon);
    this.updateAmmoText();
};

/**
 * Controls when a car crash an Enemy.
 * @method Level.crashEnemy
 * @param {InteractiveCar} car - Car that crashes the enemy.
 * @param {Enemy} enemy - Enemy who is crashed.
 */
Level.prototype.crashEnemy = function(car, enemy) {
    if (!car.isStopped()) {
        enemy.killCharacter();
    }
};

/**
 * Allows the player to pick up a HealthPack.
 * @method Level.collectHealthPack
 * @param {Player} player - Game main player.
 * @param {HealthPack} healthPack - HealthPack to be picked up.
 */
Level.prototype.collectHealthPack = function(player, healthPack) {
    if (!this.player.fullHealthLevel()) {
        this.increaseHealthLevel(healthPack.maxIncreasing);
    } else {
        this.inventory.addItem(healthPack);
    }
    healthPack.pickUp();
};

/**
 * Allows the player to pick up an Item.
 * @method Level.collectItem
 * @param {Player} player - Game main player.
 * @param {Item} item - Item to be picked up.
 */
Level.prototype.collectItem = function(player, item) {
    this.inventory.addItem(item);
    item.pickUp();
};

/**
 * Allows the player to pick up an ItemVocabulary.
 * @method Level.collectVocabularyItem
 * @param {Player} player - Game main player.
 * @param {Item} vocabularyItem - Item to be picked up.
 */
Level.prototype.collectVocabularyItem = function(player, vocabularyItem) {
    this.myVocabulary.addItem(vocabularyItem);
    vocabularyItem.pickUp();
};

/**
 * Updates current player's avialbele ammo text.
 * @method Level.updateAmmoText
 */
Level.prototype.updateAmmoText = function() {
    this.ammoText.text = '' + this.player.currentWeapon.numberOfBullets;
};

/**
 * Updates current player's score.
 * @method Level.updateScoreText
 */
Level.prototype.updateScoreText = function() {
    this.scoreText.text = '' + this.player.score;
};

/**
 * Updates current player's health leel bar and text.
 * @method Level.updateHealthLevel
 */
Level.prototype.updateHealthLevel = function() {
    if (this.player.healthLevel <= 0) {
        this.gameOver();
    }
    this.healthLevelText.text = '' + this.player.healthLevel;
    this.healthBar.updateResourceBarLevel(this.player.healthLevel /
        this.player.maxHealthLevel);
};

/**
 * Called when player loses.
 * @method Level.gameOver
 */
Level.prototype.gameOver = function() {
    this.game.state.start('menu');
};

/**
 * Increases player's health level.
 * @method Level.increaseHealthLevel
 * @param {number} increase - The amount to be increased.
 */
Level.prototype.increaseHealthLevel = function(increase) {
    this.player.increaseHealthLevel(increase);
    this.updateHealthLevel();
};

/**
 * Increases player's score.
 * @method Level.increaseScore
 * @param {number} increase - The amount to be increased.
 */
Level.prototype.increaseScore = function(increase) {
    this.player.increaseScore(increase);
    this.updateScoreText();
};

/**
 * Adds a HealthPack to healthPacks group.
 * @method Level.addHealthPack
 * @param {HealthPack} healthPack - HealthPack to be added.
 */
Level.prototype.addHealthPack = function(healthPack) {
    this.healthPacks.add(healthPack);
};

/**
 * Adds a Item to vocabularyItems group.
 * @method Level.addVocabularyItem
 * @param {Item} item - Vocabulary item to be added.
 */
Level.prototype.addVocabularyItem = function(item) {
    this.vocabularyItems.add(item);
};

/**
 * Adds a new Revolver to weapons group.
 * @method Level.addRevolver
 * @param {number} x - X coordinate within the world where the Revolver should
 * appear.
 * @param {number} y - Y coordinate within the world where the Revolver should
 * appear.
 * @param {boolean} infiniteAmmo - Indicates whether the revolver has or no
 * infinite ammo.
 */
Level.prototype.addRevolver = function(x, y, infiniteAmmo) {
    this.weapons.add(new Revolver(x, y, infiniteAmmo));
};

/**
 * Adds a new MachineGun to weapons group.
 * @method Level.addMachineGun
 * @param {number} x - X coordinate within the world where the MachineGun should
 * appear.
 * @param {number} y - Y coordinate within the world where the MachineGun should
 * appear.
 * @param {boolean} infiniteAmmo - Indicates whether the MachineGun has or no
 * infinite ammo.
 */
Level.prototype.addMachineGun = function(x, y, infiniteAmmo) {
    this.weapons.add(new MachineGun(x, y, infiniteAmmo));
};

/**
 * Pauses the current game.
 * @method Level.pause
 */
Level.prototype.pause = function() {
    this.game.physics.arcade.isPaused = true;
};

/**
 * Resumes the game when it has been paused.
 * @method Level.resume
 */
Level.prototype.resume = function() {
    this.game.physics.arcade.isPaused = false;
};

/**
 * Shows a Dialog with an error message.
 * @method Level.showErrorMessage
 * @param {string} errorMessage - Message to be showed.
 * @param {PopUp} [parent] - PopUp that shows the message.
 */
Level.prototype.showErrorMessage = function(errorMessage, parent) {
    var errorDialog = new Dialog('errorIcon', errorMessage, parent);
    this.game.add.existing(errorDialog);
    errorDialog.open();
};

/**
 * Shows a Dialog with a success message.
 * @method Level.showSuccessMessage
 * @param {string} successMessage - Message to be showed.
 * @param {PopUp} [parent] - PopUp that shows the message.
 */
Level.prototype.showSuccessMessage = function(successMessage, parent) {
    var successDialog = new Dialog('successIcon', successMessage, parent);
    this.game.add.existing(successDialog);
    successDialog.open();
};

/**
 * Adds a new static building (player can not interact with it) to the game
 * scene.
 * @method Level.prototype.addStaticBuilding
 * @param {number} x - X coordinate within the world where the building should
 * appear.
 * @param {string} key - Bulding texture key.
 * @returns {Phaser.Sprite} - Added building
 */
Level.prototype.addStaticBuilding = function(x, key) {
    var building = level.game.make.sprite(x, this.GROUND_HEIGHT, key);
    building.anchor.set(0, 1);
    this.addObject(building);
    return building;
};

/**
 * Adds two neighbors to a certain building, one on its left and the other one
 * on its right.
 * @method Level.addNeighbors
 * @param {Phaser.Sprite} building - Building, which will have the neighbors.
 * @param {string} leftKey - Left neighbor texture key.
 * @param {string} rightKey - Right neighbor texture key.
 */
Level.prototype.addNeighbors = function(building, leftKey, rightKey) {
    var leftHouse = this.addStaticBuilding(0, leftKey);
    leftHouse.x = building.x - leftHouse.width;
    this.addStaticBuilding(building.x + building.width, rightKey);
};

/**
 * Adds a new NameBoard, typically for a certain place or street.
 * @method Level.addNameBoard
 * @param {number} x - X coordinate within the world, where the board should
 * appear.
 * @param {string} text - Text to be showed on the board.
 */
Level.prototype.addNameBoard = function(x, text) {
    var board;
    board = new NameBoard(x, this.GROUND_HEIGHT, text);
    this.addObject(board);

};

/**
 * Determines whether the player has won
 * @returns {boolean}
 */
Level.prototype.playerWins = function() {};

module.exports = Level;
