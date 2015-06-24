(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'WOPIC');

//Game States
var LevelOneState = require('./states/levelOne');

game.state.add('play', LevelOneState);
game.state.start('play');

},{"./states/levelOne":7}],2:[function(require,module,exports){
var Item = require('./item');

var HealthPack;
HealthPack = function(game, key, maxIncreasing, gravity, bounce, xPos,
                      yPos) {
    Item.call(this, game, 'Health Pack');
    Phaser.Sprite.call(this, game, xPos, yPos, key);
    this.anchor.set(0.5);
    this.maxIncreasing = maxIncreasing;
    this.game.physics.arcade.enable(this);
    this.body.bounce.y = bounce;
    this.body.gravity.y = gravity;
    this.body.collideWorldBounds = true;
    return this;
};

HealthPack.prototype = Object.create(Item.prototype);
HealthPack.prototype.constructor = HealthPack;

HealthPack.prototype.pickUp = function() {
    this.kill();
};

module.exports = HealthPack;

},{"./item":4}],3:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var Inventory = function(game) {
    this.game = game;
    this.items = [];
};

Inventory.prototype.constructor = Inventory;

Inventory.prototype.addItem = function(item) {
    this.items.push(item);

    //localStorage.setItem(item.name, foo);
};
module.exports = Inventory;

},{}],4:[function(require,module,exports){
var Item;
Item = function(game, name) {
    this.name = name;
    this.game = game;
};

Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;

module.exports = Item;

},{}],5:[function(require,module,exports){
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Player = function(game, speed, runningSpeed, healthLevel, bounce, gravity) {
    Phaser.Sprite.call(this, game, 32, game.world.height - 150, 'character');
    this.speed = speed;
    this.runningSpeed = runningSpeed;
    this.healthLevel = healthLevel;

    this.game.physics.arcade.enable(this);
    this.body.bounce.y = bounce;
    this.body.gravity.y = gravity;
    this.body.collideWorldBounds = true;

    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {

};

Player.prototype.moveLeft = function() {
    this.body.velocity.x = -this.speed;
    this.animations.play('left');
};

Player.prototype.moveRight = function() {
    this.body.velocity.x = this.speed;
    this.animations.play('right');
};

Player.prototype.runLeft = function() {
    this.body.velocity.x = -this.runningSpeed;
    this.animations.play('left');
};

Player.prototype.runRight = function() {
    this.body.velocity.x = this.runningSpeed;
    this.animations.play('right');
};

Player.prototype.stop = function() {
    this.body.velocity.x = 0;
    this.animations.stop();
    this.frame = 4;
};

Player.prototype.jump = function() {
    this.body.velocity.y = -350;
};

Player.prototype.crouch = function() {
    this.animations.stop();
    this.frame = 9;
};

module.exports = Player;

},{}],6:[function(require,module,exports){
var Weapon = function(game, player, numberOfBullets, imageName, nextFire,
                      bulletSpeed, fireRate) {
    this.game = game;
    this.player = player;
    this.numberOfBullets = numberOfBullets;
    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(numberOfBullets, imageName);
    this.nextFire = nextFire;
    this.bulletSpeed = bulletSpeed;
    this.fireRate = fireRate;
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 1);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('texture.baseTexture.scaleMode',
        PIXI.scaleModes.NEAREST);
    this.bullets.setAll('exists', false);
};

Weapon.prototype.constructor = Weapon;

Weapon.prototype.fire = function(direction) {
    if (this.game.time.now > this.nextFire) {

        this.currentBullet = this.bullets.getFirstExists(false);

        if (this.currentBullet && this.numberOfBullets > 0) {
            this.currentBullet.reset(this.player.x, this.player.y + 30);
            this.currentBullet.body.velocity.x = this.player.body.velocity.x +
                    this.bulletSpeed * direction;
            this.nextFire = this.game.time.now + this.fireRate;
            this.numberOfBullets--;
        }
    }
};

module.exports = Weapon;

},{}],7:[function(require,module,exports){
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
        this.game.load.image('sky', 'assets/images/sky.png');
        this.game.load.image('ground', 'assets/images/platform.png');
        this.game.load.image('healthPack', 'assets/images/healthPack.png');
        this.game.load.image('inventory_button', 'assets/images/inventory.png');
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
        this.ammoText = this.game.add.text(this.game.camera.width - 300,
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
        this.inventory = new Inventory(this.game);

        this.inventoryButton = this.game.add.button(this.game.camera.width - 50,
            100, 'inventory_button', this.displayInventory, this);
        this.inventoryButton.anchor.setTo(0.5, 0.5);
        this.inventoryButton.fixedToCamera = true;
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

    }
};

module.exports = LevelOne;

},{"../prefabs/healthPack":2,"../prefabs/inventory":3,"../prefabs/player":5,"../prefabs/weapon":6}]},{},[1,2,3,4,5,6,7]);
