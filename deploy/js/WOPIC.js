(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'WOPIC');

WebFontConfig = {
    google: {
        families: ['Shojumaru']
    }
};

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

},{"./states/Boot":24,"./states/Menu":25,"./states/Preloader":26,"./states/levels/LevelOne":28,"./states/levels/LevelOneIntro":29}],2:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 08/07/2015.
 */

var SPEED = 150;
var MAX_SPEED = 250;
var INITIAL_HEALTH_LEVEL = 100;
var MAX_HEALTH_LEVEL = 100;
var BOUNCE = 0.2;
var GRAVITY = 300;
var RIGHT_DIRECTION = 1;
var LEFT_DIRECTION = -1;

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
    this.anchor.setTo(0.5, 0.5);

    this.currentWeaponIndex = 0;

    this.level = level;
    this.weapons = [];
    this.weaponsKeys = [];
    this.direction = RIGHT_DIRECTION;
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
    this.direction = LEFT_DIRECTION;
    this.body.velocity.x = -this.speed;
    this.animations.play('left');
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.pointToLeft();
    }
};

/**
 * Moves the character in the right direction using normal speed.
 */
Character.prototype.moveRight = function() {
    this.direction = RIGHT_DIRECTION;
    this.body.velocity.x = this.speed;
    this.animations.play('right');
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.pointToRight();
    }
};

/**
 * Moves the character in the left direction using running speed.
 */
Character.prototype.runLeft = function() {
    this.direction = LEFT_DIRECTION;
    this.body.velocity.x = -this.maxSpeed;
    this.animations.play('left');
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.pointToLeft();
    }
};

/**
 * Moves the character in the right direction using running speed.
 */
Character.prototype.runRight = function() {
    this.direction = RIGHT_DIRECTION;
    this.body.velocity.x = this.maxSpeed;
    this.animations.play('right');
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.pointToRight();
    }
};

/**
 * Stops the character and its animations.
 */
Character.prototype.stop = function() {
    this.body.velocity.x = 0;
    this.animations.stop();
    if (this.direction > 0) {
        this.frame = this.stopRightFrameIndex;
    }else {
        this.frame = this.stopLeftFrameIndex;
    }
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
 * Changes player's current weapon, to the next one in the weapons array.
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
    if (this.weapons[newWeapon.key] === undefined) {
        this.weaponsKeys.push(newWeapon.key);
    }
    this.weapons[newWeapon.key] = newWeapon;
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

Character.prototype.useWeapon = function(weapon) {
    if (this.weapons[weapon.key] === undefined) {
        this.addWeapon(weapon);
        this.updateCurrentWeapon(weapon.key);
        if (this.direction === RIGHT_DIRECTION) {
            this.currentWeapon.pointToRight();
        }else {
            this.currentWeapon.pointToLeft();
        }
    }else {
        //weapon.kill();
        this.weapons[weapon.key].addBullets(weapon.numberOfBullets);
    }
};

module.exports = Character;

},{}],3:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 08/07/2015.
 */
var Character = require('./Character');

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
    this.stopLeftFrameIndex = 0;
    this.stopRightFrameIndex = 2;
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
    this.currentWeapon.updateCoordinates(this.x, this.y);
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

},{"./Character":2}],4:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 16/07/2015.
 */
var Character = require('./Character');

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

},{"./Character":2}],5:[function(require,module,exports){
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var SPEED = 250;
var MAX_SPEED = 300;
var GRAVITY = 300;
var Character = require('./Character');

var MINIMUM_SCORE = 10;
var Player;
Player = function(level) {
    var options = {speed : SPEED, maxSpeed : MAX_SPEED};
    Character.call(this, level, 32, level.game.world.height - 150,
        'character', options);
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);
    this.stopLeftFrameIndex = 0;
    this.stopRightFrameIndex = 5;
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
        this.currentWeapon.updateCoordinates(this.x + (this.direction * 25),
            this.y + 20);
    }
};

Player.prototype.killCharacter = function() {

    Character.prototype.killCharacter.call(this);
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

Player.prototype.buyItem = function(item) {
    if (this.score >= item.price) {
        this.score -= item.price;
        return true;
    }else {
        return false;
    }
};

module.exports = Player;

},{"./Character":2}],6:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 23/07/2015.
 */
var Enemy = require('./Enemy');
var Revolver = require('../items/weapons/Revolver');

var SPRITE_KEY = 'simple_enemy';
var MAX_HEALTH_LEVEL = 5;
var MIN_RANGE_DETECTION = 200;
var MAX_RANGE_DETECTION = 700;
var MIN_RANGE_ATTACK = 50;
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

    this.useWeapon(new Revolver(this, x, y, true));
};

SimpleEnemy.prototype = Object.create(Enemy.prototype);
SimpleEnemy.prototype.constructor = SimpleEnemy;

module.exports = SimpleEnemy;

},{"../items/weapons/Revolver":22,"./Enemy":3}],7:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 23/07/2015.
 */
var Enemy = require('./Enemy');
var MachineGun = require('../items/weapons/MachineGun');

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

    this.useWeapon(new MachineGun(this, x, y, true));
};

StrongEnemy.prototype = Object.create(Enemy.prototype);
StrongEnemy.prototype.constructor = StrongEnemy;

module.exports = StrongEnemy;

},{"../items/weapons/MachineGun":21,"./Enemy":3}],8:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 08/10/2015.
 */

var GridLayoutPopUp = require('../util/GridLayoutPopUp');
var GridLayoutPanel = require('../util/GridLayoutPanel');
var Button = require('../util/Button');

var NUMBER_OF_CONTEXTS = 2;
var ContextGroups = function(level) {
    this.score = 30;
    var dimensions = {numberOfColumns: 1, numberOfRows: 4};
    GridLayoutPopUp.call(this, level, 'inventory_background', dimensions);

    this.level = level;

    var words = ['Mother', 'Son', 'Father', 'Living room', 'Dining room',
        'Kitchen'];

    this.contexts = [];
    var draggableWords = [];
    var optionals = {numberOfColumns: words.length / 2, numberOfRows : 2};
    this.wordsField = new GridLayoutPanel(this.level, 'wordField', optionals);

    optionals = {numberOfColumns: NUMBER_OF_CONTEXTS};
    var contextsPanels = new GridLayoutPanel(this.level, 'wordField',
        optionals);

    var i;
    var j;
    var word;
    var wordShade;
    var context;
    this.numberOfWords = words.length / NUMBER_OF_CONTEXTS;
    optionals = {numberOfRows: this.numberOfWords};
    for (i = 0; i < NUMBER_OF_CONTEXTS; i++) {
        context = new GridLayoutPanel(this.level, 'itemGroupBackGround',
            optionals);
        this.contexts.push(context);
        contextsPanels.addElement(context);

        for (j = i * (NUMBER_OF_CONTEXTS + 1);
             j < (i + 1) * this.numberOfWords; j++) {
            word = this.level.game.make.text(0, 0, words[j]);
            //Font style
            word.font = 'Shojumaru';
            word.fontSize = 20;
            word.fill = '#0040FF';
            word.inputEnabled = true;
            word.input.enableDrag(true, true);
            word.events.onDragStop.add(this.fixLocation, this);
            word.code = '' + i;
            draggableWords.push(word);

            wordShade = new GridLayoutPanel(this.level, 'useButtonShade');
            context.addElement(wordShade);
        }
    }

    var randomIndex;
    var indexes = [];
    for (i = 0; i < draggableWords.length; i++) {
        indexes.push(i);
    }

    for (i = 0; i < draggableWords.length; i++) {
        randomIndex = level.game.rnd.integerInRange(0,
            indexes.length - 1);
        this.wordsField.addElement(draggableWords[indexes[randomIndex]]);
        draggableWords[indexes[randomIndex]].initialX =
            draggableWords[indexes[randomIndex]].x;
        draggableWords[indexes[randomIndex]].initialY =
            draggableWords[indexes[randomIndex]].y;
        indexes.splice(randomIndex, 1);
    }

    this.confirmButton = new Button(this.level, 'Confirm', this.confirm, this);
    //this.addElement(Description);
    this.addElement(contextsPanels);
    this.addElement(this.wordsField);
    this.addElement(this.confirmButton);
};

ContextGroups.prototype = Object.create(GridLayoutPopUp.prototype);
ContextGroups.prototype.constructor = ContextGroups;

ContextGroups.prototype.fixLocation = function(item) {
    var context;
    var shade;
    for (context in this.contexts) {
        for (shade in this.contexts[context].children) {
            if (item.overlap(this.contexts[context].children[shade]) &&
                this.contexts[context].children[shade].children.length === 0) {
                item.x = 0;
                item.y = 0;
                this.contexts[context].children[shade].addChild (item);
                return;
            }
            item.x = item.initialX;
            item.y = item.initialY;
            this.wordsField.addChild(item);
        }
    }
};

ContextGroups.prototype.bringItemToTop = function(item) {
    if (ContextGroups.prototype.isPrototypeOf(item.parent)) {
        this.addChild(item);
    }else {
        this.addChild(item.parent.parent);
    }
};

ContextGroups.prototype.confirm = function() {
    var correct = true;
    if (this.wordsField.children.length > 0) {
        this.level.showErrorMessage('The challenge is not complete.', this);
        return;
    }
    for (var shade in this.contexts) {
        for (var word in this.contexts[shade].children) {
            if (this.contexts[shade].children[word].children[0].code !==
                shade) {
                this.level.showErrorMessage('Sorry! Try Again.', this);
                return;
            }
        }
    }
    this.level.increaseScore(this.score);
    this.level.showSuccessMessage('Well done! You got ' + this.score +
        ' points.', this);
    this.close();
};

module.exports = ContextGroups;

},{"../util/Button":30,"../util/GridLayoutPanel":33,"../util/GridLayoutPopUp":34}],9:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 13/10/2015.
 */

/**
 * Represents an EnglishChallenge within the game. An EnglishChallenge is used,
 * by the player to increase his/her score in a faster way.
 * @param level {Level} level Object to access game level elements
 * @param iconKey {string} Texture's key for the icon of the challenge
 * @param name {string} Name of the challenge
 * @param score {number} Score to be increased in case of success.
 * @constructor
 */
var EnglishChallenge = function(level, iconKey, name, score) {
    this.level = level;
    this.icon = this.level.game.make.sprite(10, 10, iconKey);
    this.name = name;
    this.score = score;
};

/**
 * Increases player score and shows a success message. It is called when player
 * overcome the challenge successfully.
 * @param parent Parent Ui to show dalog
 */
EnglishChallenge.prototype.success = function(parent) {
    this.level.increaseScore(this.score);
    this.level.showSuccessMessage('Well done! You got ' + this.score +
        ' points.', parent);
};

/**
 * Shows a failure message. It is called when player has completed the challenge
 * but in a wrong way.
 * @param parent Parent Ui to show dalog
 */
EnglishChallenge.prototype.failure = function(parent) {
    this.level.showErrorMessage('Sorry! Try Again.', parent);
};

/**
 * Shows a failure message. It is called when player has not completed the
 * challenge.
 * @param parent Parent Ui to show dalog
 */
EnglishChallenge.prototype.incomplete = function(parent) {
    this.level.showErrorMessage('The challenge is not complete.', parent);
};

module.exports = EnglishChallenge;

},{}],10:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 10/10/2015.
 */
var GridLayoutPopUp = require('../util/GridLayoutPopUp');

var EnglishChallenges = function(level) {
    GridLayoutPopUp.call(this, level, 'inventory_background');

    this.level = level;
    this.createGames();
};

EnglishChallenges.prototype = Object.create(GridLayoutPopUp.prototype);
EnglishChallenges.prototype.constructor = EnglishChallenges;

EnglishChallenges.prototype.createGames = function() {

    var healthPackItem = new HealthPack(this.level, 0, 0, 5);
    this.items.healthPack5 = new EnglishChallengesItem(this.level,
        healthPackItem,
        this);
    this.addElement(this.items.healthPack5);

    var revolverItem = new Revolver(this.level, 0, 0, false);
    this.items.simpleWeapon = new EnglishChallengesItem(this.level,
        revolverItem,
        this);
    this.addElement(this.items.simpleWeapon);
};

EnglishChallenges.prototype.showHealthPacks = function() {
    //TODO
};

module.exports = EnglishChallenges;

},{"../util/GridLayoutPopUp":34}],11:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 08/10/2015.
 */

var GridLayoutPopUp = require('../util/GridLayoutPopUp');
var Button = require('../util/Button');
var Utilities = require('../util/Utilities');
var VerticalLayoutPanel = require('../util/VerticalLayoutPanel');
var EnglishChallenge = require('../englishChallenges/EnglishChallenge');

var ImageWordMatch = function(level) {
    this.englishChallenge = new EnglishChallenge(
        level,
        'mother',
        'Word-Image Match',
        10
    );
    var utils = new Utilities(level);
    var dimensions = {numberOfColumns: 3, numberOfRows: 3};
    GridLayoutPopUp.call(this, level, 'inventory_background', dimensions);

    this.level = level;

    var familyKeys = ['mother', 'son', 'daughter'];
    var familyMembersCells = [];
    var familyMembersLabels = [];
    this.shades = [];

    for (var key in familyKeys) {
        var cell = new VerticalLayoutPanel(this.level, 'itemGroupBackGround');
        var familyMember = this.level.game.make.sprite(0, 0, familyKeys[key]);
        var shade = this.level.game.make.sprite(0, 0, 'useButtonShade');
        shade.code = key;

        this.shades.push(shade);
        cell.addElement(familyMember);
        cell.addElement(shade);

        var label = this.level.game.make.text(0, 0, familyKeys[key]);
        //Font style
        label.font = 'Shojumaru';
        label.fontSize = 20;
        label.fill = '#0040FF';
        label.inputEnabled = true;
        label.input.enableDrag(true, true);
        label.events.onDragStart.add(this.bringItemToTop, this);
        label.events.onDragStop.add(this.fixLocation, this);
        label.code = key;
        familyMembersCells.push(cell);
        familyMembersLabels.push(label);
    }

    for (var familyMemberCell in familyMembersCells) {
        this.addElement(familyMembersCells[familyMemberCell]);
    }

    var randomIndexes = utils.randomIndexesArray(familyMembersLabels.length);
    var index;
    for (index in randomIndexes) {
        this.addElement(familyMembersLabels[randomIndexes[index]]);
        familyMembersLabels[randomIndexes[index]].initialX =
            familyMembersLabels[randomIndexes[index]].x;
        familyMembersLabels[randomIndexes[index]].initialY =
            familyMembersLabels[randomIndexes[index]].y;
    }

    this.confirmButton = new Button(this.level, 'Confirm', this.confirm, this);
    this.addElement(this.confirmButton);
};

ImageWordMatch.prototype = Object.create(GridLayoutPopUp.prototype);
ImageWordMatch.prototype.constructor = ImageWordMatch;

ImageWordMatch.prototype.fixLocation = function(item) {
    for (var shade in this.shades) {
        if (item.overlap(this.shades[shade]) &&
            this.shades[shade].children.length === 0) {
            item.x = 0;
            item.y = 0;
            this.shades[shade].addChild(item);
            return;
        }
        this.addChild(item);
        item.x = item.initialX;
        item.y = item.initialY;
    }
};

ImageWordMatch.prototype.bringItemToTop = function(item) {
    if (ImageWordMatch.prototype.isPrototypeOf(item.parent)) {
        this.addChild(item);
    }else {
        this.addChild(item.parent.parent);
    }
};

ImageWordMatch.prototype.confirm = function() {
    var correct = true;
    for (var shade in this.shades) {
        if (this.shades[shade].children[0] === undefined) {
            this.englishChallenge.incomplete(this);
            return;
        }
        var letter = this.shades[shade].children[0];
        if (this.shades[shade].children[0].code !== shade) {
            this.englishChallenge.failure(this);
            return;
        }
    }
    this.englishChallenge.success();
    this.close(this);
};
module.exports = ImageWordMatch;

},{"../englishChallenges/EnglishChallenge":9,"../util/Button":30,"../util/GridLayoutPopUp":34,"../util/Utilities":38,"../util/VerticalLayoutPanel":40}],12:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 08/10/2015.
 */

var GridLayoutPopUp = require('../util/GridLayoutPopUp');
var GridLayoutPanel = require('../util/GridLayoutPanel');
var Button = require('../util/Button');

var FamilyEC = function(level) {
    this.score = 30;
    var dimensions = {numberOfColumns: 1, numberOfRows: 4};
    GridLayoutPopUp.call(this, level, 'inventory_background', dimensions);

    this.level = level;

    var word = 'mother';
    this.shades = [];
    var letters = [];
    var wordImage = this.level.game.make.sprite(0, 0, 'mother');

    var optionals = {numberOfColumns: word.length};
    var wordFieldAnswer = new GridLayoutPanel(this.level,
        'wordField', optionals);

    this.wordFieldLetters = new GridLayoutPanel(this.level,
        'wordField', optionals);

    var i;
    var letter;
    var letterShade;
    for (i = 0; i < word.length; i++) {
        letterShade = new GridLayoutPanel(this.level, 'letterShade');
        this.shades.push(letterShade);

        wordFieldAnswer.addElement(letterShade);

        letter = this.level.game.make.text(0, 0, word.charAt(i));
        //Font style
        letter.font = 'Shojumaru';
        letter.fontSize = 20;
        letter.fill = '#0040FF';
        letter.inputEnabled = true;
        letter.input.enableDrag(true, true);
        letter.events.onDragStop.add(this.fixLocation, this);
        letter.code = '' + i;
        letters.push(letter);
    }

    var randomIndex;
    var indexes = [];
    for (i = 0; i < word.length; i++) {
        indexes.push(i);
    }

    for (i = 0; i < word.length; i++) {
        randomIndex = level.game.rnd.integerInRange(0,
            indexes.length - 1);
        this.wordFieldLetters.addElement(letters[indexes[randomIndex]]);
        letters[indexes[randomIndex]].initialX =
            letters[indexes[randomIndex]].x;
        letters[indexes[randomIndex]].initialY =
            letters[indexes[randomIndex]].y;

        indexes.splice(randomIndex, 1);

    }

    this.confirmButton = new Button(this.level, 'Confirm', this.confirm, this);
    this.addElement(wordImage);
    this.addElement(wordFieldAnswer);
    this.addElement(this.wordFieldLetters);
    this.addElement(this.confirmButton);
};

FamilyEC.prototype = Object.create(GridLayoutPopUp.prototype);
FamilyEC.prototype.constructor = FamilyEC;

FamilyEC.prototype.fixLocation = function(item) {
    for (var shade in this.shades) {
        if (item.overlap(this.shades[shade]) &&
            this.shades[shade].children.length === 0) {
            item.x = 0;
            item.y = 0;
            this.shades[shade].addElement(item);
            return;
        }
        item.x = item.initialX;
        item.y = item.initialY;
        this.wordFieldLetters.addChild(item);
    }
};

FamilyEC.prototype.bringItemToTop = function(item) {
    if (FamilyEC.prototype.isPrototypeOf(item.parent)) {
        this.addChild(item);
    }else {
        this.addChild(item.parent.parent);
    }
};

FamilyEC.prototype.confirm = function() {
    var correct = true;
    if (this.wordFieldLetters.children.length > 0) {
        this.level.showErrorMessage('The challenge is not complete.', this);
        return;
    }
    for (var shade in this.shades) {
        if (this.shades[shade].children[0].code !== shade) {
            this.level.showErrorMessage('Sorry! Try Again.', this);
            return;
        }
    }
    this.level.increaseScore(this.score);
    this.level.showSuccessMessage('Well done! You got ' + this.score +
        ' points.', this);
    this.close();
};
module.exports = FamilyEC;

},{"../util/Button":30,"../util/GridLayoutPanel":33,"../util/GridLayoutPopUp":34}],13:[function(require,module,exports){
var Item = require('./Item');

var PRCE_INCREASE_RATE = 10;
var GRAVITY = 300;

var HealthPack = function(level,
                          x,
                          y,
                          maxIncreasing) {
    Item.call(this, level, x, y, 'healthPack' + maxIncreasing,
        maxIncreasing * PRCE_INCREASE_RATE);
    this.body.gravity.y = GRAVITY;
    this.maxIncreasing = maxIncreasing;
};

HealthPack.prototype = Object.create(Item.prototype);
HealthPack.prototype.constructor = HealthPack;

HealthPack.prototype.pickUp = function() {
    this.kill();
};

HealthPack.prototype.use = function() {
    if (!this.alive) {
        this.revive();
    }
    this.x = this.level.player.x;
    this.y = 50;
    this.level.addHealthPack(this);
};

module.exports = HealthPack;

},{"./Item":14}],14:[function(require,module,exports){
var BOUNCE = 0.7 + Math.random() * 0.2;

var Item = function(level, x, y, key, price) {
    Phaser.Sprite.call(this, level.game, x, y, key);
    this.anchor.set(0.5, 0.5);
    level.game.physics.arcade.enable(this);
    this.body.bounce.y = BOUNCE;
    this.body.collideWorldBounds = true;
    this.level = level;
    this.price = price;
};

Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;

module.exports = Item;

},{}],15:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 17/07/2015.
 */
var GridLayoutPanel = require('../util/GridLayoutPanel');
var Button = require('../util/Button');

var ItemGroupView = function(level,
                             item,
                             buttonText,
                             parentView) {
    Phaser.Sprite.call(this, level.game, 0, 0, 'itemGroupBackGround');
    this.icon = level.game.make.sprite(10, 10, item.key);
    this.message = level.game.make.text(0, 0, '');
    this.message.font = 'Arial';
    this.message.fontSize = 30;
    this.message.fill = '#0040FF';
    this.messageBackground = new GridLayoutPanel(level, 'letterShade');
    this.messageBackground.addElement(this.message);

    this.messageBackground.x = 10;
    this.messageBackground.y = this.icon.y + this.icon.height + 10;

    this.button = new Button(level, buttonText, this.buttonAction, this);
    this.button.x = this.messageBackground.x + this.messageBackground.width +
        10;
    this.button.y = this.icon.y + this.icon.height + 10;

    this.addChild(this.icon);
    this.addChild(this.messageBackground);
    this.addChild(this.button);
    this.parent = parentView;
    this.item = item;
    this.level = level;
};

ItemGroupView.prototype = Object.create(Phaser.Sprite.prototype);
ItemGroupView.prototype.constructor = ItemGroupView;

ItemGroupView.prototype.buttonAction = function() {

};

module.exports = ItemGroupView;

},{"../util/Button":30,"../util/GridLayoutPanel":33}],16:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var GridLayoutPopUp = require('../../util/GridLayoutPopUp');
var InventoryItem = require ('./InventoryItem');
var HealthPack = require('../HealthPack');
var Revolver = require('../weapons/Revolver');

var Inventory = function(level) {
    GridLayoutPopUp.call(this, level, 'inventory_background');

    this.level = level;

    this.healthPacks = [];
    this.items = [];
    this.createItemGroups();
};

Inventory.prototype = Object.create(GridLayoutPopUp.prototype);
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
    var healthPackItem = new HealthPack(this.level, 0, 0, 5);
    this.items.healthPack5 = new InventoryItem(this.level, healthPackItem,
        this);
    this.addElement(this.items.healthPack5);

    var revolverItem = new Revolver(this.level, 0, 0, false);
    this.items.simpleWeapon = new InventoryItem(this.level, revolverItem,
        this);
    this.addElement(this.items.simpleWeapon);
};

Inventory.prototype.showHealthPacks = function() {
    //TODO
};

module.exports = Inventory;

},{"../../util/GridLayoutPopUp":34,"../HealthPack":13,"../weapons/Revolver":22,"./InventoryItem":17}],17:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 17/07/2015.
 */
var ItemGroupView = require('../ItemGroupView');

var InventoryItem = function(level, item, parentView) {
    ItemGroupView.call(this, level, item, 'Use', parentView);

    this.amountAvailable = 0;
    this.updateAmountAvailableText();
};

InventoryItem.prototype = Object.create(ItemGroupView.prototype);
InventoryItem.prototype.constructor = InventoryItem;

InventoryItem.prototype.buttonAction = function() {
    if (this.amountAvailable > 0) {
        this.item.use();
        this.amountAvailable --;
        this.updateAmountAvailableText();
        this.parent.close();
    }
};

InventoryItem.prototype.updateAmountAvailableText = function() {
    this.message.text = '' + this.amountAvailable;
};

module.exports = InventoryItem;

},{"../ItemGroupView":15}],18:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var GridLayoutPopUp = require('../../util/GridLayoutPopUp');
var StoreItem = require ('./StoreItem');
var HealthPack = require('../HealthPack');
var Revolver = require('../weapons/Revolver');

var Store = function(level) {
    GridLayoutPopUp.call(this, level, 'inventory_background');

    this.level = level;

    this.healthPacks = [];
    this.items = [];
    this.createItemGroups();
};

Store.prototype = Object.create(GridLayoutPopUp.prototype);
Store.prototype.constructor = Store;

Store.prototype.addHealthPack = function(healthPack) {
    if (healthPack.maxIncreasing == 5) {
        this.healthPack5Group.amountAvailable ++;
        this.healthPack5Group.updateAmountAvailableText();
    }else if (healthPack.maxIncreasing == 20) {
        this.healthPacks[1]++;
    }else {
        this.healthPacks[2]++;
    }
};

Store.prototype.addItem = function(item) {
    if (this.items[item.key].item === undefined) {
        this.items[item.key].setItem(item);
    }
    this.items[item.key].amountAvailable ++;
    this.items[item.key].updateAmountAvailableText();
};

Store.prototype.createItemGroups = function() {
    var healthPackItem = new HealthPack(this.level, 0, 0, 5);
    this.items.healthPack5 = new StoreItem(this.level, healthPackItem,
        this);
    this.addElement(this.items.healthPack5);

    var revolverItem = new Revolver(this.level, 0, 0, false);
    this.items.simpleWeapon = new StoreItem(this.level, revolverItem,
        this);
    this.addElement(this.items.simpleWeapon);
};

Store.prototype.showHealthPacks = function() {
    //TODO
};

module.exports = Store;

},{"../../util/GridLayoutPopUp":34,"../HealthPack":13,"../weapons/Revolver":22,"./StoreItem":19}],19:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 17/07/2015.
 */
var ItemGroupView = require('../ItemGroupView');

var StoreItem = function(level, item, parentView) {
    ItemGroupView.call(this, level, item, 'Buy', parentView);
    this.updatePriceText();
};

StoreItem.prototype = Object.create(ItemGroupView.prototype);
StoreItem.prototype.constructor = StoreItem;

StoreItem.prototype.updatePriceText = function() {
    this.message.text = this.item.price;
};

StoreItem.prototype.buttonAction = function() {
    var succesfulPurchase = this.level.player.buyItem(this.item);
    if (succesfulPurchase) {
        this.item.use();
        this.level.updateScoreText();
        this.level.showSuccessMessage('Successful Purchase!', this.parent);
    }else {
        this.level.showErrorMessage('Not enough money.', this.parent);
    }
};

module.exports = StoreItem;

},{"../ItemGroupView":15}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 23/07/2015.
 */
var Weapon = require('./Weapon');

var MACHINE_GUN_NUMBER_OF_BULLETS = 30;
var MACHINE_GUN_KEY = 'machineGunSprite';
var MACHINE_GUN_BULLET_KEY = 'bullet2';
var MACHINE_GUN_NEXT_FIRE = 1;
var MACHINE_GUN_BULLET_SPEED = 700;
var MACHINE_GUN_FIRE_RATE = 100;
var MACHINE_GUN_BULLET_POWER = 10;
var PRICE = 100;

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
        inifinite,
        PRICE
    );
};

MachineGun.prototype = Object.create(Weapon.prototype);
MachineGun.prototype.constructor = MachineGun;

module.exports = MachineGun;

},{"./Weapon":23}],22:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 23/07/2015.
 */
var Weapon = require('./Weapon');

var REVOLVER_NUMBER_OF_BULLETS = 20;
var REVOLVER_KEY = 'revolverSprite';
var REVOLVER_BULLET_KEY = 'bullet1';
var REVOLVER_NEXT_FIRE = 0;
var REVOLVER_BULLET_SPEED = 400;
var REVOLVER_FIRE_RATE = 250;
var REVOLVER_BULLET_POWER = 1;
var PRICE = 20;

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
        inifinite,
        PRICE
    );
};

Revolver.prototype = Object.create(Weapon.prototype);
Revolver.prototype.constructor = Revolver;

module.exports = Revolver;

},{"./Weapon":23}],23:[function(require,module,exports){
var Item = require('../Item');
var Bullet = require('./Bullet');

var RIGHT_KEY = 0;
var LEFT_KEY = 1;

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
                      infinite,
                      price) {
    Item.call(this, level, x, y, weaponKey, price);

    this.anchor.set(0.5, 0);

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

Weapon.prototype = Object.create(Item.prototype);
Weapon.prototype.constructor = Weapon;

Weapon.prototype.fire = function(toX, toY) {
    var finalToY = toY || this.y;
    if (this.level.game.time.time > this.nextFire &&
        (this.infinite || this.numberOfBullets > 0)) {
        this.currentBullet = this.bullets.getFirstExists(false);
        if (this.currentBullet) {
            this.currentBullet.reset(this.x, this.y);
            this.currentBullet.rotation =
                this.level.game.physics.arcade.angleToXY(this.currentBullet,
                toX, finalToY);
            this.currentBullet.body.velocity.x =
                Math.cos(this.currentBullet.rotation) * this.bulletSpeed;
            this.currentBullet.body.velocity.y =
                Math.sin(this.currentBullet.rotation) * this.bulletSpeed;
            this.nextFire = this.level.game.time.time + this.fireRate;
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
    this.level.player.useWeapon(this);
    this.level.updateAmmoText();
};

Weapon.prototype.addBullets = function(amount) {
    this.numberOfBullets += amount;
};

Weapon.prototype.killWeapon = function() {
    this.bullets.removeAll();
    this.kill();
};

Weapon.prototype.pointToRight = function() {
    this.frame = RIGHT_KEY;
};

Weapon.prototype.pointToLeft = function() {
    this.frame = LEFT_KEY;
};

module.exports = Weapon;

},{"../Item":14,"./Bullet":20}],24:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 07/07/2015.
 */
var Boot = function(game) {};

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

},{}],25:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 08/07/2015.
 */
var Menu = function(game) {};

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

},{}],26:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 08/07/2015.
 */
var Preloader = function(game) {
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
        this.game.load.image('buyButton', 'assets/images/buyButton.png');
        this.game.load.image('inventory_button', 'assets/images/inventory.png');
        this.game.load.image('storeButton', 'assets/images/store.png');
        this.game.load.image('inventory_background',
            'assets/images/inventoryBackground.png');
        this.game.load.image('close', 'assets/images/close.png');
        this.game.load.image('itemGroupBackGround',
            'assets/images/itemGroupBackGround.png');
        this.game.load.image('dialog', 'assets/images/dialog.png');
        this.game.load.image('errorIcon', 'assets/images/errorIcon.png');
        this.game.load.image('successIcon', 'assets/images/successIcon.png');

        this.game.load.spritesheet('character', 'assets/sprites/character.png',
            64, 96);
        this.game.load.spritesheet('npc', 'assets/sprites/npc.png',
            64, 96);
        this.game.load.spritesheet('friend', 'assets/sprites/npc.png',
            64, 96);
        this.game.load.spritesheet('simple_enemy',
            'assets/sprites/simple_enemy.png', 64, 64);
        this.game.load.spritesheet('strong_enemy',
            'assets/sprites/strong_enemy.png', 64, 64);
        this.game.load.spritesheet('jeep', 'assets/sprites/jeep.png', 219.5,
            150);
        this.game.load.spritesheet('revolverSprite',
            'assets/sprites/revolver.png', 30, 16);
        this.game.load.spritesheet('machineGunSprite',
            'assets/sprites/machineGun.png', 60, 42);

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
        this.game.load.image('addCashButton', 'assets/images/addCash.png');
        this.game.load.image('useButtonShade',
            'assets/images/useButtonShade.png');
        this.game.load.image('button', 'assets/images/button.png');
        this.game.load.image('mother', 'assets/images/mother.png');
        this.game.load.image('father', 'assets/images/father.png');
        this.game.load.image('daughter', 'assets/images/daughter.png');
        this.game.load.image('son', 'assets/images/son.png');

        this.game.load.image('wordField', 'assets/images/wordField.png');
        this.game.load.image('letterShade', 'assets/images/letterShade.png');
        this.game.load.image('transparent', 'assets/images/transparent.png');

        this.game.load.script('webfont',
            '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
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

},{}],27:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var Inventory = require('../../items/inventory/Inventory');
var Store = require('../../items/store/Store');
var HealthPack = require('../../items/HealthPack');
var Player = require('../../character/Player');
var Revolver = require('../../items/weapons/Revolver');
var MachineGun = require('../../items/weapons/MachineGun');
var SimpleEnemy = require('../../character/SimpleEnemy');
var StrongEnemy = require('../../character/StrongEnemy');
var NPC = require('../../character/NPC');
var PopUp = require('../../util/PopUp');
var InteractiveCar = require ('../../worldElements/InteractiveCar');
var Dialog = require('../../util/Dialog');

//var ImageWordMatch = require('../../englishChallenges/WordUnscramble');
//var ImageWordMatch = require('../../englishChallenges/ContextGroups');
var ImageWordMatch = require('../../englishChallenges/ImageWordMatch');

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
    this.createEnemiesGroup();
    this.createNpcsGroup();
    this.createCarsGroup();
    this.addPlayer();
    this.createWeaponsGroup();
    this.addPlatforms();
    this.addTexts();
    this.addControls();
    this.addCamera();
    this.createInventory();
    this.createStore();
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
        this.player.fireToXY(this.player.x + (100 * this.player.direction));
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
    this.player.useWeapon(new Revolver(this, 700, 100, false));
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
    this.addHealthPack(new HealthPack(this, 500, 10, 5, this));
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

Level.prototype.createStore = function() {
    this.store = new Store(this);
    this.game.add.existing(this.store);

    this.storeButton = this.game.add.button(110,
        this.game.camera.height - 30, 'storeButton',
        this.store.open, this.store);
    this.storeButton.anchor.setTo(0.5, 0.5);
    this.storeButton.fixedToCamera = true;
    this.storeButton.input.priorityID = 1;

    this.englishChallenge = new ImageWordMatch(this);
    this.game.add.existing(this.englishChallenge);

    this.addCashButton = this.game.add.button(170,
        this.game.camera.height - 30, 'addCashButton',
        this.englishChallenge.open, this.englishChallenge);
    this.addCashButton.anchor.setTo(0.5, 0.5);
    this.addCashButton.fixedToCamera = true;
    this.addCashButton.input.priorityID = 1;
};

Level.prototype.bulletHitCharacter = function(character, bullet) {
    character.decreaseHealthLevel(bullet.power);
    character.updateHealhtLevelText();
    bullet.kill();
};

Level.prototype.collectWeapon = function(player, weapon) {
    this.weapons.remove(weapon);
    this.player.useWeapon(weapon);
    this.updateAmmoText();
};

Level.prototype.crashEnemy = function(car, enemy) {
    if (!car.isStopped()) {
        enemy.killCharacter();
    }
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

Level.prototype.showErrorMessage = function(errorMessage, parent) {
    var errorDialog = new Dialog(this, 'errorIcon', errorMessage, parent);
    this.game.add.existing(errorDialog);
    errorDialog.open();
};

Level.prototype.showSuccessMessage = function(successMessage, parent) {
    var successDialog = new Dialog(this, 'successIcon', successMessage, parent);
    this.game.add.existing(successDialog);
    successDialog.open();
};

module.exports = Level;

},{"../../character/NPC":4,"../../character/Player":5,"../../character/SimpleEnemy":6,"../../character/StrongEnemy":7,"../../englishChallenges/ImageWordMatch":11,"../../items/HealthPack":13,"../../items/inventory/Inventory":16,"../../items/store/Store":18,"../../items/weapons/MachineGun":21,"../../items/weapons/Revolver":22,"../../util/Dialog":31,"../../util/PopUp":37,"../../worldElements/InteractiveCar":41}],28:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 22/07/2015.
 */
var Level = require ('../levels/Level');
var InteractiveHouse = require ('../../worldElements/InteractiveHouse');

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
    CHECK_POINTS_DISTANCE = this.game.camera.width + 200;
    this.addNPCs();
    this.addEnemies();
    this.addObjects();
    this.addRevolver(2000, 400, false);
    this.addRevolver(2000, 400, false);
    //this.player.bringToTop();
};

LevelOne.prototype.addObjects = function() {
    var gunsStore = new InteractiveHouse(
        this,
        CHECK_POINT_X_ONE + 1.5 * CHECK_POINTS_DISTANCE,
        this.GROUND_HEIGHT,
        'house'
    );
    gunsStore.anchor.set(0, 1);
    this.addObject(gunsStore);

    var friendsHouse = new InteractiveHouse(
        this,
        CHECK_POINT_X_ONE + 5 * CHECK_POINTS_DISTANCE,
        this.GROUND_HEIGHT,
        'house'
    );
    friendsHouse.anchor.set(0, 1);
    this.addObject(friendsHouse);

    this.addCar(CHECK_POINT_X_ONE + 3 * CHECK_POINTS_DISTANCE, 'jeep');
};

LevelOne.prototype.addNPCs = function() {
    this.addNPC(this.game.camera.width / 2, 'npc', 'comic1');
    this.addNPC(CHECK_POINT_X_ONE + CHECK_POINTS_DISTANCE, 'friend', 'comic2');
};

LevelOne.prototype.addEnemies = function() {
    var x = CHECK_POINT_X_ONE;
    var y = 350;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 5; j++) {
            x += 30;
            this.addSimpleEnemy(x, y);
        }
        x += 2 * CHECK_POINTS_DISTANCE;
    }
};

module.exports = LevelOne;

},{"../../worldElements/InteractiveHouse":42,"../levels/Level":27}],29:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 29/08/2015.
 */
/**
 * Created by Edwin Gamboa on 22/07/2015.
 */
var LevelOneIntro = function(game) {};

LevelOneIntro.prototype.create = function() {
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
};

LevelOneIntro.prototype.continue = function() {
    this.game.state.start('levelOne');
};

module.exports = LevelOneIntro;

},{}],30:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 10/10/2015.
 */

var Button = function(level, text, action, parent, optionals) {
    var ops = optionals || [];
    var x = ops.x || 0;
    var y = ops.y || 0;

    Phaser.Sprite.call(this, level.game, x, y, 'transparent');

    this.text = level.game.make.text(10, 10, text);
    this.text.font = 'Shojumaru';
    this.text.fontSize = 20;
    this.text.fill = '#FFFFFF';

    this.background = level.game.make.sprite(0, 0, 'button');

    this.inputEnabled = true;
    this.events.onInputDown.add(action, parent);

    var scale = (this.text.width + 20) / this.background.width;
    this.background.scale.x = scale;

    //this.background.width = this.text.width + 20;

    this.addChild(this.background);
    this.addChild(this.text);
};

Button.prototype = Object.create(Phaser.Sprite.prototype);
Button.prototype.constructor = Button;

module.exports = Button;

},{}],31:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 16/07/2015.
 */
var HorizontalLayoutPopUp = require('./HorizontalLayoutPopUp');

var Dialog = function(level, iconKey, text, parent) {
    HorizontalLayoutPopUp.call(this, level, 'dialog', parent);

    this.icon = level.game.make.sprite(0, 0, iconKey);
    this.message = level.game.make.text(0, 0, '');
    this.message.font = 'Arial';
    this.message.fontSize = 20;
    this.message.fill = '#000000';
    this.message.text = text;

    this.addElement(this.icon);
    this.addElement(this.message);
};

Dialog.prototype = Object.create(HorizontalLayoutPopUp.prototype);
Dialog.prototype.constructor = Dialog;

Dialog.prototype.setText = function(text) {
    this.message.text = text;
};

module.exports = Dialog;

},{"./HorizontalLayoutPopUp":36}],32:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 11/10/2015.
 */
var MARGIN = 10;

var GridLayout = function(numberOfColumns, numberOfRows, parent) {
    this.currentRow = 0;
    this.currentColumn = 0;
    this.numberOfColumns = numberOfColumns;
    this.numberOfRows = numberOfRows;
    this.rowWidth = (parent.width - MARGIN * this.numberOfColumns) /
        this.numberOfColumns;
    this.rowHeight = (parent.height - MARGIN * this.numberOfRows) /
        this.numberOfRows;
    if (numberOfColumns === 1 && numberOfRows === 1) {
        this.xOrigin = 0;
        this.yOrigin = 0;
    } else {
        this.xOrigin = MARGIN;
        this.yOrigin = MARGIN;
    }
    this.parent = parent;
};

GridLayout.prototype.constructor = GridLayout;

GridLayout.prototype.addElement = function(element) {
    if (this.currentColumn >= this.numberOfColumns) {
        this.currentColumn = 0;
        this.currentRow++;
    }
    var xCentered = (this.rowWidth / 2) - (element.width / 2);
    element.x = this.xOrigin + (this.rowWidth + MARGIN) *
        this.currentColumn + xCentered;
    var yCentered = this.yOrigin + (this.rowHeight / 2) - (element.height / 2);
    element.y = (this.rowHeight + MARGIN) *
        this.currentRow + yCentered;

    this.parent.addChild(element);
    this.currentColumn ++;
};

module.exports = GridLayout;

},{}],33:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 11/10/2015.
 */
var GridLayout = require('./GridLayout');

var NUMBER_OF_COLUMNS = 1;
var NUMBER_OF_ROWS = 1;

var GridLayoutPanel = function(level, backgroundKey, optionals) {
    var ops = optionals || [];
    var x = ops.x || 0;
    var y = ops.y || 0;
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);
    this.level = level;
    this.numberOfColumns = ops.numberOfColumns || NUMBER_OF_COLUMNS;
    this.numberOfRows = ops.numberOfRows || NUMBER_OF_ROWS;

    this.grid = new GridLayout(this.numberOfColumns, this.numberOfRows, this);
};

GridLayoutPanel.prototype = Object.create(Phaser.Sprite.prototype);
GridLayoutPanel.prototype.constructor = GridLayoutPanel;

GridLayoutPanel.prototype.addElement = function(element) {
    this.grid.addElement(element);
};

module.exports = GridLayoutPanel;

},{"./GridLayout":32}],34:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 11/10/2015.
 */
var PopUp = require('./PopUp');
var GridLayout = require('./GridLayout');

var NUMBER_OF_COLUMNS = 5;
var NUMBER_OF_ROWS = 1;

var GridLayoutPopUp = function(level, backgroundKey, dimensions, parent) {
    PopUp.call(this, level, backgroundKey, parent);
    this.level = level;
    this.currentRow = 0;
    this.currentColumn = 0;

    var dims = dimensions || {};
    this.numberOfColumns = dims.numberOfColumns || NUMBER_OF_COLUMNS;
    this.numberOfRows = dims.numberOfRows || NUMBER_OF_ROWS;

    this.grid = new GridLayout(this.numberOfColumns, this.numberOfRows, this);

};

GridLayoutPopUp.prototype = Object.create(PopUp.prototype);
GridLayoutPopUp.prototype.constructor = GridLayoutPopUp;

GridLayoutPopUp.prototype.addElement = function(element) {
    this.grid.addElement(element);
};

module.exports = GridLayoutPopUp;

},{"./GridLayout":32,"./PopUp":37}],35:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 11/10/2015.
 */
var MARGIN = 10;

var HorizontalLayout = function(parent) {
    this.currentY = MARGIN;
    this.parent = parent;
};

HorizontalLayout.prototype.constructor = HorizontalLayout;

HorizontalLayout.prototype.addElement = function(element) {
    element.x = this.currentY;
    this.currentY += element.width + MARGIN;
    element.y = this.parent.height / 2 - element.height / 2;

    this.parent.addChild(element);
};

module.exports = HorizontalLayout;

},{}],36:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 11/10/2015.
 */
/**
 * Created by Edwin Gamboa on 16/07/2015.
 */
var PopUp = require('./PopUp');
var Horizontalayout = require('./HorizontalLayout');

var HorizontalLayoutPopUP = function(level, backgroundKey, parent) {
    PopUp.call(this, level, backgroundKey, parent);
    this.layout = new Horizontalayout(this);
};

HorizontalLayoutPopUP.prototype = Object.create(PopUp.prototype);
HorizontalLayoutPopUP.prototype.constructor = HorizontalLayoutPopUP;

HorizontalLayoutPopUP.prototype.addElement = function(element) {
    this.layout.addElement(element);
};

module.exports = HorizontalLayoutPopUP;


},{"./HorizontalLayout":35,"./PopUp":37}],37:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 16/07/2015.
 */
var MARGIN = 10;
var PopUp = function(level, backgroundKey, parent) {
    Phaser.Sprite.call(this, level.game, 0, 0, backgroundKey);

    this.xCenter = this.width / 2;
    this.yCenter = this.height / 2;

    this.x = level.game.camera.width / 2 - this.xCenter;
    this.y = level.game.camera.height / 2 - this.yCenter;

    this.closeButton = level.game.make.sprite(this.width, 0, 'close');
    this.closeButton.anchor.set(0.5, 0.5);
    this.closeButton.inputEnabled = true;
    this.closeButton.input.priorityID = 2;
    this.closeButton.events.onInputDown.add(this.close, this);

    this.addChild(this.closeButton);

    this.fixedToCamera = true;
    this.visible = false;

    if (parent === undefined) {
        this.withoutParent = true;
    }else {
        this.withoutParent = false;
        this.parent = parent;
    }

    this.level = level;
};

PopUp.prototype = Object.create(Phaser.Sprite.prototype);
PopUp.prototype.constructor = PopUp;

PopUp.prototype.close = function() {
    this.visible = false;
    if (this.withoutParent) {
        this.level.resume();
    }
    this.kill();
};

PopUp.prototype.open = function() {
    if (!this.alive) {
        this.revive();
    }
    this.level.pause();
    this.bringToTop();
    this.visible = true;
};

module.exports = PopUp;

},{}],38:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 13/10/2015.
 */

/**
 * Tha class Utilities contains different functions or utilities that are useful
 * within other classes.
 * @param {Level} level object to acces game level elements.
 * @constructor
 */
var Utilities = function(level) {
    this.level = level;
};

/**
 * Returns a list with random indexes for an array of length = size
 * @param {number} size array's length
 * @returns {Array} array containing the random indexes
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
        randomIndex = this.level.game.rnd.integerInRange(0, indexes.length - 1);
        randomIndexes.push(indexes[randomIndex]);
        indexes.splice(randomIndex, 1);
    }
    return randomIndexes;
};

module.exports = Utilities;

},{}],39:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 13/10/2015.
 */
/**
 * Margin to hold between elements
 * @constant
 * @type {number}
 */
var MARGIN = 10;

/**
 * Allow control for a Vertical Layout Sprite.
 * @param {Phaser.Sprite} parent Sprite that contatins the layout.
 * @constructor
 */
var VerticalLayout = function(parent) {
    this.currentY = MARGIN;
    this.parent = parent;
};

VerticalLayout.prototype.constructor = VerticalLayout;

/**
 * Adds a element as a child to the parent Sprite, is add the elment vercially
 * bellow the last element and centered on x axis.
 * @param {Phaser.Sprite} element Element to be added to the Sprite
 */
VerticalLayout.prototype.addElement = function(element) {
    element.y = this.currentY;
    this.currentY += element.height + MARGIN;
    element.x = this.parent.width / 2 - element.width / 2;

    this.parent.addChild(element);
};

module.exports = VerticalLayout;

},{}],40:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 13/10/2015.
 */

var VerticalLayout = require('./VerticalLayout');

/**
 * Represents a panel that has a VerticalLayout to arrange its elements.
 * @param {Level} level Object to access game level elements
 * @param {string} backgroundKey Texture's key for panel's background
 * @param {Array} optionals array containing optional parameters x and/or y
 * coordinates for the panel, it can be undefined (optional)
 * @constructor
 */
var VerticalLayoutPanel = function(level, backgroundKey, optionals) {
    var ops = optionals || [];
    var x = ops.x || 0;
    var y = ops.y || 0;
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);
    this.level = level;
    this.layout = new VerticalLayout(this);
};

VerticalLayoutPanel.prototype = Object.create(Phaser.Sprite.prototype);
VerticalLayoutPanel.prototype.constructor = VerticalLayoutPanel;

/**
 * Adds an element to the Panel vertically.
 * @param element
 */
VerticalLayoutPanel.prototype.addElement = function(element) {
    this.layout.addElement(element);
};

module.exports = VerticalLayoutPanel;


},{"./VerticalLayout":39}],41:[function(require,module,exports){
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
    this.anchor.set(0.5, 1);
    this.animations.add('left', [0], 10, true);
    this.animations.add('right', [1], 10, true);

    this.level = level;
    this.occupied = false;
};

InteractiveCar.prototype = Object.create(Phaser.Sprite.prototype);
InteractiveCar.prototype.constructor = InteractiveCar;

InteractiveCar.prototype.getOn = function() {
    this.level.player.relocate(this.x, this.y - 100);
    this.level.player.changeSpeed(DEFAULT_CAR_SPEED, DEFAULT_CAR_MAX_SPEED);
    this.level.player.changeGravity(CAR_GRAVITY);
    this.occupied = true;
};

InteractiveCar.prototype.update = function() {
    if (this.occupied) {
        this.body.velocity.x = this.level.player.body.velocity.x;
        if (this.body.velocity.x < 0) {
            this.animations.play('left');
        }else {
            this.animations.play('right');
        }
    }
};

InteractiveCar.prototype.isStopped = function() {
    return this.body.velocity.x === 0;
};

module.exports = InteractiveCar;

},{"../util/PopUp":37}],42:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 29/08/2015.
 */
var Store = require('../items/store/Store');
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
    var popUp = new Store(this.level);
    this.level.game.add.existing(popUp);
    popUp.open();
};

module.exports = InteractiveHouse;

},{"../items/store/Store":18}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42]);
