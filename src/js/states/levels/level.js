/**
 * @ignore Created by Edwin Gamboa on 22/06/2015.
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
var InteractiveCar = require ('../../items/vocabularyItems/InteractiveCar');
var Dialog = require('../../util/Dialog');
var EnglishChallengesMenu =
    require('../../englishChallenges/menu/EnglishChallengesMenu');
var ResourceBar = require('../../util/ResourceBar');
var NameBoard = require('../../worldElements/NameBoard');
var WorldItem = require('../../items/vocabularyItems/WorldItem');
var InteractionManager = require('../../util/InteractionManager');
var IconButton = require('../../util/IconButton');
var HorizontalLayoutPanel = require('../../util/HorizontalLayoutPanel');
var InteractiveHouse = require('../../worldElements/InteractiveHouse');
var ClueItem = require('../../items/vocabularyItems/ClueItem');

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
    this.WORLD_WIDTH = 8000;
    this.WORLD_HEIGHT = 500;
    this.GROUND_HEIGHT = this.WORLD_HEIGHT - 100;
    this.CAMERA_WIDTH = this.game.camera.width;
    this.font = level.font;
    level = this;
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
    this.addPlatforms();
    this.createBackObjectsGroup();
    this.createHealthPacksGroup();
    this.createVocabularyItemsGroup();
    this.createInteractiveBuildingsGroup();
    this.createTriggerSpritesGroup();
    this.createCarsGroup();
    this.createNpcsGroup();
    this.createEnemiesGroup();
    this.addPlayer();
    this.createWeaponsGroup();
    this.addTexts();
    this.addHealthBar();
    this.addControls();
    this.addCamera();
    this.createStore();
    this.createInventory();
    this.createMyVocabulary ();
    this.createEnglishChallengesMenu();
    this.updateHealthLevel();
    this.createToolsBar();
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
            npc.openDialogs();
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
        this.increaseScore(50);
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
    this.game.physics.arcade.overlap(this.player, this.interactiveBuldings,
        this.openActivity, null, this);
    this.game.physics.arcade.overlap(this.player, this.triggerSprites,
        this.triggerAction, null, this);
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
        this.player.currentWeapon.saveWeapon();
        this.updateAmmoText();
    }
};

/**
 * Adds palyer health bar to the game scene.
 * @method Level.addHealthBar
 */
Level.prototype.addHealthBar = function() {
    this.healthBar = new ResourceBar(
        this.healthIcon.x + this.healthIcon.width + 10,
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
 * @param {InteractionManager} interactionManager - Interaction manager that
 * @return {NPC} - Added NPC;
 */
Level.prototype.addNPC = function(x, key, interactionManager) {
    var npc = new NPC(x, this.GROUND_HEIGHT - 100, key, interactionManager);
    this.npcs.add(npc);
    return npc;
};

/**
 * Adds a new InteractiveCar to cars group.
 * @method Level.addCar
 * @param {InteractiveCar} car - car to be added.
 */
Level.prototype.addCar = function(car) {
    this.cars.add(car);
};

/**
 * Adds the car that corresponds to this level.
 * @method Level.addLevelCar
 * @param {string} key - Car texture key.
 * @param {number} x - X coordinate within the world where the car should
 * appear.
 */
Level.prototype.addLevelCar = function(key, x) {
    var car = this.createInteractiveCar(key);
    car.x = x;
    car.y = this.GROUND_HEIGHT;
    this.cars.add(car);
};

/**
 * Adds a new InteractiveHouse to the level.
 * @method Level.addInteractiveHouse
 * @param {InteractiveHouse} house - Interactive house to be added.
 * @param {boolean} withNeighbors - Indicates whether the building should have
 * neighbors or not.
 */
Level.prototype.addInteractiveHouse = function(house, withNeighbors) {
    this.interactiveBuldings.add(house);
    if (withNeighbors) {
        this.addNeighbors(house, 'orangeHouse', 'yellowHouse');
    }
};

/**
 * Adds a new TriggerSprite to the level.
 * @method Level.addTriggerSprite
 * @param {TriggerSprite} house - Trigger Sprite to be added.
 */
Level.prototype.addTriggerSprite = function(sprite) {
    this.triggerSprites.add(sprite);
};

/**
 * Adds a new ClueItem to the level.
 * @method Level.addClueItem
 * @param {number} x - X coordinate within the world where the item should
 * appear.
 * @param {string} key - Item's texture key.
 * @param {InteractionManager} interactionManager - Interaction manager that
 * allows interaction with the player.
 */
Level.prototype.addClueItem = function(x, key, interactionManager) {
    this.addVocabularyItem(new ClueItem (x, this.GROUND_HEIGHT + 5, key,
        interactionManager));
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
    this.player.loadPlayer();
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
    var labelFontStyle = {fontSize: '16px', fill: '#fff', stroke: '#000',
        strokeThickness: 4};
    var textFontStyle = {fontSize: '35px', fill: '#fff', stroke: '#000',
        strokeThickness: 4};
    var y = 10;
    var distanceBetewIconLabel = 80;
    //The score
    this.scoreIcon = this.game.add.sprite(this.game.camera.width - 190, y,
        'money');
    this.scoreIcon.fixedToCamera = true;
    this.scoreIcon.anchor.set(0.5, 0);
    this.scoreLabel = this.game.add.text(this.scoreIcon.x,
        this.scoreIcon.y + this.scoreIcon.height, 'Money', labelFontStyle);
    this.scoreLabel.fixedToCamera = true;
    this.scoreLabel.anchor.set(0.5, 0);
    this.scoreText = this.game.add.text(
        this.scoreIcon.x + distanceBetewIconLabel, y, '$ ' + this.player.score,
        textFontStyle
    );
    this.scoreText.fixedToCamera = true;
    this.scoreText.anchor.set(0.5, 0);

    //The ammo
    this.ammoIcon = this.game.add.sprite(this.game.camera.width - 400, 10,
        'ammo');
    this.ammoIcon.fixedToCamera = true;
    this.ammoIcon.anchor.set(0.5, 0);
    this.ammoLabel = this.game.add.text(this.ammoIcon.x,
        this.ammoIcon.y + this.ammoIcon.height, 'Ammunition', labelFontStyle);
    this.ammoLabel.fixedToCamera = true;
    this.ammoLabel.anchor.set(0.5, 0);
    this.ammoText = this.game.add.text(
        this.ammoIcon.x + distanceBetewIconLabel, y,
        'x' + this.player.currentWeapon.numberOfBullets, textFontStyle
    );
    this.ammoText.fixedToCamera = true;
    this.ammoText.anchor.set(0.5, 0);

    //The health level
    this.healthIcon = this.game.add.sprite(40, 10, 'health');
    this.healthIcon.fixedToCamera = true;
    this.healthIcon.anchor.set(0.5, 0);
    this.healthLabel = this.game.add.text(this.healthIcon.x,
        this.healthIcon.y + this.healthIcon.height, 'Health', labelFontStyle);
    this.healthLabel.fixedToCamera = true;
    this.healthLabel.anchor.set(0.5, 0);
    this.healthLevelText = this.game.add.text(
        this.healthIcon.x + distanceBetewIconLabel, y, ' ', textFontStyle
    );
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
 * Creates a Phaser group to manage vocabulary items.
 * @method Level.createVocabularyItemsGroup
 */
Level.prototype.createVocabularyItemsGroup = function() {
    this.vocabularyItems = this.game.add.group();
    this.gameObjects.push(this.vocabularyItems);
};

/**
 * Creates a Phaser group to manage interactive buildings group.
 * @method Level.createVocabularyItemsGroup
 */
Level.prototype.createInteractiveBuildingsGroup = function() {
    this.interactiveBuldings = this.game.add.group();
    this.gameObjects.push(this.interactiveBuldings);
};

/**
 * Creates a Phaser group to manage trigger sprites group.
 * @method Level.createTriggerSpritesGroup
 */
Level.prototype.createTriggerSpritesGroup = function() {
    this.triggerSprites = this.game.add.group();
    this.gameObjects.push(this.triggerSprites);
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
};

/**
 * Creates the game Store and a button to access it.
 * @method Level.createStore
 */
Level.prototype.createStore = function() {
    this.store = new Store(this);
    this.game.add.existing(this.store);
};

/**
 * Creates the English challenges menu and a button to access it.
 * @method Level.createEnglishChallengesMenu
 */
Level.prototype.createEnglishChallengesMenu = function() {
    this.englishChallengeMenu = new EnglishChallengesMenu();
    this.game.add.existing(this.englishChallengeMenu);
};

/**
 * Creates the game vocabulary list and a button to access it.
 * @method Level.createMyVocabulary
 */
Level.prototype.createMyVocabulary = function() {
    this.myVocabulary = new MyVocabulary(this);
    this.game.add.existing(this.myVocabulary);
};

/**
 * Creates the game vocabulary list and a button to access it.
 * @method Level.createMyVocabulary
 */
Level.prototype.createToolsBar = function() {
    this.toolsBar = new HorizontalLayoutPanel('toolsBar',
        {x: 0, y: this.WORLD_HEIGHT - 80, margin: 5});
    this.game.add.existing(this.toolsBar);
    this.toolsBar.fixedToCamera = true;
    this.toolsBar.visible = true;

    this.inventoryButton = new IconButton(
        'Inventory',
        'inventory_button',
        this.inventory.open,
        this.inventory
    );
    this.toolsBar.addElement(this.inventoryButton);

    this.storeButton = new IconButton(
        'Store',
        'storeButton',
        this.store.open,
        this.store
    );
    this.toolsBar.addElement(this.storeButton);

    this.addCashButton = new IconButton(
        'Add Money',
        'addCashButton',
        this.englishChallengeMenu.open,
        this.englishChallengeMenu
    );
    this.toolsBar.addElement(this.addCashButton);

    this.myVocabularyButton = new IconButton(
        'Vocabulary',
        'myVocabularyButton',
        this.myVocabulary.open,
        this.myVocabulary
    );
    this.toolsBar.addElement(this.myVocabularyButton);
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
 * Allows the player to interact with an Interactive building.
 * @method Level.openActivity
 * @param {Player} player - Game main player.
 * @param {InteractiveHouse} interactiveBuilding - Bouilding to interact with.
 */
Level.prototype.openActivity = function(player, interactiveBuilding) {
    interactiveBuilding.openActivity();
};

/**
 * Trigger the action associated with the sprite.
 * @method Level.triggerAction
 * @param {Player} player - Game main player.
 * @param {TriggerSprite} sprite - Sprite tht triggers the action.
 */
Level.prototype.triggerAction = function(player, sprite) {
    sprite.triggerAction();
};

/**
 * Updates current player's avialbele ammo text.
 * @method Level.updateAmmoText
 */
Level.prototype.updateAmmoText = function() {
    this.ammoText.text = 'x' + this.player.currentWeapon.numberOfBullets;
};

/**
 * Updates current player's score.
 * @method Level.updateScoreText
 */
Level.prototype.updateScoreText = function() {
    this.scoreText.text = '$ ' + this.player.score;
    localStorage.setItem('score', this.player.score);
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
    localStorage.setItem('healthLevel', this.player.healthLevel);
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
 * Adds this level enemies.
 * @method Level.addEnemies
 */
Level.prototype.addEnemies = function() {
    var x = this.firstCheckPointX * 0.80;
    var i;
    var j;
    for (i = 0; i < this.numberOfFightingPoints; i++) {
        for (j = 0; j < this.numberOfEnemies; j++) {
            x += 50;
            this.addSimpleEnemy(x);
        }
        for (j = 0; j < this.numberOfStrongEnemies; j++) {
            x += 50;
            this.addStrongEnemy(x);
        }
        x += this.checkPointsDistance - 200;
    }
};

/**
 * Adds city places from vocabulary that corresponds to this level.
 * @method LevelT.addPlaces
 */
Level.prototype.addPlaces = function() {
    var x = this.WORLD_WIDTH / (this.placesKeys.length + 1);
    var i;
    var houseIndex = 0;
    var place;
    var leftHouse;
    for (i = 0; i < this.placesKeys.length; i++) {
        if (houseIndex >= this.housesKeys.length) {
            houseIndex = 0;
        }
        place = new WorldItem(
            x * (i + 1),
            this.GROUND_HEIGHT,
            this.placesKeys[i]
        );
        this.addVocabularyItem(place);
        this.addNeighbors(place, this.housesKeys[houseIndex],
            this.housesKeys[houseIndex + 1]);
        houseIndex += 2;
        this.addNameBoard(place.x - 70, place.name + ' Street');
    }
};

/**
 * Adds the health packs for this level
 * @method Level.addHealthPacks
 */
Level.prototype.addHealthPacks = function() {
    var heathPacksDistance = this.WORLD_WIDTH / this.numberOfFightingPoints;
    var i;
    for (i = 1; i <= this.numberOfFightingPoints; i++) {
        this.addHealthPack(new HealthPack(heathPacksDistance * i - 200, 10, 5,
            this));
    }
};

/**
 * Lets the player to play next level.
 * @method Level.nextLevel
 */
Level.prototype.nextLevel = function() {
    localStorage.setItem('level', this.nextState);
    this.game.state.start(this.nextState);
};

/**
 * Creates a car according to its key.
 * @method InteractiveCar.getOn
 * @param {string} carKey - Car's key
 * @return {InteractiveCar} - The created car
 */
Level.prototype.createInteractiveCar = function(carKey) {
    switch (carKey) {
        case 'car':
            return new InteractiveCar(0, 0, carKey, 60, 300, 200);
        case 'jeep':
            return new InteractiveCar(0, 0, carKey, 100, 350, 180);
        case 'bus':
            return new InteractiveCar(0, 0, carKey, 300, 400, 450);
        case 'truck':
            return new InteractiveCar(0, 0, carKey, 200, 70, 90);
        case 'taxi':
            return new InteractiveCar(0, 0, carKey, 450, 200, 400);
        case 'ambulance':
            return new InteractiveCar(0, 0, carKey, 400, 150, 500);
    }
};

/**
 * Determines whether the player has won
 * @returns {boolean}
 */
Level.prototype.playerWins = function() {
    return (this.player.x >= (this.WORLD_WIDTH - this.player.width - 5) &&
    this.enemies.children.length <= 0);
};

module.exports = Level;
