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

},{"./states/boot":10,"./states/levelOne":11,"./states/menu":12,"./states/preloader":13}],2:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 10/07/2015.
 */
var Bullet;
Bullet = function(level, power, imageKey) {
    Phaser.Sprite.call(this, level.game, 0, 0, imageKey);
    this.power = power;

    level.game.physics.arcade.enable(this);
    this.anchor.setTo(0, 0.5);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;
};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

module.exports = Bullet;

},{}],3:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 08/07/2015.
 */
var Character;
Character = function(level, x, y, spriteKey, speed, runningSpeed,
                      maxHealthLevel, bounce, gravity, target) {
    Phaser.Sprite.call(this, level.game, x, y, spriteKey);
    this.speed = speed;
    this.runningSpeed = runningSpeed;
    this.healthLevel = maxHealthLevel;
    this.maxHealthLevel = maxHealthLevel;

    level.game.physics.arcade.enable(this);
    this.body.bounce.y = bounce;
    this.body.gravity.y = gravity;
    this.body.collideWorldBounds = true;
    this.anchor.setTo(0.5, 0.5);

    this.level = level;
    this.weapons = [];
    this.currentWeaponIndex = 0;
    this.target = target;
};

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

Character.prototype.moveLeft = function() {
    this.body.velocity.x = -this.speed;
    this.animations.play('left');
};

Character.prototype.moveRight = function() {
    this.body.velocity.x = this.speed;
    this.animations.play('right');
};

Character.prototype.runLeft = function() {
    this.body.velocity.x = -this.runningSpeed;
    this.animations.play('left');
};

Character.prototype.runRight = function() {
    this.body.velocity.x = this.runningSpeed;
    this.animations.play('right');
};

Character.prototype.stop = function() {
    this.body.velocity.x = 0;
    this.animations.stop();
    this.frame = 4;
};

Character.prototype.fullHealthLevel = function() {
    return this.healthLevel === this.maxHealthLevel;
};

Character.prototype.increaseHealthLevel = function(increase) {
    this.healthLevel += increase;
    if (this.healthLevel > this.maxHealthLevel) {
        this.healthLevel = this.maxHealthLevel;
    }
};

Character.prototype.decreaseHealthLevel = function(decrease) {
    this.healthLevel -= decrease;
    if (this.healthLevel <= 0) {
        for (var i = 0; i < this.weapons.length; i++) {
            this.weapons[i].bullets.removeAll();
            this.weapons[i].kill();
        }
        this.kill();
    }
};

Character.prototype.updateCurrentWeapon = function() {
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.kill();
    }
    this.currentWeapon = this.weapons[this.currentWeaponIndex];
    if (!this.currentWeapon.alive) {
        this.currentWeapon.revive();
    }
    this.level.game.add.existing(this.currentWeapon);
};

Character.prototype.nextWeapon = function() {
    this.currentWeaponIndex++;
    if (this.currentWeaponIndex === this.weapons.length) {
        this.currentWeaponIndex = 0;
    }
    this.updateCurrentWeapon();
};

module.exports = Character;

},{}],4:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 08/07/2015.
 */
var Character = require('../prefabs/character');

var Enemy;
Enemy = function(level, spriteKey, maxHealthLevel, x, y, target,
                 rangeDetection, rangeAttack) {
    Character.call(this, level, x, y, spriteKey, 250,
        500, maxHealthLevel, 0.2, 300, target);
    this.animations.add('left', [0, 1], 10, true);
    this.animations.add('right', [2, 3], 10, true);
    this.healthLevelText = level.game.add.text(this.body.x, this.body.y - 20,
        '' + this.healthLevel, {fontSize: '12px', fill: '#000'});
    this.rangeDetection = rangeDetection;
    this.rangeAttack = rangeAttack;
};

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
    if (this.body.velocity.x > 0) {
        this.animations.play('right');

    }else if (this.body.velocity.x < 0) {
        this.animations.play('left');
    }
    this.healthLevelText.x = this.body.x;
    this.healthLevelText.y = this.body.y - 20;
    this.currentWeapon.rotation = this.level.game.physics.arcade.angleBetween(
        this, this.target);
};

Enemy.prototype.updateHealhtLevel = function() {
    if (this.healthLevel > 0) {
        this.healthLevelText.text = '' + this.healthLevel;
    }else {
        this.healthLevelText.text = '';
        this.level.player.increaseScore(this.maxHealthLevel * 0.1);
    }
};

module.exports = Enemy;

},{"../prefabs/character":3}],5:[function(require,module,exports){
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

},{"./item":7}],6:[function(require,module,exports){
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

},{"../prefabs/healthPack":5}],7:[function(require,module,exports){
var Item;
Item = function(game, type) {
    this.type = type;
};

Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;

module.exports = Item;

},{}],8:[function(require,module,exports){
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Character = require('../prefabs/character');

var Player;
Player = function(level, startingScore, target) {
    Character.call(this, level, 32, level.game.world.height - 150,
        'character', 250, 500, 100, 0.2, 300, target);
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);
    this.score = startingScore;
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

Player.prototype.jump = function() {
    this.body.velocity.y = -350;
};

Player.prototype.crouch = function() {
    this.animations.stop();
    this.frame = 9;
};

Player.prototype.increaseScore = function(increase) {
    this.score += increase;
    this.level.updateScoreText();
};

Player.prototype.decreaseScore = function(decrease) {
    this.score += decrease;
    this.level.updateScoreText();
};

Player.prototype.updateHealhtLevel = function() {
    this.level.updateHealthLevelText();
};

Player.prototype.update = function() {
    this.currentWeapon.rotation = this.level.game.physics.arcade.angleToPointer(
        this);
};

module.exports = Player;

},{"../prefabs/character":3}],9:[function(require,module,exports){
var Bullet = require('../prefabs/bullet');
var Weapon;
Weapon = function(level, owner, numberOfBullets, weaponKey, bulletKey, nextFire,
                  bulletSpeed, fireRate, power, infinite) {
    Phaser.Sprite.call(this, level.game, owner.x , owner.y, weaponKey);

    this.anchor.set(0.1, 0.5);

    this.numberOfBullets = numberOfBullets;
    this.power = power;
    this.bullets = level.game.add.group();

    for (var i = 0; i < this.numberOfBullets; i++) {
        this.bullets.add(new Bullet(level, power, bulletKey));
    }

    this.nextFire = nextFire;
    this.bulletSpeed = bulletSpeed;
    this.fireRate = fireRate;
    this.level = level;
    this.infinite = infinite;
    this.owner = owner;
};

Weapon.prototype = Object.create(Phaser.Sprite.prototype);
Weapon.prototype.constructor = Weapon;

Weapon.prototype.fire = function(toX, toY) {
    if (this.level.game.time.now > this.nextFire &&
        (this.infinite || this.numberOfBullets > 0)) {
        this.currentBullet = this.bullets.getFirstExists(false);
        if (this.currentBullet) {
            this.currentBullet.reset(this.x, this.y);
            this.currentBullet.rotation =
                this.level.game.physics.arcade.angleToXY(this.currentBullet,
                toX, toY);
            this.currentBullet.body.velocity.x =
                Math.cos(this.currentBullet.rotation) * this.bulletSpeed;
            this.currentBullet.body.velocity.y =
                Math.sin(this.currentBullet.rotation) * this.bulletSpeed;
            this.nextFire = this.level.game.time.now + this.fireRate;
            this.numberOfBullets--;
        }
    }
};

Weapon.prototype.update = function() {
    this.x = this.owner.x;
    this.y = this.owner.y;
};

module.exports = Weapon;

},{"../prefabs/bullet":2}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{"../prefabs/enemy":4,"../prefabs/healthPack":5,"../prefabs/inventory":6,"../prefabs/player":8,"../prefabs/weapon":9}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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
        this.game.load.spritesheet('simple_enemy',
            'assets/sprites/simple_enemy.png', 32, 32);
        this.game.load.spritesheet('strong_enemy',
            'assets/sprites/strong_enemy.png', 64, 64);
        for (var i = 1; i <= 2; i++) {
            this.game.load.image('bullet' + i, 'assets/images/bullet' + i +
                '.png');
        }
        this.game.load.image('weapon', 'assets/images/weapon.png');
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

},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13]);
