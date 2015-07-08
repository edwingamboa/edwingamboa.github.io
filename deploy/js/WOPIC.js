(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'WOPIC');

//Game States
var Boot = require('./states/boot');
var Preloader = require('./states/preloader');
var Menu = require('./states/menu');
var LevelOneState = require('./states/levelOne');

game.state.add('boot', Boot);
game.state.add('preloader', Preloader);
game.state.add('menu', Menu);
game.state.add('levelOne', LevelOneState);
game.state.start('boot');

},{"./states/boot":7,"./states/levelOne":8,"./states/menu":9,"./states/preloader":10}],2:[function(require,module,exports){
var Item = require('./item');

var HealthPack;
HealthPack = function(key, maxIncreasing, gravity, bounce, xPos, yPos, level) {
    Item.call(this, level.game, 'Health Pack');
    Phaser.Sprite.call(this, level.game, xPos, yPos, key);
    this.anchor.set(0.5);
    this.maxIncreasing = maxIncreasing;
    level.game.physics.arcade.enable(this);
    this.body.bounce.y = bounce;
    this.body.gravity.y = gravity;
    this.body.collideWorldBounds = true;
    this.level = level;
    return this;
};

HealthPack.prototype = Object.create(Item.prototype);
HealthPack.prototype.constructor = HealthPack;

HealthPack.prototype.pickUp = function() {
    this.kill();
};

HealthPack.prototype.use = function() {
    this.level.addHealthPack(this);
};

module.exports = HealthPack;

},{"./item":4}],3:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var HealthPack = require('../prefabs/healthPack');

var Inventory = function(level) {
    Phaser.Sprite.call(this, level.game, level.game.camera.width / 2,
        level.game.camera.height / 2, 'inventory_background');
    this.anchor.set(0.5);

    this.healthPackIcon = level.game.make.sprite(-this.width / 2 +
        20, -this.height / 2 + 20, 'healthPack');
    this.healthPackIcon.inputEnabled = true;
    this.healthPackIcon.input.priorityID = 2;
    this.healthPackIcon.events.onInputDown.add(this.useHealthPack, this);

    this.closeButton = level.game.make.sprite(this.width / 2,
        -this.height / 2, 'close');
    this.closeButton.anchor.set(0.5);
    this.closeButton.inputEnabled = true;
    this.closeButton.input.priorityID = 2;
    this.closeButton.events.onInputDown.add(this.close, this);

    this.addChild(this.closeButton);
    this.addChild(this.healthPackIcon);

    this.fixedToCamera = true;
    this.visible = false;

    this.items = [];
    this.level = level;
};

Inventory.prototype = Object.create(Phaser.Sprite.prototype);
Inventory.prototype.constructor = Inventory;

Inventory.prototype.addItem = function(item) {
    this.items.push(item);

    //localStorage.setItem(item.name, foo);
};

Inventory.prototype.showHealthPacks = function() {
    //TODO
};

Inventory.prototype.close = function() {
    this.level.resume();
    this.visible = false;
};

Inventory.prototype.open = function() {
    this.level.pause();
    this.visible = true;
};

Inventory.prototype.useHealthPack = function() {
    this.close();
    this.level.addHealthPack(new HealthPack('healthPack', 10, 300,
        0.7 + Math.random() * 0.2, this.level.player.body.x, 100, this.level));
};
module.exports = Inventory;

},{"../prefabs/healthPack":2}],4:[function(require,module,exports){
var Item;
Item = function(game, type) {
    this.type = type;
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

Player.prototype.increaseHealthLevel = function(increase) {
    this.healthLevel += increase;
    if (this.healthLevel > 100) {
        this.healthLevel = 100;
    }
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
 * Created by Edwin Gamboa on 07/07/2015.
 */
var Boot;
Boot = function(game) {};

Boot.prototype = {
    preload: function() {
        this.load.image('loading', 'assets/images/loading.png');
        this.load.image('load_progress_bar_dark',
            'assets/images/progress_bar_bg.png');
        this.load.image('load_progress_bar',
            'assets/images/progress_bar_fg.png');
    },
    create: function() {
        this.game.input.maxPointers = 1;
        this.game.state.start('preloader');
    }
};

module.exports = Boot;

},{}],8:[function(require,module,exports){
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
        this.xDirection = 1;

        this.player = new Player(this.game, 250, 500, 10, 0.2, 300);
        this.game.add.existing(this.player);
        this.gameObjects.push(this.player);

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

        this.weapons.push(new Weapon(this.game, this.player, 30, 'bullet1', 0,
            400, 100));
        this.weapons.push(new Weapon(this.game, this.player, 40, 'bullet2', 0,
            500, 100));
        for (var i = 1; i < this.weapons.length; i++) {
            this.weapons[i].visible = false;
        }

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
            this.player.healthLevel, {fontSize: '32px', fill: '#000'});
        this.healthLevelText.fixedToCamera = true;

        //Controls
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.changeKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.changeKey.onDown.add(this.nextWeapon, this);

        //Camera
        this.game.renderer.renderSession.roundPixels = true;
        this.game.camera.follow(this.player);

        //Inventory
        this.inventory = new Inventory(this);
        this.game.add.existing(this.inventory);

        this.inventoryButton = this.game.add.button(this.game.camera.width - 50,
            100, 'inventory_button', this.inventory.open, this.inventory);
        this.inventoryButton.anchor.setTo(0.5, 0.5);
        this.inventoryButton.fixedToCamera = true;
        this.inventoryButton.input.priorityID = 1;
    },

    update: function() {
        //Collisions
        this.game.physics.arcade.collide(this.gameObjects, this.platforms);
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

    collectHealthPack: function(player , healthPack) {
        if (this.player.healthLevel !== 100) {
            this.increaseHealthLevel(healthPack.maxIncreasing);
        } else {
            this.inventory.addItem(healthPack);
        }
        healthPack.pickUp();
    },

    increaseHealthLevel: function(increase) {
        this.player.increaseHealthLevel(increase);
        this.healthLevelText.text = 'Health: ' + this.player.healthLevel;
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

},{"../prefabs/healthPack":2,"../prefabs/inventory":3,"../prefabs/player":5,"../prefabs/weapon":6}],9:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 08/07/2015.
 */
var Menu;
Menu = function(game) {};

Menu.prototype = {
    create: function() {
        var newGame = this.game.add.text(this.game.camera.width / 2,
                this.game.camera.height / 2, 'New Game');
        //Font style
        newGame.font = 'Arial';
        newGame.fontSize = 50;
        newGame.fontWeight = 'bold';
        newGame.fill = '#0040FF';
        newGame.anchor.set(0.5);
        newGame.inputEnabled = true;
        newGame.events.onInputDown.add(this.newGame, this);
    },

    newGame: function() {
        this.game.state.start('levelOne');
    }
};

module.exports = Menu;

},{}],10:[function(require,module,exports){
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

},{}]},{},[1,2,3,4,5,6,7,8,9,10]);
