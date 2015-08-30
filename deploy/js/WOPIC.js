(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'WOPIC');

//Game States
var Boot = require('./states/Boot');
var Preloader = require('./states/Preloader');
var Menu = require('./states/Menu');
var LevelOne = require('./states/levels/LevelOne');
var LevelOneIntro = require('./states/levels/LevelOneIntro');

game.state.add('boot', Boot);
game.state.add('preloader', Preloader);
game.state.add('menu', Menu);
game.state.add('levelOne', LevelOne);
game.state.add('levelOneIntro', LevelOneIntro);
game.state.start('boot');

},{"./states/Boot":19,"./states/Menu":20,"./states/Preloader":21,"./states/levels/LevelOne":23,"./states/levels/LevelOneIntro":24}],2:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 08/07/2015.
 */

var SPEED = 150;
var MAX_SPEED = 250;
var INITIAL_HEALTH_LEVEL = 100;
var MAX_HEALTH_LEVEL = 100;
var BOUNCE = 0.2;
var GRAVITY = 300;

/**
 * The Character class handles game characters general behaviour.
 *
 * @param {object} level - represents a game level
 * @param {number} x - character's x coordinate within the world
 * @param {number} y - character's y coordinate within the world
 * @param {string} spriteKey - key that represents the character sprite (preload)
 * @param {object} optionsArgs - character's physic properties
 * @constructor
 */
var Character = function(level, x, y, spriteKey, optionsArgs) {
    Phaser.Sprite.call(this, level.game, x, y, spriteKey);

    var options = optionsArgs || {};
    this.healthLevel = options.healthLevel || INITIAL_HEALTH_LEVEL;
    this.maxHealthLevel = options.maxHealthLevel || MAX_HEALTH_LEVEL;
    this.speed = options.speed || SPEED;
    this.maxSpeed = options.maxSpeed || MAX_SPEED;

    level.game.physics.arcade.enable(this);
    this.body.bounce.y = options.bounce || BOUNCE;
    this.body.gravity.y = options.gravity || GRAVITY;
    this.body.collideWorldBounds = true;
    this.anchor.setTo(0.5, 1);

    this.currentWeaponIndex = 0;

    this.level = level;
    this.weapons = [];
    this.weaponsKeys = [];
};

/**
 * Character class constructor.
 *
 * @type {Phaser.Sprite}
 */
Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

/**
 * Moves the character in the left direction using normal speed.
 */
Character.prototype.moveLeft = function() {
    this.body.velocity.x = -this.speed;
    this.animations.play('left');
};

/**
 * Moves the character in the right direction using normal speed.
 */
Character.prototype.moveRight = function() {
    this.body.velocity.x = this.speed;
    this.animations.play('right');
};

/**
 * Moves the character in the left direction using running speed.
 */
Character.prototype.runLeft = function() {
    this.body.velocity.x = -this.maxSpeed;
    this.animations.play('left');
};

/**
 * Moves the character in the right direction using running speed.
 */
Character.prototype.runRight = function() {
    this.body.velocity.x = this.maxSpeed;
    this.animations.play('right');
};

/**
 * Stops the character and its animations.
 */
Character.prototype.stop = function() {
    this.body.velocity.x = 0;
    this.animations.stop();
    this.frame = 4;
};

/**
 * Determines whether the character's current health level is maxHelathLevel (is
 * full) or not.
 *
 * @returns {boolean}
 */
Character.prototype.fullHealthLevel = function() {
    return this.healthLevel === this.maxHealthLevel;
};

/**
 * Increase the character health level. If after the increasing, the healthLevel
 * is greater than or equal to the maxHealthLevel property, then healthLevel
 * will be maxHealthLevel.
 *
 * @param {number} increase - the amount to increase.
 */
Character.prototype.increaseHealthLevel = function(increase) {
    this.healthLevel += increase;
    if (this.healthLevel > this.maxHealthLevel) {
        this.healthLevel = this.maxHealthLevel;
    }
};

/**
 * Decrease the character health level. If after the decreasing, the healthLevel
 * is lees than or equal to 0, then character and its elements will be killed.
 *
 * @param {number} decrease - the amount to decrease.
 */
Character.prototype.decreaseHealthLevel = function(decrease) {
    this.healthLevel -= decrease;
    if (this.healthLevel <= 0) {
        this.killCharacter();
    }
};

/**
 * Kill the character and his elements.
 */
Character.prototype.killCharacter = function() {
    for (var weaponKey in this.weapons) {
        this.weapons[weaponKey].killWeapon();
    }
    this.kill();
};

/**
 * Set the character health level.
 *
 * @param {number} healthLevel - the new caharacter's healthLevel.
 */
Character.prototype.setHealthLevel = function(healthLevel) {
    this.healthLevel = healthLevel;
};

/**
 * Updates player's current weapon, the old weapon is killed (out of stage) and
 * the new one is shown on screen. If the new one is a weapon that was killed,
 * then it is revived and shown on screen.
 *
 * @param {string} weaponKey - new current weapon's key
 */
Character.prototype.updateCurrentWeapon = function(weaponKey) {
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.kill();
    }
    this.currentWeapon = this.weapons[weaponKey];
    if (!this.currentWeapon.alive) {
        this.currentWeapon.revive();
    }
    this.level.game.add.existing(this.currentWeapon);
};

/**
 * Changes player's current weapon, to the nest one in the weapons array.
 * Updates currentWeaponIndex property.
 */
Character.prototype.nextWeapon = function() {
    this.currentWeaponIndex++;
    if (this.currentWeaponIndex === this.weaponsKeys.length) {
        this.currentWeaponIndex = 0;
    }
    this.updateCurrentWeapon(this.weaponsKeys[this.currentWeaponIndex]);
};

/**
 * Add a new weapon to character's weapons.
 *
 * @param {object} newWeapon - the weapon to be added.
 */
Character.prototype.addWeapon = function(newWeapon) {
    this.weapons[newWeapon.key] = newWeapon;
    this.weaponsKeys.push(newWeapon.key);
};

/**
 * Fires the current weapon if it is defined
 * @param {number} x - x coordinate on the point to fire
 * @param {number} y - y coordinate on the point to fire
 */
Character.prototype.fireToXY = function(x, y) {
    this.currentWeapon.fire(x, y);
};

/**
 * Lets to relocate the character on the given coordinates
 * @param {number} x - x coordinate to be relocated
 * @param {number} y - y coordinate to be relocated
 */
Character.prototype.relocate = function(x, y) {
    this.x = x;
    this.y = y;
};

module.exports = Character;

},{}],3:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 08/07/2015.
 */
var Character = require('../character/Character');

var Enemy = function(level,
                     spriteKey,
                     maxHealthLevel,
                     x,
                     y,
                     minRangeDetection,
                     maxRangeDetection,
                     minRangeAttack,
                     maxRangeAttack) {
    var options = {
        healthLevel : maxHealthLevel,
        maxHealthLevel : maxHealthLevel
    };
    Character.call(this, level, x, y, spriteKey, options);
    this.animations.add('left', [0, 1], 10, true);
    this.animations.add('right', [2, 3], 10, true);
    this.healthLevelText = level.game.add.text(this.body.x, this.body.y - 20,
        '' + this.healthLevel, {fontSize: '12px', fill: '#000'});
    this.rangeDetection = level.game.rnd.integerInRange(minRangeDetection,
        maxRangeDetection);
    this.rangeAttack = level.game.rnd.integerInRange(minRangeAttack,
        maxRangeAttack);
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
    this.currentWeapon.updateCoordinates(this.x + 20, this.y - 20);
};

Enemy.prototype.updateHealhtLevelText = function() {
    if (this.healthLevel > 0) {
        this.healthLevelText.text = '' + this.healthLevel;
    }
};

Enemy.prototype.killCharacter = function() {
    this.healthLevel = 0;
    this.healthLevelText.text = '';
    this.level.player.increaseScore(this.maxHealthLevel * 0.1);
    Character.prototype.killCharacter.call(this);
};

Enemy.prototype.rotateWeapon = function(x, y) {
    this.currentWeapon.rotation =
        this.level.game.physics.arcade.angleToXY(this, x, y);
};

module.exports = Enemy;

},{"../character/Character":2}],4:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 16/07/2015.
 */
var Character = require('../character/Character');

var NPC;
NPC = function(level, x, y, key, comicKey) {
    Character.call(this, level, x, y, key);
    this.comicKey = comicKey;
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);
};

NPC.prototype = Object.create(Character.prototype);
NPC.prototype.constructor = NPC;

module.exports = NPC;

},{"../character/Character":2}],5:[function(require,module,exports){
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var SPEED = 250;
var MAX_SPEED = 300;
var GRAVITY = 300;
var Character = require('../character/Character');

var MINIMUM_SCORE = 10;
var Player;
Player = function(level) {
    var options = {speed : SPEED, maxSpeed : MAX_SPEED};
    Character.call(this, level, 32, level.game.world.height - 150,
        'character', options);
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);
    this.score = MINIMUM_SCORE;
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

Player.prototype.updateHealhtLevelText = function() {
    this.level.updateHealthLevelText();
};

Player.prototype.update = function() {
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.rotation =
            this.level.game.physics.arcade.angleToPointer(this);
        this.currentWeapon.updateCoordinates(this.x, this.y - 10);
    }
};

Player.prototype.killCharacter = function() {

    Character.prototype.killCharacter.call(this);
};

Player.prototype.pickUpWeapon = function(weapon) {
    if (this.weapons[weapon.key] === undefined) {
        this.addWeapon(weapon);
        this.updateCurrentWeapon(weapon.key);
    }else {
        //weapon.kill();
        this.weapons[weapon.key].addBullets(weapon.numberOfBullets);
    }
};

Player.prototype.changeSpeed = function(speed, maxSpeed) {
    this.speed = speed;
    this.maxSpeed = maxSpeed;
};

Player.prototype.resetSpeed = function() {
    this.speed = SPEED;
    this.maxSpeed = MAX_SPEED;
};

Player.prototype.changeGravity = function(gravity) {
    this.body.gravity.y = gravity;
};

Player.prototype.resetGravity = function() {
    this.body.gravity.y = GRAVITY;
};

module.exports = Player;

},{"../character/Character":2}],6:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 23/07/2015.
 */
var Enemy = require('../character/Enemy');
var Revolver = require('../weapons/Revolver');

var SPRITE_KEY = 'simple_enemy';
var MAX_HEALTH_LEVEL = 5;
var MIN_RANGE_DETECTION = 500;
var MIN_RANGE_ATTACK = 100;
var MAX_RANGE_DETECTION = 700;
var MAX_RANGE_ATTACK = 300;

var SimpleEnemy = function(level, x, y) {
    Enemy.call(this,
        level,
        SPRITE_KEY,
        MAX_HEALTH_LEVEL,
        x,
        y,
        MIN_RANGE_DETECTION,
        MAX_RANGE_DETECTION,
        MIN_RANGE_ATTACK,
        MAX_RANGE_ATTACK);

    this.addWeapon(new Revolver(this, x, y, true));
    this.updateCurrentWeapon('simpleWeapon');
};

SimpleEnemy.prototype = Object.create(Enemy.prototype);
SimpleEnemy.prototype.constructor = SimpleEnemy;

module.exports = SimpleEnemy;

},{"../character/Enemy":3,"../weapons/Revolver":15}],7:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 23/07/2015.
 */
var Enemy = require('../character/Enemy');
var MachineGun = require('../weapons/MachineGun');

var SPRITE_KEY = 'strong_enemy';
var MAX_HEALTH_LEVEL = 150;
var MIN_RANGE_DETECTION = 1000;
var MIN_RANGE_ATTACK = 600;
var MAX_RANGE_DETECTION = 1000;
var MAX_RANGE_ATTACK = 600;

var StrongEnemy = function(level, x, y) {
    Enemy.call(
        this,
        level,
        SPRITE_KEY,
        MAX_HEALTH_LEVEL,
        x,
        y,
        MIN_RANGE_DETECTION,
        MAX_RANGE_DETECTION,
        MIN_RANGE_ATTACK,
        MAX_RANGE_ATTACK
    );

    this.addWeapon(new MachineGun(this, x, y, true));
    this.updateCurrentWeapon('strongWeapon');
};

StrongEnemy.prototype = Object.create(Enemy.prototype);
StrongEnemy.prototype.constructor = StrongEnemy;

module.exports = StrongEnemy;

},{"../character/Enemy":3,"../weapons/MachineGun":14}],8:[function(require,module,exports){
var HealthPack;
HealthPack = function(key,
                      maxIncreasing,
                      gravity,
                      bounce,
                      xPos,
                      yPos,
                      level) {
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

HealthPack.prototype = Object.create(Phaser.Sprite.prototype);
HealthPack.prototype.constructor = HealthPack;

HealthPack.prototype.pickUp = function() {
    this.kill();
};

HealthPack.prototype.use = function() {
    if (!this.alive) {
        this.revive();
    }
    this.x = this.level.player.x;
    this.level.addHealthPack(this);
};

module.exports = HealthPack;

},{}],9:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var PopUp = require('../util/PopUp');
var ItemGroupView = require('../inventory/ItemGroupView');

var Inventory = function(level) {
    PopUp.call(this, level, 'inventory_background');
    this.anchor.set(0.5, 0.5);

    this.level = level;

    this.healthPacks = [];
    this.items = [];
    this.createItemGroups();
};

Inventory.prototype = Object.create(PopUp.prototype);
Inventory.prototype.constructor = Inventory;

Inventory.prototype.addHealthPack = function(healthPack) {
    if (healthPack.maxIncreasing == 5) {
        this.healthPack5Group.amountAvailable ++;
        this.healthPack5Group.updateAmountAvailableText();
    }else if (healthPack.maxIncreasing == 20) {
        this.healthPacks[1]++;
    }else {
        this.healthPacks[2]++;
    }
};

Inventory.prototype.addItem = function(item) {
    if (this.items[item.key].item === undefined) {
        this.items[item.key].setItem(item);
    }
    this.items[item.key].amountAvailable ++;
    this.items[item.key].updateAmountAvailableText();
};

Inventory.prototype.createItemGroups = function() {
    this.items.healthPack5 = new ItemGroupView(this.level,
        -this.width / 2 + 20, -this.height / 2 + 20, 'healthPack5', this);
    this.addChild(this.items.healthPack5);

    this.items.simpleWeapon = new ItemGroupView(this.level,
        -this.width / 2 + 20, -this.height / 2 + 200, 'simpleWeapon', this);
    this.addChild(this.items.simpleWeapon);
};

Inventory.prototype.showHealthPacks = function() {
    //TODO
};

module.exports = Inventory;

},{"../inventory/ItemGroupView":11,"../util/PopUp":12}],10:[function(require,module,exports){
var Item;
Item = function(game, type) {
    this.type = type;
};

Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;

module.exports = Item;

},{}],11:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 17/07/2015.
 */
var ItemGroupView;
ItemGroupView = function(level, x, y, imageKey, inventory) {
    Phaser.Sprite.call(this, level.game, x, y, 'itemGroupBackGround');
    this.healthPackIcon = level.game.make.sprite(this.width / 2,
        this.height / 2, imageKey);
    this.healthPackIcon.anchor.set(0.5, 0.5);
    this.useOneButton = level.game.make.sprite(this.width - 10,
        this.height - 20, 'useOneButton');
    this.useOneButton.anchor.set(1, 0.5);
    this.useOneButton.inputEnabled = true;
    this.useOneButton.input.priorityID = 2;
    this.useOneButton.events.onInputDown.add(this.useItem, this);

    this.amountAvailable = 0;
    this.amountAvailableText = level.game.make.text(10,
        this.height - 20, '' + this.amountAvailable);
    //Font style
    this.amountAvailableText.font = 'Arial';
    this.amountAvailableText.fontSize = 30;
    this.amountAvailableText.fontWeight = 'bold';
    this.amountAvailableText.fill = '#0040FF';
    this.amountAvailableText.anchor.set(0, 0.5);

    this.addChild(this.healthPackIcon);
    this.addChild(this.useOneButton);
    this.addChild(this.amountAvailableText);

    this.inventory = inventory;
};

ItemGroupView.prototype = Object.create(Phaser.Sprite.prototype);
ItemGroupView.prototype.constructor = ItemGroupView;

ItemGroupView.prototype.setItem = function(item) {
    this.item = item;
};

ItemGroupView.prototype.useItem = function() {
    if (this.amountAvailable > 0) {
        this.item.use();
        this.amountAvailable --;
        this.updateAmountAvailableText();
        this.inventory.close();
    }
};

ItemGroupView.prototype.updateAmountAvailableText = function() {
    this.amountAvailableText.text = '' + this.amountAvailable;
};

module.exports = ItemGroupView;

},{}],12:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 16/07/2015.
 */
var PopUp = function(level, backgroundKey) {
    Phaser.Sprite.call(this, level.game, level.game.camera.width / 2,
        level.game.camera.height / 2, backgroundKey);

    this.bringToTop();
    this.anchor.set(0.5);

    this.openDoorButton = level.game.make.sprite(this.width / 2,
        -this.height / 2, 'close');
    this.openDoorButton.anchor.set(0.5);
    this.openDoorButton.inputEnabled = true;
    this.openDoorButton.input.priorityID = 2;
    this.openDoorButton.events.onInputDown.add(this.close, this);

    this.addChild(this.openDoorButton);

    this.fixedToCamera = true;
    this.visible = false;

    this.level = level;
};

PopUp.prototype = Object.create(Phaser.Sprite.prototype);
PopUp.prototype.constructor = PopUp;

PopUp.prototype.close = function() {
    this.level.resume();
    this.visible = false;
};

PopUp.prototype.open = function() {
    this.level.pause();
    this.visible = true;
};

module.exports = PopUp;

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 23/07/2015.
 */
var Weapon = require('../weapons/Weapon');

var MACHINE_GUN_NUMBER_OF_BULLETS = 30;
var MACHINE_GUN_KEY = 'strongWeapon';
var MACHINE_GUN_BULLET_KEY = 'bullet2';
var MACHINE_GUN_NEXT_FIRE = 1;
var MACHINE_GUN_BULLET_SPEED = 700;
var MACHINE_GUN_FIRE_RATE = 100;
var MACHINE_GUN_BULLET_POWER = 10;

var MachineGun = function(level, x, y, inifinite) {
    Weapon.call(this,
        level,
        x,
        y,
        MACHINE_GUN_NUMBER_OF_BULLETS,
        MACHINE_GUN_KEY,
        MACHINE_GUN_BULLET_KEY,
        MACHINE_GUN_NEXT_FIRE,
        MACHINE_GUN_BULLET_SPEED,
        MACHINE_GUN_FIRE_RATE,
        MACHINE_GUN_BULLET_POWER,
        inifinite
    );
};

MachineGun.prototype = Object.create(Weapon.prototype);
MachineGun.prototype.constructor = MachineGun;

module.exports = MachineGun;

},{"../weapons/Weapon":16}],15:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 23/07/2015.
 */
var Weapon = require('../weapons/Weapon');

var REVOLVER_NUMBER_OF_BULLETS = 20;
var REVOLVER_KEY = 'simpleWeapon';
var REVOLVER_BULLET_KEY = 'bullet1';
var REVOLVER_NEXT_FIRE = 50;
var REVOLVER_BULLET_SPEED = 700;
var REVOLVER_FIRE_RATE = 50;
var REVOLVER_BULLET_POWER = 1;

var Revolver = function(level, x, y, inifinite) {
    Weapon.call(this,
        level,
        x,
        y,
        REVOLVER_NUMBER_OF_BULLETS,
        REVOLVER_KEY,
        REVOLVER_BULLET_KEY,
        REVOLVER_NEXT_FIRE,
        REVOLVER_BULLET_SPEED,
        REVOLVER_FIRE_RATE,
        REVOLVER_BULLET_POWER,
        inifinite
    );
};

Revolver.prototype = Object.create(Weapon.prototype);
Revolver.prototype.constructor = Revolver;

module.exports = Revolver;

},{"../weapons/Weapon":16}],16:[function(require,module,exports){
var Bullet = require('../weapons/Bullet');
var Weapon = function(level,
                  x,
                  y,
                  numberOfBullets,
                  weaponKey,
                  bulletKey,
                  nextFire,
                  bulletSpeed,
                  fireRate,
                  power,
                  infinite) {
    Phaser.Sprite.call(this, level.game, x, y, weaponKey);

    level.game.physics.arcade.enable(this);
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

Weapon.prototype.updateCoordinates = function(x, y) {
    this.x = x;
    this.y = y;
};

Weapon.prototype.use = function() {
    if (!this.alive) {
        this.revive();
    }
    //this.level.addHealthPack(this);
};

Weapon.prototype.addBullets = function(amount) {
    this.numberOfBullets += amount;
};

Weapon.prototype.killWeapon = function() {
    this.bullets.removeAll();
    this.kill();

};

module.exports = Weapon;

},{"../weapons/Bullet":13}],17:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 29/08/2015.
 */
var PopUp = require('../util/PopUp');

var DEFAULT_CAR_SPEED = 400;
var DEFAULT_CAR_MAX_SPEED = 500;
var CAR_GRAVITY = 30000;

var InteractiveCar = function(level, x, y, backgroundKey) {
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);

    this.anchor.set(0, 0);

    this.getOnButton = level.game.make.sprite(this.width / 2,
        -this.height, 'openDoor');
    this.getOnButton.anchor.set(0.5);
    this.getOnButton.inputEnabled = true;
    this.getOnButton.input.priorityID = 2;
    this.getOnButton.events.onInputDown.add(this.getOn, this);

    this.addChild(this.getOnButton);

    level.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.anchor.set(0, 1);

    this.level = level;
    this.occupied = false;
};

InteractiveCar.prototype = Object.create(Phaser.Sprite.prototype);
InteractiveCar.prototype.constructor = InteractiveCar;

InteractiveCar.prototype.getOn = function() {
    this.level.player.relocate(this.x, this.y - 10);
    this.level.player.changeSpeed(DEFAULT_CAR_SPEED, DEFAULT_CAR_MAX_SPEED);
    this.level.player.changeGravity(CAR_GRAVITY);
    this.occupied = true;
};

InteractiveCar.prototype.update = function() {
    if (this.occupied) {
        this.x = this.level.player.x;
        //this.y = this.level.player.y;
    }
};

module.exports = InteractiveCar;

},{"../util/PopUp":12}],18:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 29/08/2015.
 */
var PopUp = require('../util/PopUp');
var InteractiveHouse = function(level, x, y, backgroundKey) {
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);

    this.anchor.set(0, 0);

    this.openDoorButton = level.game.make.sprite(this.width / 2,
        -this.height / 2, 'openDoor');
    this.openDoorButton.anchor.set(0.5);
    this.openDoorButton.inputEnabled = true;
    this.openDoorButton.input.priorityID = 2;
    this.openDoorButton.events.onInputDown.add(this.openActivity, this);

    this.addChild(this.openDoorButton);
    this.level = level;
};

InteractiveHouse.prototype = Object.create(Phaser.Sprite.prototype);
InteractiveHouse.prototype.constructor = InteractiveHouse;

InteractiveHouse.prototype.openActivity = function() {
    var popUp = new PopUp(this.level, 'working');
    this.level.game.add.existing(popUp);
    popUp.open();
};

module.exports = InteractiveHouse;

},{"../util/PopUp":12}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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
        this.game.state.start('levelOneIntro');
    }
};

module.exports = Menu;

},{}],21:[function(require,module,exports){
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
        //Level assets
        this.game.load.image('ground', 'assets/images/platform.png');
        this.game.load.image('healthPack5', 'assets/images/healthPack5.png');
        this.game.load.image('healthPack20', 'assets/images/healthPack20.png');
        this.game.load.image('healthPack50', 'assets/images/healthPack50.png');
        this.game.load.image('useOneButton', 'assets/images/useOneButton.png');
        this.game.load.image('inventory_button', 'assets/images/inventory.png');
        this.game.load.image('inventory_background',
            'assets/images/inventoryBackground.png');
        this.game.load.image('close', 'assets/images/close.png');
        this.game.load.image('itemGroupBackGround',
            'assets/images/itemGroupBackGround.png');
        this.game.load.spritesheet('character', 'assets/sprites/character.png',
            32, 48);
        this.game.load.spritesheet('npc', 'assets/sprites/npc.png',
            32, 48);
        this.game.load.spritesheet('friend', 'assets/sprites/npc.png',
            32, 48);
        this.game.load.spritesheet('simple_enemy',
            'assets/sprites/simple_enemy.png', 32, 32);
        this.game.load.spritesheet('strong_enemy',
            'assets/sprites/strong_enemy.png', 64, 64);
        for (var i = 1; i <= 2; i++) {
            this.game.load.image('bullet' + i, 'assets/images/bullet' + i +
                '.png');
        }
        this.game.load.image('simpleWeapon',
            'assets/images/revolver.png');
        this.game.load.image('strongWeapon',
            'assets/images/machineGun.png');
        this.game.load.image('comic1', 'assets/images/comic1.png');
        this.game.load.image('comic2', 'assets/images/comic2.png');
        this.game.load.image('introLevelOne',
            'assets/images/introLevelOne.png');
        this.game.load.image('house', 'assets/images/house.png');
        this.game.load.image('openDoor', 'assets/images/openDoor.png');
        this.game.load.image('working', 'assets/images/working.png');
        this.game.load.image('jeep', 'assets/images/jeep.png');
    },

    update: function() {
        if (!!this.ready) {
            //this.game.state.start('menu');
            this.game.state.start('levelOne');
        }
    },

    onLoadComplete: function() {
        this.ready = true;
    }
};

module.exports = Preloader;

},{}],22:[function(require,module,exports){
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
var InteractiveCar = require ('../../prefabs/worldElements/InteractiveCar');

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
    character.updateHealhtLevelText();
    bullet.kill();
};

Level.prototype.collectWeapon = function(player, weapon) {
    this.weapons.remove(weapon);
    this.player.pickUpWeapon(weapon);
    this.updateAmmoText();
};

Level.prototype.crashEnemy = function(car, enemy) {
    enemy.killCharacter();
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

},{"../../prefabs/character/NPC":4,"../../prefabs/character/Player":5,"../../prefabs/character/SimpleEnemy":6,"../../prefabs/character/StrongEnemy":7,"../../prefabs/inventory/HealthPack":8,"../../prefabs/inventory/Inventory":9,"../../prefabs/util/PopUp":12,"../../prefabs/weapons/MachineGun":14,"../../prefabs/weapons/Revolver":15,"../../prefabs/worldElements/InteractiveCar":17}],23:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 22/07/2015.
 */
var Level = require ('../levels/Level');
var InteractiveHouse = require ('../../prefabs/worldElements/InteractiveHouse');

var CHECK_POINT_X_ONE;
var CHECK_POINTS_DISTANCE;

var LevelOne = function(game) {
    Level.call(this, game);
};

LevelOne.prototype = Object.create(Level.prototype);
LevelOne.prototype.constructor = LevelOne;

LevelOne.prototype.create = function() {
    Level.prototype.create.call(this);
    CHECK_POINT_X_ONE = this.game.camera.width * 1.7;
    CHECK_POINTS_DISTANCE = this.game.camera.width;
    this.addNPCs();
    this.addEnemies();
    this.addObjects();
    this.addRevolver(2000, 400, false);
    this.addMachineGun(2400, 400, false);
    this.player.bringToTop();
};

LevelOne.prototype.addObjects = function() {
    var friendsHouse = new InteractiveHouse(
        this,
        CHECK_POINT_X_ONE + 1.5 * CHECK_POINTS_DISTANCE,
        this.GROUND_HEIGHT,
        'house'
    );
    friendsHouse.anchor.set(0, 1);
    this.addObject(friendsHouse);
    this.addCar(CHECK_POINT_X_ONE + 2 * CHECK_POINTS_DISTANCE, 'jeep');
};

LevelOne.prototype.addNPCs = function() {
    this.addNPC(this.game.camera.width / 2, 'npc', 'comic1');
    this.addNPC(CHECK_POINT_X_ONE + CHECK_POINTS_DISTANCE, 'friend', 'comic2');
};

LevelOne.prototype.addEnemies = function() {
    var x = CHECK_POINT_X_ONE;
    var y = 350;
    for (var i = 0; i < 5; i++) {
        x += 30;
        this.addSimpleEnemy(x, y);
    }
};

module.exports = LevelOne;

},{"../../prefabs/worldElements/InteractiveHouse":18,"../levels/Level":22}],24:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 29/08/2015.
 */
/**
 * Created by Edwin Gamboa on 22/07/2015.
 */
var LevelOneIntro = function(game) {};

LevelOneIntro.prototype = {
    create: function() {
        var centerX = this.game.camera.width / 2;
        var centerY = this.game.camera.height / 2;

        this.background = this.game.add.sprite(centerX, centerY,
            'introLevelOne');
        this.background.anchor.setTo(0.5, 0.5);

        var continueButton = this.game.add.text(
            this.game.camera.width - 80,
            this.game.camera.height - 30,
            'Continue');
        //Font style
        continueButton.font = 'Arial';
        continueButton.fontSize = 30;
        continueButton.fontWeight = 'bold';
        continueButton.fill = '#0040FF';
        continueButton.anchor.set(0.5);
        continueButton.inputEnabled = true;
        continueButton.events.onInputDown.add(this.continue, this);
    },

    continue: function() {
        this.game.state.start('levelOne');
    }
};

module.exports = LevelOneIntro;

},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);
