(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 08/07/2015.
 */
/**
 * Default speed for any character
 * @constant
 * @type {number}
 * @default
 */
var SPEED = 150;
/**
 * Default greatest speed for any character
 * @constant
 * @type {number}
 * @default
 */
var MAX_SPEED = 250;
/**
 * Default initial health level for any character
 * @constant
 * @type {number}
 * @default
 */
var INITIAL_HEALTH_LEVEL = 100;
/**
 * Default greatest health level for any character
 * @constant
 * @type {number}
 * @default
 */
var MAX_HEALTH_LEVEL = 100;
/**
 * Default bounce value for any character
 * @constant
 * @type {number}
 * @default
 */
var BOUNCE = 0.2;
/**
 * Default gravity value for aby character.
 * @constant
 * @type {number}
 * @default
 */
var GRAVITY = 300;

/**
 * Handles game characters general behaviour.
 * @class Character
 * @extends Phaser.Sprite
 * @constructor
 * @param {number} x - Character's x coordinate within the world.
 * @param {number} y - Character's y coordinate within the world.
 * @param {string} spriteKey - Key that represents the character sprite.
 * @param {Object} [optionals] - Character's physic properties.
 * @param {Object} [optionals.healthLevel = INITIAL_HEALTH_LEVEL] - Character's
 * initial health level, when it is 100 at the beginning of a level.
 * @param {Object} [optionals.maxHealthLevel = MAX_HEALTH_LEVEL] - Character's
 * greatest health level, use to increase health level till this number.
 * @param {Object} [optionals.speed = SPEED] - Character's speed, is used when
 * he walks.
 * @param {Object} [optionals.maxSpeed = MAX_SPEED] - Character's maximal speed,
 * it is used when he runs.
 */
var Character = function(x, y, spriteKey, optionals) {
    Phaser.Sprite.call(this, level.game, x, y, spriteKey);

    var options = optionals || {};
    this.healthLevel = options.healthLevel || INITIAL_HEALTH_LEVEL;
    this.maxHealthLevel = options.maxHealthLevel || MAX_HEALTH_LEVEL;
    this.speed = options.speed || SPEED;
    this.maxSpeed = options.maxSpeed || MAX_SPEED;

    level.game.physics.arcade.enable(this);
    this.body.bounce.y = options.bounce || BOUNCE;
    this.body.gravity.y = options.gravity || GRAVITY;
    this.body.collideWorldBounds = true;
    this.anchor.setTo(0.5, 0.5);

    this.currentWeaponIndex = 0;

    this.weapons = [];
    this.weaponsKeys = [];
    this.onVehicle = false;
    this.canFire = true;
};

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

/**
 * Moves the character in the left direction using normal speed.
 * @method Character.moveLeft
 */
Character.prototype.moveLeft = function() {
    this.body.velocity.x = -this.speed;
    if (!this.onVehicle) {
        this.animations.play('left');
    }else {
        this.frame = this.stopLeftFrameIndex;
    }
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.pointToLeft();
    }
};

/**
 * Moves the character in the right direction using normal speed.
 * @method Character.moveRight
 */
Character.prototype.moveRight = function() {
    this.body.velocity.x = this.speed;
    if (!this.onVehicle) {
        this.animations.play('right');
    }else {
        this.frame = this.stopRightFrameIndex;
    }
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.pointToRight();
    }
};

/**
 * Moves the character in the left direction using running speed.
 * @method Character.runLeft
 */
Character.prototype.runLeft = function() {
    this.body.velocity.x = -this.maxSpeed;
    if (!this.onVehicle) {
        this.animations.play('left');
    }else {
        this.frame = this.stopLeftFrameIndex;
    }
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.pointToLeft();
    }
};

/**
 * Moves the character in the right direction using running speed.
 * @method Character.runRight
 */
Character.prototype.runRight = function() {
    this.body.velocity.x = this.maxSpeed;
    if (!this.onVehicle) {
        this.animations.play('right');
    }else {
        this.frame = this.stopRightFrameIndex;
    }
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.pointToRight();
    }
};

/**
 * Stops the character and its animations.
 * @method Character.stop
 */
Character.prototype.stop = function() {
    this.body.velocity.x = 0;
    this.animations.stop();
    if (level.xDirection > 0) {
        this.frame = this.stopRightFrameIndex;
    }else {
        this.frame = this.stopLeftFrameIndex;
    }
};

/**
 * Determines whether the character's current health level is maxHealthLevel (is
 * full) or not.
 * @method Character.fullHealthLevel
 * @returns {boolean} True if player's health level is the greatest, otherwise
 * false.
 */
Character.prototype.fullHealthLevel = function() {
    return this.healthLevel === this.maxHealthLevel;
};

/**
 * Increase the character health level. If after the increasing, the healthLevel
 * is greater than or equal to the maxHealthLevel property, then healthLevel
 * will be maxHealthLevel.
 * @method Character.increaseHealthLevel
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
 * @method Character.decreaseHealthLevel
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
 * @method Character.killCharacter
 */
Character.prototype.killCharacter = function() {
    this.killWeapons();
    this.kill();
};

/**
 * Kill the character's weapons.
 * @method Character.killWeapons
 */
Character.prototype.killWeapons = function() {
    for (var weaponKey in this.weapons) {
        this.weapons[weaponKey].killWeapon();
    }
};

/**
 * Set the character health level.
 * @method Character.setHealthLevel
 * @param {number} healthLevel - the new caharacter's healthLevel.
 */
Character.prototype.setHealthLevel = function(healthLevel) {
    this.healthLevel = healthLevel;
};

/**
 * Updates player's current weapon, the old weapon is killed (out of stage) and
 * the new one is shown on screen. If the new one is a weapon that was killed,
 * then it is revived and shown on screen.
 * @method Character.weaponKey
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
    level.game.add.existing(this.currentWeapon);
};

/**
 * Changes character's current weapon, to the next one in the weapons array.
 * Updates currentWeaponIndex property.
 * @method Character.nextWeapon
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
 * @method Character.addWeapon
 * @param newWeapon {object} The weapon to be added.
 */
Character.prototype.addWeapon = function(newWeapon) {
    if (this.weapons[newWeapon.key] === undefined) {
        this.weaponsKeys.push(newWeapon.key);
    }
    this.weapons[newWeapon.key] = newWeapon;
};

/**
 * Fires the current weapon if it is defined
 * @method Character.fireToXY
 * @param x {number} X coordinate on the point to fire
 * @param y {number} Y coordinate on the point to fire
 */
Character.prototype.fireToXY = function(x, y) {
    if (this.canFire) {
        this.currentWeapon.fire(x, y);
    }
};

/**
 * Lets to relocate the character on the given coordinates
 * @method Character.relocate
 * @param x {number} X coordinate to be relocated
 * @param y {number} Y coordinate to be relocated
 */
Character.prototype.relocate = function(x, y) {
    this.x = x;
    this.y = y;
};

/**
 * Updates current weapon, so that character can use it.
 * @method Character.useWeapon
 * @param {Weapon} weapon - Weapon to be used by the character.
 */
Character.prototype.useWeapon = function(weapon) {
    if (this.weapons[weapon.key] === undefined) {
        this.addWeapon(weapon);
        this.currentWeaponIndex = this.weaponsKeys.indexOf(weapon.key);
        this.updateCurrentWeapon(weapon.key);
        if (level.xDirection > 0) {
            this.currentWeapon.pointToRight();
        }else {
            this.currentWeapon.pointToLeft();
        }
    }else {
        //weapon.kill();
        this.weapons[weapon.key].addBullets(weapon.numberOfBullets);
    }
};

/**
 * Allows the character to jump.
 * @method Character.jump
 */
Character.prototype.jump = function() {
    this.body.velocity.y = -350;
};

module.exports = Character;

},{}],2:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 08/07/2015.
 */
var Character = require('./Character');
var ResourceBar = require('./../util/ResourceBar');

/**
 * Represents the right direction on the screen.
 * @constant
 * @type {number}
 */
var RIGHT_DIRECTION = 1;
/**
 * Represents the left direction on the screen.
 * @constant
 * @type {number}
 */
var LEFT_DIRECTION = -1;

/**
 * Represents an enemy within the game.
 * @class Enemy
 * @extends Character
 * @constructor
 * @param {string} spriteKey - Texture's key for the enemy sprite.
 * @param {number} maxHealthLevel - Greatest health level for this enemy.
 * @param {number} x - Enemy's x coordinate within the game world.
 * @param {number} y - Enemy's y coordinate within the game world.
 * @param {number} minRangeDetection - Lowest distance in which the enemy can
 * detect the player.
 * @param {number} maxRangeDetection - Longest distance in which the enemy can
 * detect the player.
 * @param {number} minRangeAttack - Lowest distance in which the enemy can
 * shoot the player.
 * @param {number} maxRangeAttack - Longest distance in which the enemy can
 * shoot the player.
 */
var Enemy = function(spriteKey,
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
    Character.call(this, x, y, spriteKey, options);
    this.animations.add('left', [0, 1], 10, true);
    this.animations.add('right', [2, 3], 10, true);
    this.stopLeftFrameIndex = 0;
    this.stopRightFrameIndex = 2;
    this.rangeDetection = level.game.rnd.integerInRange(minRangeDetection,
        maxRangeDetection);
    this.rangeAttack = level.game.rnd.integerInRange(minRangeAttack,
        maxRangeAttack);
    this.heatlthBar = new ResourceBar(-this.width / 2, -this.height / 2 - 10,
        {width: 40, height: 5});
    this.addChild(this.heatlthBar);
    this.direction = RIGHT_DIRECTION;
};

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

/**
 * Update animations and current weapon of the enemy.
 * @method Enemy.update
 */
Enemy.prototype.update = function() {
    if (this.body.velocity.x > 0) {
        this.direction = RIGHT_DIRECTION;
        this.animations.play('right');
        this.currentWeapon.pointToRight();
    }else if (this.body.velocity.x < 0) {
        this.direction = LEFT_DIRECTION;
        this.animations.play('left');
        this.currentWeapon.pointToLeft();
    }
    this.currentWeapon.updateCoordinates(this.x, this.y);
};

/**
 * Updates enemy's health level bar.
 * @method Enemy.updateHealthLevel
 */
Enemy.prototype.updateHealthLevel = function() {
    this.heatlthBar.updateResourceBarLevel(this.healthLevel /
        this.maxHealthLevel);
};

/**
 * Kills the character, so that is not visible and functional in the game.
 * @method Enemy.killCharacter
 */
Enemy.prototype.killCharacter = function() {
    this.healthLevel = 0;
    level.player.increaseScore(this.maxHealthLevel * 0.5);
    Character.prototype.killCharacter.call(this);
    level.enemies.removeChild(this);
};

/**
 * Rotates enemies current weapon to  certain direction.
 * @method Enemy.rotateWeapon
 * @param {number} x - X coordinate of a point id the direction, where weapon
 * will be rotate.
 * @param {number} y - Y coordinate of a point id the direction, where weapon
 * will be rotate.
 */
Enemy.prototype.rotateWeapon = function(x, y) {
    this.currentWeapon.rotation =
        level.game.physics.arcade.angleToXY(this, x, y);
};

/**
 * Stops the enemy, its animations an chose the frame to display according to
 * its direction.
 * @method Enemy.stop
 */
Enemy.prototype.stop = function() {
    this.body.velocity.x = 0;
    this.animations.stop();
    if (this.direction === RIGHT_DIRECTION) {
        this.frame = this.stopRightFrameIndex;
    }else {
        this.frame = this.stopLeftFrameIndex;
    }
};

module.exports = Enemy;

},{"./../util/ResourceBar":66,"./Character":1}],3:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 06/12/2015.
 */
var InteractionEnemy = require('./InteractionEnemy');
var MachineGun = require('../items/weapons/MachineGun');
var VerticalLayoutPopUp = require('../util/VerticalLayoutPopUp');
var InteractionManager = require('../util/InteractionManager');

/**
 * Texture key for a strong  enemy
 * @constant
 * @type {string}
 */
var SPRITE_KEY = 'friend';
/**
 * Greatest health level of a strong enemy
 * @constant
 * @type {number}
 */
var MAX_HEALTH_LEVEL = 40;
/**
 * Lowest distance in which a strong enemy can detect the player.
 * @constant
 * @type {number}
 */
var MIN_RANGE_DETECTION = 800;
/**
 * Lowest distance in which a strong enemy can shoot the player.
 * @constant
 * @type {number}
 */
var MAX_RANGE_DETECTION = 1000;
/**
 * Longest distance in which a simple enemy can detect the player.
 * @constant
 * @type {number}
 */
var MIN_RANGE_ATTACK = 600;
/**
 * Longest distance in which a simple enemy can shoot the player.
 * @constant
 * @type {number}
 */
var MAX_RANGE_ATTACK = 800;

/**
 * Represents the strongest enemies of the game.
 * @class Friend
 * @extends Enemy
 * @param {number} x - Strongest enemy's x coordinate within the game world.
 * @param {number} y - Strongest enemy's y coordinate within the game world.
 * @constructor
 */
var Friend = function(x, y) {
    var messages = ['I did not know what I was doing.' +
    '\nI just wanted to have your life',
        'But now I have realised that I made suffer too ' +
        '\nmany people',
        'I will surrender to the police'];
    var titles = ['Forgive me!', 'I am sorry!', 'I give up!'];
    var imagesKeys = ['forgive', 'forgive', 'surrender'];
    var intManager = new InteractionManager(messages, titles, imagesKeys);
    InteractionEnemy.call(
        this,
        SPRITE_KEY,
        MAX_HEALTH_LEVEL,
        x,
        y,
        MIN_RANGE_DETECTION,
        MAX_RANGE_DETECTION,
        MIN_RANGE_ATTACK,
        MAX_RANGE_ATTACK,
        intManager
    );
    this.useWeapon(new MachineGun(this, x, y, true));
};

Friend.prototype = Object.create(InteractionEnemy.prototype);
Friend.prototype.constructor = Friend;

module.exports = Friend;

},{"../items/weapons/MachineGun":35,"../util/InteractionManager":63,"../util/VerticalLayoutPopUp":70,"./InteractionEnemy":4}],4:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 23/07/2015.
 */
var Enemy = require('./Enemy');
var MachineGun = require('../items/weapons/MachineGun');

/**
 * Represents the enemies that can interact with the player.
 * @class InteractionEnemy
 * @extends Enemy
 * @constructor
 * @param {string} spriteKey - Texture's key for the enemy sprite.
 * @param {number} maxHealthLevel - Greatest health level for this enemy.
 * @param {number} x - Strongest enemy's x coordinate within the game world.
 * @param {number} y - Strongest enemy's y coordinate within the game world.
 * @param {number} minDetection - Lowest distance in which the enemy can
 * detect the player.
 * @param {number} maxDetection - Longest distance in which the enemy can
 * detect the player.
 * @param {number} minAttack - Lowest distance in which the enemy can
 * shoot the player.
 * @param {number} maxAttack - Longest distance in which the enemy can
 * shoot the player.
 * @param {InteractionManager} interactionManager - Interaction manager that
 * allows interaction with the player
 */
var InteractionEnemy = function(spriteKey, maxHealthLevel, x, y, minDetection,
                                maxDetection, minAttack, maxAttack,
                                interactionManager) {
    Enemy.call(
        this,
        spriteKey,
        maxHealthLevel,
        x,
        y,
        minDetection,
        maxDetection,
        minAttack,
        maxAttack
    );
    this.interactionManager = interactionManager;
};

InteractionEnemy.prototype = Object.create(Enemy.prototype);
InteractionEnemy.prototype.constructor = InteractionEnemy;

/**
 * Decrease the character health level. If after the decreasing, the healthLevel
 * is less than or equal to 10, then character will stop fighting and will ask
 * for pardon.
 * @method InteractionEnemy.decreaseHealthLevel
 * @param {number} decrease - the amount to decrease.
 */
InteractionEnemy.prototype.decreaseHealthLevel = function(decrease) {
    this.healthLevel -= decrease;
    if (this.healthLevel <= 10 && !level.lastGoalAimed) {
        this.killWeapons();
        this.canFire = false;
        this.openDialogs();
        level.liberateFamilyMember();
        level.enemies.removeChild(this);
        level.game.add.existing(this);
    }
};

/**
 * Lets the enemy to show the messages he has for the player. (Interaction)
 * @method  InteractionEnemy.openDialogs

 */
InteractionEnemy.prototype.openDialogs = function() {
    this.interactionManager.openDialogs();
};

module.exports = InteractionEnemy;


},{"../items/weapons/MachineGun":35,"./Enemy":2}],5:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 16/07/2015.
 */
var Character = require('./Character');
var Dialog = require('../util/Dialog');

/**
 * Represents a non player character within the game, whom player will interact
 * with.
 * @class NPC
 * @extends Character
 * @constructor
 * @param {number} x - NPC's x coordinate within game world.
 * @param {number} y - NPC's y coordinate within game world.
 * @param {string} key - NPC's texture key.
 * shoot the player.
 * @param {InteractionManager} interactionManager - Interaction manager that
 * allows interaction with the player
 * @return {NPC}
 */
var NPC = function(x, y, key, interactionManager) {
    Character.call(this, x, y, key);
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);
    this.stopLeftFrameIndex = 0;
    this.stopRightFrameIndex = 5;
    this.frame = this.stopLeftFrameIndex;
    this.hadContactWithPlayer = false;
    this.interactionManager = interactionManager;
    return this;
};

NPC.prototype = Object.create(Character.prototype);
NPC.prototype.constructor = NPC;

/**
 * Lets the NPC to show the messages he has for the player. (Interaction)
 * @method NPC.openDialogs
 */
NPC.prototype.openDialogs = function() {
    this.interactionManager.openDialogs();
};

module.exports = NPC;

},{"../util/Dialog":55,"./Character":1}],6:[function(require,module,exports){
/*
 * @ignore Created by Edwin Gamboa
 */
var Character = require('./Character');
var Revolver = require('../items/weapons/Revolver');
var MachineGun = require('../items/weapons/MachineGun');
var Rifle = require('../items/weapons/Rifle');
var Carbine = require('../items/weapons/Carbine');
var Pistol = require('../items/weapons/Pistol');

/**
 * Default player speed
 * @constant
 * @type {number}
 */
var SPEED = 250;
/**
 * Default player running speed
 * @constant
 * @type {number}
 */
var MAX_SPEED = 300;
/**
 * Default player gravity
 * @constant
 * @type {number}
 */
var GRAVITY = 300;
/**
 * Default minimum player score, is used at the beginning of the game.
 * @constant
 * @type {number}
 */
var MINIMUM_SCORE = 20;
/**
 * Default initial health level for any character
 * @constant
 * @type {number}
 * @default
 */
var INITIAL_HEALTH_LEVEL = 100;

/**
 * Represents player's character within the game.
 * @class Player
 * @extends Character
 * @constructor
 */
var Player = function() {
    var options = {speed : SPEED, maxSpeed : MAX_SPEED};
    Character.call(this, 200, level.GROUND_HEIGHT - 50,
        'character', options);
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);
    this.stopLeftFrameIndex = 0;
    this.stopRightFrameIndex = 5;
    this.frame = this.stopRightFrameIndex;
    this.score = MINIMUM_SCORE;
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

/**
 * Allows the player to crouch.
 * @method Player.crouch
 */
Player.prototype.crouch = function() {
    this.animations.stop();
    this.frame = 9;
};

/**
 * Increases player's score
 * @method Player.increaseScore
 * @param {number} increase - The amount to increase
 */
Player.prototype.increaseScore = function(increase) {
    this.score += increase;
    level.updateScoreText();
};

/**
 * Increases player's score
 * @method Player.decreaseScore
 * @param {number} decrease - The amount to decrease
 */
Player.prototype.decreaseScore = function(decrease) {
    this.score += decrease;
    level.updateScoreText();
};

/**
 * Updates player health level bar (in the main UI)
 * @method Player.updateHealthLevel
 */
Player.prototype.updateHealthLevel = function() {
    level.updateHealthLevel();
};

/**
 * Updates player's current weapon position.
 * @method Player.update
 */
Player.prototype.update = function() {
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.updateCoordinates(this.x + (level.xDirection * 25),
            this.y + 20);
    }
};

/**
 * Changes player walking and running speeds.
 * @method Player.changeSpeed
 * @param {number} speed - New Player's walking speed.
 * @param {number} maxSpeed - New Player's running speed.
 */
Player.prototype.changeSpeed = function(speed, maxSpeed) {
    this.speed = speed;
    this.maxSpeed = maxSpeed;
};

/**
 * Resets player walking and running speeds to default values.
 * @method Player.resetSpeed
 */
Player.prototype.resetSpeed = function() {
    this.speed = SPEED;
    this.maxSpeed = MAX_SPEED;
};

/**
 * Changes player gravity.
 * @method Player.changeGravity
 * @param {number} gravity - New player gravity.
 */
Player.prototype.changeGravity = function(gravity) {
    this.body.gravity.y = gravity;
};

/**
 * Resets player gravity to default value.
 * @method Player.resetGravity
 */
Player.prototype.resetGravity = function() {
    this.body.gravity.y = GRAVITY;
};

/**
 * Allows the player to buy an item, when he has enough money (score) to do it.
 * @param {Item} item - Item that is intended to be purchased.
 * @returns {boolean} - true if purchase was successful, otherwise false.
 */
Player.prototype.buyItem = function(item) {
    if (this.score >= item.price) {
        this.score -= item.price;
        return true;
    }else {
        return false;
    }
};

/**
 * Updates player's current weapon
 * @method Player.weaponKey
 * @param {string} weaponKey - new current weapon's key
 */
Player.prototype.updateCurrentWeapon = function(weaponKey) {
    Character.prototype.updateCurrentWeapon.call(this, weaponKey);
    localStorage.setItem('currentWeapon', weaponKey);
};

/**
 * Loads player's current weapon
 * @method Player.weaponKey
 * @param {string} weaponKey - new current weapon's key
 */
Player.prototype.loadCurrentWeapon = function(weaponKey) {
    Character.prototype.updateCurrentWeapon.call(this, weaponKey);
};

/**
 * Add a new weapon to character's weapons.
 * @method Player.addWeapon
 * @param newWeapon {object} The weapon to be added.
 */
Player.prototype.addWeapon = function(newWeapon) {
    Character.prototype.addWeapon.call(this, newWeapon);
    newWeapon.saveWeapon();
};

/**
 * Loads a weapon that player has acquired.
 * @method Player.loadWeapon
 * @param newWeapon {object} The weapon to be added.
 */
Player.prototype.loadWeapon = function(newWeapon) {
    Character.prototype.addWeapon.call(this, newWeapon);
};

/**
 * Changes player's current weapon, to the next one in the weapons array.
 * Updates currentWeaponIndex property.
 * @method Player.nextWeapon
 */
Player.prototype.nextWeapon = function() {
    Character.prototype.nextWeapon.call(this);
    level.updateAmmoText();
};

/**
 * Loads the player's information from the local store.
 * @method Player.loadPlayer
 */
Player.prototype.loadPlayer = function() {
    if (localStorage.getItem('score') !== null) {
        this.score = parseInt(localStorage.getItem('score'));
    }
    if (localStorage.getItem('healthLevel') !== null) {
        var health = parseInt(localStorage.getItem('healthLevel'));
        if (health > 0) {
            this.healthLevel = health;
        }else {
            this.healthLevel = 100;
            if (this.score > 5) {
                this.score -= 5;
            }else {
                this.score = 0;
            }
            localStorage.setItem('score', this.score);
        }
    }
    this.loadWeapons();
    if (localStorage.getItem('currentWeapon') !== null) {
        this.loadCurrentWeapon(localStorage.getItem('currentWeapon'));
    }else {
        this.useWeapon(new Revolver(700, 100, false));
    }
};

/**
 * Loads the player's weapons from the local store.
 * @method Player.loadPlayer
 */
Player.prototype.loadWeapons = function() {
    var weapon;
    if (localStorage.getItem('revolver') !== null) {
        weapon = new Revolver(700, 100, false);
        weapon.numberOfBullets = parseInt(localStorage.getItem('revolver'));
        this.loadWeapon(weapon);
    }
    if (localStorage.getItem('pistol') !== null) {
        weapon = new Pistol(700, 100, false);
        weapon.numberOfBullets = parseInt(localStorage.getItem('pistol'));
        this.loadWeapon(weapon);
    }
    if (localStorage.getItem('machineGun') !== null) {
        weapon = new MachineGun(700, 100, false);
        weapon.numberOfBullets = parseInt(localStorage.getItem('machineGun'));
        this.loadWeapon(weapon);
    }
    if (localStorage.getItem('carbine') !== null) {
        weapon = new Carbine(700, 100, false);
        weapon.numberOfBullets = parseInt(localStorage.getItem('carbine'));
        this.loadWeapon(weapon);
    }
    if (localStorage.getItem('rifle') !== null) {
        weapon = new Rifle(700, 100, false);
        weapon.numberOfBullets = parseInt(localStorage.getItem('rifle'));
        this.loadWeapon(weapon);
    }
};

module.exports = Player;

},{"../items/weapons/Carbine":34,"../items/weapons/MachineGun":35,"../items/weapons/Pistol":36,"../items/weapons/Revolver":37,"../items/weapons/Rifle":38,"./Character":1}],7:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 23/07/2015.
 */
var Enemy = require('./Enemy');
var Revolver = require('../items/weapons/Revolver');

/**
 * Texture key for a simple enemy
 * @constant
 * @type {string}
 */
var SPRITE_KEY = 'simple_enemy';
/**
 * Greatest health level of a simple enemy
 * @constant
 * @type {number}
 */
var MAX_HEALTH_LEVEL = 4;
/**
 * Lowest distance in which a simple enemy can detect the player.
 * @constant
 * @type {number}
 */
var MIN_RANGE_DETECTION = 200;
/**
 * Longest distance in which a simple enemy can detect the player.
 * @constant
 * @type {number}
 */
var MAX_RANGE_DETECTION = 700;
/**
 * Lowest distance in which a simple enemy can shoot the player.
 * @constant
 * @type {number}
 */
var MIN_RANGE_ATTACK = 100;
/**
 * Longest distance in which a simple enemy can shoot the player.
 * @constant
 * @type {number}
 */
var MAX_RANGE_ATTACK = 300;

/**
 * Represents the weakest enemies of the game.
 * @class SimpleEnemy
 * @extends Enemy
 * @param {number} x - Simple enemy's x coordinate within the game world.
 * @param {number} y - Simple enemy's y coordinate within the game world.
 * @constructor
 */
var SimpleEnemy = function(x, y) {
    Enemy.call(this,
        SPRITE_KEY,
        MAX_HEALTH_LEVEL,
        x,
        y,
        MIN_RANGE_DETECTION,
        MAX_RANGE_DETECTION,
        MIN_RANGE_ATTACK,
        MAX_RANGE_ATTACK);

    this.useWeapon(new Revolver(this, x, y, true));
};

SimpleEnemy.prototype = Object.create(Enemy.prototype);
SimpleEnemy.prototype.constructor = SimpleEnemy;

module.exports = SimpleEnemy;

},{"../items/weapons/Revolver":37,"./Enemy":2}],8:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 23/07/2015.
 */
var Enemy = require('./Enemy');
var MachineGun = require('../items/weapons/MachineGun');

/**
 * Texture key for a strong  enemy
 * @constant
 * @type {string}
 */
var SPRITE_KEY = 'strong_enemy';
/**
 * Greatest health level of a strong enemy
 * @constant
 * @type {number}
 */
var MAX_HEALTH_LEVEL = 8;
/**
 * Lowest distance in which a strong enemy can detect the player.
 * @constant
 * @type {number}
 */
var MIN_RANGE_DETECTION = 400;
/**
 * Lowest distance in which a strong enemy can shoot the player.
 * @constant
 * @type {number}
 */
var MAX_RANGE_DETECTION = 1000;
/**
 * Longest distance in which a simple enemy can detect the player.
 * @constant
 * @type {number}
 */
var MIN_RANGE_ATTACK = 200;
/**
 * Longest distance in which a simple enemy can shoot the player.
 * @constant
 * @type {number}
 */
var MAX_RANGE_ATTACK = 600;

/**
 * Represents the strongest enemies of the game.
 * @class StrongEnemy
 * @extends Enemy
 * @param {number} x - Strong enemy's x coordinate within the game world.
 * @param {number} y - Strong enemy's y coordinate within the game world.
 * @constructor
 */
var StrongEnemy = function(x, y) {
    Enemy.call(
        this,
        SPRITE_KEY,
        MAX_HEALTH_LEVEL,
        x,
        y,
        MIN_RANGE_DETECTION,
        MAX_RANGE_DETECTION,
        MIN_RANGE_ATTACK,
        MAX_RANGE_ATTACK
    );

    this.useWeapon(new MachineGun(this, x, y, true));
};

StrongEnemy.prototype = Object.create(Enemy.prototype);
StrongEnemy.prototype.constructor = StrongEnemy;

module.exports = StrongEnemy;

},{"../items/weapons/MachineGun":35,"./Enemy":2}],9:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 11/11/2015.
 */

var InteractionEnemy = require('./InteractionEnemy');
var MachineGun = require('../items/weapons/MachineGun');
var VerticalLayoutPopUp = require('../util/VerticalLayoutPopUp');
var InteractionManager = require('../util/InteractionManager');

/**
 * Texture key for a strong  enemy
 * @constant
 * @type {string}
 */
var SPRITE_KEY = 'strongestEnemy';
/**
 * Greatest health level of a strong enemy
 * @constant
 * @type {number}
 */
var MAX_HEALTH_LEVEL = 30;
/**
 * Lowest distance in which a strong enemy can detect the player.
 * @constant
 * @type {number}
 */
var MIN_RANGE_DETECTION = 800;
/**
 * Lowest distance in which a strong enemy can shoot the player.
 * @constant
 * @type {number}
 */
var MAX_RANGE_DETECTION = 1000;
/**
 * Longest distance in which a simple enemy can detect the player.
 * @constant
 * @type {number}
 */
var MIN_RANGE_ATTACK = 500;
/**
 * Longest distance in which a simple enemy can shoot the player.
 * @constant
 * @type {number}
 */
var MAX_RANGE_ATTACK = 600;

/**
 * Represents the strongest enemies of the game.
 * @class StrongestEnemy
 * @extends Enemy
 * @param {number} x - Strongest enemy's x coordinate within the game world.
 * @param {number} y - Strongest enemy's y coordinate within the game world.
 * @constructor
 */
var StrongestEnemy = function(x, y) {
    var messages = ['Forgive me please! \nI can liberate your wife.',
		'But your children are not here. \nThey are somewhere else,' +
		'\nbut I do not know where',
        'I am not the boss, \nI work for someone else'];
    var titles = ['Forgive me', 'Look for your children', 'I am not the boss'];
    var imagesKeys = ['forgive', 'mother', 'forgive'];
    var intManager = new InteractionManager(messages, titles, imagesKeys);
    InteractionEnemy.call(
        this,
        SPRITE_KEY,
        MAX_HEALTH_LEVEL,
        x,
        y,
        MIN_RANGE_DETECTION,
        MAX_RANGE_DETECTION,
        MIN_RANGE_ATTACK,
        MAX_RANGE_ATTACK,
        intManager
    );
    this.useWeapon(new MachineGun(this, x, y, true));
};

StrongestEnemy.prototype = Object.create(InteractionEnemy.prototype);
StrongestEnemy.prototype.constructor = StrongestEnemy;

module.exports = StrongestEnemy;


},{"../items/weapons/MachineGun":35,"../util/InteractionManager":63,"../util/VerticalLayoutPopUp":70,"./InteractionEnemy":4}],10:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 13/11/2015.
 */
var Character  = require('./Character');
var ResourceBar = require('./../util/ResourceBar');

/**
 * Represents the right direction on the screen.
 * @constant
 * @type {number}
 */
var RIGHT_DIRECTION = 1;
/**
 * Represents the left direction on the screen.
 * @constant
 * @type {number}
 */
var LEFT_DIRECTION = -1;

/**
 * Represents a non player character within the game, whom player will interact
 * with.
 * @class Wife
 * @extends Character
 * @constructor
 * @param {number} x - Wife's x coordinate within game world.
 * @param {number} y - Wife's y coordinate within game world.
 * @return {Wife}
 */
var Wife = function(x, y) {
    Character.call(this, x, y, 'wife');
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);
    this.stopLeftFrameIndex = 0;
    this.stopRightFrameIndex = 5;
    this.heatlthBar = new ResourceBar(-this.width / 2, -this.height / 2 - 10,
        {width: 40, height: 5});
    this.addChild(this.heatlthBar);
    this.direction = RIGHT_DIRECTION;
};

Wife.prototype = Object.create(Character.prototype);
Wife.prototype.constructor = Wife;

/**
 * Update animations of the wife.
 * @method Wife.update
 */
Wife.prototype.update = function() {
    this.body.velocity.x = level.player.body.velocity.x;
    if (this.body.velocity.x > 0) {
        this.direction = RIGHT_DIRECTION;
        this.animations.play('right');
    }else if (this.body.velocity.x < 0) {
        this.direction = LEFT_DIRECTION;
        this.animations.play('left');
    }else {
        this.animations.stop();
        if (this.direction === RIGHT_DIRECTION) {
            this.frame = this.stopRightFrameIndex;
        }else {
            this.frame = this.stopLeftFrameIndex;
        }
    }
};

/**
 * Updates wife's health level bar.
 * @method Wife.updateHealthLevel
 */
Wife.prototype.updateHealthLevel = function() {
    this.heatlthBar.updateResourceBarLevel(this.healthLevel /
        this.maxHealthLevel);
};

/**
 * Kills the character, so that is not visible and functional in the game.
 * @method Wife.killCharacter
 */
Wife.prototype.killCharacter = function() {
    level.gameOver();
    Character.prototype.killCharacter.call(this);
};

module.exports = Wife;

},{"./../util/ResourceBar":66,"./Character":1}],11:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 08/10/2015.
 */

var DragAndDropChallenge = require('./dragAndDrop/DragAndDropChallenge');
var GridLayoutPanel = require('../util/GridLayoutPanel');
var VerticalLayoutPanel = require('../util/VerticalLayoutPanel');

/**
 * The number of contexts allowed for this challenge
 * @constant
 * @type {number}
 */
var NUMBER_OF_CONTEXTS = 2;

/**
 * Represents the EnglishChallenge in which the player should associate each
 * word to one context. This is a drag and drop kind of challenge.
 * @class ContextGroups
 * @extends DragAndDropChallenge
 * @constructor
 */
var ContextGroups = function() {
    var dimensions = {numberOfRows: 4};
    DragAndDropChallenge.call(this,
        'contexts',
        'Contexts',
        'Match the words \nwith their category',
        50,
        dimensions
    );
};

ContextGroups.prototype = Object.create(DragAndDropChallenge.prototype);
ContextGroups.prototype.constructor = ContextGroups;

/**
 * Create a new challenge to the player.
 * @method ContextGroups.newChallenge
 */
ContextGroups.prototype.newChallenge = function() {
    this.clearChallenge();
    var numberOfWords = 3;
    var vocabularyItems = [];
    var wordsContext1 = level.myVocabulary.randomVocabularyItems(numberOfWords);
    vocabularyItems.push(wordsContext1);
    var wordsContext2;
    do {
        wordsContext2 = level.myVocabulary.randomVocabularyItems(numberOfWords);
    }while (wordsContext1[0].categoryIndex == wordsContext2[0].categoryIndex);
    vocabularyItems.push(wordsContext2);

    var contextsNames = [
        level.myVocabulary.categoriesLabels[wordsContext1[0].categoryIndex],
        level.myVocabulary.categoriesLabels[wordsContext2[0].categoryIndex]
    ];

    this.contexts = [];
    var optionals = {numberOfColumns: numberOfWords, numberOfRows : 2,
        margin: 5};
    this.source = new GridLayoutPanel('wordsBg', optionals);

    optionals = {numberOfColumns: NUMBER_OF_CONTEXTS, margin: 0};
    var contextsPanels = new GridLayoutPanel('englishChallengePanelBg',
        optionals);

    var i;
    var j;
    var word;
    var wordShade;
    var context;
    var contextTitle;

    for (i = 0; i < NUMBER_OF_CONTEXTS; i++) {
        context = new VerticalLayoutPanel('contextBg', 5);
        contextTitle = level.game.make.text(0, 0, contextsNames[i]);
        contextTitle.font = level.font;
        contextTitle.fontSize = 30;
        contextTitle.fill = '#f00000';
        contextTitle.stroke = '#000000';
        contextTitle.strokeThickness = 2;
        context.addElement(contextTitle);
        this.contexts.push(context);
        contextsPanels.addElement(context);

        for (j = 0; j < numberOfWords; j++) {
            this.vocabularyItems.push(vocabularyItems[i][j]);
            word = level.game.make.text(0, 0, vocabularyItems[i][j].name);
            //Font style
            word.font = level.font;
            word.fontSize = 20;
            word.fill = '#473e2c';
            word.stroke = '#fff';
            word.strokeThickness = 2;
            word.inputEnabled = true;
            word.input.enableDrag(true, true);
            word.events.onDragStop.add(this.dragAndDropControl.fixLocation,
                this.dragAndDropControl);
            word.code = '' + i;
            this.elements.push(word);

            wordShade = new VerticalLayoutPanel('wordBg', 2);
            wordShade.code = '' + i;
            this.destinations.push(wordShade);
            context.addElement(wordShade);
        }
    }

    this.dragAndDropControl.addElementsToSourceRandomly();
    this.mainPanel.addElement(contextsPanels);
    this.mainPanel.addElement(this.source);
};

/**
 * Brings the element's container to the top. So that, when player drag the
 * element over other containers it is not hidden by them.
 * @method ContextGroups.bringItemToTop
 * @param {Phaser.Sprite} item - element that is being dragged by the player
 */
ContextGroups.prototype.bringItemToTop = function(item) {
    if (ContextGroups.prototype.isPrototypeOf(item.parent)) {
        this.addChild(item);
    }else {
        this.addChild(item.parent.parent);
    }
};

module.exports = ContextGroups;

},{"../util/GridLayoutPanel":57,"../util/VerticalLayoutPanel":69,"./dragAndDrop/DragAndDropChallenge":15}],12:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 13/10/2015.
 */

/**
 * Represents an EnglishChallenge within the game. An EnglishChallenge is used,
 * by the player to increase his/her score in a faster way.
 * @class EnglishChallenge
 * @constructor
 * @param iconKey {string} - Texture's key for the icon of the challenge
 * @param name {string} - Name of the challenge
 * @param description {string} - Description of the challenge.
 * @param score {number} - Score to be increased in case of success.
 */
var EnglishChallenge = function(iconKey, name, description, score) {
    this.iconKey = iconKey;
    this.name = name;
    this.score = score;
    this.description = description;
};

EnglishChallenge.prototype.constructor = EnglishChallenge;

/**
 * Increases player score and shows a success message. It is called when player
 * overcome the challenge successfully.
 * @method EnglishChallenge.success
 * @param {Pahser.Sprite} parent - Current view
 */
EnglishChallenge.prototype.success = function(parent) {
    level.increaseScore(this.score);
    level.showSuccessMessage('Well done! You got ' + this.score +
        ' points.', parent);
};

/**
 * Shows a failure message. It is called when player has completed the challenge
 * but in a wrong way.
 * @method EnglishChallenge.failure
 * @param {Pahser.Sprite} parent - Current view
 */
EnglishChallenge.prototype.failure = function(parent) {
    level.showErrorMessage('Sorry! Try Again.', parent);
};

/**
 * Shows a failure message. It is called when player has not completed the
 * challenge.
 * @method EnglishChallenge.incomplete
 * @param {Pahser.Sprite} parent - Current view
 */
EnglishChallenge.prototype.incomplete = function(parent) {
    level.showErrorMessage('The challenge is not complete.', parent);
};

module.exports = EnglishChallenge;

},{}],13:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 08/10/2015.
 */

var DragAndDropChallenge = require('./dragAndDrop/DragAndDropChallenge');
var VerticalLayoutPanel = require('../util/VerticalLayoutPanel');
var GridLayoutPanel = require('../util/GridLayoutPanel');

/**
 * Represents the EnglishChallenge in which player should match a word with its
 * corresponding image representation. This is a drag and drop challenge.
 * @class ImageWordMatch
 * @extends DragAndDropChallenge
 * @constructor
 */
var ImageWordMatch = function() {
    var dimensions = {numberOfRows: 3};
    DragAndDropChallenge.call(this,
        'imageWord',
        'Image Match',
        'Match the words \nwith their images',
        30,
        dimensions
    );
};

ImageWordMatch.prototype = Object.create(DragAndDropChallenge.prototype);
ImageWordMatch.prototype.constructor = ImageWordMatch;

/**
 * Create a new challenge to the player.
 * @method ImageWordMatch.newChallenge
 */
ImageWordMatch.prototype.newChallenge = function() {
    this.clearChallenge();
    var words = level.myVocabulary.randomVocabularyItems(3);
    var wordCells = [];

    for (var i in words) {
        this.vocabularyItems.push(words[i]);
        var cell = new VerticalLayoutPanel('imageWordBg');
        var image = level.game.make.sprite(0, 0, words[i].key);
        var scaleX;
        var scaleY;
        if (image.height > 120 || image.width > 180) {
            scaleY = 120 / image.height;
            scaleX = 180 / image.width;
            if (scaleX > scaleY) {
                image.scale.x = scaleY;
                image.scale.y = scaleY;
            }else {
                image.scale.x = scaleX;
                image.scale.y = scaleX;
            }
        }
        var shade = new VerticalLayoutPanel('wordBg', 2);
        shade.code = i;

        this.destinations.push(shade);
        cell.addElement(image);
        cell.addElement(shade);

        var label = level.game.make.text(0, 0, words[i].name);
        //Font style
        label.font = level.font;
        label.fontSize = 20;
        label.fill = '#473e2c';
        label.stroke = '#fff';
        label.strokeThickness = 2;
        label.inputEnabled = true;
        label.input.enableDrag(true, true);
        //label.events.onDragStart.add(this.bringItemToTop, this);
        label.events.onDragStop.add(this.dragAndDropControl.fixLocation,
            this.dragAndDropControl);
        label.code = i;

        wordCells.push(cell);
        this.elements.push(label);
    }

    var optionals = {numberOfColumns: this.elements.length};
    this.source = new GridLayoutPanel('wordsBg', optionals);

    var images = new GridLayoutPanel('englishChallengePanelBg', optionals);

    var familyMemberCell;
    for (familyMemberCell in wordCells) {
        images.addElement(wordCells[familyMemberCell]);
    }

    this.dragAndDropControl.addElementsToSourceRandomly();

    this.mainPanel.addElement(images);
    this.mainPanel.addElement(this.source);
};

/**
 * Brings the element's container to the top. So that, when player drag the
 * element over other containers it is not hidden by them.
 * @method ImageWordMatch.bringItemToTop
 * @param {Sprite} element - element that is being dragged by the player
 */
ImageWordMatch.prototype.bringItemToTop = function(element) {
    if (ImageWordMatch.prototype.isPrototypeOf(element.parent)) {
        this.addChild(element);
    }else {
        this.addChild(element.parent.parent);
    }
};

module.exports = ImageWordMatch;

},{"../util/GridLayoutPanel":57,"../util/VerticalLayoutPanel":69,"./dragAndDrop/DragAndDropChallenge":15}],14:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 08/10/2015.
 */
var GridLayoutPanel = require('../util/GridLayoutPanel');
var VerticalLayoutPanel = require('../util/VerticalLayoutPanel');
var DragAndDropChallenge = require('./dragAndDrop/DragAndDropChallenge');

/**
 * Represents the EnglishChallenge in which player is presented with a set of
 * letters that should be correctly arranged in order to form a word.
 * @class WordUnscramble
 * @extends DragAndDropChallenge
 * @constructor
 */
var WordUnscramble = function() {
    var dimensions = {numberOfRows: 4};
    DragAndDropChallenge.call(this,
        'unscramble',
        'Unscramble',
        'Form the word \nusing the letters',
        10,
        dimensions
    );
};

WordUnscramble.prototype = Object.create(DragAndDropChallenge.prototype);
WordUnscramble.prototype.constructor = WordUnscramble;

/**
 * Create a new challenge to the player.
 * @method WordUnscramble.newChallenge
 */
WordUnscramble.prototype.newChallenge = function() {
    this.clearChallenge();
    var word = level.myVocabulary.randomVocabularyItems(1)[0];
    this.vocabularyItems.push(word);
    var wordImage = level.game.make.sprite(0, 0, word.key);
    if (wordImage.height > 120) {
        var scale = 120 / wordImage.height;
        wordImage.scale.x = scale;
        wordImage.scale.y = scale;
    }

    var optionals = {numberOfColumns: word.name.length, margin: 5};
    var wordFieldAnswer = new GridLayoutPanel('lettersBg', optionals);

    this.source = new GridLayoutPanel('lettersBg', optionals);
    var i;
    var letter;
    var letterText;
    var letterShade;
    var code;
    for (i = 0; i < word.name.length; i++) {
        letter = word.name.charAt(i);
        code = letter.toLowerCase().charCodeAt(0);

        letterText = level.game.make.text(0, 0, letter);
        letterText.code = code;
        if (letter === ' ') {
            letterShade = new VerticalLayoutPanel('spaceBg', 2);
            letterShade.addElement(letterText);
        }else {
            letterShade = new VerticalLayoutPanel('letterBg', 2);
            //Font style
            letterText.font = level.font;
            letterText.fontSize = 30;
            letterText.fill = '#473e2c';
            letterText.stroke = '#fff';
            letterText.strokeThickness = 2;
            letterText.inputEnabled = true;
            letterText.input.enableDrag(true, true);
            letterText.events.onDragStop.add(
                this.dragAndDropControl.fixLocation,
                this.dragAndDropControl
            );
            this.elements.push(letterText);
        }
        letterShade.code = code;
        this.destinations.push(letterShade);
        wordFieldAnswer.addElement(letterShade);
    }

    this.dragAndDropControl.addElementsToSourceRandomly();

    this.mainPanel.addElement(wordImage);
    this.mainPanel.addElement(wordFieldAnswer);
    this.mainPanel.addElement(this.source);
};

/**
 * Brings the element's container to the top. So that, when player drag the
 * element over other containers it is not hidden by them.
 * @method WordUnscramble.bringItemToTop
 * @param {Sprite} item - Element that is being dragged by the player.
 */
WordUnscramble.prototype.bringItemToTop = function(item) {
    if (WordUnscramble.prototype.isPrototypeOf(item.parent)) {
        this.addChild(item);
    }else {
        this.addChild(item.parent.parent);
    }
};

module.exports = WordUnscramble;

},{"../util/GridLayoutPanel":57,"../util/VerticalLayoutPanel":69,"./dragAndDrop/DragAndDropChallenge":15}],15:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 13/10/2015.
 */

var VerticalLayoutPopUp = require('../../util/VerticalLayoutPopUp');
var VerticalLayoutPanel = require('../../util/VerticalLayoutPanel');
var EnglishChallenge = require('../../englishChallenges/EnglishChallenge');
var DragAndDropController = require('./DragAndDropController');
var Button = require('../../util/Button');

/**
 * Represents the UI for an EnglishChallenge that have draggable elements, which
 * need to be arranged in a certain destinations.
 * @class DragAndDropChallenge
 * @extends VerticalLayoutPopUp
 * @constructor
 * @param {string} iconKey - Texture key of the Challenge icon
 * @param {string} challengeName - Challenge name to show in UI.
 * @param {number} score - Score to be increased in case of success.
 * @param {string} description - Description of the challenge.
 */
var DragAndDropChallenge = function(iconKey, challengeName, description,
                                    score) {
    VerticalLayoutPopUp.call(this, 'popUpBg', null, challengeName, 5);
    this.englishChallenge = new EnglishChallenge(
        iconKey,
        challengeName,
        description,
        score
    );
    this.vocabularyItems = [];
    this.destinations = [];
    this.elements = [];
    this.dragAndDropControl = new DragAndDropController(this);
    this.mainPanel = new VerticalLayoutPanel('popUpPanelBg');
    this.addElement(this.mainPanel);
    this.confirmButton = new Button('Confirm', this.confirm, this);
    this.addElement(this.confirmButton);
};

DragAndDropChallenge.prototype = Object.create(VerticalLayoutPopUp.prototype);
DragAndDropChallenge.prototype.constructor = DragAndDropChallenge;

/**
 * Controls whether the Challenge is completed and successfully overcome.
 * messages
 * @method DragAndDropChallenge.confirm
 */
DragAndDropChallenge.prototype.confirm = function() {
    if (this.dragAndDropControl.emptyDestinations()) {
        this.englishChallenge.incomplete(this);
        return;
    }
    if (!this.dragAndDropControl.elementsInCorrectDestination()) {
        this.englishChallenge.failure(this);
        return;
    }
    this.englishChallenge.success();
    var i;
    for (i in this.vocabularyItems) {
        level.myVocabulary.markAsLearned(this.vocabularyItems[i]);
    }
    //this.clearChallenge();
    this.close();
};

/**
 * Clear all the containers and elements of the challenge, so that a new
 * challenge can be created.
 * @method DragAndDropChallenge.clearChallenge
 */
DragAndDropChallenge.prototype.clearChallenge = function() {
    if (this.mainPanel.children.length > 0) {
        this.mainPanel.removeAllElements();
    }
    if (this.elements.length > 0) {
        var ie;
        for (ie in this.elements) {
            this.elements[ie].kill();
        }
        this.elements.splice(0, this.elements.length);
    }
    if (this.destinations.length > 0) {
        var id;
        for (id in this.elements) {
            this.elements[id].kill();
        }
        this.destinations.splice(0, this.destinations.length);
    }
};

module.exports = DragAndDropChallenge;

},{"../../englishChallenges/EnglishChallenge":12,"../../util/Button":54,"../../util/VerticalLayoutPanel":69,"../../util/VerticalLayoutPopUp":70,"./DragAndDropController":16}],16:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 13/10/2015.
 */
var Utilities = require('../../util/Utilities');

/**
 * Controls draggable elements that are dropped in some destinations.
 * @class DragAndDropController
 * @constructor
 * @param {Phaser.Sprite} container - Sprite tha contains the draggable
 * elements, their initial location (source) and their possible destinations.
 */
var DragAndDropController = function(container) {
    this.container = container;
};

DragAndDropController.prototype.constructor = DragAndDropController;

/**
 * Adds a draggable element to a destination.
 * @method DragAndDropController.addToADestination
 * @param {Phaser.Sprite} element - element to be added.
 * @param {string} destinationIndex - index (key) to of the destination, where
 * the element will be added.
 */
DragAndDropController.prototype.addToADestination = function(element,
                                                             destinationIndex) {
    this.container.destinations[destinationIndex].restartPosition();
    this.container.destinations[destinationIndex].addElement(element);
};

/**
 * Controls where to locate an element after it is dropped by the player.
 * @method DragAndDropController.fixLocation
 * @param {Phaser.Sprite} element - Dropped element to locate
 */
DragAndDropController.prototype.fixLocation = function(element) {
    var key;
    for (key in this.container.destinations) {
        if (element.overlap(this.container.destinations[key]) &&
            this.container.destinations[key].children.length === 0) {
            this.addToADestination(element, key);
            return;
        }
    }
    this.returnElementToSource(element);
};

/**
 * Determines whether all the destinations have the correct element as children.
 * @method DragAndDropController.elementsInCorrectDestination
 * @returns {boolean} - true if elements are correctly arranged, otherwise
 * false.
 */
DragAndDropController.prototype.elementsInCorrectDestination = function() {
    var key;
    for (key in this.container.destinations) {
        if (this.container.destinations[key].children[0].code !==
            this.container.destinations[key].code) {
            return false;
        }
    }
    return true;
};

/**
 * Determines whether any destination is empty.
 * @method DragAndDropController.emptyDestinations
 * @returns {boolean} - true if any destination is empty, otherwise false
 */
DragAndDropController.prototype.emptyDestinations = function() {
    var key;
    for (key in this.container.destinations) {
        if (this.container.destinations[key].children[0] === undefined) {
            return true;
        }
    }
    return false;
};

/**
 * Locates an element within its source container.
 * @method DragAndDropController.returnElementToSource
 * @param {Phaser.Sprite} element - element to relocate.
 */
DragAndDropController.prototype.returnElementToSource = function(element) {
    element.x = element.sourceX;
    element.y = element.sourceY;
    this.container.source.addChild(element);
};

/**
 * Add every element to the source but in a random order.
 * @method DragAndDropController.addElementsToSourceRandomly
 */
DragAndDropController.prototype.addElementsToSourceRandomly = function() {
    var utils = new Utilities();
    var rdmIndexes = utils.randomIndexesArray(this.container.elements.length);
    var index;
    for (index in rdmIndexes) {
        this.container.source.addElement(
            this.container.elements[rdmIndexes[index]]);
        this.container.elements[rdmIndexes[index]].sourceX =
            this.container.elements[rdmIndexes[index]].x;
        this.container.elements[rdmIndexes[index]].sourceY =
            this.container.elements[rdmIndexes[index]].y;
    }
};
module.exports = DragAndDropController;

},{"../../util/Utilities":67}],17:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 10/10/2015.
 */
var PopUp = require('../../util/PopUp');
var GridLayoutPanel = require('../../util/GridLayoutPanel');
var MenuItem = require('./MenuItem');
var WordUnscramble = require('../WordUnscramble');
var ContextGroups = require('../ContextGroups');
var ImageWordMatch = require('../ImageWordMatch');

/**
 * Menu UI that allows accessing to all the EnglishChallenges.
 * @class EnglishChallengesMenu
 * @extends PopUp
 * @constructor
 */
var EnglishChallengesMenu = function() {
    PopUp.call(this, 'popUpBg', null, 'English Challenges');
    var dimensions = {numberOfRows: 2, numberOfColumns: 4};
    this.panel = new GridLayoutPanel('popUpPanelBg', dimensions);
    this.panel.x = 20;
    this.panel.y = 80;
    this.addChild(this.panel);
    this.createGames();
};

EnglishChallengesMenu.prototype = Object.create(PopUp.prototype);
EnglishChallengesMenu.prototype.constructor = EnglishChallengesMenu;

/**
 * Creates the menu, it adds an icon for every EnglishChallenge, so the player
 * can access them.
 * @method EnglishChallengesMenu.createGames
 */
EnglishChallengesMenu.prototype.createGames = function() {
    var challenges = [];
    challenges.push(new WordUnscramble());
    if (localStorage.getItem('level') === 'levelTwo') {
        challenges.push(new ImageWordMatch());
    }
    if (localStorage.getItem('level') === 'levelThree') {
        challenges.push(new ImageWordMatch());
        challenges.push(new ContextGroups());
    }
    var i;
    for (i in challenges) {
        this.panel.addElement(new MenuItem(challenges[i], this));
        level.game.add.existing(challenges[i]);
    }
};

module.exports = EnglishChallengesMenu;

},{"../../util/GridLayoutPanel":57,"../../util/PopUp":65,"../ContextGroups":11,"../ImageWordMatch":13,"../WordUnscramble":14,"./MenuItem":18}],18:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 15/10/2015.
 */

var ItemGroupView = require('../../items/ItemGroupView');

/**
 * Represents a challenge within the EnglishChallengesMenu.
 * @class MenuItem
 * @extends ItemGroupView
 * @constructor
 * @param {EnglishChallenge} challenge - Challenge that can be accessed through
 * this item.
 * @param {PopUp} parentView - PopUp that contains this item.
 */
var MenuItem = function(challenge, parentView) {
    ItemGroupView.call(this, challenge.englishChallenge.iconKey, 'Play',
        parentView);

    this.challenge = challenge;
    this.updateScoreText();
    this.setTitle(challenge.englishChallenge.name);
    this.setDescription(challenge.englishChallenge.description);
};

MenuItem.prototype = Object.create(ItemGroupView.prototype);
MenuItem.prototype.constructor = MenuItem;

/**
 * Called when the play button is clicked. It close the menu (PopUp), creates
 * a new challenge and displays it to the player.
 * @method MenuItem.buttonAction
 */
MenuItem.prototype.buttonAction = function() {
    this.parentView.close();
    this.challenge.newChallenge();
    this.challenge.open();
};

/**
 * Updates the text that shows the number of points that player can get, after
 * completing the challenge.
 * @method MenuItem.updateScoreText
 */
MenuItem.prototype.updateScoreText = function() {
    this.setAuxText('+ $' + this.challenge.englishChallenge.score);
};

module.exports = MenuItem;


},{"../../items/ItemGroupView":21}],19:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa
 */

var Item = require('./Item');

/**
 * Rate use to calculate health pack prize, based on maxIncreasing value.
 * @constant
 * @type {number}
 */
var PRICE_INCREASE_RATE = 2;
/**
 * HealthPack's gravity value.
 * @constant
 * @type {number}
 */
var GRAVITY = 100;

/**
 * Represents a health pack that player can use to increase his/her current
 * health level.
 * @class HealthPack
 * @extends Item
 * @constructor
 * @param {number} x - HealthPack's x coordinate within the game world.
 * @param {number} y - HealthPack's y coordinate within the game world.
 * @param {number} maxIncreasing - Greatest value to increase when player uses
 * this HealthPack.
 */
var HealthPack = function(x, y, maxIncreasing) {
    Item.call(this, x, y, 'healthPack' + maxIncreasing,
        maxIncreasing * PRICE_INCREASE_RATE);
    this.body.gravity.y = GRAVITY;
    this.maxIncreasing = maxIncreasing;
    this.name = 'Health Pack';
    this.description = 'Increasing: + ' + maxIncreasing + '\n Health Level';
    this.category = 'healthPacks';
};

HealthPack.prototype = Object.create(Item.prototype);
HealthPack.prototype.constructor = HealthPack;

/**
 * Kills the this item whn player picks it up.
 * @method HealthPack.pickUp
 */
HealthPack.prototype.pickUp = function() {
    this.kill();
};

/**
 * Add this HealthPack to the game so that the player can pick it up.
 * @method HealthPack.use
 */
HealthPack.prototype.use = function() {
    if (!this.alive) {
        this.revive();
    }
    this.x = level.player.x;
    this.y = 10;
    level.addHealthPack(this);
};

module.exports = HealthPack;

},{"./Item":20}],20:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa
 */

/**
 * Bounce value for an Item
 * @constant
 * @type {number}
 */
var BOUNCE = 0.7 + Math.random() * 0.2;

/**
 * Represents item that player can pick up an store it in inventory.
 * @class Item
 * @extends Phaser.Sprite
 * @constructor
 * @param {number} x - Item's x coordinate within the world.
 * @param {number} y - Item's y coordinate within the world.
 * @param {string} key - Item texture's key.
 * @param {number} price - Price to purchase or buy this item.
 */
var Item = function(x, y, key, price) {
    Phaser.Sprite.call(this, level.game, x, y, key);
    this.anchor.set(0, 1);
    level.game.physics.arcade.enable(this);
    this.body.bounce.y = BOUNCE;
    this.body.collideWorldBounds = true;
    this.price = price;
    this.name = '';
    this.description = '';
};

Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;

/**
 * Sets the text description for this item.
 * @method Item.setDescription
 * @param {string} description - Text describing this item.
 */
Item.prototype.setDescription = function(description) {
    this.description = description;
};

/**
 * Sets Item's name.
 * @method Item.setName
 * @param {string} name - Item name.
 */
Item.prototype.setName = function(name) {
    this.name = name;
};

module.exports = Item;

},{}],21:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 17/07/2015.
 */
var VerticalLayoutPanel = require('../util/VerticalLayoutPanel');
var Button = require('../util/Button');

/**
 * View for an item in a menu of items.
 * @class ItemGroupView
 * @extends VerticalLayoutPanel
 * @constructor
 * @param {string} iconKey - Item's icon
 * @param {string} buttonText - Text to show on the action button.
 * @param {ItemsPopUp} parentView - View on which the ItemGroupView will be
 * displayed.
 */
var ItemGroupView = function(iconKey, buttonText, parentView) {
    VerticalLayoutPanel.call(this, 'itemGroupBg', 2);

    this.icon = level.game.make.sprite(0, 0, iconKey);
    if (this.icon.height > 50 || this.icon.width > 140) {
        var scaleY = 50 / this.icon.height;
        var scaleX = 140 / this.icon.width;
        if (scaleX > scaleY) {
            this.icon.scale.x = scaleY;
            this.icon.scale.y = scaleY;
        }else {
            this.icon.scale.x = scaleX;
            this.icon.scale.y = scaleX;
        }
    }

    this.auxText = level.game.make.text(this.width - 20, this.height / 2 - 20,
        '');
    this.auxText.font = level.font;
    this.auxText.fontSize = 20;
    this.auxText.fill = '#FFF12B';
    this.auxText.stroke = '#7d655f';
    this.auxText.strokeThickness = 2;
    this.auxText.setShadow(1, 1, 'rgba(0,0,0,0.5)', 5);
    this.auxText.anchor.set(1, 0.8);

    this.title = level.game.make.text(0, 0, 'Title');
    this.title.font = level.font;
    this.title.fontSize = 20;
    this.title.fill = '#473e2c';

    this.description = level.game.make.text(0, 0, 'Des 1 \n Des 2');
    this.description.font = level.font;
    this.description.fontSize = 12;
    this.description.fill = '#000000';
    this.description.align = 'center';

    this.button = new Button(buttonText, this.buttonAction, this);

    this.addElement(this.title);
    this.addElement(this.icon);
    this.addChild(this.auxText);
    this.addElement(this.description);
    this.addElement(this.button);
    this.parentView = parentView;
};

ItemGroupView.prototype = Object.create(VerticalLayoutPanel.prototype);
ItemGroupView.prototype.constructor = ItemGroupView;

/**
 * Action to be performed when the button action is clicked.
 * @method ItemGroupView.buttonAction
 */
ItemGroupView.prototype.buttonAction = function() {};

/**
 * Sets the description text to be displayed to the player.
 * @method ItemGroupView.setDescription
 * @param {string} description - Text that describes the item.
 */
ItemGroupView.prototype.setDescription = function(description) {
    this.description.text = description;
    this.description.x = this.width / 2 - this.description.width / 2;
};

/**
 * Sets the items title to be displayed to the player.
 * @method ItemGroupView.setTitle
 * @param {string} title - Item title.
 */
ItemGroupView.prototype.setTitle = function(title) {
    this.title.text = title;
    this.title.x = this.width / 2 - this.title.width / 2;

};

/**
 * Sets the auxiliary or secondary text.
 * @method ItemGroupView.setAuxText
 * @param {string} auxText - Auxiliary or secondary text of this view.
 */
ItemGroupView.prototype.setAuxText = function(auxText) {
    this.auxText.text = auxText;
};

module.exports = ItemGroupView;

},{"../util/Button":54,"../util/VerticalLayoutPanel":69}],22:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 19/10/2015.
 */

var PopUp = require('../util/PopUp');
var GridLayoutPanel = require('../util/GridLayoutPanel');
var Button = require('../util/Button');

/**
 * View that contains a menu of items, grouped by category.
 * @class ItemsPopUp
 * @extends PopUp
 * @constructor
 * @param {Object[]} tabsLabels - Items categories names.
 * @param {Object[]} categories - Items categories (code Names).
 * @param {string} title - This view's title.
 * @param {numner} columns - Number of columns for the main panel
 * @param {numner} rows - number of rows for the main panel
 */
var ItemsPopUp = function(tabsLabels,
                          categories,
                          title,
                          columns,
                          rows
) {
    PopUp.call(this, 'popUpBg', null, title);

    this.items = [];
    var i;
    var tab;
    var x = 20;
    for (i = 0; i < tabsLabels.length; i++) {
        tab = new Button(tabsLabels[i], this.showTab, this, 'tabBg');
        tab.category = categories[i];
        tab.x = x;
        tab.y = 60;
        x += tab.width + 2;
        this.addChild(tab);
        this.items[categories[i]] = [];
    }

    var dimensions = {numberOfColumns: columns || 4, numberOfRows: rows || 2};
    this.panel = new GridLayoutPanel('popUpPanelBg', dimensions);
    this.panel.x = 20;
    this.panel.y = 100;
    this.firstCategory = categories[0];
    this.addChild(this.panel);
};

ItemsPopUp.prototype = Object.create(PopUp.prototype);
ItemsPopUp.prototype.constructor = ItemsPopUp;

/**
 * Displays a tab's content, before that it cleans the current content.
 * @method ItemsPopUp.showTab
 * @param {Button} tab - Button that represents a tab on the view.
 */
ItemsPopUp.prototype.showTab = function(tab) {
    var key;
    for (key in this.panel.children) {
        this.panel.children[key].kill();
    }
    this.panel.removeAllElements();
    this.fillPanel(tab.category);
};

/**
 * Fills the main panel with the items that belongs to a category.
 * @method ItemsPopUp.fillPanel
 * @param {string} category - Categories code name or key.
 */
ItemsPopUp.prototype.fillPanel = function(category) {
    var key;
    for (key in this.items[category]) {
        if (!this.items[category][key].alive) {
            this.items[category][key].revive();
        }
        this.panel.addElement(this.items[category][key]);
    }
};

/**
 * Opens the PopItem showing first tab.
 * @method ItemsPopUp.open
 */
ItemsPopUp.prototype.open = function() {
    this.panel.removeAllElements();
    this.fillPanel(this.firstCategory);
    PopUp.prototype.open.call(this);
};

module.exports = ItemsPopUp;

},{"../util/Button":54,"../util/GridLayoutPanel":57,"../util/PopUp":65}],23:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 22/06/2015.
 */
var ItemsPopUp = require('../ItemsPopUp');
var InventoryItem = require ('./InventoryItem');
var HealthPack = require('../HealthPack');
var Revolver = require('../weapons/Revolver');
var MachineGun = require('../weapons/MachineGun');
var Button = require('../../util/Button');

/**
 * Ui and control for the game Inventory.
 * @class Inventory
 * @extends ItemsPopUp
 * @constructor
 */
var Inventory = function() {
    var tabsLabels = ['Weapons', 'Health Packs', 'Vehicles'];
    var categories = ['weapons', 'healthPacks', 'transport'];
    ItemsPopUp.call(this, tabsLabels, categories, 'Inventory');
    this.button = new Button('Add Items', level.store.open, level.store);
    this.button.x = this.width - 140;
    this.button.y = 60;
    this.addChild(this.button);
    this.loadInventory();
};

Inventory.prototype = Object.create(ItemsPopUp.prototype);
Inventory.prototype.constructor = Inventory;

/**
 * Adds a new item to the inventory to be displayed for the player.
 * @method Inventory.addItem
 * @param {Item} item - Item to be added to the inventory.
 */
Inventory.prototype.addItem = function(item) {
    if (this.items[item.category][item.key] === undefined) {
        this.items[item.category][item.key] = new InventoryItem(item, this);
    }
    this.items[item.category][item.key].amountAvailable ++;
    this.items[item.category][item.key].updateAmountAvailableText();
    localStorage.setItem(item.key + 'Item',
        this.items[item.category][item.key].amountAvailable);
};

/**
 * Loads an item to the inventory to be displayed for the player.
 * @method Inventory.loadItem
 * @param {Item} item - Item to be loaded to the inventory.
 */
Inventory.prototype.loadItem = function(item) {
    this.items[item.category][item.key] = new InventoryItem(item, this);
    this.items[item.category][item.key].amountAvailable =
        localStorage.getItem(item.key + 'Item');
    this.items[item.category][item.key].updateAmountAvailableText();
};

/**
 * Loads the player's inventory.
 * @method Store.createItemGroups
 */
Inventory.prototype.loadInventory = function() {
    var item;
    if (localStorage.getItem('revolverItem') !== null) {
        item = new Revolver(0, 0, false);
        this.loadItem(item);
    }
    if (localStorage.getItem('machineGunItem') !== null) {
        item = new MachineGun(0, 0, false);
        this.loadItem(item);
    }

    var healthPackTypes = [5, 20, 50];
    var i;
    var healthPackKey;
    for (i in healthPackTypes) {
        healthPackKey = 'healthPack' + healthPackTypes[i] + 'Item';
        if (localStorage.getItem(healthPackKey) !== null) {
            item = new HealthPack(0, 0, 5);
            this.loadItem(item);
        }
    }

    var carsKey = ['car', 'jeep', 'bus', 'truck', 'taxi', 'ambulance'];
    for (i in carsKey) {
        if (localStorage.getItem(carsKey[i] + 'Item') !== null) {
            item = level.createInteractiveCar(carsKey[i]);
            this.loadItem(item);
        }
    }
};

module.exports = Inventory;

},{"../../util/Button":54,"../HealthPack":19,"../ItemsPopUp":22,"../weapons/MachineGun":35,"../weapons/Revolver":37,"./InventoryItem":24}],24:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 17/07/2015.
 */
var ItemGroupView = require('../ItemGroupView');

/**
 * View an inventory item.
 * @class InventoryItem
 * @extends ItemGroupView
 * @constructor
 * @param {Item} item - Item to be displayed by this class.
 * @param {Inventory} parentView - View on which the item will be displayed.
 */
var InventoryItem = function(item, parentView) {
    ItemGroupView.call(this, item.key, 'Use', parentView);
    this.item = item;
    this.amountAvailable = 0;
    this.updateAmountAvailableText();
    this.setTitle(this.item.name);
    this.setDescription(this.item.description);
};

InventoryItem.prototype = Object.create(ItemGroupView.prototype);
InventoryItem.prototype.constructor = InventoryItem;

/**
 * Allows the player to use this item.
 * @method InventoryItem.buttonAction
 */
InventoryItem.prototype.buttonAction = function() {
    if (this.amountAvailable > 0) {
        this.item.use();
        this.amountAvailable --;
        localStorage.setItem(this.item.key + 'Item', this.amountAvailable);
        this.updateAmountAvailableText();
        this.parentView.close();
    }else {
        level.showErrorMessage('You do not have more of this item.',
            this.parent);
    }
};

/**
 * Updates the remaining amount of this item.
 * @method InventoryItem.updateAmountAvailableText
 */
InventoryItem.prototype.updateAmountAvailableText = function() {
    this.setAuxText('x ' + this.amountAvailable);
};

module.exports = InventoryItem;

},{"../ItemGroupView":21}],25:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 22/06/2015.
 */
var ItemsPopUp = require('../ItemsPopUp');
var StoreItem = require ('./StoreItem');
var HealthPack = require('../HealthPack');
var Revolver = require('../weapons/Revolver');
var MachineGun = require('../weapons/MachineGun');
var Pistol = require('../weapons/Pistol');
var Rifle = require('../weapons/Rifle');
var Carbine = require('../weapons/Carbine');

/**
 * View and control of the game store
 * @class Store
 * @extends ItemsPopUp
 * @constructor
 */
var Store = function() {
    var tabsLabels = ['Weapons', 'Health Packs', 'Vehicles'];
    var categories = ['weapons', 'healthPacks', 'transport'];
    ItemsPopUp.call(this, tabsLabels, categories, 'Store');

    var cashIcon = level.game.make.sprite(this.width - 190, 60, 'money');
    var scale = 30 / cashIcon.height;
    cashIcon.scale.x = scale;
    cashIcon.scale.y = scale;
    cashIcon.anchor.set(1, 0);
    this.addChild(cashIcon);

    this.cash = level.game.make.text(this.width - 180, 60,
        'Money: $ ' + level.player.score);
    this.cash.font = level.font;
    this.cash.fontSize = 20;
    this.cash.fill = '#FFFFFF';
    this.cash.stroke = '#000';
    this.cash.strokeThickness = 3;
    this.addChild(this.cash);
    this.createItems();
};

Store.prototype = Object.create(ItemsPopUp.prototype);
Store.prototype.constructor = Store;

/**
 * Add an item to the store to be displayed for the user.
 * @method Store.addItem
 * @param {Item} item - Item to be added to the inventory.
 */
Store.prototype.addItem = function(item) {
    if (this.items[item.category][item.key] === undefined) {
        this.items[item.category][item.key] = new StoreItem(item, this);
    }
};

/**
 * Updates player score or money text on main GUI and on store
 * @method Store.updateMoney
 */
Store.prototype.updateMoney = function() {
    level.updateScoreText();
    this.cash.text = 'Money: $ ' + level.player.score;
};

/**
 * Creates all items views.
 * @method Store.createItemGroups
 */
Store.prototype.createItems = function() {
    this.addItem(new Revolver(0, 0, false));
    this.addItem(new Pistol(0, 0, false));
    this.addItem(new MachineGun(0, 0, false));
    this.addItem(new Carbine(0, 0, false));
    this.addItem(new Rifle(0, 0, false));

    this.addItem(new HealthPack(0, 0, 5));
    this.addItem(new HealthPack(0, 0, 20));
    this.addItem(new HealthPack(0, 0, 50));

    var carsKey = ['car', 'jeep', 'bus', 'truck', 'taxi', 'ambulance'];
    var i;
    for (i in carsKey) {
        this.addItem(level.createInteractiveCar(carsKey[i]));
    }
};

/**
 * Opens the store, before that updates the current money
 * @method Enemy.killCharacter
 */
Store.prototype.open = function() {
    this.updateMoney();
    ItemsPopUp.prototype.open.call(this);
};
module.exports = Store;

},{"../HealthPack":19,"../ItemsPopUp":22,"../weapons/Carbine":34,"../weapons/MachineGun":35,"../weapons/Pistol":36,"../weapons/Revolver":37,"../weapons/Rifle":38,"./StoreItem":26}],26:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 17/07/2015.
 */
var ItemGroupView = require('../ItemGroupView');

/**
 * View for a Store item.
 * @class StoreItem
 * @extends ItemGroupView
 * @constructor
 * @param {Item} item - Item to be displayed by this class.
 * @param {Store} parentView - View on which the item will be displayed.
 */
var StoreItem = function(item, parentView) {
    ItemGroupView.call(this, item.key, 'Buy', parentView);
    this.item = item;
    this.updatePriceText();
    this.setTitle(this.item.name);
    this.setDescription(this.item.description);
};

StoreItem.prototype = Object.create(ItemGroupView.prototype);
StoreItem.prototype.constructor = StoreItem;

/**
 * Updates the price of the item to be displayed.
 * @method StoreItem.updatePriceText
 */
StoreItem.prototype.updatePriceText = function() {
    this.setAuxText('$ ' + this.item.price);
};

/**
 * Allows the player to buy this item.
 * @method StoreItem.buttonAction
 */
StoreItem.prototype.buttonAction = function() {
    var successfulPurchase = level.player.buyItem(this.item);
    if (successfulPurchase) {
        this.item.use();
        level.showSuccessMessage('Successful Purchase!', this.parent);
        this.parentView.updateMoney();
    }else {
        level.showErrorMessage('You do not have enough money.', this.parent);
    }
};

module.exports = StoreItem;

},{"../ItemGroupView":21}],27:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 08/12/2015.
 */
var VocabularyItem = require('./VocabularyItem');

/**
 * Item that represents a clue for the player.
 * @class ClueItem
 * @extends Item
 * @constructor
 * @param {number} x - ClueItem's x coordinate within the game world.
 * @param {number} y - ClueItem's y coordinate within the game world.
 * @param {string} key - ClueItem's texture
 * @param {InteractionManager} interactionManager - Object that allows
 * displaying player's messages
 */
var ClueItem = function(x,
                        y,
                        key,
                        interactionManager) {
    VocabularyItem.call(this, x, y, key);
    var scale = 30 / this.height;
    this.scale.y = scale;
    this.scale.x = scale;
    this.interactionManager = interactionManager;
};

ClueItem.prototype = Object.create(VocabularyItem.prototype);
ClueItem.prototype.constructor = ClueItem;

/**
 * Kills the this item whn player picks it up.
 * @method ClueItem.pickUp
 */
ClueItem.prototype.pickUp = function() {
    this.kill();
    this.interactionManager.openDialogs();
};

/**
 * Displays this house dialog
 * @method ClueItem.openActivity
 */
ClueItem.prototype.openActivity = function() {
    this.interactionManager.openDialogs();
};

module.exports = ClueItem;


},{"./VocabularyItem":29}],28:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 29/08/2015.
 */
var VocabularyItem = require('./VocabularyItem');
var ResourceBar = require('../../util/ResourceBar');
var Button = require('../../util/Button');

/**
 * Car gravity.
 * @constant
 * @type {number}
 */
var CAR_GRAVITY = 30000;
/**
 * Fuel bar width.
 * @constant
 * @type {number}
 */
var BAR_WIDTH = 100;
/**
 * Fuel bar height.
 * @constant
 * @type {number}
 */
var BAR_HEIGHT = 10;

/**
 * Represents a car, which player can interact with.
 * @class InteractiveCar
 * @extends Phaser.Sprite
 * @constructor
 * @param {number} x - Car x coordinate within the world.
 * @param {number} y - Car y coordinate within the world.
 * @param {string} name - Car name.
 * @param {string} backgroundKey - Car texture key.
 * @param {number} price - Car price
 * @param {number} speed - Car speed
 * @param {number} gasoline - Car max gasoline
 */
var InteractiveCar = function(x,
                              y,
                              backgroundKey,
                              price,
                              speed,
                              gasoline) {
    VocabularyItem.call(this, x, y, backgroundKey, false, price);

    level.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.anchor.set(0.5, 1);
    this.animations.add('left', [0], 10, true);
    this.animations.add('right', [1], 10, true);
    this.occupied = false;
    this.stopLeftFrameIndex = 0;
    this.stopRightFrameIndex = 1;
    this.remainingGas = gasoline;
    this.gasoline = gasoline;
    this.speed = speed;
    this.maxSpeed = speed * 1.5;
    this.description = 'Speed: ' + this.speed +
        '\nGasoline: ' + this.gasoline;
    this.category = 'transport';

    this.gasBar = new ResourceBar(-(this.width - BAR_WIDTH) / 2,
        -this.height - 30, {width: BAR_WIDTH, height: BAR_HEIGHT});
    var fuelIcon = level.game.make.sprite(0, 0, 'gas');
    fuelIcon.anchor.set(1, 0.5);
    this.gasBar.addChild(fuelIcon);
    this.gasBar.visible = false;
    this.addChild(this.gasBar);

    this.getOnButton = new Button ('Get on', this.getOn, this);
    this.getOnButton.x = -(this.width - this.getOnButton.width) / 2;
    this.getOnButton.y = -this.height;
    this.addChild(this.getOnButton);
};

InteractiveCar.prototype = Object.create(VocabularyItem.prototype);
InteractiveCar.prototype.constructor = InteractiveCar;

/**
 * Allows the player to get on the car.
 * @method InteractiveCar.getOn
 */
InteractiveCar.prototype.getOn = function() {
    if (this.remainingGas > 0) {
        level.myVocabulary.addItem(this);
        this.gasBar.visible = true;
        this.getOnButton.visible = false;
        level.player.onVehicle = true;
        level.player.relocate(this.x, this.y - 100);
        level.player.changeSpeed(this.speed, this.maxSpeed);
        level.player.changeGravity(CAR_GRAVITY);
        this.occupied = true;
    }
};

/**
 * Allows the player to get off the car.
 * @method InteractiveCar.getOff
 */
InteractiveCar.prototype.getOff = function() {
    this.stop();
    level.player.onVehicle = false;
    level.player.relocate(this.x + 100, this.y - 100);
    level.player.resetSpeed();
    level.player.resetGravity();
    this.occupied = false;
};

/**
 * Updates car current state, animations and traveled distance, to stop it when
 * it has traveled the longest possible distance.
 * @method InteractiveCar.update
 */
InteractiveCar.prototype.update = function() {
    if (this.occupied) {
        this.body.velocity.x = level.player.body.velocity.x;
        if (this.body.velocity.x < 0) {
            this.animations.play('left');
            this.remainingGas --;
        }else if (this.body.velocity.x > 0) {
            this.animations.play('right');
            this.remainingGas --;
        }else if (level.direction > 0) {
            this.frame = this.stopRightFrameIndex;
        }else if (level.direction < 0) {
            this.frame = this.stopLeftFrameIndex;
        }
        if (this.remainingGas <= 0) {
            this.getOff();
        }
        this.gasBar.updateResourceBarLevel(this.remainingGas /
            this.gasoline);
    }
};

/**
 * Determines whether the car is stopped or not.
 * @method InteractiveCar.isStopped
 * @returns {boolean} - True if car speed = 0, otherwise false.
 */
InteractiveCar.prototype.isStopped = function() {
    return this.body.velocity.x === 0;
};

/**
 * Stops the car, making speed = 0.
 * @method InteractiveCar.stop
 */
InteractiveCar.prototype.stop = function() {
    this.body.velocity.x = 0;
};

/**
 * Allows the character to use this car.
 * @method InteractiveCar.use
 */
InteractiveCar.prototype.use = function() {
    if (!this.alive) {
        this.revive();
    }
    this.x = level.player.x + 50;
    this.y = level.GROUND_HEIGHT;
    level.addCar(this);
};

module.exports = InteractiveCar;

},{"../../util/Button":54,"../../util/ResourceBar":66,"./VocabularyItem":29}],29:[function(require,module,exports){

/**
 * @ignore Created by Edwin Gamboa on 06/11/2015.
 */
var Item = require('./../Item');
var VerticalLayoutPopUp = require ('../../util/VerticalLayoutPopUp');

/**
 * Item that represents a clue for the player.
 * @class VocabularyItem
 * @extends Item
 * @constructor
 * @param {number} x - VocabularyItem's x coordinate within the game world.
 * @param {number} y - VocabularyItem's y coordinate within the game world.
 * @param {string} key - VocabularyItem's texture
 * belongs.
 * @param {boolean} [openImmediately = flase] - Indicates whether this
 * vocabulary item should display the message when the player picksItUp
 * @param {number} [price = 0] - The price of this item
 */
var VocabularyItem = function(x,
                              y,
                              key,
                              openImmediately,
                              price) {
    Item.call(this, x, y, key, price || 0);
    this.setProperties(key);
    this.makeDialog();
    this.openImmediately = openImmediately || false;
};

VocabularyItem.prototype = Object.create(Item.prototype);
VocabularyItem.prototype.constructor = VocabularyItem;

/**
 * Displays the definition of this VocabularyItem
 * @method VocabularyItem.use
 */
VocabularyItem.prototype.show = function() {
    this.popUp.open();
};

/**
 * Makes the dialog that is delivered to the player when he checks a vocabulary.
 * @method VocabularyItem.makeDialog
 */
VocabularyItem.prototype.makeDialog = function() {
    this.popUp = new VerticalLayoutPopUp('mediumPopUpBg', null, this.name);
    var icon = level.game.make.sprite(0, 0, this.key);
    if (icon.height > 200) {
        var scale = 200 / icon.height;
        icon.scale.x = scale;
        icon.scale.y = scale;
    }
    var dialogText = level.game.make.text(0, 0, this.definition);
    dialogText.font = level.font;
    dialogText.fontSize = 20;
    dialogText.fill = '#000000';
    dialogText.align = 'center';
    this.popUp.addElement(icon);
    this.popUp.addElement(dialogText);
    level.game.add.existing(this.popUp);
};

/**
 * Creates a car according to its key.
 * @method InteractiveCar.getOn
 * @param {string} key - VocabularyItem's key
 */
VocabularyItem.prototype.setProperties = function(key) {
    switch (key) {
        //Places
        case 'factory':
            this.name = 'Old Factory';
            this.definition = 'A building or group of buildings' +
                '\nwhere products are made';
            this.categoryIndex = 0;
            break;
        case 'school':
            this.name = 'School';
            this.definition = 'A place for education; a place where' +
                '\npeople go to learn';
            this.categoryIndex = 0;
            break;
        case 'hospital':
            this.name = 'Hospital';
            this.definition = 'A place where sick or injured people' +
                '\nare given medical care';
            this.categoryIndex = 0;
            break;
        case 'coffeeShop':
            this.name = 'Coffee Shop';
            this.definition = 'A small restaurant that serves coffee and' +
                '\nother drinks as well as simple foods';
            this.categoryIndex = 0;
            break;
        case 'bank':
            this.name = 'Bank';
            this.definition = 'An organization that keeps and lends money';
            this.categoryIndex = 0;
            break;
        case 'zoo':
            this.name = 'Zoo';
            this.definition = 'A place where many kinds of animals are ' +
                '\nkept so that people can see them';
            this.categoryIndex = 0;
            break;
        case 'gasStation':
            this.name = 'Gas Station';
            this.definition = 'A place where gasoline for vehicles is sold';
            this.categoryIndex = 0;
            break;
        case 'playground':
            this.name = 'Playground';
            this.definition = 'An outdoor area where children can play';
            this.categoryIndex = 0;
            break;
        case 'bookStore':
            this.name = 'Bookstore';
            this.definition = 'A store that sells books';
            this.categoryIndex = 0;
            break;
        case 'hotel':
            this.name = 'Hotel';
            this.definition = 'A place that has rooms in which people' +
                '\ncan stay especially when they are traveling';
            this.categoryIndex = 0;
            break;
        case 'superMarket':
            this.name = 'Super Market';
            this.definition = 'A store where customers can buy a variety' +
                '\nof foods and usually household items';
            this.categoryIndex = 0;
            break;
        case 'fireStation':
            this.name = 'Fire Station';
            this.definition = 'A building in which the members of a fire' +
                '\n department and the equipment used to' +
                '\nput out fires are located';
            this.categoryIndex = 0;
            break;
        case 'policeStation':
            this.name = 'Police Station';
            this.definition = 'A place where local \n police officers work';
            this.categoryIndex = 0;
            break;
        case 'blueHouse':
            this.name = 'House';
            this.definition = 'A building in which a family lives';
            this.categoryIndex = 0;
            break;
        case 'store':
            this.name = 'Store';
            this.definition = 'A building or room where things are sold';
            this.categoryIndex = 0;
            break;
        //Family
        case 'child':
            this.name = 'Child';
            this.definition = 'A young person; a son or daughter';
            this.categoryIndex = 1;
            break;
        case 'daughter':
            this.name = 'Daughter';
            this.definition = 'A female child';
            this.categoryIndex = 1;
            break;
        case 'family':
            this.name = 'Family';
            this.definition = 'A group of people who are related to each other';
            this.categoryIndex = 1;
            break;
        case 'father':
            this.name = 'Father';
            this.definition = 'A male parent';
            this.categoryIndex = 1;
            break;
        case 'friend':
            this.name = 'Friend';
            this.definition = 'A person who you like and enjoy being with';
            this.categoryIndex = 1;
            break;
        case 'husband':
            this.name = 'Husband';
            this.definition = 'A married man; the man someone is married to';
            this.categoryIndex = 1;
            break;
        case 'kid':
            this.name = 'Kid';
            this.definition = 'A son or daughter; a young person';
            this.categoryIndex = 1;
            break;
        case 'mother':
            this.name = 'Mother';
            this.definition = 'A female parent';
            this.categoryIndex = 1;
            break;
        case 'parent':
            this.name = 'Parent';
            this.definition = 'A person who is a father or mother; ' +
                '\na person who has a child';
            this.categoryIndex = 1;
            break;
        case 'son':
            this.name = 'Son';
            this.definition = 'A male child';
            this.categoryIndex = 1;
            break;
        case 'wife':
            this.name = 'Wife';
            this.definition = 'A married woman; the woman someone is ' +
                'married to';
            this.categoryIndex = 1;
            break;
        //Transport
        case 'car':
            this.name = 'Car';
            this.definition = 'A vehicle that has four wheels and an engine ' +
                'and \nthat is used for carrying passengers on roads';
            this.categoryIndex = 2;
            break;
        case 'jeep':
            this.name = 'Jeep';
            this.definition = 'Used for a small truck that can be driven over' +
                '\nvery rough surfaces';
            this.categoryIndex = 2;
            break;
        case 'bus':
            this.name = 'Bus';
            this.definition = 'A large vehicle that is used for carrying ' +
                'passengers \nespecially along a particular route at ' +
                'particular times';
            this.categoryIndex = 2;
            break;
        case 'truck':
            this.name = 'Truck';
            this.definition = 'A very large, heavy vehicle that is used to ' +
                'move \mlarge or numerous objects';
            this.categoryIndex = 2;
            break;
        case 'taxi':
            this.name = 'Taxi';
            this.definition = 'A car that carries passengers to a place for ' +
                'an \namount of money that is based on the distance ' +
                '\ntravelled';
            this.categoryIndex = 2;
            break;
        case 'ambulance':
            this.name = 'Ambulance';
            this.definition = 'A vehicle used for taking hurt or sick ' +
                'people to \nthe hospital especially in emergencies';
            this.categoryIndex = 2;
            break;
        //Personal Items
        case 'bracelet':
            this.name = 'Bracelet';
            this.definition = 'A piece of jewelry worn on the wrist';
            this.categoryIndex = 3;
            break;
        case 'cap':
            this.name = 'Cap';
            this.definition = 'A small, soft hat that often has a hard ' +
                'curved part \n(called a visor) that extends out over your ' +
                'eyes';
            this.categoryIndex = 3;
            break;
        case 'ring':
            this.name = 'Ring';
            this.definition = 'A piece of jewelry that is worn usually on a ' +
                'finger';
            this.categoryIndex = 3;
            break;
        case 'necklace':
            this.name = 'Necklace';
            this.definition = 'A piece of jewelry that is worn around your ' +
                'neck';
            this.categoryIndex = 3;
            break;
        case 'watch':
            this.name = 'Watch';
            this.definition = 'A device that shows what time it is and that ' +
                '\nyou wear on your wrist or carry in a pocket';
            this.categoryIndex = 3;
            break;
        case 'glasses':
            this.name = 'Glasses';
            this.definition = 'A pair of glass or plastic lenses set into a ' +
                '\nframe and worn over the eyes to help a person see';
            this.categoryIndex = 3;
            break;
    }
};

module.exports = VocabularyItem;


},{"../../util/VerticalLayoutPopUp":70,"./../Item":20}],30:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 08/12/2015.
 */
var VocabularyItem = require('./VocabularyItem');

/**
 * Item that represents a clue for the player.
 * @class WorldItem
 * @extends Item
 * @constructor
 * @param {number} x - VocabularyItem's x coordinate within the game world.
 * @param {number} y - VocabularyItem's y coordinate within the game world.
 * @param {string} key - WorldItem's texture
 */
var WorldItem = function(x, y, key) {
    VocabularyItem.call(this, x, y, key);
};

WorldItem.prototype = Object.create(VocabularyItem.prototype);
WorldItem.prototype.constructor = WorldItem;

/**
 * Kills this item when player picks it up.
 * @method WorldItem.pickUp
 */
WorldItem.prototype.pickUp = function() {
    level.vocabularyItems.remove(this);
    level.addObject(this);
};

module.exports = WorldItem;

},{"./VocabularyItem":29}],31:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 29/11/2015.
 */
var ItemsPopUp = require('../ItemsPopUp');
var MyVocabularyItem = require ('./MyVocabularyItem');
var Utilities = require('../../util/Utilities');
var VocabularyItem = require('../vocabularyItems/VocabularyItem');

/**
 * Ui and control for the game MyVocabulary.
 * @class MyVocabulary
 * @extends ItemsPopUp
 * @constructor
 */
var MyVocabulary = function() {
    this.categoriesLabels = ['Places', 'Family', 'Transport', 'Personal Items'];
    this.categories = ['places', 'family', 'transport', 'personalItems'];
    ItemsPopUp.call(this, this.categoriesLabels, this.categories,
        'Vocabulary', 5, 3);
    this.loadVocabulary();
};

MyVocabulary.prototype = Object.create(ItemsPopUp.prototype);
MyVocabulary.prototype.constructor = MyVocabulary;

/**
 * Adds a new item to the inventory to be displayed for the player.
 * @method MyVocabulary.addItem
 * @param {Item} item - Item to be added to the vocabulary.
 */
MyVocabulary.prototype.addItem = function(item) {
    var category = this.categories[item.categoryIndex];
    if (this.items[category][item.key] === undefined) {
        this.items[category][item.key] = new MyVocabularyItem(item, this);
        this.items[category].length ++;
        localStorage.setItem(item.key + 'Voc', 0);
    }
};

/**
 * Loads an item to the inventory to be displayed for the player.
 * @method Inventory.loadItem
 * @param {Item} item - Item to be loaded to the vocabulary.
 * @param {bool} learned - Indicates whether the player has learned the word or
 * not.
 */
MyVocabulary.prototype.loadItem = function(item, learned) {
    var category = this.categories[item.categoryIndex];
    this.items[category][item.key] = new MyVocabularyItem(item, this, learned);
    this.items[category].length ++;
};

/**
 * Marks a vocabulary item as learned.
 * @method MyVocabulary.markAsLearned
 * @param {VocabularyItem} item - VocabularyItem's key
 */
MyVocabulary.prototype.markAsLearned = function(item) {
    var category = this.categories[item.categoryIndex];
    this.items[category][item.key].addLearnedIcon();
    localStorage.setItem(item.key + 'Voc', 1);
};

/**
 * Returns an array with the desired number of words.
 * @method MyVocabulary.randomVocabularyItems
 * @param {number} numberOfWords - Desired number of words
 * @return {Array} - Array containing random words from the vocabulary.
 */
MyVocabulary.prototype.randomVocabularyItems = function(numberOfWords) {
    var util = new Utilities();
    var randomCategory = this.randomCategory(numberOfWords);
    var indexes = util.randomIndexesArray(this.items[randomCategory].length);
    var vocabularyItems = [];
    var i;
    var key;
    var j;
    for (i = 0; i < numberOfWords; i++) {
        j = 0;
        for (key in this.items[randomCategory]) {
            if (j === indexes[i]) {
                vocabularyItems.push(this.items[randomCategory][key].item);
                break;
            }else {
                j ++;
            }
        }
    }
    return vocabularyItems;
};

/**
 * Returns a random category from the vocabulary, that has at least a certain
 * number of words.
 * @method MyVocabulary.randomCategory
 * @param numberOfWords - Minimum number of words that should have the category.
 * @returns {string} - a random category that has a certain number of words.
 */
MyVocabulary.prototype.randomCategory = function(numberOfWords) {
    var emptyCategory = true;
    var index;
    var category;
    while (emptyCategory) {
        index = level.game.rnd.integerInRange(0, this.categories.length - 1);
        category = this.categories[index];
        if (this.items[category].length >= numberOfWords) {
            emptyCategory = false;
        }
    }
    return category;
};

/**
 * Loads the player's vocabulary.
 * @method Store.createItemGroups
 */
MyVocabulary.prototype.loadVocabulary = function() {
    var keys = ['factory', 'school', 'hospital', 'coffeeShop', 'bank', 'zoo',
        'gasStation', 'playground', 'bookStore', 'hotel', 'superMarket',
        'fireStation', 'policeStation', 'blueHouse', 'store', 'child',
        'daughter', 'family', 'father', 'friend', 'husband', 'kid', 'mother',
        'parent', 'son', 'wife', 'car', 'jeep', 'bus', 'truck', 'taxi',
        'ambulance', 'bracelet', 'cap', 'ring', 'necklace', 'watch', 'glasses'];
    var i;
    var item;
    var learned;
    for (i in keys) {
        if (localStorage.getItem(keys[i] + 'Voc') !== null) {
            learned = false;
            item = new VocabularyItem(0, 0, keys[i]);
            if (parseInt(localStorage.getItem(keys[i] + 'Voc')) === 1) {
                learned = true;
            }
            this.loadItem(item, learned);
        }
    }
};

module.exports = MyVocabulary;

},{"../../util/Utilities":67,"../ItemsPopUp":22,"../vocabularyItems/VocabularyItem":29,"./MyVocabularyItem":32}],32:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 29/11/2015.
 */
var VerticalLayoutPanel = require('../../util/VerticalLayoutPanel');
var Button = require('../../util/Button');

/**
 * View an inventory item.
 * @class MyVocabularyItem
 * @extends ItemGroupView
 * @constructor
 * @param {Item} item - Item to be displayed by this class.
 * @param {Inventory} parentView - View on which the item will be displayed.
 * @param {bool} learned - Indicates whether the player has learned the word or
 * not.
 */
var MyVocabularyItem = function(item, parentView, learned) {
    VerticalLayoutPanel.call(this, 'myVocabularyItemBg', 4);
    this.item = item;
    this.icon = level.game.make.sprite(0, 0, this.item.key);
    var scale = 45 / this.icon.height;
    this.icon.scale.x = scale;
    this.icon.scale.y = scale;
    this.title = level.game.make.text(0, 0, this.item.name);
    this.title.font = level.font;
    this.title.fontSize = 15;
    this.title.fill = '#473e2c';

    this.button = new Button('Show', this.buttonAction, this);

    this.addElement(this.title);
    this.addElement(this.icon);
    this.addElement(this.button);
    this.parentView = parentView;
    this.learned = learned || false;
    if (this.learned) {
        this.addLearnedIcon();
    }
};

MyVocabularyItem.prototype = Object.create(VerticalLayoutPanel.prototype);
MyVocabularyItem.prototype.constructor = MyVocabularyItem;

/**
 * Allows the player to use this item.
 * @method MyVocabularyItem.buttonAction
 */
MyVocabularyItem.prototype.buttonAction = function() {
    this.item.show();
};

/**
 * Adds an icon to this view, that indicates that the player already learned,
 * learned the word.
 * @method MyVocabularyItem.addLearnedIcon
 */
MyVocabularyItem.prototype.addLearnedIcon = function() {
    var learnedIcon = level.game.make.sprite(this.width - 20, this.height / 2,
        'learned');
    learnedIcon.anchor.set(1, 0.8);
    this.addChild(learnedIcon);
};

module.exports = MyVocabularyItem;

},{"../../util/Button":54,"../../util/VerticalLayoutPanel":69}],33:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 10/07/2015.
 */

/**
 * Controls a bullet from a weapon.
 * @class Bullet
 * @extends Phaser.Sprite
 * @constructor
 * @param {number} power - Damage that can cause this bullet.
 * @param {string} imageKey - Texture's key of this bullet.
 */
var Bullet = function(power, imageKey) {
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

},{}],34:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 06/03/2016.
 */

var Weapon = require('./Weapon');

/**
 * Default number of bullets for this weapon.
 * @constant
 * @type {number}
 */
var CARBINE_NUMBER_OF_BULLETS = 30;
/**
 * Texture's key for this weapon.
 * @constant
 * @type {number}
 */
var CARBINE_KEY = 'carbine';
/**
 * Texture's key for this weapon bullets.
 * @constant
 * @type {number}
 */
var CARBINE_BULLET_KEY = 'bullet2';
/**
 * The time player is allowed to shoot again.
 * @constant
 * @type {number}
 */
var CARBINE_NEXT_FIRE = 1;
/**
 * This weapon bullets' speed
 * @constant
 * @type {number}
 */
var CARBINE_BULLET_SPEED = 400;
/**
 * Rate at which this weapon fires, the lower the number, the higher the firing
 * rate.
 * @constant
 * @type {number}
 */
var CARBINE_FIRE_RATE = 270;
/**
 * Damage that can cause this weapon bullets.
 * @constant
 * @type {number}
 */
var CARBINE_BULLET_POWER = 3;
/**
 * The price that this weapon costs.
 * @constant
 * @type {number}
 */
var PRICE = 90;

/**
 * Represents a Carbine, which is a  kind of a Weapon.
 * @class Carbine
 * @extends Weapon
 * @constructor
 * @param {number} x - Weapon's x coordinate within the game world.
 * @param {number} y - Weapon's y coordinate within the game world.
 * @param {boolean} infinite - Indicates weather this weapon has infinite
 * bullets or not.
 */
var Carbine = function(x, y, infinite) {
    Weapon.call(
        this,
        x,
        y,
        CARBINE_NUMBER_OF_BULLETS,
        CARBINE_KEY,
        CARBINE_BULLET_KEY,
        CARBINE_NEXT_FIRE,
        CARBINE_BULLET_SPEED,
        CARBINE_FIRE_RATE,
        CARBINE_BULLET_POWER,
        infinite,
        PRICE
    );
    this.name = 'Carbine';
};

Carbine.prototype = Object.create(Weapon.prototype);
Carbine.prototype.constructor = Carbine;

module.exports = Carbine;

},{"./Weapon":39}],35:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 23/07/2015.
 */
var Weapon = require('./Weapon');

/**
 * Default number of bullets for this weapon.
 * @constant
 * @type {number}
 */
var MACHINE_GUN_NUMBER_OF_BULLETS = 40;
/**
 * Texture's key for this weapon.
 * @constant
 * @type {number}
 */
var MACHINE_GUN_KEY = 'machineGun';
/**
 * Texture's key for this weapon bullets.
 * @constant
 * @type {number}
 */
var MACHINE_GUN_BULLET_KEY = 'bullet2';
/**
 * The time player is allowed to shoot again.
 * @constant
 * @type {number}
 */
var MACHINE_GUN_NEXT_FIRE = 1;
/**
 * This weapon bullets' speed
 * @constant
 * @type {number}
 */
var MACHINE_GUN_BULLET_SPEED = 400;
/**
 * Rate at which this weapon fires, the lower the number, the higher the firing
 * rate.
 * @constant
 * @type {number}
 */
var MACHINE_GUN_FIRE_RATE = 200;
/**
 * Damage that can cause this weapon bullets.
 * @constant
 * @type {number}
 */
var MACHINE_GUN_BULLET_POWER = 2;
/**
 * The price that this weapon costs.
 * @constant
 * @type {number}
 */
var PRICE = 50;

/**
 * Represents a MachineGun, which is a  kind of a Weapon.
 * @class MachineGun
 * @extends Weapon
 * @constructor
 * @param {number} x - Weapon's x coordinate within the game world.
 * @param {number} y - Weapon's y coordinate within the game world.
 * @param {boolean} infinite - Indicates weather this weapon has infinite
 * bullets or not.
 */
var MachineGun = function(x, y, infinite) {
    Weapon.call(
        this,
        x,
        y,
        MACHINE_GUN_NUMBER_OF_BULLETS,
        MACHINE_GUN_KEY,
        MACHINE_GUN_BULLET_KEY,
        MACHINE_GUN_NEXT_FIRE,
        MACHINE_GUN_BULLET_SPEED,
        MACHINE_GUN_FIRE_RATE,
        MACHINE_GUN_BULLET_POWER,
        infinite,
        PRICE
    );
    this.name = 'Machine Gun';
};

MachineGun.prototype = Object.create(Weapon.prototype);
MachineGun.prototype.constructor = MachineGun;

module.exports = MachineGun;

},{"./Weapon":39}],36:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 06/03/2016.
 */

var Weapon = require('./Weapon');

/**
 * Default number of bullets for this weapon.
 * @constant
 * @type {number}
 */
var PISTOL_NUMBER_OF_BULLETS = 20;
/**
 * Texture's key for this weapon.
 * @constant
 * @type {number}
 */
var PISTOL_KEY = 'pistol';
/**
 * Texture's key for this weapon bullets.
 * @constant
 * @type {number}
 */
var PISTOL_BULLET_KEY = 'bullet2';
/**
 * The time player is allowed to shoot again.
 * @constant
 * @type {number}
 */
var PISTOL_NEXT_FIRE = 1;
/**
 * This weapon bullets' speed
 * @constant
 * @type {number}
 */
var PISTOL_BULLET_SPEED = 400;
/**
 * Rate at which this weapon fires, the lower the number, the higher the firing
 * rate.
 * @constant
 * @type {number}
 */
var PISTOL_FIRE_RATE = 250;
/**
 * Damage that can cause this weapon bullets.
 * @constant
 * @type {number}
 */
var PISTOL_BULLET_POWER = 2;
/**
 * The price that this weapon costs.
 * @constant
 * @type {number}
 */
var PRICE = 30;

/**
 * Represents a Pistol, which is a  kind of a Weapon.
 * @class Pistol
 * @extends Weapon
 * @constructor
 * @param {number} x - Weapon's x coordinate within the game world.
 * @param {number} y - Weapon's y coordinate within the game world.
 * @param {boolean} infinite - Indicates weather this weapon has infinite
 * bullets or not.
 */
var Pistol = function(x, y, infinite) {
    Weapon.call(
        this,
        x,
        y,
        PISTOL_NUMBER_OF_BULLETS,
        PISTOL_KEY,
        PISTOL_BULLET_KEY,
        PISTOL_NEXT_FIRE,
        PISTOL_BULLET_SPEED,
        PISTOL_FIRE_RATE,
        PISTOL_BULLET_POWER,
        infinite,
        PRICE
    );
    this.name = 'Pistol';
};

Pistol.prototype = Object.create(Weapon.prototype);
Pistol.prototype.constructor = Pistol;

module.exports = Pistol;

},{"./Weapon":39}],37:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 23/07/2015.
 */
var Weapon = require('./Weapon');

/**
 * Default number of bullets for this weapon.
 * @constant
 * @type {number}
 */
var REVOLVER_NUMBER_OF_BULLETS = 20;
/**
 * Texture's key for this weapon
 * @constant
 * @type {number}
 */
var REVOLVER_KEY = 'revolver';
/**
 * Texture's key for this weapon bullets.
 * @constant
 * @type {number}
 */
var REVOLVER_BULLET_KEY = 'bullet1';
/**
 * The time player is allowed to shoot again.
 * @constant
 * @type {number}
 */
var REVOLVER_NEXT_FIRE = 1;
/**
 * This weapon bullets' speed
 * @constant
 * @type {number}
 */
var REVOLVER_BULLET_SPEED = 600;
/**
 * Rate at which this weapon fires, the lower the number, the higher the firing
 * rate.
 * @constant
 * @type {number}
 */
var REVOLVER_FIRE_RATE = 250;
/**
 * Damage that can cause this weapon bullets.
 * @constant
 * @type {number}
 */
var REVOLVER_BULLET_POWER = 1;
/**
 * The price that this weapon costs.
 * @constant
 * @type {number}
 */
var PRICE = 20;

/**
 * Represents a Revolver, which is a  kind of a Weapon.
 * @class Revolver
 * @extends Weapon
 * @constructor
 * @param {number} x - Weapon's x coordinate within the game world.
 * @param {number} y - Weapon's y coordinate within the game world.
 * @param {boolean} infinite - Indicates weather this weapon has infinite
 * bullets or not.
 */
var Revolver = function(x, y, inifinite) {
    Weapon.call(
        this,
        x,
        y,
        REVOLVER_NUMBER_OF_BULLETS,
        REVOLVER_KEY,
        REVOLVER_BULLET_KEY,
        REVOLVER_NEXT_FIRE,
        REVOLVER_BULLET_SPEED,
        REVOLVER_FIRE_RATE,
        REVOLVER_BULLET_POWER,
        inifinite,
        PRICE
    );
    this.name = 'Revolver';
};

Revolver.prototype = Object.create(Weapon.prototype);
Revolver.prototype.constructor = Revolver;

module.exports = Revolver;

},{"./Weapon":39}],38:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 06/03/2016.
 */

var Weapon = require('./Weapon');

/**
 * Default number of bullets for this weapon.
 * @constant
 * @type {number}
 */
var RIFLE_NUMBER_OF_BULLETS = 30;
/**
 * Texture's key for this weapon.
 * @constant
 * @type {number}
 */
var RIFLE_KEY = 'rifle';
/**
 * Texture's key for this weapon bullets.
 * @constant
 * @type {number}
 */
var RIFLE_BULLET_KEY = 'bullet1';
/**
 * The time player is allowed to shoot again.
 * @constant
 * @type {number}
 */
var RIFLE_NEXT_FIRE = 1;
/**
 * This weapon bullets' speed
 * @constant
 * @type {number}
 */
var RIFLE_BULLET_SPEED = 400;
/**
 * Rate at which this weapon fires, the lower the number, the higher the firing
 * rate.
 * @constant
 * @type {number}
 */
var RIFLE_FIRE_RATE = 270;
/**
 * Damage that can cause this weapon bullets.
 * @constant
 * @type {number}
 */
var RIFLE_BULLET_POWER = 4;
/**
 * The price that this weapon costs.
 * @constant
 * @type {number}
 */
var PRICE = 120;

/**
 * Represents a Rifle, which is a  kind of a Weapon.
 * @class Rifle
 * @extends Weapon
 * @constructor
 * @param {number} x - Weapon's x coordinate within the game world.
 * @param {number} y - Weapon's y coordinate within the game world.
 * @param {boolean} infinite - Indicates weather this weapon has infinite
 * bullets or not.
 */
var Rifle = function(x, y, infinite) {
    Weapon.call(
        this,
        x,
        y,
        RIFLE_NUMBER_OF_BULLETS,
        RIFLE_KEY,
        RIFLE_BULLET_KEY,
        RIFLE_NEXT_FIRE,
        RIFLE_BULLET_SPEED,
        RIFLE_FIRE_RATE,
        RIFLE_BULLET_POWER,
        infinite,
        PRICE
    );
    this.name = 'Rifle';
};

Rifle.prototype = Object.create(Weapon.prototype);
Rifle.prototype.constructor = Rifle;

module.exports = Rifle;

},{"./Weapon":39}],39:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa
 */

var Item = require('../Item');
var Bullet = require('./Bullet');

/**
 * The key of the frame to be displayed when weapon should point to right.
 * @constant
 * @type {number}
 */
var RIGHT_KEY = 0;
/**
 * The key of the frame to be displayed when weapon should point to left.
 * @constant
 * @type {number}
 */
var LEFT_KEY = 1;

/**
 * Represents a game weapon for characters.
 * @class Weapon
 * @extends Item
 * @constructor
 * @param {number} x - Weapon's x coordinate within the game world.
 * @param {number} y - Weapon's y coordinate within the game world.
 * @param {number} numberOfBullets - Number of bullets for this weapon.
 * @param {string} weaponKey - Texture's key for this weapon.
 * @param {string} bulletKey - Texture's key for this weapon bullets.
 * @param {number} nextFire - The time player is allowed to shoot again.
 * @param {number} bulletSpeed - This weapon bullets' speed
 * @param {number} fireRate - Rate at which this weapon fires, the lower the
 * number, the higher the firing rate.
 * @param {number} power - Damage that can cause this weapon bullets.
 * @param {boolean} infinite - Indicates weather this weapon has infinite
 * bullets or not.
 * @param {number} price - The price that this weapon costs.
 */
var Weapon = function(x,
                      y,
                      numberOfBullets,
                      weaponKey,
                      bulletKey,
                      nextFire,
                      bulletSpeed,
                      fireRate,
                      power,
                      infinite,
                      price) {
    Item.call(this, x, y, weaponKey, price);

    this.anchor.set(0.5, 0);

    this.numberOfBullets = numberOfBullets;
    this.power = power;
    this.bullets = level.game.add.group();

    for (var i = 0; i < this.numberOfBullets; i++) {
        this.bullets.add(new Bullet(power, bulletKey));
    }

    this.nextFire = nextFire;
    this.bulletSpeed = bulletSpeed;
    this.fireRate = fireRate;
    this.infinite = infinite;
    this.description = 'Damage: ' + this.power +
        '\nAmmunition: ' + this.numberOfBullets;
    this.category = 'weapons';
};

Weapon.prototype = Object.create(Item.prototype);
Weapon.prototype.constructor = Weapon;

/**
 * Allows the character to shoot or fire this weapon
 * @method Weapon.fire
 * @param {number} toX - X coordinate of the point to fire to.
 * @param {number} toY - Y coordinate of the point to fire to.
 */
Weapon.prototype.fire = function(toX, toY) {
    var finalToY = toY || this.y;
    if (level.game.time.time > this.nextFire &&
        (this.infinite || this.numberOfBullets > 0)) {
        this.currentBullet = this.bullets.getFirstExists(false);
        if (this.currentBullet) {
            this.currentBullet.reset(this.x, this.y);
            this.currentBullet.rotation =
                level.game.physics.arcade.angleToXY(this.currentBullet,
                toX, finalToY);
            this.currentBullet.body.velocity.x =
                Math.cos(this.currentBullet.rotation) * this.bulletSpeed;
            this.currentBullet.body.velocity.y =
                Math.sin(this.currentBullet.rotation) * this.bulletSpeed;
            this.nextFire = level.game.time.time + this.fireRate;
            this.numberOfBullets--;
        }
    }
};

/**
 * Relocates this weapon within the game world.
 * @method Weapon.updateCoordinates
 * @param {number} x - X coordinate of the new position.
 * @param {number} y - Y  coordinate of the new position.
 */
Weapon.prototype.updateCoordinates = function(x, y) {
    this.x = x;
    this.y = y;
};

/**
 * Allows the character to use this weapon.
 * @method Weapon.use
 */
Weapon.prototype.use = function() {
    if (!this.alive) {
        this.revive();
    }
    level.player.useWeapon(this);
    level.updateAmmoText();
};

/**
 * Add bullets to the weapon.
 * @method Weapon.addBullets
 * @param {number} amount - Number of bullets to be added.
 */
Weapon.prototype.addBullets = function(amount) {
    this.numberOfBullets += amount;
};

/**
 * Kills this weapon so that it is not more accessible within the game.
 * @method Weapon.killWeapon
 */
Weapon.prototype.killWeapon = function() {
    this.bullets.removeAll();
    this.kill();
};

/**
 * Points the weapon to the right.
 * @method Weapon.pointToRight
 */
Weapon.prototype.pointToRight = function() {
    this.frame = RIGHT_KEY;
};

/**
 * Points the weapon to the left.
 * @method Weapon.pointToLeft
 */
Weapon.prototype.pointToLeft = function() {
    this.frame = LEFT_KEY;
};

/**
 * Saves this weapon information.
 * @method Weapon.saveWeapon
 */
Weapon.prototype.saveWeapon = function() {
    localStorage.setItem(this.key, this.numberOfBullets);
};

module.exports = Weapon;

},{"../Item":20,"./Bullet":33}],40:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 25/10/2015.
 */

/**
 * Phaser variable game.
 * @type {Phaser.Game}
 */
var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'WOPIC');

var Boot = require('./states/Boot');
var Preloader = require('./states/Preloader');
var Menu = require('./states/Menu');
var Intro = require('./states/levels/Intro');
var LevelOne = require('./states/levels/LevelOne');
var LevelTwo = require('./states/levels/LevelTwo');
var LevelThree = require('./states/levels/LevelThree');

game.state.add('boot', Boot);
game.state.add('preloader', Preloader);
game.state.add('menu', Menu);
game.state.add('levelOne', LevelOne);
game.state.add('levelTwo', LevelTwo);
game.state.add('levelThree', LevelThree);
game.state.add('intro', Intro);
game.state.start('boot');

},{"./states/Boot":41,"./states/Menu":42,"./states/Preloader":43,"./states/levels/Intro":45,"./states/levels/LevelOne":47,"./states/levels/LevelThree":48,"./states/levels/LevelTwo":49}],41:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 07/07/2015.
 */

/**
 * Phaser state to boot game.
 * @class Boot
 * @constructor
 * @param {Phaser.Game} game - Phaser game object.
 */
var Boot = function(game) {};

/**
 * Loads assets for preload screen.
 * @method Boot.preload
 */
Boot.prototype.preload = function() {
    this.load.image('loading', 'assets/images/loading.png');
    this.load.image('load_progress_bar_dark',
        'assets/images/progress_bar_bg.png');
    this.load.image('load_progress_bar',
        'assets/images/progress_bar_fg.png');
};

/**
 * Starts preloader state.
 * @method Boot.create
 */
Boot.prototype.create = function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preloader');
};

module.exports = Boot;

},{}],42:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 08/07/2015.
 */

var Button = require('../util/Button');

/**
 * Game main menu. It allows the player to start a new game.
 * @class Menu
 * @constructor
 * @param {Phaser.Game} game - Phaser game object.
 */
var Menu = function(game) {
};

/**
 * Creates the buttons for the menu items.
 * @method Menu.create
 */
Menu.prototype.create = function() {
    this.game.stage.backgroundColor = '#000';
    var centerX = this.game.camera.width / 2;
    var centerY = this.game.camera.height / 2;

    var menuItem = new Button('New Game', this.newGame, this);
    menuItem.x = centerX - menuItem.width / 2;
    menuItem.y = centerY - menuItem.height;
    this.game.add.existing(menuItem);
    if (localStorage.getItem('level') !== null) {
        menuItem = new Button('Continue Playing', this.continuePlaying, this);
        menuItem.x = centerX - menuItem.width / 2;
        menuItem.y = centerY + menuItem.height;
        this.game.add.existing(menuItem);
    }
};

/**
 * Starts a new game.
 * @method Menu.newGame
 */
Menu.prototype.newGame = function() {
    localStorage.clear();
    this.game.state.start('intro');
};

/**
 * Continues a previous game.
 * @method Menu.continuePlaying
 */
Menu.prototype.continuePlaying = function() {
    this.game.state.start(localStorage.getItem('level'));
};

module.exports = Menu;

},{"../util/Button":54}],43:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 08/07/2015.
 */
/**
 * Phaser state to load all assets.
 * @class Preloader
 * @constructor
 * @param {Phaser.Game} game - Phaser game object.
 */
var Preloader = function(game) {
    this.ready = false;
};

/**
 * Manages this state behavior.
 * @method Preloader.preload
 */
Preloader.prototype.preload = function() {
    this.displayLoadScreen();
    this.loadAssets();
};

/**
 * Displays loading bar while assets load.
 * @method Preloader.displayLoadScreen
 */
Preloader.prototype.displayLoadScreen = function() {
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
};

/**
 * Loads game assets.
 * @method Preloader.loadAssets
 */
Preloader.prototype.loadAssets = function() {
    //UI assets
    this.game.load.spritesheet('arrowKeysJump',
        'assets/sprites/arrowKeysJump.png', 122, 80);
    this.game.load.spritesheet('arrowKeysMove',
        'assets/sprites/arrowKeysMove.png', 122, 80);
    this.game.load.spritesheet('arrowKeysRun',
        'assets/sprites/arrowKeysRun.png', 190, 80);
    this.game.load.spritesheet('spaceBar', 'assets/sprites/spaceBar.png',
        138, 80);
    this.game.load.spritesheet('arrowDown', 'assets/sprites/arrowDown.png',
        77, 90);
    //Level assets
    this.game.load.image('gas', 'assets/images/gas.png');
    this.game.load.image('worldBg', 'assets/images/worldBg.png');
    this.game.load.image('ground', 'assets/images/platform.png');
    this.game.load.image('healthPack5', 'assets/images/healthPack5.png');
    this.game.load.image('healthPack20', 'assets/images/healthPack20.png');
    this.game.load.image('healthPack50', 'assets/images/healthPack50.png');
    this.game.load.image('inventory_button', 'assets/images/inventory.png');
    this.game.load.image('storeButton', 'assets/images/store.png');
    this.game.load.image('store', 'assets/images/storeBig.png');
    this.game.load.image('popUpBg',
        'assets/images/popUpBg.png');
    this.game.load.image('close', 'assets/images/close.png');
    this.game.load.image('itemGroupBg', 'assets/images/itemGroupBg.png');
    this.game.load.image('myVocabularyItemBg',
        'assets/images/myVocabularyItemBg.png');
    this.game.load.image('dialogBgSmall', 'assets/images/dialogBgSmall.png');
    this.game.load.image('dialogBg', 'assets/images/dialogBg.png');
    this.game.load.image('errorIcon', 'assets/images/errorIcon.png');
    this.game.load.image('successIcon', 'assets/images/successIcon.png');

    this.game.load.spritesheet('character', 'assets/sprites/character.png',
        64, 96);
    this.game.load.spritesheet('wife', 'assets/sprites/wife.png',
        64, 96);
    this.game.load.spritesheet('npc', 'assets/sprites/npc.png',
        64, 96);
    this.game.load.spritesheet('friend', 'assets/sprites/npc.png',
        64, 96);
    this.game.load.spritesheet('daughter', 'assets/sprites/daughter.png',
        40, 60);
    this.game.load.spritesheet('son', 'assets/sprites/son.png',
        40, 60);

    this.game.load.spritesheet('simple_enemy',
        'assets/sprites/simple_enemy.png', 64, 64);
    this.game.load.spritesheet('strong_enemy',
        'assets/sprites/strong_enemy.png', 64, 64);
    this.game.load.spritesheet('strongestEnemy',
        'assets/sprites/strongestEnemy.png', 80, 80);

    this.game.load.spritesheet('jeep', 'assets/sprites/jeep.png', 219.5, 150);
    this.game.load.spritesheet('bus', 'assets/sprites/bus.png', 400, 180);
    this.game.load.spritesheet('taxi', 'assets/sprites/taxi.png', 215, 100);
    this.game.load.spritesheet('truck', 'assets/sprites/truck.png', 400, 239);
    this.game.load.spritesheet('car', 'assets/sprites/car.png', 237, 100);
    this.game.load.spritesheet('ambulance', 'assets/sprites/ambulance.png', 300,
        144);

    this.game.load.spritesheet('revolver', 'assets/sprites/revolver.png',
        54, 30);
    this.game.load.spritesheet('machineGun',
        'assets/sprites/machineGun.png', 43, 40);
    this.game.load.spritesheet('pistol',
        'assets/sprites/pistol.png', 47, 30);
    this.game.load.spritesheet('carbine',
        'assets/sprites/carbine.png', 119, 30);
    this.game.load.spritesheet('rifle',
        'assets/sprites/rifle.png', 137, 35);

    var i;
    for (i = 1; i <= 2; i++) {
        this.game.load.image('bullet' + i, 'assets/images/bullet' + i +
            '.png');
    }
    this.game.load.image('simpleWeapon',
        'assets/images/revolver.png');
    this.game.load.image('strongWeapon',
        'assets/images/machineGun.png');
    this.game.load.image('house', 'assets/images/house.png');
    this.game.load.image('openDoor', 'assets/images/openDoor.png');
    this.game.load.image('working', 'assets/images/working.png');
    this.game.load.image('addCashButton', 'assets/images/addCash.png');
    this.game.load.image('addCashBig', 'assets/images/addCashBig.png');
    this.game.load.image('myVocabularyButton',
        'assets/images/myVocabulary.png');
    this.game.load.image('button', 'assets/images/button.png');
    this.game.load.image('iconButton', 'assets/images/iconButton.png');
    this.game.load.image('toolsBar', 'assets/images/toolsBar.png');

    this.game.load.image('lettersBg', 'assets/images/lettersBg.png');
    this.game.load.image('wordsBg', 'assets/images/wordsBg.png');
    this.game.load.image('wordBg', 'assets/images/wordBg.png');
    this.game.load.image('spaceBg', 'assets/images/spaceBg.png');
    this.game.load.image('letterBg', 'assets/images/letterBg.png');
    this.game.load.image('transparent', 'assets/images/transparent.png');
    this.game.load.image('healthBarBackground',
        'assets/images/healthBarBackground.png');
    this.game.load.image('healthBar', 'assets/images/healthBar.png');

    this.game.load.image('healthPack5Icon',
        'assets/icons/healthPack5Icon.png');
    this.game.load.image('healthPack20Icon',
        'assets/icons/healthPack20Icon.png');
    this.game.load.image('revolverIcon', 'assets/icons/revolverIcon.png');
    this.game.load.image('machineGunIcon', 'assets/icons/machineGunIcon.png');
    this.game.load.image('unscramble', 'assets/icons/unscramble.png');
    this.game.load.image('contexts', 'assets/icons/contexts.png');
    this.game.load.image('imageWord', 'assets/icons/imageWord.png');
    this.game.load.image('health', 'assets/icons/health.png');
    this.game.load.image('ammo', 'assets/icons/ammo.png');
    this.game.load.image('money', 'assets/icons/money.png');
    this.game.load.image('learned', 'assets/icons/learned.png');

    this.game.load.image('popUpPanelBg',
        'assets/images/popUpPanelBg.png');
    this.game.load.image('tabBg', 'assets/images/tabBg.png');
    this.game.load.image('contextBg', 'assets/images/contextBg.png');
    this.game.load.image('englishChallengePanelBg',
        'assets/images/englishChallengePanelBg.png');
    this.game.load.image('imageWordBg', 'assets/images/imageWordBg.png');

    this.game.load.image('forgive', 'assets/images/vocabulary/forgive.png');
    this.game.load.image('bookStore', 'assets/images/vocabulary/bookStore.png');
    this.game.load.image('playground',
        'assets/images/vocabulary/playground.png');
    this.game.load.image('zoo', 'assets/images/vocabulary/zoo.png');
    this.game.load.image('gasStation',
        'assets/images/vocabulary/gasStation.png');

    this.game.load.image('bank', 'assets/images/vocabulary/bank.png');
    this.game.load.image('coffeeShop',
        'assets/images/vocabulary/coffeeShop.png');
    this.game.load.image('hospital', 'assets/images/vocabulary/hospital.png');
    this.game.load.image('school', 'assets/images/vocabulary/school.png');
    this.game.load.image('factory', 'assets/images/vocabulary/factory.png');

    this.game.load.image('fireStation',
        'assets/images/vocabulary/fireStation.png');
    this.game.load.image('policeStation',
        'assets/images/vocabulary/policeStation.png');
    this.game.load.image('hotel', 'assets/images/vocabulary/hotel.png');
    this.game.load.image('superMarket',
        'assets/images/vocabulary/superMarket.png');

    this.game.load.image('trees', 'assets/images/trees.png');
    this.game.load.image('surrender', 'assets/images/surrender.png');
    this.game.load.image('orangeHouse',
        'assets/images/vocabulary/orangeHouse.png');
    this.game.load.image('greenHouse',
        'assets/images/vocabulary/greenHouse.png');
    this.game.load.image('whiteHouse',
        'assets/images/vocabulary/whiteHouse.png');
    this.game.load.image('yellowHouse',
        'assets/images/vocabulary/yellowHouse.png');
    this.game.load.image('redHouse',
        'assets/images/vocabulary/redHouse.png');
    this.game.load.image('blueHouse',
        'assets/images/vocabulary/blueHouse.png');
    this.game.load.image('nameBoard',
        'assets/images/vocabulary/nameBoard.png');
    this.game.load.image('necklace', 'assets/images/vocabulary/necklace.png');
    this.game.load.image('glasses', 'assets/images/vocabulary/glasses.png');
    this.game.load.image('watch', 'assets/images/vocabulary/watch.png');
    this.game.load.image('ring', 'assets/images/vocabulary/ring.png');
    this.game.load.image('cap', 'assets/images/vocabulary/cap.png');
    this.game.load.image('bracelet', 'assets/images/vocabulary/bracelet.png');
    this.game.load.image('family', 'assets/images/vocabulary/family.png');
    this.game.load.image('mother', 'assets/images/vocabulary/mother.png');
    this.game.load.image('father', 'assets/images/vocabulary/father.png');
    this.game.load.image('husband', 'assets/images/vocabulary/father.png');
    this.game.load.image('child', 'assets/images/vocabulary/child.png');
    this.game.load.image('kid', 'assets/images/vocabulary/child.png');
    this.game.load.image('parent', 'assets/images/vocabulary/parent.png');
    this.game.load.image('comicBg', 'assets/images/comics/comicBg.png');
    var key;
    for (i = 1; i <= 7; i++) {
        key = 'intro' + i;
        this.game.load.image(key, 'assets/images/comics/' + key + '.png');
    }

    this.game.load.image('mediumPopUpBg', 'assets/images/mediumPopUpBg.png');
    this.game.load.image('emptyRoom', 'assets/images/emptyRoom.png');
};

/**
 * Starts menu state.
 * @method Preloader.update
 */
Preloader.prototype.update = function() {
    if (!!this.ready) {
        this.game.state.start('menu');
        level = this.game.state.states.levelOne;

    }
};

/**
 * Indicates that assets are already load.
 * @method Preloader.onLoadComplete
 */
Preloader.prototype.onLoadComplete = function() {
    this.ready = true;
};

module.exports = Preloader;

},{}],44:[function(require,module,exports){
arguments[4][41][0].apply(exports,arguments)
},{"dup":41}],45:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 29/08/2015.
 */

var Button = require('../../util/Button');

/**
 * Number seconds to wait before changing the comic image or frame.
 * @constant
 * @type {number}
 */
var SECONDS_BETWEEN_FRAMES = 8;
/**
 * Number of images that contains this comic.
 * @constant
 * @type {number}
 */
var NUMBER_OF_COMIC_IMAGES = 7;
/**
 * Time in seconds to wait before showing a new word.
 * @type {number}
 */
var WORD_DELAY = 300;

/**
 * Manages Game Intro, in which is presented background game story.
 * @class Intro
 * @constructor
 * @param {Phaser.Game} game - Phaser Game object.
 */
var Intro = function(game) {};

/**
 * Creates the comic for the intro and a button to continue.
 * @method Intro.create
 */
Intro.prototype.create = function() {
    var centerX = this.game.camera.width / 2;
    var centerY = this.game.camera.height / 2;

    this.background = this.game.add.sprite(centerX, centerY - 20, 'comicBg');
    this.background.anchor.set(0.5, 0.7);

    this.changeComicImage('intro1');
    this.currentImage = 1;

    var continueButton = new Button('Continue', this.continue, this);
    continueButton.x = this.game.camera.width - 150;
    continueButton.y = this.game.camera.height - 60;
    this.game.add.existing(continueButton);

    this.game.time.events.repeat(Phaser.Timer.SECOND * SECONDS_BETWEEN_FRAMES,
        NUMBER_OF_COMIC_IMAGES, this.updateComic, this);

    this.scripts = [
        'Edward gets home',
        'He parks his car and gets into his house',
        'Now he wants to eat something',
        'Then he finds a piece of paper',
        'Someone kidnapped his family and he is now worried and angry',
        'He will rescue his family, but that can be dangerous'
    ];
    this.comicText = this.game.add.text(centerX, 430, '',
        {font: '25px Arial', fill: '#FFF', align: 'center',
            stroke: '#7d655f', strokeThickness: 2});
    this.comicText.anchor.set(0.5, 0);
    this.game.add.existing(this.comicText);
    this.showScript(0);
};

/**
 * Allows the player to start level one.
 * @method Intro.continue
 */
Intro.prototype.continue = function() {
    this.game.state.start('levelOne');
};

/**
 * Updates the image to be showed, in order to show the whole intro story. This
 * method is called every SECONDS_BETWEEN_FRAMES.
 * @method Intro.updateComic
 */
Intro.prototype.updateComic = function() {
    if (this.currentImage < NUMBER_OF_COMIC_IMAGES) {
        this.currentImage ++;
        this.changeComicImage('intro' + this.currentImage);
        this.showScript(this.currentImage - 1);
    }else {
        this.continue();
    }
};

/**
 * Changes the current image of the comic.
 * @method Intro.changeComicImage
 * @param {string} imageKey - New images' texture key.
 */
Intro.prototype.changeComicImage = function(imageKey) {
    var image = this.game.make.sprite(0, 0, imageKey);
    image.anchor.set(0.5, 0.5);
    if (this.background.children.length > 0) {
        this.background.removeChildren();
    }
    this.background.addChild(image);

};

/**
 * Shows the script that corresponds to an index in this.scripts array.
 * @method Intro.showScript
 * @param {number} index - Index of the script to be showed.
 */
Intro.prototype.showScript = function(index) {
    this.wordIndex = 0;
    this.comicText.text = '';
    this.line = this.scripts[index].split(' ');
    this.game.time.events.repeat(WORD_DELAY, this.line.length, this.nextWord,
        this);

};

/**
 * Adds a new word to the script showed on screen.
 * @method Intro.nextWord
 */
Intro.prototype.nextWord = function() {
    this.comicText.text = this.comicText.text.concat(this.line[this.wordIndex] +
        ' ');
    this.wordIndex++;
};

module.exports = Intro;

},{"../../util/Button":54}],46:[function(require,module,exports){
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

},{"../../character/NPC":5,"../../character/Player":6,"../../character/SimpleEnemy":7,"../../character/StrongEnemy":8,"../../character/StrongestEnemy":9,"../../englishChallenges/menu/EnglishChallengesMenu":17,"../../items/HealthPack":19,"../../items/inventory/Inventory":23,"../../items/store/Store":25,"../../items/vocabulary/MyVocabulary":31,"../../items/vocabularyItems/ClueItem":27,"../../items/vocabularyItems/InteractiveCar":28,"../../items/vocabularyItems/WorldItem":30,"../../items/weapons/MachineGun":35,"../../items/weapons/Revolver":37,"../../util/Dialog":55,"../../util/HorizontalLayoutPanel":60,"../../util/IconButton":62,"../../util/InteractionManager":63,"../../util/PopUp":65,"../../util/ResourceBar":66,"../../worldElements/InteractiveHouse":71,"../../worldElements/NameBoard":72}],47:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 22/07/2015.
 */
var Level = require ('./Level');
var InteractiveHouse = require ('../../worldElements/InteractiveHouse');
var TriggerSprite = require ('../../worldElements/TriggerSprite');
var HealthPack = require('../../items/HealthPack');
var Dialog = require('../../util/Dialog');
var VerticalLayoutPopUp = require('../../util/VerticalLayoutPopUp');
var InteractionManager = require('../../util/InteractionManager');
var ClueItem = require('../../items/vocabularyItems/ClueItem');
var VocabularyItem = require('../../items/vocabularyItems/VocabularyItem');
var NonPauseDialog = require('../../util/NonPauseDialog');

/**
 * Number of fights that player will have during this level.
 * @type {number}
 */
var NUMBER_OF_FIGHTING_POINTS = 5;

/**
 * Manages LevelOne.
 * @class LevelOne
 * @constructor
 * @extends Level
 * @param {Phaser.Game} game - Pahser Game object.
 */
var LevelOne = function(game) {
    Level.call(this, game);
};

LevelOne.prototype = Object.create(Level.prototype);
LevelOne.prototype.constructor = LevelOne;

/**
 * Creates level one specific objects and elements.
 * @method LevelOne.create
 */
LevelOne.prototype.create = function() {
    Level.prototype.create.call(this);
    localStorage.setItem('level', 'levelOne');
    this.nextState = 'levelTwo';
    this.game.stage.backgroundColor = '#C7D2FC';
    this.firstCheckPointX = this.game.camera.width * 1.5;
    this.checkPointsDistance = this.WORLD_WIDTH /
        (NUMBER_OF_FIGHTING_POINTS + 1);
    this.lastGoalAimed = false;
    this.numberOfFightingPoints = NUMBER_OF_FIGHTING_POINTS;
    this.numberOfEnemies = 3;
    this.numberOfStrongEnemies = 0;
    this.createPlaces();
    this.addInteractiveBuildings();
    this.addStaticBuildings();
    this.addNPCs();
    this.addEnemies();
    this.createWeapons();
    this.addClueItems();
    this.addLevelCar('jeep', 4.4 * this.checkPointsDistance);
    this.addHealthPacks();
    this.addTutorialInstructions();
};

/**
 * Add instructions to guide the player
 * @method LevelOne.addTutorialInstructions
 */
LevelOne.prototype.addTutorialInstructions = function() {
    var howToMoveDialog = new NonPauseDialog(50, 70, 'dialogBgSmall', null,
        '', 8, 'Move using arrow keys', 'arrowKeysMove', true, false);
    howToMoveDialog.open();

    var howToShoot = new NonPauseDialog(this.CAMERA_WIDTH - 100, 70,
        'dialogBgSmall', null, '', 8, 'Shoot using the Space Bar', 'spaceBar',
        true, false);
    var triggerHouse = new TriggerSprite(howToShoot.x, this.GROUND_HEIGHT,
        'greenHouse', howToShoot.open, howToShoot);
    this.addTriggerSprite(triggerHouse);

    var howToRun = new NonPauseDialog(this.CAMERA_WIDTH * 2.8, 70,
        'dialogBgSmall', null, '', 8, 'Run using X and arrow keys',
        'arrowKeysRun',
        true, false);
    triggerHouse = new TriggerSprite(howToRun.x, this.GROUND_HEIGHT,
        'whiteHouse', howToRun.open, howToRun);
    this.addTriggerSprite(triggerHouse);

    var howToJump = new NonPauseDialog(this.CAMERA_WIDTH * 4, 70,
        'dialogBgSmall', null, '', 8, 'Jump using Up key', 'arrowKeysJump',
        true, false);
    triggerHouse = new TriggerSprite(howToJump.x, this.GROUND_HEIGHT,
        'redHouse', howToJump.open, howToJump);
    this.addTriggerSprite(triggerHouse);

    //Car tutorial
    var animatedArrow = level.game.make.sprite(10, 0, 'arrowDown');
    animatedArrow.anchor.set(0, 1);
    animatedArrow.scale.x = 70 / animatedArrow.width;
    animatedArrow.scale.y = 60 / animatedArrow.height;
    animatedArrow.animations.add('animation', [0, 1, 2, 3, 4, 5], 4, true);
    animatedArrow.animations.play('animation');
    this.cars.children[0].getOnButton.addChild(animatedArrow);
};

/**
 * Creates the needed arrays to add level weapons
 * @method LevelOne.createWeapons
 */
LevelOne.prototype.createWeapons = function() {
    this.addRevolver(3000, this.GROUND_HEIGHT - 40, false);
    this.addRevolver(6000, this.GROUND_HEIGHT - 40, false);
};

/**
 * Add ClueItems for this level.
 * @method LevelOne.addClueItems
 */
LevelOne.prototype.addClueItems = function() {
    var messages = ['Oh Great, those are my wife\'s glasses!'];
    var titles = ['My wife\'s glasses'];
    var imagesKeys = ['glasses'];
    var vocabularyItems = [];
    var vocabularyItem = new VocabularyItem(0, 0, 'wife', false);
    vocabularyItems.push(vocabularyItem);
    var interactionManager = new InteractionManager(messages, titles,
        imagesKeys, vocabularyItems);
    this.addClueItem(300, 'glasses', interactionManager);

    messages = ['Oh Great, that is my wife\'s watch!'];
    titles = ['My wife\'s watch'];
    imagesKeys = ['watch'];
    interactionManager = new InteractionManager(messages, titles,
        imagesKeys);
    this.addClueItem(this.WORLD_WIDTH / 1.5, 'watch', interactionManager);
};

/**
 * Adds interactive buildings to this level.
 * @method LevelOne.addInteractiveBuildings
 */
LevelOne.prototype.addInteractiveBuildings = function() {
    var messages = ['You can buy a weapon using the store'];
    var titles = ['Buying weapons'];
    var imagesKeys = ['store'];
    var interactionManager = new InteractionManager(messages, titles,
        imagesKeys);
    var interactiveHouse = new InteractiveHouse(this.firstCheckPointX * 1.55,
        this.GROUND_HEIGHT, 'store', interactionManager);
    interactiveHouse.createAnimatedArrow(-90,
        interactionManager.dialogs[0].height);
    this.addInteractiveHouse(interactiveHouse, true);

    messages = ['Your family is now somewhere else.',
        'Continue trying, because this game is just starting!'];
    titles = ['Continue trying', 'Continue trying'];
    imagesKeys = ['emptyRoom', 'emptyRoom'];
    var vocabularyItems = [];
    var vocabularyItem = new VocabularyItem(0, 0, 'family', false);
    vocabularyItems.push(vocabularyItem);
    interactionManager = new InteractionManager(messages, titles,
        imagesKeys, vocabularyItems);
    interactiveHouse = new InteractiveHouse(this.firstCheckPointX * 4.85,
        this.GROUND_HEIGHT, 'blueHouse', interactionManager);
    this.addInteractiveHouse(interactiveHouse, true);

    messages = ['You can add money playing the English Challenges'];
    titles = ['Add money'];
    imagesKeys = ['addCashBig'];
    interactionManager = new InteractionManager(messages, titles,
        imagesKeys);
    interactiveHouse = new InteractiveHouse(this.firstCheckPointX * 5.5,
        this.GROUND_HEIGHT, 'greenHouse', interactionManager);
    interactiveHouse.createAnimatedArrow(-10,
        interactionManager.dialogs[0].height);
    this.addInteractiveHouse(interactiveHouse, false);
};

/**
 * Adds static buildings to this level.
 * @method LevelOne.addInteractiveBuildings
 */
LevelOne.prototype.addStaticBuildings = function() {
    this.addStaticBuilding(5, 'orangeHouse');
    var house = this.addStaticBuilding(500, 'whiteHouse');
    this.addNeighbors(house, 'greenHouse', 'yellowHouse');
};

/**
 * Adds level one non player characters.
 * @method LevelOne.addNPCs
 */
LevelOne.prototype.addNPCs = function() {
    var messages = [
        'Are you looking for Carlos? \n Be careful, he is so dangerous',
        'Your wife and children are in \nthe Big Blue House after the Zoo'
    ];
    var titles = ['I can help you', 'Go to Big Blue House'];
    var imagesKeys = ['npc', 'blueHouse'];
    var intManager = new InteractionManager(messages, titles, imagesKeys);
    this.addNPC(this.game.camera.width / 2, 'npc', intManager);
};

/**
 * Creates the needed arrays to add this level places
 * @method LevelOne.createPlaces
 */
LevelOne.prototype.createPlaces = function() {
    this.housesKeys = ['whiteHouse', 'greenHouse', 'yellowHouse',
        'orangeHouse'];
    this.placesKeys = ['bookStore', 'playground', 'gasStation', 'zoo'];
    this.addPlaces();
};

module.exports = LevelOne;

},{"../../items/HealthPack":19,"../../items/vocabularyItems/ClueItem":27,"../../items/vocabularyItems/VocabularyItem":29,"../../util/Dialog":55,"../../util/InteractionManager":63,"../../util/NonPauseDialog":64,"../../util/VerticalLayoutPopUp":70,"../../worldElements/InteractiveHouse":71,"../../worldElements/TriggerSprite":73,"./Level":46}],48:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 19/11/2015.
 */
var Level = require ('./Level');
var InteractiveHouse = require ('../../worldElements/InteractiveHouse');
var HealthPack = require('../../items/HealthPack');
var Dialog = require('../../util/Dialog');
var VerticalLayoutPopUp = require('../../util/VerticalLayoutPopUp');
var ClueItem = require('../../items/vocabularyItems/ClueItem');
var Wife = require('../../character/Wife');
var Friend = require('../../character/Friend');
var VocabularyItem = require('../../items/vocabularyItems/VocabularyItem');
var InteractionManager = require('../../util/InteractionManager');

/**
 * Number of fights that player will have during this level.
 * @type {number}
 */
var NUMBER_OF_FIGHTING_POINTS = 8;

/**
 * Manages LevelThree.
 * @class LevelThree
 * @constructor
 * @extends Level
 * @param {Phaser.Game} game - Phaser Game object.
 */
var LevelThree = function(game) {
    Level.call(this, game);
};

LevelThree.prototype = Object.create(Level.prototype);
LevelThree.prototype.constructor = LevelThree;

/**
 * Creates level one specific objects and elements.
 * @method LevelThree.create
 */
LevelThree.prototype.create = function() {
    Level.prototype.create.call(this);
    //localStorage.setItem('level', 'levelThree');
    this.nextState = 'menu';
    this.game.stage.backgroundColor = '#09061F';
    this.firstCheckPointX = this.game.camera.width * 1.5;
    this.checkPointsDistance = this.WORLD_WIDTH /
        (NUMBER_OF_FIGHTING_POINTS + 1);
    this.lastGoalAimed = false;
    this.numberOfFightingPoints = NUMBER_OF_FIGHTING_POINTS;
    this.numberOfEnemies = 2;
    this.numberOfStrongEnemies = 3;
    this.createPlaces();
    this.addStaticBuildings();
    this.addEnemies();
    this.addWife();
    this.addFriend(this.WORLD_WIDTH - 100);
    this.addLevelCar('taxi', 3 * this.checkPointsDistance);
    this.addClueItems();
    this.createWeapons();
    this.addHealthPacks();
};

/**
 * Creates the needed arrays to add level weapons
 * @method LevelThree.createWeapons
 */
LevelThree.prototype.createWeapons = function() {
    this.addMachineGun(600, this.GROUND_HEIGHT - 40, false);
    this.addRevolver(2000, this.GROUND_HEIGHT - 40, false);
    this.addMachineGun(4000, this.GROUND_HEIGHT - 40, false);
    this.addRevolver(6000, this.GROUND_HEIGHT - 40, false);
    this.addMachineGun(7000, this.GROUND_HEIGHT - 40, false);
};

/**
 * Creates the needed arrays to add this level places
 */
LevelThree.prototype.createPlaces = function() {
    this.housesKeys = ['yellowHouse', 'greenHouse', 'orangeHouse',
        'whiteHouse'];
    this.placesKeys = ['policeStation', 'fireStation', 'superMarket', 'hotel'];
    this.addPlaces();
};

/**
 * Add ClueItems, InteractiveCar and InteractiveHouses for this level.
 * @method LevelThree.addClueItems
 */
LevelThree.prototype.addClueItems = function() {
    var messages = ['Our daughter\'s drawing!'];
    var titles = ['We are closer to our kids!'];
    var imagesKeys = ['family'];
    var vocabularyItems = [];
    var vocabularyItem = new VocabularyItem(0, 0, 'kid', false);
    vocabularyItems.push(vocabularyItem);
    var interactionManager = new InteractionManager(messages, titles,
        imagesKeys, vocabularyItems);
    this.addClueItem(400, 'family', interactionManager);

    messages = ['Oh Great, that is our son\'s cap!'];
    titles = ['Our son\'s cap'];
    imagesKeys = ['cap'];
    vocabularyItems = [];
    vocabularyItem = new VocabularyItem(0, 0, 'son', false);
    vocabularyItems.push(vocabularyItem);
    interactionManager = new InteractionManager(messages, titles,
        imagesKeys, vocabularyItems);
    this.addClueItem(this.WORLD_WIDTH / 2 - 400, 'cap',
        interactionManager);

    messages = ['Oh Great, that is our daughter\'s bracelet!'];
    titles = ['My daughter\'s bracelet'];
    imagesKeys = ['bracelet'];
    vocabularyItems = [];
    vocabularyItem = new VocabularyItem(0, 0, 'daughter', false);
    vocabularyItems.push(vocabularyItem);
    interactionManager = new InteractionManager(messages, titles,
        imagesKeys, vocabularyItems);
    this.addClueItem(this.WORLD_WIDTH / 2 + 400, 'bracelet',
        interactionManager);
};

/**
 * Adds character's wife to the level scene.
 * @method LevelThree.addWife
 */
LevelThree.prototype.addWife = function() {
    this.wife = new Wife(this.player.x - this.player.width,
        this.GROUND_HEIGHT - 50);
    this.addPlayerCharacter(this.wife);
};

/**
 * Adds the Friend (as Enemy) to enemies group.
 * @method LevelThree.addFriend
 * @param {number} x - X coordinate within the world where the enemy should
 * appear.
 */
LevelThree.prototype.addFriend = function(x) {
    this.enemies.add(new Friend(x, this.GROUND_HEIGHT - 100));
};

/**
 * Adds static buildings to this level.
 * @method LevelThree.addInteractiveBuildings
 */
LevelThree.prototype.addStaticBuildings = function() {
    var house = this.addStaticBuilding(400, 'redHouse');
    this.addNeighbors(house, 'whiteHouse', 'blueHouse');
    this.addStaticBuilding(this.WORLD_WIDTH - 300, 'whiteHouse');
};

/**
 * Adds character's wife to the level scene.
 * @method LevelThree.liberateFamilyMember
 */
LevelThree.prototype.liberateFamilyMember = function() {
    var vocabularyItems = [];
    var vocabularyItem = new VocabularyItem(0, 0, 'parent', false);
    vocabularyItems.push(vocabularyItem);
    var messages = ['Thank you dear parents.'];
    var titles = ['Thank you!'];
    var imagesKeys = ['parent'];
    var intManager = new InteractionManager(messages, titles, imagesKeys,
        vocabularyItems);
    this.son = this.addNPC(
        this.WORLD_WIDTH - 250,
        'son',
        intManager
    );

    vocabularyItems = [];
    vocabularyItem = new VocabularyItem(0, 0, 'mother', false);
    vocabularyItems.push(vocabularyItem);
    vocabularyItem = new VocabularyItem(0, 0, 'father', false);
    vocabularyItems.push(vocabularyItem);
    messages = ['Mother and Father we are so happy to see you again.'];
    titles = ['Thank you!'];
    imagesKeys = ['parent'];
    intManager = new InteractionManager(messages, titles, imagesKeys,
        vocabularyItems);
    this.son = this.addNPC(
        this.WORLD_WIDTH - 200,
        'daughter',
        intManager
    );
};

module.exports = LevelThree;

},{"../../character/Friend":3,"../../character/Wife":10,"../../items/HealthPack":19,"../../items/vocabularyItems/ClueItem":27,"../../items/vocabularyItems/VocabularyItem":29,"../../util/Dialog":55,"../../util/InteractionManager":63,"../../util/VerticalLayoutPopUp":70,"../../worldElements/InteractiveHouse":71,"./Level":46}],49:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 05/11/2015.
 */
var Level = require ('./Level');
var HealthPack = require('../../items/HealthPack');
var Dialog = require('../../util/Dialog');
var VerticalLayoutPopUp = require('../../util/VerticalLayoutPopUp');
var ClueItem = require('../../items/vocabularyItems/ClueItem');
var InteractionManager = require('../../util/InteractionManager');
var VocabularyItem = require('../../items/vocabularyItems/VocabularyItem');

/**
 * Number of fights that player will have during this level.
 * @type {number}
 */
var NUMBER_OF_FIGHTING_POINTS = 6;

/**
 * Manages LevelTwo.
 * @class LevelTwo
 * @constructor
 * @extends Level
 * @param {Phaser.Game} game - Phaser Game object.
 */
var LevelTwo = function(game) {
    Level.call(this, game);
};

LevelTwo.prototype = Object.create(Level.prototype);
LevelTwo.prototype.constructor = LevelTwo;

/**
 * Creates level one specific objects and elements.
 * @method LevelTwo.create
 */
LevelTwo.prototype.create = function() {
    Level.prototype.create.call(this);
    //localStorage.setItem('level', 'levelTwo');
    this.nextState = 'levelThree';
    this.game.stage.backgroundColor = '#C2501B';
    this.firstCheckPointX = this.game.camera.width * 1.5;
    this.checkPointsDistance = this.WORLD_WIDTH /
        (NUMBER_OF_FIGHTING_POINTS + 1);
    this.lastGoalAimed = false;
    this.numberOfFightingPoints = NUMBER_OF_FIGHTING_POINTS;
    this.numberOfEnemies = 2;
    this.numberOfStrongEnemies = 2;
    this.metWife = false;
    this.createPlaces();
    this.addStaticBuildings();
    this.addEnemies();
    this.addStrongestEnemy(this.WORLD_WIDTH - 100);
    this.addClueItems();
    this.addLevelCar('bus', 3.9 * this.checkPointsDistance);
    this.addHealthPacks();
    this.createWeapons();
};

/**
 * Creates the needed arrays to add level weapons
 * @method LevelTwo.createWeapons
 */
LevelTwo.prototype.createWeapons = function() {
    this.addMachineGun(600, this.GROUND_HEIGHT - 40, false);
    this.addRevolver(2000, this.GROUND_HEIGHT - 40, false);
    this.addRevolver(4000, this.GROUND_HEIGHT - 40, false);
    this.addRevolver(6000, this.GROUND_HEIGHT - 40, false);
    this.addMachineGun(7000, this.GROUND_HEIGHT - 40, false);
};

/**
 * Add ClueItems, InteractiveCar and InteractiveHouses for this level.
 * @method LevelTwo.addClueItems
 */
LevelTwo.prototype.addClueItems = function() {
    var messages = ['Oh Great, that is my wife\'s necklace!'];
    var titles = ['My wife\'s necklace'];
    var imagesKeys = ['necklace'];
    var interactionManager = new InteractionManager(messages, titles,
        imagesKeys);
    this.addClueItem(400, 'necklace', interactionManager);

    messages = ['Oh Great, that is my wife\'s ring!'];
    titles = ['My wife\'s ring'];
    imagesKeys = ['ring'];
    interactionManager = new InteractionManager(messages, titles,
        imagesKeys);
    this.addClueItem(this.WORLD_WIDTH / 2 - 500, 'ring', interactionManager);
};

/**
 * Adds character's wife to the level scene.
 * @method LevelTwo.liberateFamilyMember
 */
LevelTwo.prototype.liberateFamilyMember = function() {
    var vocabularyItems = [];
    var vocabularyItem = new VocabularyItem(0, 0, 'husband', false);
    vocabularyItems.push(vocabularyItem);
    vocabularyItem = new VocabularyItem(0, 0, 'child', false);
    vocabularyItems.push(vocabularyItem);
    vocabularyItem = new VocabularyItem(0, 0, 'friend', false);
    vocabularyItems.push(vocabularyItem);

    var messages = [
        'Hello my husband. I am so happy to see you again.',
        'Your friend has kidnapped \n our daughter and our son.'
    ];
    var titles = ['Hello!', 'Our children are not here'];
    var imagesKeys = ['wife', 'friend'];
    var intManager = new InteractionManager(messages, titles, imagesKeys,
        vocabularyItems);
    this.wife = this.addNPC(
        this.WORLD_WIDTH - 200,
        'wife',
        intManager
    );
};

/**
 * Adds city places from vocabulary that corresponds to this level.
 * @method LevelTwo.addPlaces
 */
LevelTwo.prototype.createPlaces = function() {
    this.housesKeys = ['whiteHouse', 'greenHouse', 'yellowHouse',
        'orangeHouse'];
    this.placesKeys = ['bank', 'coffeeShop', 'hospital', 'school', 'factory'];
    this.addPlaces();
};

/**
 * Adds static buildings to this level.
 * @method LevelTwo.addInteractiveBuildings
 */
LevelTwo.prototype.addStaticBuildings = function() {
    var house = this.addStaticBuilding(400, 'trees');
    this.addNeighbors(house, 'greenHouse', 'yellowHouse');
    this.addStaticBuilding(this.WORLD_WIDTH - 300, 'yellowHouse');
};

module.exports = LevelTwo;

},{"../../items/HealthPack":19,"../../items/vocabularyItems/ClueItem":27,"../../items/vocabularyItems/VocabularyItem":29,"../../util/Dialog":55,"../../util/InteractionManager":63,"../../util/VerticalLayoutPopUp":70,"./Level":46}],50:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"../../character/NPC":5,"../../character/Player":6,"../../character/SimpleEnemy":7,"../../character/StrongEnemy":8,"../../character/StrongestEnemy":9,"../../englishChallenges/menu/EnglishChallengesMenu":17,"../../items/HealthPack":19,"../../items/inventory/Inventory":23,"../../items/store/Store":25,"../../items/vocabulary/MyVocabulary":31,"../../items/vocabularyItems/ClueItem":27,"../../items/vocabularyItems/InteractiveCar":28,"../../items/vocabularyItems/WorldItem":30,"../../items/weapons/MachineGun":35,"../../items/weapons/Revolver":37,"../../util/Dialog":55,"../../util/HorizontalLayoutPanel":60,"../../util/IconButton":62,"../../util/InteractionManager":63,"../../util/PopUp":65,"../../util/ResourceBar":66,"../../worldElements/InteractiveHouse":71,"../../worldElements/NameBoard":72,"dup":46}],51:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"../../items/HealthPack":19,"../../items/vocabularyItems/ClueItem":27,"../../items/vocabularyItems/VocabularyItem":29,"../../util/Dialog":55,"../../util/InteractionManager":63,"../../util/NonPauseDialog":64,"../../util/VerticalLayoutPopUp":70,"../../worldElements/InteractiveHouse":71,"../../worldElements/TriggerSprite":73,"./Level":46,"dup":47}],52:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"../util/Button":54,"dup":42}],53:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"dup":43}],54:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 10/10/2015.
 */

/**
 * Represents a Button for the views.
 * @class Button
 * @extends Phaser.Sprite
 * @constructor
 * @param {string} text - Buttons label.
 * @param {function} action - Action to be carried out when button is clicked.
 * @param {Phaser.Sprite} parent - View that contains this button.
 * @param {string} buttonKey - Button's texture key.
 */
var Button = function(text, action, parent, buttonKey) {
    var key = buttonKey || 'button';
    Phaser.Sprite.call(this, level.game, 0, 0, key);

    this.text = level.game.make.text(this.width / 2, this.height / 2, text);
    this.text.anchor.set(0.5, 0.5);
    this.text.font = level.font;
    this.text.fontSize = 20;
    this.text.fill = '#FFFFFF';
    this.text.stroke = '#000000';
    this.text.strokeThickness = 3;

    this.inputEnabled = true;
    this.events.onInputDown.add(action, parent);

    scale = (this.text.width + 20) / this.width;
    this.scale.x = scale;
    this.addChild(this.text);
    this.text.scale.x = 1 / scale;
};

Button.prototype = Object.create(Phaser.Sprite.prototype);
Button.prototype.constructor = Button;

module.exports = Button;

},{}],55:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 16/07/2015.
 */
var HorizontalLayoutPopUp = require('./HorizontalLayoutPopUp');

/**
 * View for a Dialog.
 * @class Dialog
 * @extends PopUp
 * @constructor
 * @param {string} iconKey - Background texture key.
 * @param {string} text - Text to be through the dialog.
 * @param {PopUp} [parent = null] - View that generates the Dialog.
 */
var Dialog = function(iconKey, text, parent) {
    HorizontalLayoutPopUp.call(this, 'dialogBg', parent, null, 20);

    this.icon = level.game.make.sprite(0, 0, iconKey);
    var scale;
    if (this.icon.width > 100) {
        scale = this.icon.width / 100;
    }else {
        scale = 100 / this.icon.width;
    }
    this.icon.scale.setTo(scale, scale);

    this.message = level.game.make.text(0, 0, '');
    this.message.font = level.font;
    this.message.fontSize = 20;
    this.message.fill = '#000000';
    this.message.text = text;

    this.addElement(this.icon);
    this.addElement(this.message);
};

Dialog.prototype = Object.create(HorizontalLayoutPopUp.prototype);
Dialog.prototype.constructor = Dialog;

/**
 * Sets the text to be displayed through this dialog.
 * @method Dialog.setText
 * @param text
 */
Dialog.prototype.setText = function(text) {
    this.message.text = text;
};

module.exports = Dialog;

},{"./HorizontalLayoutPopUp":61}],56:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 11/10/2015.
 */

/**
 * The margin between the cells if the grid.
 * @constant
 * @type {number}
 */
var MARGIN = 10;

/**
 * Represents a grid with a fixed number of rows and columns. All the cells have
 * the same height and width.
 * @class GridLayout
 * @constructor
 * @param {number} numberOfColumns - Number of columns for the grid.
 * @param {number} numberOfRows - Number of rows for the grid.
 * @param {Sprite} container - Container in which elements are added
 * @param {number} xOrigin - X coordinate where the grid starts
 * @param {number} yOrigin - Y coordinate where the grid starts
 * @param {number} margin - Space between elements, optional.

 */
var GridLayout = function(numberOfColumns, numberOfRows, xOrigin, yOrigin,
                          container, margin) {
    this.currentRow = 0;
    this.currentColumn = 0;
    this.numberOfColumns = numberOfColumns;
    this.numberOfRows = numberOfRows;
    this.margin = margin || MARGIN;
    if (numberOfColumns === 1 && numberOfRows === 1) {
        this.xOrigin = 0;
        this.yOrigin = 0;
    } else {
        this.xOrigin = this.margin + xOrigin;
        this.yOrigin = this.margin + yOrigin;
    }
    this.rowWidth = (container.width - xOrigin - this.margin * 2) /
        this.numberOfColumns;
    this.rowHeight = (container.height - yOrigin - this.margin * 2) /
        this.numberOfRows;
    this.container = container;
};

GridLayout.prototype.constructor = GridLayout;

/**
 * Adds an element to the container on the next possible cell of the grid.
 * @method GridLayout.addElement
 * @param element {Sprite} Element to be added to the container
 */
GridLayout.prototype.addElement = function(element) {
    if (this.currentColumn >= this.numberOfColumns) {
        this.currentColumn = 0;
        this.currentRow++;
        if (this.currentRow === this.numberOfRows) {
            return;
        }
    }
    var xCentered = (this.rowWidth / 2) - (element.width / 2);
    element.x = this.xOrigin + (this.rowWidth) *
        this.currentColumn + xCentered;
    var yCentered = this.yOrigin + (this.rowHeight / 2) - (element.height / 2);
    element.y = (this.rowHeight) *
        this.currentRow + yCentered;

    this.container.addChild(element);
    this.currentColumn ++;
};

/**
 * Restarts the indexes, currentRow and currentColumn.
 * @method GridLayout.restartIndexes
 */
GridLayout.prototype.restartIndexes = function() {
    this.currentColumn = 0;
    this.currentRow = 0;
};

module.exports = GridLayout;

},{}],57:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 11/10/2015.
 */
var GridLayout = require('./GridLayout');

/**
 * Lowest number of columns for this Panel
 * @constant
 * @default
 * @type {number}
 */
var NUMBER_OF_COLUMNS = 1;
/**
 * Lowest number of rows for this Panel
 * @constant
 * @default
 * @type {number}
 */
var NUMBER_OF_ROWS = 1;

/**
 * Represents a Panel that uses a GridLayout to arrange its elements.
 * @class GridLayoutPanel
 * @extends Phaser.Sprite
 * @constructor
 * @param {string} backgroundKey - Background texture key.
 * @param {Object} [optionals.x] - X coordinate for the Panel within its parent
 * view.
 * @param {Object} [optionals.y] - Y coordinate for the Panel within its parent
 * view.
 * @param {Object} [optionals.numberOfColumns] - Number of columns for the
 * panel.
 * @param {Object} [optionals.numberOfRows] - Number of rows for the panel.
 */
var GridLayoutPanel = function(backgroundKey, optionals) {
    var ops = optionals || [];
    var x = ops.x || 0;
    var y = ops.y || 0;
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);
    this.numberOfColumns = ops.numberOfColumns || NUMBER_OF_COLUMNS;
    this.numberOfRows = ops.numberOfRows || NUMBER_OF_ROWS;

    this.grid = new GridLayout(this.numberOfColumns, this.numberOfRows, 0, 0,
        this, ops.margin);
};

GridLayoutPanel.prototype = Object.create(Phaser.Sprite.prototype);
GridLayoutPanel.prototype.constructor = GridLayoutPanel;

/**
 * Add an element to the panel.
 * @method GridLayoutPanel.addElement
 * @param {Phaser.Sprite} element - Element ot be added to the panel.
 */
GridLayoutPanel.prototype.addElement = function(element) {
    this.grid.addElement(element);
};

/**
 * Remove all the elements that contains the panel
 * @method GridLayoutPanel.removeAllElements
 */
GridLayoutPanel.prototype.removeAllElements = function() {
    this.removeChildren();
    this.grid.restartIndexes();
};

module.exports = GridLayoutPanel;

},{"./GridLayout":56}],58:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 11/10/2015.
 */
var PopUp = require('./PopUp');
var GridLayout = require('./GridLayout');

/**
 * Minimum number of columns for this container
 * @constant
 * @type {number}
 */
var MIN_NUMBER_OF_COLUMNS = 1;
/**
 * Minimum number of rows for this container
 * @constant
 * @type {number}
 */
var MIN_NUMBER_OF_ROWS = 1;

/**
 * Represents a PopUpLayout that contains a grid layout to arrange its elements.
 * @class GridLayoutPopUp
 * @extends PopUp
 * @constructor
 * @param {string} backgroundKey - Texture's key of the background
 * @param {string} title - Name or title of the PopUp.
 * @param {Object} [dimensions.numberOfColumns] - Number of columns for the
 * PopUp.
 * @param {Object} [dimensions.numberOfRows] - Number of rows for the PopUp.
 * @param {Phaser.Sprite} parent - View or Sprite that opened this PopUp.
 */
var GridLayoutPopUp = function(backgroundKey, title, dimensions, parent) {
    PopUp.call(this, backgroundKey, parent, title);
    this.currentRow = 0;
    this.currentColumn = 0;

    var dims = dimensions || {};
    this.numberOfColumns = dims.numberOfColumns || MIN_NUMBER_OF_COLUMNS;
    this.numberOfRows = dims.numberOfRows || MIN_NUMBER_OF_ROWS;
    this.grid = new GridLayout(this.numberOfColumns, this.numberOfRows, 0,
        this.title.height + this.title.y, this, dims.margin);

};

GridLayoutPopUp.prototype = Object.create(PopUp.prototype);
GridLayoutPopUp.prototype.constructor = GridLayoutPopUp;

/**
 * Add an element to the container in the next possible cell of the grid.
 * @method GridLayoutPopUp.addElement
 * @param {Phaser.Sprite} element - Element to be added to the view.
 */
GridLayoutPopUp.prototype.addElement = function(element) {
    this.grid.addElement(element);
};

/**
 * Restarts the positions x and y to the origin, so that next elements will be
 * added in the first position.
 * @method GridLayoutPopUp.restartPositions
 */
GridLayoutPopUp.prototype.restartPositions = function() {
    this.grid.restartsIndexes();
};

module.exports = GridLayoutPopUp;

},{"./GridLayout":56,"./PopUp":65}],59:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 11/10/2015.
 */

/**
 * Default value for the margin between elements.
 * @constant
 * @default
 * @type {number}
 */
var MARGIN = 10;

/**
 * Controls an HorizontalLayout for a view, so that it arranged elements
 * horizontally, one after another, centered on y axis.
 * @class HorizontalLayout
 * @constructor
 * @param {Phaser.Sprite} parent - View on which elements are added and
 * arranged.
 * @param {number} [margin = MARGIN] - Margin between elements.
 */
var HorizontalLayout = function(parent, margin) {
    this.margin = margin || MARGIN;
    this.currentX = this.margin;
    this.parent = parent;
};

HorizontalLayout.prototype.constructor = HorizontalLayout;

/**
 * Add an element horizontally, after the last one (if any), centered on y axis.
 * @method HorizontalLayout.addElement
 * @param {Phaser.Sprite} element - Element to be added to the view.
 */
HorizontalLayout.prototype.addElement = function(element) {
    element.x = this.currentX;
    this.currentX += element.width + this.margin ;
    element.y = this.parent.height / 2 - element.height / 2;
    this.parent.addChild(element);
};

/**
 * Restarts the position of x to the first one, so that new element will be
 * added in first position.
 * @method HorizontalLayout.restartPosition
 */
HorizontalLayout.prototype.restartPosition = function() {
    this.currentX = this.margin;
};

module.exports = HorizontalLayout;

},{}],60:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 15/10/2015.
 */

var HorizontalLayout = require('./HorizontalLayout');
/**
 * Represents a panel that has a HorizontalLayout to arrange its elements.
 * @class HorizontalLayoutPanel
 * @extends Phaser.Sprite
 * @param {string} backgroundKey - Texture's key for panel's background
 * @param {Object} [optionals.x = 0] - X coordinate for the panel within its
 * parent view.
 * @param {Object} [optionals.y = 0] - Y coordinate for the panel within its
 * parent view.
 * @constructor
 */
var HorizontalLayoutPanel = function(backgroundKey, optionals) {
    var ops = optionals || [];
    var x = ops.x || 0;
    var y = ops.y || 0;
    var margin = ops.margin || 0;
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);
    this.layout = new HorizontalLayout(this, margin);
};

HorizontalLayoutPanel.prototype = Object.create(Phaser.Sprite.prototype);
HorizontalLayoutPanel.prototype.constructor = HorizontalLayoutPanel;

/**
 * Adds an element to the Panel horizontally.
 * @method HorizontalLayoutPanel.addElement
 * @param {Phaser.Sprite} element - Element to be added to the panel.
 */
HorizontalLayoutPanel.prototype.addElement = function(element) {
    this.layout.addElement(element);
};

module.exports = HorizontalLayoutPanel;

},{"./HorizontalLayout":59}],61:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 11/10/2015.
 */
var PopUp = require('./PopUp');
var Horizontalayout = require('./HorizontalLayout');

/**
 * Represents a PopUp that arranges its elements using an HorizontalLayout.
 * @class HorizontalLayoutPopUP
 * @extends PopUp
 * @constructor
 * @param {string} backgroundKey - Background texture's key.
 * @param {PopUp} parent - View that creates this PopUp.
 * @param {string} title - PopUp title.
 * @param {number} margin - Margin between elements.
 */
var HorizontalLayoutPopUP = function(backgroundKey, parent, title, margin) {
    PopUp.call(this, backgroundKey, parent, title);
    this.layout = new Horizontalayout(this, margin);
};

HorizontalLayoutPopUP.prototype = Object.create(PopUp.prototype);
HorizontalLayoutPopUP.prototype.constructor = HorizontalLayoutPopUP;

/**
 * Adds an element to the PopUp.
 * @method HorizontalLayoutPopUP.addElement
 * @param {Phaser.Sprite} element - Element to be added.
 */
HorizontalLayoutPopUP.prototype.addElement = function(element) {
    this.layout.addElement(element);
};

/**
 * Restarts the positions x and y to the origin, so that next elements will be
 * added in the first position.
 * @method HorizontalLayoutPopUP.restartPositions
 */
HorizontalLayoutPopUP.prototype.restartPositions = function() {
    this.layout.restartPosition();
};

module.exports = HorizontalLayoutPopUP;


},{"./HorizontalLayout":59,"./PopUp":65}],62:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 10/01/2016.
 */
var VerticalLayoutPanel = require('../util/VerticalLayoutPanel');
/**
 * Represents a Button with an Icon for the views.
 * @class IconButton
 * @extends Phaser.Sprite
 * @constructor
 * @param {string} text - Buttons label.
 * @param {string} iconKey - Buttons icon texture.
 * @param {function} action - Action to be carried out when button is clicked.
 * @param {Phaser.Sprite} parent - View that contains this button.
 * @param {string} buttonKey - Button's texture key.
 */
var IconButton = function(text, iconKey, action, parent, buttonKey) {
    var key = buttonKey || 'iconButton';
    VerticalLayoutPanel.call(this, key, 5);

    this.icon = level.game.make.sprite(0, 0, iconKey);
    this.text = level.game.make.text(0, 0, text);
    this.text.font = level.font;
    this.text.fontSize = 14;
    this.text.fill = '#FFFFFF';
    this.text.stroke = '#000000';
    this.text.strokeThickness = 3;

    this.inputEnabled = true;
    this.events.onInputDown.add(action, parent);
    this.addElement(this.icon);
    this.addElement(this.text);
};

IconButton.prototype = Object.create(VerticalLayoutPanel.prototype);
IconButton.prototype.constructor = IconButton;

module.exports = IconButton;

},{"../util/VerticalLayoutPanel":69}],63:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 20/12/2015.
 */

var VerticalLayoutPopUp = require('../util/VerticalLayoutPopUp');

/**
 * Represents a sequence of messages that should be devlivvered to the player.
 * @class InteractionManager
 * @constructor
 * @param {Array} messages - Messages that should be delivered the player.
 * @param {Array} titles - Title associated to each message.
 * @param {Array} imagesKeys - Icon associated to each message.
 * @param {Array} vocabularyItems - Vocabulary that is delivered to the player
 * with the messages
 */
var InteractionManager = function(messages, titles, imagesKeys,
                                  vocabularyItems) {
    this.dialogs = [];
    var i;
    var tempDialog;
    for (i in messages) {
        tempDialog =  new VerticalLayoutPopUp('mediumPopUpBg', null, titles[i]);
        var dialogImage = level.game.make.sprite(0, 0, imagesKeys[i]);
        var dialogText = level.game.make.text(0, 0, messages[i]);
        dialogText.font = level.font;
        dialogText.fontSize = 20;
        dialogText.fill = '#000000';
        dialogText.align = 'center';
        tempDialog.addElement(dialogImage);
        tempDialog.addElement(dialogText);
        this.dialogs.push(tempDialog);
        level.game.add.existing(tempDialog);
    }
    this.vocabuaryItems = vocabularyItems || [];
};

/**
 * Lets the enemy to show the messages he has for the player. (Interaction)
 * @method  InteractionEnemy.openDialogs
 */
InteractionManager.prototype.openDialogs = function() {
    var i;
    for (i = this.dialogs.length - 1; i >= 0; i--) {
        this.dialogs[i].open();
    }
    for (i = 0; i < this.vocabuaryItems.length; i++) {
        level.myVocabulary.addItem(this.vocabuaryItems[i]);
    }
};

module.exports = InteractionManager;

},{"../util/VerticalLayoutPopUp":70}],64:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 06/03/2016.
 */

var VerticalLayoutPopUp = require('./VerticalLayoutPopUp');

/**
 * Represents a game weapon for characters.
 * @class NonPauseDialog
 * @extends VerticalLayoutPopUp
 * @constructor
 * @param {number} x - X coordinate to locate the dialog.
 * @param {number} y - Y coordinate to locate the dialog.
 * @param {string} backgroundKey - Texture key for the dialog's background.
 * @param {Sprite} parent - Parent view of this dialog.
 * @param {string} title - Title of this dialog.
 * @param {number} margin - Margin between the elements of this dialog.
 * @param {string} text - Message of this dialog.
 * @param {string} iconKey - Texture key for the image or icon of this dialog.
 * @param {boolean} animated - Indicates if the icon should be animated.
 * @param {boolean} fixedToCamera - Indicates if the dialog should be fixed to
 * the camera.
 */
var NonPauseDialog = function(x, y, backgroundKey, parent, title, margin, text,
                              iconKey, animated, fixedToCamera) {
    VerticalLayoutPopUp.call(this, backgroundKey, parent, title, margin);
    this.x = x;
    this.y = y;
    this.icon = level.game.make.sprite(0, 0, iconKey);
    var dialogText = level.game.make.text(0, 0, text);
    dialogText.font = level.font;
    dialogText.fontSize = 16;
    dialogText.fill = '#000000';
    dialogText.align = 'center';
    this.addElement(this.icon);
    this.addElement(dialogText);
    if (animated) {
        this.icon.animations.add('animation', [0, 1], 1, true);
        this.icon.animations.play('animation');
    }
    this.fixedToCamera = fixedToCamera;
    this.visible = false;
    level.addObject(this);
};

NonPauseDialog.prototype = Object.create(VerticalLayoutPopUp.prototype);
NonPauseDialog.prototype.constructor = NonPauseDialog;

/**
 * Closes or disposes this PopUp window.
 * @method NonPauseDialog.close
 */
NonPauseDialog.prototype.close = function() {
    this.visible = false;
    this.kill();
};

/**
 * Opens or displays this PopUp window.
 * @method NonPauseDialog.open
 */
NonPauseDialog.prototype.open = function() {
    if (!this.alive) {
        this.revive();
    }
    this.bringToTop();
    this.visible = true;
};

module.exports = NonPauseDialog;

},{"./VerticalLayoutPopUp":70}],65:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 16/07/2015.
 */
/**
 * Represents a pop up window.
 * @class PopUp
 * @extends Phaser.Sprite
 * @constructor
 * @param {string} backgroundKey - Background texture key.
 * @param {PopUP} [parent] - View that creates this PopUP.
 * @param {string} [title] - PopUp title.
 */
var PopUp = function(backgroundKey, parent, title) {
    Phaser.Sprite.call(this, level.game, 0, 0, backgroundKey);

    this.xCenter = this.width / 2;
    this.yCenter = this.height / 2;

    this.x = level.game.camera.width / 2 - this.xCenter;
    this.y = level.game.camera.height / 2 - this.yCenter;

    this.closeButton = level.game.make.sprite(this.width - 5, 5, 'close');
    this.closeButton.anchor.set(1, 0);
    this.closeButton.inputEnabled = true;
    this.closeButton.input.priorityID = 2;
    this.closeButton.events.onInputDown.add(this.close, this);

    if (title !== undefined) {
        this.title = level.game.make.text(this.xCenter, 5, title);
        this.title.font = level.font;
        this.title.fontSize = 40;
        this.title.fill = '#feec69';
        this.title.stroke = '#000000';
        this.title.strokeThickness = 3;
        this.title.anchor.set(0.5, 0);
        this.addChild(this.title);
    }
    this.addChild(this.closeButton);

    this.fixedToCamera = true;
    this.visible = false;

    if (parent === undefined) {
        this.withoutParent = true;
    }else {
        this.withoutParent = false;
        this.parent = parent;
    }
};

PopUp.prototype = Object.create(Phaser.Sprite.prototype);
PopUp.prototype.constructor = PopUp;

/**
 * Closes or disposes this PopUp window.
 * @method PopUp.close
 */
PopUp.prototype.close = function() {
    this.visible = false;
    level.activePopUps --;
    if (level.activePopUps === 0) {
        level.resume();
    }
    this.kill();
};

/**
 * Opens or displays this PopUp window.
 * @method PopUp.open
 */
PopUp.prototype.open = function() {
    if (!this.alive) {
        this.revive();
    }if (level.activePopUps === 0) {
        level.pause();
    }
    level.activePopUps ++;
    this.bringToTop();
    this.visible = true;
};

/**
 * Remove all the elements that contains the PopUp
 * @method PopUp.removeAllElements
 */
PopUp.prototype.removeAllElements = function() {
    var index = 1;
    if (this.title !== undefined) {
        index = 2;
    }
    this.removeChildren(index);
    this.restartPositions();
};

module.exports = PopUp;

},{}],66:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 15/10/2015.
 */

/**
 * Bar that shows the remaining part of a resource, for example a HealthBar.
 * @class ResourceBar
 * @extends Phaser.Sprite
 * @constructor
 * @param {number} x - X coordinate of the bar.
 * @param {number} y - Y coordinate of the bar.
 * @param {Object} [size.width] - Bar width.
 * @param {Object} [size.height] - Bar height.
 */
var ResourceBar = function(x, y, size) {
    Phaser.Sprite.call(this, level.game, x, y, 'healthBarBackground');
    this.bar = level.game.make.sprite(0, 0, 'healthBar');
    var sizeOps = size || [];
    if (sizeOps.width !== undefined && sizeOps.height !== undefined) {
        this.width =  sizeOps.width;
        this.height =  sizeOps.height;
    }
    this.addChild(this.bar);
};

ResourceBar.prototype = Object.create(Phaser.Sprite.prototype);
ResourceBar.prototype.constructor = ResourceBar;

/**
 * Updates the current level of the bar.
 * @method ResourceBar.updateResourceBarLevel
 * @param {number} barLevel - Number between 0 (0%) and 1 (100%), that
 * represents the bar current level.
 */
ResourceBar.prototype.updateResourceBarLevel = function(barLevel) {
    this.bar.scale.x = barLevel;
};

module.exports = ResourceBar;

},{}],67:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 13/10/2015.
 */

/**
 * Tha class Utilities contains different functions or utilities that are useful
 * within other classes.
 * @class Utilities
 * @constructor
 */
var Utilities = function() {};

/**
 * Returns a list with random indexes for an array of length = size.
 * @method Utilities.randomIndexesArray
 * @param {number} size - Array's length.
 * @returns {number[]} Array containing the random indexes.
 */
Utilities.prototype.randomIndexesArray = function(size) {
    var randomIndex;
    var randomIndexes = [];
    var indexes = [];
    var  i;
    for (i = 0; i < size; i++) {
        indexes.push(i);
    }
    for (i = 0; i < size; i++) {
        randomIndex = level.game.rnd.integerInRange(0, indexes.length - 1);
        randomIndexes.push(indexes[randomIndex]);
        indexes.splice(randomIndex, 1);
    }
    return randomIndexes;
};

module.exports = Utilities;

},{}],68:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 13/10/2015.
 */
/**
 * Margin to hold between elements
 * @constant
 * @type {number}
 */
var MARGIN = 10;

/**
 * Allow control for a Vertical Layout Sprite.
 * @class VerticalLayout
 * @constructor
 * @param {Phaser.Sprite} parent - Sprite that contains the layout.
 * @param {number} margin - Margin or space between elements, optional.
 * @param {number} [yOrigin] - Where layout should start adding elements.
 */
var VerticalLayout = function(parent, margin, yOrigin) {
    var y = yOrigin || 0;
    this.margin = margin || MARGIN;
    this.currentY = this.margin + y;
    this.parent = parent;
};

VerticalLayout.prototype.constructor = VerticalLayout;

/**
 * Adds a element as a child to the parent Sprite, is add the elment vercially
 * bellow the last element and centered on x axis.
 * @method VerticalLayout.addElement
 * @param {Phaser.Sprite} element Element to be added to the Sprite
 */
VerticalLayout.prototype.addElement = function(element) {
    element.y = this.currentY;
    this.currentY += element.height + this.margin;
    element.x = this.parent.width / 2 - element.width / 2;

    this.parent.addChild(element);
};

/**
 * Restart the position of y, so that the next element is added at the first
 * position.
 * @method VerticalLayout.restartPosition
 */
VerticalLayout.prototype.restartPosition = function() {
    this.currentY = this.margin;
};

module.exports = VerticalLayout;

},{}],69:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 13/10/2015.
 */

var VerticalLayout = require('./VerticalLayout');

/**
 * Represents a panel that has a VerticalLayout to arrange its elements.
 * @class VerticalLayoutPanel
 * @extends Phaser.Sprite
 * @constructor
 * @param {string} backgroundKey - Texture's key for panel's background
 * @param {number} margin - Margin or space between elements, optional
 * @param {number} yOrigin - Where layout should start adding elements,
 * optional.
 */
var VerticalLayoutPanel = function(backgroundKey, margin, yOrigin) {
    Phaser.Sprite.call(this, level.game, 0, 0, backgroundKey);
    this.layout = new VerticalLayout(this, margin, yOrigin);
};

VerticalLayoutPanel.prototype = Object.create(Phaser.Sprite.prototype);
VerticalLayoutPanel.prototype.constructor = VerticalLayoutPanel;

/**
 * Adds an element to the Panel vertically.
 * @method VerticalLayoutPanel.addElement
 * @param {Phaser.Sprite} element - Element to be added.
 */
VerticalLayoutPanel.prototype.addElement = function(element) {
    this.layout.addElement(element);
};

/**
 * Remove all the elements that contains the panel
 * @method VerticalLayoutPanel.removeAllElements
 */
VerticalLayoutPanel.prototype.removeAllElements = function() {
    this.removeChildren();
    this.layout.restartPosition();
};

/**
 * Restarts the positions of x and y to the origin.
 * @method VerticalLayoutPanel.restartPosition
 */
VerticalLayoutPanel.prototype.restartPosition = function() {
    this.layout.restartPosition();
};

module.exports = VerticalLayoutPanel;


},{"./VerticalLayout":68}],70:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 21/10/2015.
 */
var PopUp = require('./PopUp');
var VerticalLayout = require('./VerticalLayout');

/**
 * PopUp view that uses a VerticalLayout to arrange its elements.
 * @class VerticalLayoutPopUP
 * @extends PopUp
 * @constructor
 * @param {string} backgroundKey - Background texture's key.
 * @param {PopUp} [parent] - View that creates this PopUp.
 * @param {string} title - Title for this PopUp.
 * @param {number} margin - Margin or space between elements, optional.
 */
var VerticalLayoutPopUP = function(backgroundKey, parent, title, margin) {
    PopUp.call(this, backgroundKey, parent, title);
    var yOrigin = 0;
    if (title !== '') {
        yOrigin = this.title.y + this.title.height;
    }
    this.layout = new VerticalLayout(this, margin, yOrigin);
};

VerticalLayoutPopUP.prototype = Object.create(PopUp.prototype);
VerticalLayoutPopUP.prototype.constructor = VerticalLayoutPopUP;

/**
 * Adds an element to the PopUp.
 * @method VerticalLayoutPopUP.addElement
 * @param {Phaser.Sprite} element - Element to be added to the PopUp.
 */
VerticalLayoutPopUP.prototype.addElement = function(element) {
    this.layout.addElement(element);
};

/**
 * Restarts the positions x and y to the origin, so that next elements will be
 * added in the first position.
 * @method VerticalLayoutPopUP.restartPositions
 */
VerticalLayoutPopUP.prototype.restartPositions = function() {
    this.layout.restartPosition();
};

module.exports = VerticalLayoutPopUP;

},{"./PopUp":65,"./VerticalLayout":68}],71:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 29/08/2015.
 */

/**
 * Represents a House, which player can interact with.
 * @class InteractiveHouse
 * @extends Phaser.Sprite
 * @constructor
 * @param {number} x - House x coordinate within the world.
 * @param {number} y - House y coordinate within the world.
 * @param {string} backgroundKey - House texture key.
 * @param {InteractionManager} interactionManager - Interaction manager that
 * allows interaction with the player.
 */
var InteractiveHouse = function(x, y, backgroundKey, interactionManager) {
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);
    this.anchor.set(0, 1);
    level.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.interactionManager = interactionManager;
};

InteractiveHouse.prototype = Object.create(Phaser.Sprite.prototype);
InteractiveHouse.prototype.constructor = InteractiveHouse;

/**
 * Displays this house dialog
 * @method InteractiveHouse.openActivity
 */
InteractiveHouse.prototype.openActivity = function() {
    level.interactiveBuldings.remove(this);
    level.addObject(this);
    this.interactionManager.openDialogs();
};

/**
 * Creates an animated arrow to show when the pop up displays. It can be used
 * to indicate or point something to the user
 * @param {number} x - Arrow x coordinate within the world.
 * @param {number} y - Arrow y coordinate within the world.
 */
InteractiveHouse.prototype.createAnimatedArrow = function(x, y) {
    var animatedArrow = level.game.make.sprite(x, y, 'arrowDown');
    animatedArrow.anchor.set(0, 1);
    animatedArrow.animations.add('animation', [0, 1, 2, 3, 4, 5], 4, true);
    animatedArrow.animations.play('animation');
    var lastDialogIndex = this.interactionManager.dialogs.length - 1;
    this.interactionManager.dialogs[lastDialogIndex].addChild(animatedArrow);
};

module.exports = InteractiveHouse;

},{}],72:[function(require,module,exports){
/**
 * @ignore Created by Edwin Gamboa on 25/10/2015.
 */

/**
 * Represents a board for streets and city places names.
 * @class NameBoard
 * @extends Phaser.Sprite
 * @param {number} x - Board x coordinate within the world.
 * @param {number} y - Board y coordinate within the world.
 * @param {string} name - Text to be showed on the Board.
 * @constructor
 */
var NameBoard = function(x, y, name) {
    Phaser.Sprite.call(this, level.game, x, y, 'nameBoard');
    this.anchor.set(0.5, 1);

    this.message = level.game.make.text(0, -this.height + 10, name);
    this.message.font = level.font;
    this.message.fontSize = 16;
    this.message.fill = '#FFFFFF';
    this.message.anchor.set(0.5, 0);

    this.addChild(this.message);
};

NameBoard.prototype = Object.create(Phaser.Sprite.prototype);
NameBoard.prototype.constructor = NameBoard;

module.exports = NameBoard;

},{}],73:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 09/03/2016.
 */
/**
 * Represents a Sprite that triggers an action when player overlaps it.
 * @class TriggerSprite
 * @extends Phaser.Sprite
 * @constructor
 * @param {number} x - X coordinate within the world.
 * @param {number} y - Y coordinate within the world.
 * @param {string} backgroundKey - House texture key.
 * @param {function} action - Action to be triggered.
 * @param {object} parent - Object that has the action as function
 */
var TriggerSprite = function(x, y, backgroundKey, action, parent) {
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);
    this.anchor.set(0, 1);
    level.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.action = action;
    this.parentObject = parent;
};

TriggerSprite.prototype = Object.create(Phaser.Sprite.prototype);
TriggerSprite.prototype.constructor = TriggerSprite;

/**
 * Triggers the action related to this Sprite
 * @method TriggerSprite.triggerAction
 */
TriggerSprite.prototype.triggerAction = function() {
    this.action.call(this.parentObject);
};

module.exports = TriggerSprite;

},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,31,32,27,28,29,30,33,34,35,36,37,38,39,40,44,45,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73]);
