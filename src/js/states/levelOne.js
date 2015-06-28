/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var Inventory = require('../prefabs/inventory');
var HealthPack = require('../prefabs/healthPack');
var Player = require('../prefabs/player');
var Weapon = require('../prefabs/weapon');

var LevelOne;
LevelOne = function(game) {};

LevelOne.prototype = {
    preload: function() {
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
        this.game.stage.backgroundColor = '#82CAFA';
    },

    create: function() {
        this.game.world.setBounds(0, 0, 3000, 500);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.gameObjects = [];
        this.weapons = [];
        this.score = 0;
        this.currentWeapon = 0;
        this.ammo = 10;
        this.healthLevel = 100;
        this.xDirection = 1;

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

        this.player = new Player(this.game, 250, 500, 100, 0.2, 300);
        this.game.add.existing(this.player);
        this.gameObjects.push(this.player);

        this.weapons.push(new Weapon(this.game, this.player, 30, 'bullet1', 0,
            400, 100));
        this.weapons.push(new Weapon(this.game, this.player, 40, 'bullet2', 0,
            500, 100));

        for (var i = 1; i < this.weapons.length; i++) {
            this.weapons[i].visible = false;
        }

        this.healthPack = new HealthPack(this.game, 'healthPack', 10, 300,
            0.7 + Math.random() * 0.2, 500, 100);
        this.game.add.existing(this.healthPack);
        this.gameObjects.push(this.healthPack);

        //The score
        this.scoreText = this.game.add.text(this.game.camera.width - 300, 16,
            'Score: ' + this.score, {fontSize: '32px', fill: '#000'});
        this.scoreText.fixedToCamera = true;

        //The ammo
        this.ammoText = this.game.add.text(this.game.width - 300,
            this.game.world.height - 50, 'Ammo: ' + this.ammo, {fontSize:
                '32px', fill: '#000'});
        this.ammoText.fixedToCamera = true;

        //The health level
        this.healthLevelText = this.game.add.text(16, 16, 'Health: ' +
            this.healthLevel, {fontSize: '32px', fill: '#000'});
        this.healthLevelText.fixedToCamera = true;

        //Controls
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.changeKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.changeKey.onDown.add(this.nextWeapon, this);

        //Camera
        this.game.renderer.renderSession.roundPixels = true;
        this.game.camera.follow(this.player);

        //Inventory
        this.inventoryButton = this.game.add.button(this.game.camera.width - 50,
            100, 'inventory_button', this.displayInventory, this);

        this.inventoryButton.inputEnabled = true;
        this.inventoryButton.events.onInputUp.add(this.displayInventory, this);
        this.inventoryButton.anchor.setTo(0.5, 0.5);
        this.inventoryButton.fixedToCamera = true;
        this.inventoryButton.input.priorityID = 1;

        this.inventory = new Inventory(this.game);
        var healthPackIcon = this.game.make.sprite(20, 20, 'healthPack');
        healthPackIcon.inputEnabled = true;
        healthPackIcon.input.priorityID = 2;
        //healthPackIcon.input.useHandCursor = true;
        //healthPackIcon.events.onInputDown.add(this.inventory.showHealthPacks,
        //    this);
        healthPackIcon.input.enableDrag();

        var closeButton = this.game.make.sprite((this.inventory.width / 2),
            (-this.inventory.height / 2), 'close');
        closeButton.anchor.set(0.5);
        closeButton.inputEnabled = true;
        closeButton.input.priorityID = 2;
        closeButton.events.onInputDown.add(this.closeInventory, this);

        this.inventory.addChild(closeButton);
        this.inventory.addChild(healthPackIcon);

        this.game.add.existing(this.inventory);

        this.inventory.fixedToCamera = true;

        this.inventory.visible = false;
    },

    update: function() {
        //Collisions
        this.game.physics.arcade.collide(this.gameObjects, this.platforms);
        this.game.physics.arcade.overlap(this.healthPack, this.player,
            this.collectItem, null, this);

        if (this.cursors.left.isDown) {
            this.xDirection = -1;
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.X)) {
                this.player.runLeft();
            }else {
                this.player.moveLeft();
            }
        } else if (this.cursors.right.isDown) {
            this.xDirection = 1;
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.X)) {
                this.player.runRight();
            }else {
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
            this.weapons[this.currentWeapon].fire(this.xDirection);
            //  Add and update the score
            this.ammo = this.weapons[this.currentWeapon].numberOfBullets;
            this.ammoText.text = 'Ammo: ' + this.ammo;
        }
        //if (this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
        //    this.nextWeapon();
        //}
    },

    nextWeapon: function() {
        this.currentWeapon++;

        if (this.currentWeapon === this.weapons.length) {
            this.currentWeapon = 0;
        }

        this.weapons[this.currentWeapon].visible = true;
        this.ammo = this.weapons[this.currentWeapon].numberOfBullets;
        this.ammoText.text = 'Ammo: ' + this.ammo;
    },

    collectItem: function(item) {
        if (this.healthLevel !== 100) {
            this.healthLevel += item.maxIncreasing;
            if (this.healthLevel > 100) {
                this.healthLevel = 100;
            }
            this.healthLevelText.text = 'Health: ' + this.healthLevel;
        } else {
            this.inventory.addItem(item);
        }
        item.pickUp();
    },

    render: function() {
        this.game.debug.cameraInfo(this.game.camera, 32, 32);
    },

    displayInventory: function() {
        //this.game.paused = true;
        this.game.physics.arcade.isPaused = true;
        this.inventory.visible = true;
    },

    closeInventory: function() {
        //this.game.paused = false;
        this.game.physics.arcade.isPaused = false;
        this.inventory.visible = false;
    }
};

module.exports = LevelOne;
