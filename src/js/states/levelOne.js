/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var Inventory = require('../prefabs/inventory');
var HealthPack = require('../prefabs/healthPack');
var Player = require('../prefabs/player');
var Weapon = require('../prefabs/weapon');
var Enemy = require('../prefabs/enemy');

var LevelOne;
LevelOne = function(game) {};

LevelOne.prototype = {
    preload: function() {
        this.game.stage.backgroundColor = '#82CAFA';
    },

    create: function() {
        this.game.world.setBounds(0, 0, 3000, 500);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.gameObjects = [];
        this.ammo = 10;
        this.xDirection = 1;

        this.player = new Player(this, 10, this.game.input.activePointer); //global variable for minimum score
        this.game.add.existing(this.player);
        this.gameObjects.push(this.player);
        this.player.weapons.push(new Weapon(this, this.player, 30, 'weapon',
            'bullet1', 1, this.player.runningSpeed * 2, 100, 10, false));
        this.player.weapons.push(new Weapon(this, this.player, 40, 'weapon',
            'bullet2', 1, this.player.runningSpeed * 2, 100, 50, false));
        this.player.updateCurrentWeapon();

        this.enemies = this.game.add.group();
        this.gameObjects.push(this.enemies);

        for (var i = 0; i < 6; i++) {
            var simpleEnemy = new Enemy(this, 'simple_enemy', 70,
                this.game.camera.width - 100 + (i * 60),
                this.game.camera.height - 100, this.player,
                this.game.camera.width - 200, 300);
            simpleEnemy.weapons.push(new Weapon(this, simpleEnemy, 1, 'weapon',
                'bullet1', 1, this.player.runningSpeed * 2, 100, 0.5, true));
            simpleEnemy.updateCurrentWeapon();
            this.enemies.add(simpleEnemy);
        }

        for (var j = 0; j < this.player.weapons.length; j++) {
            var strongEnemy = new Enemy(this, 'strong_enemy', 150,
                this.game.camera.width + 500 + (j * 100),
                this.game.camera.height - 100, this.player,
                this.game.camera.width, 200 * 2);
            strongEnemy.weapons.push(new Weapon(this, strongEnemy, 1, 'weapon',
                'bullet1', 1, this.player.runningSpeed * 2, 100, 8, true));
            strongEnemy.updateCurrentWeapon();
            this.enemies.add(strongEnemy);
        }

        this.healthPacks = this.game.add.group();
        this.gameObjects.push(this.healthPacks);
        this.addHealthPack(new HealthPack('healthPack', 10, 300,
            0.7 + Math.random() * 0.2, 500, 100, this));

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

        //The score
        this.scoreText = this.game.add.text(this.game.camera.width - 300, 16,
            'Score: ' + this.player.score, {fontSize: '32px', fill: '#000'});
        this.scoreText.fixedToCamera = true;

        //The ammo
        this.ammoText = this.game.add.text(this.game.width - 300,
            this.game.world.height - 50, 'Ammo: ' +
            this.player.currentWeapon.numberOfBullets, {fontSize: '32px',
                fill: '#000'});
        this.ammoText.fixedToCamera = true;

        //The health level
        this.healthLevelText = this.game.add.text(16, 16, 'Health: ' +
            this.player.healthLevel, {fontSize: '32px', fill: '#000'});
        this.healthLevelText.fixedToCamera = true;

        //Controls
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.changeKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.changeKey.onDown.add(this.player.nextWeapon, this.player);

        //Camera
        this.game.renderer.renderSession.roundPixels = true;
        this.game.camera.follow(this.player);

        //Inventory
        this.inventory = new Inventory(this);
        this.game.add.existing(this.inventory);

        this.inventoryButton = this.game.add.button(50,
            this.game.camera.height - 30, 'inventory_button',
            this.inventory.open, this.inventory);
        this.inventoryButton.anchor.setTo(0.5, 0.5);
        this.inventoryButton.fixedToCamera = true;
        this.inventoryButton.input.priorityID = 1;
    },

    update: function() {
        //Collisions
        this.game.physics.arcade.collide(this.gameObjects, this.platforms);
        this.game.physics.arcade.collide(this.player, this.enemies);
        this.game.physics.arcade.collide(this.player, this.strongEnemy);
        this.game.physics.arcade.overlap(this.player, this.healthPacks,
            this.collectHealthPack, null, this);

        for (var i = 0; i < this.player.weapons.length; i++) {
            this.game.physics.arcade.overlap(this.enemies,
                this.player.weapons[i].bullets, this.bulletHitCharacter, null,
                this);
        }

        for (var j = 0; j < this.enemies.length; j++) {
            var enemy = this.enemies.children[j];
            for (var k = 0; k < enemy.weapons.length; k++) {
                this.game.physics.arcade.overlap(this.player,
                    enemy.weapons[k].bullets, this.bulletHitCharacter, null,
                    this);
            }
            var distanceToPlayer = this.game.physics.arcade.distanceBetween(
                this.player, enemy);
            if (distanceToPlayer <= enemy.rangeDetection &&
                distanceToPlayer > enemy.rangeAttack) {
                this.game.physics.arcade.moveToXY(enemy, this.player.x +
                    enemy.rangeAttack, enemy.y);
            }
            if (distanceToPlayer <= enemy.rangeAttack) {
                enemy.stop();
                enemy.currentWeapon.fire(this.player.x, this.player.y);
            }
        }

        this.game.physics.arcade.overlap(this.player, this.healthPacks,
            this.collectHealthPack, null, this);

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
        if (this.game.input.activePointer.isDown) {
            this.player.currentWeapon.fire(this.game.input.activePointer.worldX,
                this.game.input.activePointer.worldY);
            //  Add and update the score
            this.updateAmmoText();
        }
    },

    bulletHitCharacter: function(character, bullet) {
        character.decreaseHealthLevel(bullet.power);
        character.updateHealhtLevel();
        bullet.kill();
    },

    collectHealthPack: function(player , healthPack) {
        if (!this.player.fullHealthLevel()) {
            this.increaseHealthLevel(healthPack.maxIncreasing);
        } else {
            this.inventory.addItem(healthPack);
        }
        healthPack.pickUp();
    },

    updateAmmoText: function() {
        this.ammoText.text = 'Ammo: ' +
            this.player.currentWeapon.numberOfBullets;
    },

    updateScoreText: function() {
        this.scoreText.text = 'Score: ' + this.player.score;
    },

    updateHealthLevelText: function() {
        if (this.player.healthLevel <= 0) {
            this.game.state.start('menu');
        }
        this.healthLevelText.text = 'Health: ' + this.player.healthLevel;
    },

    increaseHealthLevel: function(increase) {
        this.player.increaseHealthLevel(increase);
        this.updateHealthLevelText();
    },

    increaseScore: function(increase) {
        this.player.increaseScore(increase);
        this.updateScoreText();
    },

    render: function() {
        this.game.debug.cameraInfo(this.game.camera, 32, 32);
    },

    addHealthPack: function(healthPack) {
        this.healthPacks.add(healthPack);
    },

    pause: function() {
        this.game.physics.arcade.isPaused = true;
    },

    resume: function() {
        this.game.physics.arcade.isPaused = false;
    }
};

module.exports = LevelOne;
