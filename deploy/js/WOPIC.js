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

},{"./states/Boot":27,"./states/Menu":28,"./states/Preloader":29,"./states/levels/LevelOne":31,"./states/levels/LevelOneIntro":32}],2:[function(require,module,exports){
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
 * Handles game characters general behaviour.
 * @param x {number} - character's x coordinate within the world
 * @param y {number} - character's y coordinate within the world
 * @param spriteKey {string} - key that represents the character sprite (preload)
 * @param  optionsArgs {object}  - character's physic properties
 * @constructor
 */
var Character = function(x, y, spriteKey, optionsArgs) {
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

    this.weapons = [];
    this.weaponsKeys = [];
    this.onVehicle = false;
};

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

/**
 * Moves the character in the left direction using normal speed.
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
 * Determines whether the character's current health level is maxHelathLevel (is
 * full) or not.
 * @returns {boolean}
 */
Character.prototype.fullHealthLevel = function() {
    return this.healthLevel === this.maxHealthLevel;
};

/**
 * Increase the character health level. If after the increasing, the healthLevel
 * is greater than or equal to the maxHealthLevel property, then healthLevel
 * will be maxHealthLevel.
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
    level.game.add.existing(this.currentWeapon);
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
 * @param x {number} X coordinate on the point to fire
 * @param y {number} Y coordinate on the point to fire
 */
Character.prototype.fireToXY = function(x, y) {
    this.currentWeapon.fire(x, y);
};

/**
 * Lets to relocate the character on the given coordinates
 * @param x {number} X coordinate to be relocated
 * @param y {number} Y coordinate to be relocated
 */
Character.prototype.relocate = function(x, y) {
    this.x = x;
    this.y = y;
};

Character.prototype.useWeapon = function(weapon) {
    if (this.weapons[weapon.key] === undefined) {
        this.addWeapon(weapon);
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

Character.prototype.jump = function() {
    this.body.velocity.y = -350;
};

module.exports = Character;

},{}],3:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 08/07/2015.
 */
var Character = require('./Character');
var ResourceBar = require('./../util/ResourceBar');

var RIGHT_DIRECTION = 1;
var LEFT_DIRECTION = -1;

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

Enemy.prototype.updateHealthLevel = function() {
    this.heatlthBar.updateResourceBarLevel(this.healthLevel /
        this.maxHealthLevel);
};

Enemy.prototype.killCharacter = function() {
    this.healthLevel = 0;
    level.player.increaseScore(this.maxHealthLevel * 0.1);
    Character.prototype.killCharacter.call(this);
};

Enemy.prototype.rotateWeapon = function(x, y) {
    this.currentWeapon.rotation =
        level.game.physics.arcade.angleToXY(this, x, y);
};

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

},{"./../util/ResourceBar":42,"./Character":2}],4:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 16/07/2015.
 */
var Character = require('./Character');

var NPC = function(x, y, key, comicKey) {
    Character.call(this, x, y, key);
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

var Player = function() {
    var options = {speed : SPEED, maxSpeed : MAX_SPEED};
    Character.call(this, 32, level.game.world.height - 150,
        'character', options);
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);
    this.stopLeftFrameIndex = 0;
    this.stopRightFrameIndex = 5;
    this.score = MINIMUM_SCORE;
    this.frame = this.stopRightFrameIndex;
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

Player.prototype.crouch = function() {
    this.animations.stop();
    this.frame = 9;
};

Player.prototype.increaseScore = function(increase) {
    this.score += increase;
    level.updateScoreText();
};

Player.prototype.decreaseScore = function(decrease) {
    this.score += decrease;
    level.updateScoreText();
};

Player.prototype.updateHealthLevel = function() {
    level.updateHealthLevel();
};

Player.prototype.update = function() {
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.updateCoordinates(this.x + (level.xDirection * 25),
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
var MIN_RANGE_ATTACK = 100;
var MAX_RANGE_ATTACK = 300;

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

},{"../items/weapons/Revolver":25,"./Enemy":3}],7:[function(require,module,exports){
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

},{"../items/weapons/MachineGun":24,"./Enemy":3}],8:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 08/10/2015.
 */

var DragAndDropChallenge = require('./dragAndDrop/DragAndDropChallenge');
var GridLayoutPanel = require('../util/GridLayoutPanel');
var Button = require('../util/Button');

/**
 * The number of contexts allowed for this challenge
 * @constant
 * @type {number}
 */
var NUMBER_OF_CONTEXTS = 2;

/**
 * Represents the EnglishChallenge in which the player should associate each
 * word to one context. This is a drag and drop kind of challenge.
 * @constructor
 */
var ContextGroups = function() {
    var dimensions = {numberOfRows: 4};
    DragAndDropChallenge.call(this, 'son', 'Context Groups', 10,
        dimensions);
};

ContextGroups.prototype = Object.create(DragAndDropChallenge.prototype);
ContextGroups.prototype.constructor = ContextGroups;

/**
 * Create a new challenge to the player.
 */
ContextGroups.prototype.newChallenge = function() {
    this.clearChallenge();

    var words = ['Mother', 'Son', 'Father', 'Living room', 'Dining room',
        'Kitchen'];

    this.contexts = [];
    var optionals = {numberOfColumns: words.length / 2, numberOfRows : 2};
    this.source = new GridLayoutPanel('wordField', optionals);

    optionals = {numberOfColumns: NUMBER_OF_CONTEXTS};
    var contextsPanels = new GridLayoutPanel('wordField',
        optionals);

    var i;
    var j;
    var word;
    var wordShade;
    var context;
    this.numberOfWords = words.length / NUMBER_OF_CONTEXTS;
    optionals = {numberOfRows: this.numberOfWords};
    for (i = 0; i < NUMBER_OF_CONTEXTS; i++) {
        context = new GridLayoutPanel('itemGroupBackGround',
            optionals);
        this.contexts.push(context);
        contextsPanels.addElement(context);

        for (j = i * (NUMBER_OF_CONTEXTS + 1);
             j < (i + 1) * this.numberOfWords; j++) {
            word = level.game.make.text(0, 0, words[j]);
            //Font style
            word.font = 'Shojumaru';
            word.fontSize = 20;
            word.fill = '#0040FF';
            word.inputEnabled = true;
            word.input.enableDrag(true, true);
            word.events.onDragStop.add(this.dragAndDropControl.fixLocation,
                this.dragAndDropControl);
            word.code = '' + i;
            this.elements.push(word);

            wordShade = new GridLayoutPanel('useButtonShade');
            wordShade.code = '' + i;
            this.destinations.push(wordShade);
            context.addElement(wordShade);
        }
    }

    this.dragAndDropControl.addElementsToSourceRandomly();

    this.confirmButton = new Button('Confirm', this.confirm, this);
    //this.addElement(Description);
    this.addElement(contextsPanels);
    this.addElement(this.source);
    this.addElement(this.confirmButton);
};

/**
 * Brings the element's container to the top. So that, when player drag the
 * element over other containers it is not hidden by them.
 * @param element {Sprite} element that is being dragged by the player
 */
ContextGroups.prototype.bringItemToTop = function(item) {
    if (ContextGroups.prototype.isPrototypeOf(item.parent)) {
        this.addChild(item);
    }else {
        this.addChild(item.parent.parent);
    }
};

module.exports = ContextGroups;

},{"../util/Button":33,"../util/GridLayoutPanel":36,"./dragAndDrop/DragAndDropChallenge":12}],9:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 13/10/2015.
 */

/**
 * Represents an EnglishChallenge within the game. An EnglishChallenge is used,
 * by the player to increase his/her score in a faster way.
 * @param iconKey {string} Texture's key for the icon of the challenge
 * @param name {string} Name of the challenge
 * @param score {number} Score to be increased in case of success.
 * @constructor
 */
var EnglishChallenge = function(iconKey, name, score) {
    this.iconKey = iconKey;
    this.name = name;
    this.score = score;
};

/**
 * Increases player score and shows a success message. It is called when player
 * overcome the challenge successfully.
 * @param parent Parent Ui to show dalog
 */
EnglishChallenge.prototype.success = function(parent) {
    level.increaseScore(this.score);
    level.showSuccessMessage('Well done! You got ' + this.score +
        ' points.', parent);
};

/**
 * Shows a failure message. It is called when player has completed the challenge
 * but in a wrong way.
 * @param parent Parent Ui to show dalog
 */
EnglishChallenge.prototype.failure = function(parent) {
    level.showErrorMessage('Sorry! Try Again.', parent);
};

/**
 * Shows a failure message. It is called when player has not completed the
 * challenge.
 * @param parent Parent Ui to show dalog
 */
EnglishChallenge.prototype.incomplete = function(parent) {
    level.showErrorMessage('The challenge is not complete.', parent);
};

module.exports = EnglishChallenge;

},{}],10:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 08/10/2015.
 */

var DragAndDropChallenge = require('./dragAndDrop/DragAndDropChallenge');
var Button = require('../util/Button');
var VerticalLayoutPanel = require('../util/VerticalLayoutPanel');
var GridLayoutPanel = require('../util/GridLayoutPanel');

/**
 * Represents the EnglishChallenge in which player should match a word with its
 * corresponding image representation. This is a drag and drop challenge.
 * @constructor
 */
var ImageWordMatch = function() {
    var dimensions = {numberOfRows: 3};
    DragAndDropChallenge.call(this, 'mother', 'Word-Image Match', 10,
        dimensions);
};

ImageWordMatch.prototype = Object.create(DragAndDropChallenge.prototype);
ImageWordMatch.prototype.constructor = ImageWordMatch;

/**
 * Create a new challenge to the player.
 */
ImageWordMatch.prototype.newChallenge = function() {
    this.clearChallenge();
    var familyKeys = ['mother', 'son', 'daughter'];
    var familyMembersCells = [];

    for (var key in familyKeys) {
        var cell = new VerticalLayoutPanel('itemGroupBackGround');
        var familyMember = level.game.make.sprite(0, 0, familyKeys[key]);
        var shade = level.game.make.sprite(0, 0, 'useButtonShade');
        shade.code = key;

        this.destinations.push(shade);
        cell.addElement(familyMember);
        cell.addElement(shade);

        var label = level.game.make.text(0, 0, familyKeys[key]);
        //Font style
        label.font = 'Shojumaru';
        label.fontSize = 20;
        label.fill = '#0040FF';
        label.inputEnabled = true;
        label.input.enableDrag(true, true);
        //label.events.onDragStart.add(this.bringItemToTop, this);
        label.events.onDragStop.add(this.dragAndDropControl.fixLocation,
            this.dragAndDropControl);
        label.code = key;

        familyMembersCells.push(cell);
        this.elements.push(label);
    }

    var optionals = {numberOfColumns: this.elements.length};
    this.source = new GridLayoutPanel('wordField', optionals);

    var images = new GridLayoutPanel('wordField', optionals);

    var familyMemberCell;
    for (familyMemberCell in familyMembersCells) {
        images.addElement(familyMembersCells[familyMemberCell]);
    }

    this.dragAndDropControl.addElementsToSourceRandomly();
    this.confirmButton = new Button('Confirm', this.confirm, this);

    this.addElement(images);
    this.addElement(this.source);
    this.addElement(this.confirmButton);
};

/**
 * Brings the element's container to the top. So that, when player drag the
 * element over other containers it is not hidden by them.
 * @param element {Sprite} element that is being dragged by the player
 */
ImageWordMatch.prototype.bringItemToTop = function(element) {
    if (ImageWordMatch.prototype.isPrototypeOf(element.parent)) {
        this.addChild(element);
    }else {
        this.addChild(element.parent.parent);
    }
};

module.exports = ImageWordMatch;

},{"../util/Button":33,"../util/GridLayoutPanel":36,"../util/VerticalLayoutPanel":45,"./dragAndDrop/DragAndDropChallenge":12}],11:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 08/10/2015.
 */
var GridLayoutPanel = require('../util/GridLayoutPanel');
var Button = require('../util/Button');
var DragAndDropChallenge = require('./dragAndDrop/DragAndDropChallenge');

/**
 * Represents the EnglishChallenge in which player is presented with a set of
 * letters that should be correctly arranged in order to form a word.
 * @constructor
 */
var WordUnscramble = function() {
    var dimensions = {numberOfRows: 4};
    DragAndDropChallenge.call(this, 'father', 'Word Unscramble', 10,
        dimensions);
};

WordUnscramble.prototype = Object.create(DragAndDropChallenge.prototype);
WordUnscramble.prototype.constructor = WordUnscramble;

/**
 * Create a new challenge to the player.
 */
WordUnscramble.prototype.newChallenge = function() {
    this.clearChallenge();
    var word = 'mother';
    var wordImage = level.game.make.sprite(0, 0, 'mother');

    var optionals = {numberOfColumns: word.length};
    var wordFieldAnswer = new GridLayoutPanel('wordField', optionals);

    this.source = new GridLayoutPanel('wordField', optionals);
    var i;
    var letter;
    var letterShade;
    for (i = 0; i < word.length; i++) {
        letterShade = new GridLayoutPanel('letterShade');
        letterShade.code = '' + i;
        this.destinations.push(letterShade);

        wordFieldAnswer.addElement(letterShade);

        letter = level.game.make.text(0, 0, word.charAt(i));
        //Font style
        letter.font = 'Shojumaru';
        letter.fontSize = 20;
        letter.fill = '#0040FF';
        letter.inputEnabled = true;
        letter.input.enableDrag(true, true);
        letter.events.onDragStop.add(this.dragAndDropControl.fixLocation,
            this.dragAndDropControl);
        letter.code = '' + i;
        this.elements.push(letter);
    }

    this.dragAndDropControl.addElementsToSourceRandomly();

    this.confirmButton = new Button('Confirm', this.confirm, this);
    this.addElement(wordImage);
    this.addElement(wordFieldAnswer);
    this.addElement(this.source);
    this.addElement(this.confirmButton);
};

/**
 * Brings the element's container to the top. So that, when player drag the
 * element over other containers it is not hidden by them.
 * @param element {Sprite} element that is being dragged by the player
 */
WordUnscramble.prototype.bringItemToTop = function(item) {
    if (WordUnscramble.prototype.isPrototypeOf(item.parent)) {
        this.addChild(item);
    }else {
        this.addChild(item.parent.parent);
    }
};

module.exports = WordUnscramble;

},{"../util/Button":33,"../util/GridLayoutPanel":36,"./dragAndDrop/DragAndDropChallenge":12}],12:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 13/10/2015.
 */

var GridLayoutPopUp = require('../../util/GridLayoutPopUp');
var EnglishChallenge = require('../../englishChallenges/EnglishChallenge');
var DragAndDropController = require('./DragAndDropController');

/**
 * Represents an EnglishChallenge that have draggable elements, which need to be
 * arranged in a certain destinations.
 * @param iconKey {string} Texture key of the Challenge icon
 * @param challengeName {string} Challenge name to show in UI.
 * @param score {number} Score to be increased in case of success.
 * @param dimensions {Array} Array containing number of rows and columns needed
 * for the challenge UI.
 * @constructor
 */
var DragAndDropChallenge = function(iconKey, challengeName, score,
                                    dimensions) {
    GridLayoutPopUp.call(this, 'inventory_background', dimensions);
    this.englishChallenge = new EnglishChallenge(
        iconKey,
        challengeName,
        score
    );
    this.destinations = [];
    this.elements = [];
    this.dragAndDropControl = new DragAndDropController(this);
};

DragAndDropChallenge.prototype = Object.create(GridLayoutPopUp.prototype);
DragAndDropChallenge.prototype.constructor = DragAndDropChallenge;

/**
 * Controls if the Challenge is complete and successfully overcome.
 * messages
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
    this.close(this);
};

/**
 * Clear all the containers and elements of the challenge, so that a new
 * challenge can be created.
 */
DragAndDropChallenge.prototype.clearChallenge = function() {
    if (this.children.length > 1) {
        this.removeAllElements();
    }
    if (this.elements.length > 0) {
        this.elements.splice(0, this.elements.length);
    }
    if (this.destinations.length > 0) {
        this.destinations.splice(0, this.destinations.length);
    }
};

module.exports = DragAndDropChallenge;

},{"../../englishChallenges/EnglishChallenge":9,"../../util/GridLayoutPopUp":37,"./DragAndDropController":13}],13:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 13/10/2015.
 */
var Utilities = require('../../util/Utilities');

/**
 * Controls draggable elements that are dropped in some destinations.
 * @constructor
 * @param container {Phaser.Sprite} Sprite tha contains the draggable elements,
 * their initial location (source) and their possible destinations.
 */
var DragAndDropController = function(container) {
    this.container = container;
};

/**
 * Adds a draggable element to a destination.
 * @param element {Phaser.Sprite} element to be added.
 * @param destinationIndex {string} index (key) to of the destination, where the
 * element will be added.
 */
DragAndDropController.prototype.addToADestination = function(element,
                                                             destinationIndex) {
    element.x = 0;
    element.y = 0;
    this.container.destinations[destinationIndex].addChild(element);
};

/**
 * Controls where to locate an element after it is dropped by the player.
 * @param element {Phaser.Sprite} Dropped element to locate
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
 * @returns {boolean}
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
 * @returns {boolean}
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
 * @param element {Phaser.Sprite} element to relocate.
 */
DragAndDropController.prototype.returnElementToSource = function(element) {
    element.x = element.sourceX;
    element.y = element.sourceY;
    this.container.source.addChild(element);
};

/**
 * Add every element to the source but in a random order.
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

},{"../../util/Utilities":43}],14:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 10/10/2015.
 */
var GridLayoutPopUp = require('../../util/GridLayoutPopUp');
var MenuItem = require('./MenuItem');
var WordUnscramble = require('../WordUnscramble');
var ContextGroups = require('../ContextGroups');
var ImageWordMatch = require('../ImageWordMatch');

/**
 * Menu that allows accessing to all the EnglishChallenges.
 * @constructor
 */
var EnglishChallengesMenu = function() {
    var dimensions = {numberOfRows: 2, numberOfColumns: 2};
    GridLayoutPopUp.call(this, 'inventory_background', dimensions);
    this.createGames();
};

EnglishChallengesMenu.prototype = Object.create(GridLayoutPopUp.prototype);
EnglishChallengesMenu.prototype.constructor = EnglishChallengesMenu;

/**
 * Creates the menu, it adds an icon for every EnglishChallenge, so the player
 * can access them.
 */
EnglishChallengesMenu.prototype.createGames = function() {
    var challenges = [];
    challenges.push(new WordUnscramble());
    challenges.push(new ContextGroups());
    challenges.push(new ImageWordMatch());
    var i;
    for (i in challenges) {
        this.addElement(new MenuItem(challenges[i], this));
        level.game.add.existing(challenges[i]);
    }
};

module.exports = EnglishChallengesMenu;

},{"../../util/GridLayoutPopUp":37,"../ContextGroups":8,"../ImageWordMatch":10,"../WordUnscramble":11,"./MenuItem":15}],15:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 15/10/2015.
 */

var ItemGroupView = require('../../items/ItemGroupView');

/**
 * Represents a challenge within the EnglishChallengesMenu.
 * @param challenge {EnglishChallenge} Challenge that can be accessed through
 * this item.
 * @param parentView {PopUp} PopUp that contatins this item.
 * @constructor
 */
var MenuItem = function(challenge, parentView) {
    ItemGroupView.call(this, challenge.englishChallenge.iconKey,
        challenge.englishChallenge.name, parentView);
    this.challenge = challenge;
    this.updateScoreText();
};

MenuItem.prototype = Object.create(ItemGroupView.prototype);
MenuItem.prototype.constructor = MenuItem;

/**
 * Called when the play button is clicked. It close the menu (PopUp), creates
 * a new challenge and displays it to the player.
 */
MenuItem.prototype.buttonAction = function() {
    this.parent.close();
    this.challenge.newChallenge();
    this.challenge.open();
};

/**
 * Updates the text that shows the number of points that player can get, after
 * completing the challenge.
 */
MenuItem.prototype.updateScoreText = function() {
    this.message.text = '' + this.challenge.englishChallenge.score;
};

module.exports = MenuItem;


},{"../../items/ItemGroupView":18}],16:[function(require,module,exports){
var Item = require('./Item');

var PRCE_INCREASE_RATE = 10;
var GRAVITY = 300;

var HealthPack = function(x, y, maxIncreasing) {
    Item.call(this, x, y, 'healthPack' + maxIncreasing,
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
    this.x = level.player.x;
    this.y = 50;
    level.addHealthPack(this);
};

module.exports = HealthPack;

},{"./Item":17}],17:[function(require,module,exports){
var BOUNCE = 0.7 + Math.random() * 0.2;

var Item = function(x, y, key, price) {
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

},{}],18:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 17/07/2015.
 */
var GridLayoutPanel = require('../util/GridLayoutPanel');
var Button = require('../util/Button');

var ItemGroupView = function(iconKey, buttonText, parentView) {
    Phaser.Sprite.call(this, level.game, 0, 0, 'itemGroupBackGround');
    this.icon = level.game.make.sprite(10, 10, iconKey);
    this.message = level.game.make.text(0, 0, '');
    this.message.font = 'Arial';
    this.message.fontSize = 30;
    this.message.fill = '#0040FF';
    this.messageBackground = new GridLayoutPanel('letterShade');
    this.messageBackground.addElement(this.message);

    this.messageBackground.x = 10;
    this.messageBackground.y = this.icon.y + this.icon.height + 10;

    this.button = new Button(buttonText, this.buttonAction, this);
    this.button.x = this.messageBackground.x + this.messageBackground.width +
        10;
    this.button.y = this.icon.y + this.icon.height + 10;

    this.addChild(this.icon);
    this.addChild(this.messageBackground);
    this.addChild(this.button);
    this.parent = parentView;
};

ItemGroupView.prototype = Object.create(Phaser.Sprite.prototype);
ItemGroupView.prototype.constructor = ItemGroupView;

ItemGroupView.prototype.buttonAction = function() {

};

module.exports = ItemGroupView;

},{"../util/Button":33,"../util/GridLayoutPanel":36}],19:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var GridLayoutPopUp = require('../../util/GridLayoutPopUp');
var InventoryItem = require ('./InventoryItem');
var HealthPack = require('../HealthPack');
var Revolver = require('../weapons/Revolver');

var Inventory = function() {
    var dimensions = {numberOfColumns: 5, numberOfRows: 2};
    GridLayoutPopUp.call(this, 'inventory_background', dimensions);

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
    var healthPackItem = new HealthPack(0, 0, 5);
    this.items.healthPack5 = new InventoryItem(healthPackItem, this);
    this.addElement(this.items.healthPack5);

    var revolverItem = new Revolver(0, 0, false);
    this.items.simpleWeapon = new InventoryItem(revolverItem, this);
    this.addElement(this.items.simpleWeapon);
};

Inventory.prototype.showHealthPacks = function() {
    //TODO
};

module.exports = Inventory;

},{"../../util/GridLayoutPopUp":37,"../HealthPack":16,"../weapons/Revolver":25,"./InventoryItem":20}],20:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 17/07/2015.
 */
var ItemGroupView = require('../ItemGroupView');

var InventoryItem = function(item, parentView) {
    ItemGroupView.call(this, item.key, 'Use', parentView);

    this.item = item;
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

},{"../ItemGroupView":18}],21:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var GridLayoutPopUp = require('../../util/GridLayoutPopUp');
var StoreItem = require ('./StoreItem');
var HealthPack = require('../HealthPack');
var Revolver = require('../weapons/Revolver');

var Store = function() {
    var dimensions = {numberOfColumns: 5, numberOfRows: 2};
    GridLayoutPopUp.call(this, 'inventory_background', dimensions);

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
    var healthPackItem = new HealthPack(0, 0, 5);
    this.items.healthPack5 = new StoreItem(healthPackItem, this);
    this.addElement(this.items.healthPack5);

    var revolverItem = new Revolver(0, 0, false);
    this.items.simpleWeapon = new StoreItem(revolverItem, this);
    this.addElement(this.items.simpleWeapon);
};

Store.prototype.showHealthPacks = function() {
    //TODO
};

module.exports = Store;

},{"../../util/GridLayoutPopUp":37,"../HealthPack":16,"../weapons/Revolver":25,"./StoreItem":22}],22:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 17/07/2015.
 */
var ItemGroupView = require('../ItemGroupView');

var StoreItem = function(item, parentView) {
    ItemGroupView.call(this, item.key, 'Buy', parentView);
    this.item = item;
    this.updatePriceText();
};

StoreItem.prototype = Object.create(ItemGroupView.prototype);
StoreItem.prototype.constructor = StoreItem;

StoreItem.prototype.updatePriceText = function() {
    this.message.text = this.item.price;
};

StoreItem.prototype.buttonAction = function() {
    var successfulPurchase = level.player.buyItem(this.item);
    if (successfulPurchase) {
        this.item.use();
        level.updateScoreText();
        level.showSuccessMessage('Successful Purchase!', this.parent);
    }else {
        level.showErrorMessage('Not enough money.', this.parent);
    }
};

module.exports = StoreItem;

},{"../ItemGroupView":18}],23:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 10/07/2015.
 */
var Bullet;
Bullet = function(power, imageKey) {
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

},{}],24:[function(require,module,exports){
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

var MachineGun = function(x, y, inifinite) {
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
        inifinite,
        PRICE
    );
};

MachineGun.prototype = Object.create(Weapon.prototype);
MachineGun.prototype.constructor = MachineGun;

module.exports = MachineGun;

},{"./Weapon":26}],25:[function(require,module,exports){
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
};

Revolver.prototype = Object.create(Weapon.prototype);
Revolver.prototype.constructor = Revolver;

module.exports = Revolver;

},{"./Weapon":26}],26:[function(require,module,exports){
var Item = require('../Item');
var Bullet = require('./Bullet');

var RIGHT_KEY = 0;
var LEFT_KEY = 1;

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
};

Weapon.prototype = Object.create(Item.prototype);
Weapon.prototype.constructor = Weapon;

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

Weapon.prototype.updateCoordinates = function(x, y) {
    this.x = x;
    this.y = y;
};

Weapon.prototype.use = function() {
    if (!this.alive) {
        this.revive();
    }
    level.player.useWeapon(this);
    level.updateAmmoText();
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

},{"../Item":17,"./Bullet":23}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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
        this.game.load.image('healthBarBackground',
            'assets/images/healthBarBackground.png');
        this.game.load.image('healthBar', 'assets/images/healthBar.png');

        this.game.load.script('webfont',
            '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    },

    update: function() {
        if (!!this.ready) {
            //this.game.state.start('menu');
            this.game.state.start('levelOne');
            level = this.game.state.states.levelOne;
        }
    },

    onLoadComplete: function() {
        this.ready = true;
    }
};

module.exports = Preloader;

},{}],30:[function(require,module,exports){
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
var EnglishChallengesMenu =
    require('../../englishChallenges/menu/EnglishChallengesMenu');
var ResourceBar = require('../../util/ResourceBar');

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
    this.activePopUps = 0;
    this.xDirection = 1;

    this.createHealthPacksGroup();
    this.createEnemiesGroup();
    this.createNpcsGroup();
    this.createCarsGroup();
    this.addPlayer();
    this.createWeaponsGroup();
    this.addPlatforms();
    this.addTexts();
    this.addHealthBar();
    this.addControls();
    this.addCamera();
    this.createInventory();
    this.createEnglishChallengesMenu();
    this.createStore();
};

Level.prototype.updateEnemies = function() {
    var i;
    for (i = 0; i < this.enemies.children.length; i++) {
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

Level.prototype.updateNpcs = function() {
    for (var i = 0; i < this.npcs.children.length; i++) {
        var npc = this.npcs.children[i];

        var distanceNpcPlayer = this.game.physics.arcade.distanceBetween(
            this.player, npc);
        if (distanceNpcPlayer <= npc.width) {
            var comic = new PopUp(npc.comicKey);
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
        this.player.fireToXY(this.player.x + (100 * this.xDirection));
        //  Add and update the score
        this.updateAmmoText();
    }
};

Level.prototype.addHealthBar = function() {
    var x = this.healthLevelText.x + this.healthLevelText.width;
    var y = this.healthLevelText.y;
    this.healthBar = new ResourceBar(x, y);
    this.addObject(this.healthBar);
    this.healthBar.fixedToCamera = true;
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
    this.enemies.add(new SimpleEnemy(x, this.GROUND_HEIGHT - 100));
};

Level.prototype.addStrongEnemy = function(x) {
    this.enemies.add(new StrongEnemy(x, this.GROUND_HEIGHT - 100));
};

Level.prototype.addNPC = function(x, key, comicKey) {
    this.npcs.add(new NPC(x, this.GROUND_HEIGHT - 100, key, comicKey));
};

Level.prototype.addCar = function(x, key) {
    this.cars.add(new InteractiveCar(x, this.GROUND_HEIGHT, key));
};

Level.prototype.addPlatforms = function() {
    this.platforms = this.game.add.group();
    this.platforms.enableBody = true;

    this.ground = this.platforms.create(0, this.game.world.height - 64,
        'ground');
    this.ground.scale.setTo(40, 2);
    this.ground.body.immovable = true;

    /*
    this.ledge = this.platforms.create(400, 300, 'ground');
    this.ledge.body.immovable = true;
    this.ledge = this.platforms.create(-150, 200, 'ground');
    this.ledge.body.immovable = true;
    */
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
    this.player.useWeapon(new Revolver(700, 100, false));
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
    this.healthLevelText = this.game.add.text(16, 16, 'Health: ',
        {fontSize: '32px', fill: '#000'});
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
    this.addHealthPack(new HealthPack(500, 10, 5, this));
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

Level.prototype.createEnglishChallengesMenu = function() {
    this.englishChallengeMenu = new EnglishChallengesMenu();
    this.game.add.existing(this.englishChallengeMenu);

    this.addCashButton = this.game.add.button(170,
        this.game.camera.height - 30, 'addCashButton',
        this.englishChallengeMenu.open, this.englishChallengeMenu);
    this.addCashButton.anchor.setTo(0.5, 0.5);
    this.addCashButton.fixedToCamera = true;
    this.addCashButton.input.priorityID = 1;
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
};

Level.prototype.bulletHitCharacter = function(character, bullet) {
    character.decreaseHealthLevel(bullet.power);
    character.updateHealthLevel();
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

Level.prototype.updateHealthLevel = function() {
    if (this.player.healthLevel <= 0) {
        this.game.state.start('menu');
    }
    this.healthLevelText.text = 'Health: ' + this.player.healthLevel;
    this.healthBar.updateResourceBarLevel(this.player.healthLevel /
        this.player.maxHealthLevel);
};

Level.prototype.increaseHealthLevel = function(increase) {
    this.player.increaseHealthLevel(increase);
    this.updateHealthLevel();
};

Level.prototype.increaseScore = function(increase) {
    this.player.increaseScore(increase);
    this.updateScoreText();
};

Level.prototype.addHealthPack = function(healthPack) {
    this.healthPacks.add(healthPack);
};

Level.prototype.addRevolver = function(x, y, infiniteAmmo) {
    this.weapons.add(new Revolver(x, y, infiniteAmmo));
};

Level.prototype.addMachineGun = function(x, y, infiniteAmmo) {
    this.weapons.add(new MachineGun(x, y, infiniteAmmo));
};

Level.prototype.pause = function() {
    this.game.physics.arcade.isPaused = true;
};

Level.prototype.resume = function() {
    this.game.physics.arcade.isPaused = false;
};

Level.prototype.showErrorMessage = function(errorMessage, parent) {
    var errorDialog = new Dialog('errorIcon', errorMessage, parent);
    this.game.add.existing(errorDialog);
    errorDialog.open();
};

Level.prototype.showSuccessMessage = function(successMessage, parent) {
    var successDialog = new Dialog('successIcon', successMessage, parent);
    this.game.add.existing(successDialog);
    successDialog.open();
};

module.exports = Level;

},{"../../character/NPC":4,"../../character/Player":5,"../../character/SimpleEnemy":6,"../../character/StrongEnemy":7,"../../englishChallenges/menu/EnglishChallengesMenu":14,"../../items/HealthPack":16,"../../items/inventory/Inventory":19,"../../items/store/Store":21,"../../items/weapons/MachineGun":24,"../../items/weapons/Revolver":25,"../../util/Dialog":34,"../../util/PopUp":41,"../../util/ResourceBar":42,"../../worldElements/InteractiveCar":46}],31:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 22/07/2015.
 */
var Level = require ('../levels/Level');
var InteractiveHouse = require ('../../worldElements/InteractiveHouse');

var LevelOne = function(game) {
    Level.call(this, game);
};

LevelOne.prototype = Object.create(Level.prototype);
LevelOne.prototype.constructor = LevelOne;

LevelOne.prototype.create = function() {
    Level.prototype.create.call(this);
    this.firstCheckPointX = this.game.camera.width * 1.3;
    this.checkPointsDistance = this.game.camera.width + 140;
    this.addNPCs();
    this.addEnemies();
    this.addObjects();
    this.addRevolver(2000, 400, false);
    this.addRevolver(2000, 400, false);
    //this.player.bringToTop();
};

LevelOne.prototype.addObjects = function() {
    var gunsStore = new InteractiveHouse(
        this.firstCheckPointX + 1.5 * this.checkPointsDistance,
        this.GROUND_HEIGHT,
        'house'
    );
    gunsStore.anchor.set(0, 1);
    this.addObject(gunsStore);

    var friendsHouse = new InteractiveHouse(
        this.firstCheckPointX + 5 * this.checkPointsDistance,
        this.GROUND_HEIGHT,
        'house'
    );
    friendsHouse.anchor.set(0, 1);
    this.addObject(friendsHouse);

    this.addCar(this.firstCheckPointX + 3 * this.checkPointsDistance, 'jeep');
    //this.addCar(40, 'jeep');
};

LevelOne.prototype.addNPCs = function() {
    this.addNPC(this.game.camera.width / 2, 'npc', 'comic1');
    this.addNPC(this.firstCheckPointX + this.checkPointsDistance, 'friend',
        'comic2');
};

LevelOne.prototype.addEnemies = function() {
    var x = this.firstCheckPointX;
    var y = 350;
    var numberOfEnemies = 3;
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < numberOfEnemies; j++) {
            x += 30;
            this.addSimpleEnemy(x, y);
        }
        numberOfEnemies ++;
        x += 2 * this.checkPointsDistance;
    }
};

module.exports = LevelOne;

},{"../../worldElements/InteractiveHouse":47,"../levels/Level":30}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 10/10/2015.
 */

var Button = function(text, action, parent, optionals) {
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

},{}],34:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 16/07/2015.
 */
var HorizontalLayoutPopUp = require('./HorizontalLayoutPopUp');

var Dialog = function(iconKey, text, parent) {
    HorizontalLayoutPopUp.call(this, 'dialog', parent);

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

},{"./HorizontalLayoutPopUp":40}],35:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 11/10/2015.
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
 * @param numberOfColumns {number} Number of columns for the grid.
 * @param numberOfRows {number} Number of rows for the grid.
 * @param container {Sprite} Container in which elements are added
 * @constructor
 */
var GridLayout = function(numberOfColumns, numberOfRows, container) {
    this.currentRow = 0;
    this.currentColumn = 0;
    this.numberOfColumns = numberOfColumns;
    this.numberOfRows = numberOfRows;
    this.rowWidth = (container.width - MARGIN * this.numberOfColumns) /
        this.numberOfColumns;
    this.rowHeight = (container.height - MARGIN * this.numberOfRows) /
        this.numberOfRows;
    if (numberOfColumns === 1 && numberOfRows === 1) {
        this.xOrigin = 0;
        this.yOrigin = 0;
    } else {
        this.xOrigin = MARGIN;
        this.yOrigin = MARGIN;
    }
    this.container = container;
};

GridLayout.prototype.constructor = GridLayout;

/**
 * Adds an element to the container on the next possible cell of the grid.
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
    element.x = this.xOrigin + (this.rowWidth + MARGIN) *
        this.currentColumn + xCentered;
    var yCentered = this.yOrigin + (this.rowHeight / 2) - (element.height / 2);
    element.y = (this.rowHeight + MARGIN) *
        this.currentRow + yCentered;

    this.container.addChild(element);
    this.currentColumn ++;
};

/**
 * Restarts the indexes, currentRow and currentColumn
 */
GridLayout.prototype.restartsIndexes = function() {
    this.currentColumn = 0;
    this.currentRow = 0;
};

module.exports = GridLayout;

},{}],36:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 11/10/2015.
 */
var GridLayout = require('./GridLayout');

var NUMBER_OF_COLUMNS = 1;
var NUMBER_OF_ROWS = 1;

var GridLayoutPanel = function(backgroundKey, optionals) {
    var ops = optionals || [];
    var x = ops.x || 0;
    var y = ops.y || 0;
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);
    this.numberOfColumns = ops.numberOfColumns || NUMBER_OF_COLUMNS;
    this.numberOfRows = ops.numberOfRows || NUMBER_OF_ROWS;

    this.grid = new GridLayout(this.numberOfColumns, this.numberOfRows, this);
};

GridLayoutPanel.prototype = Object.create(Phaser.Sprite.prototype);
GridLayoutPanel.prototype.constructor = GridLayoutPanel;

GridLayoutPanel.prototype.addElement = function(element) {
    this.grid.addElement(element);
};

/**
 * Remove all the elements that contains the panel
 */
GridLayoutPanel.prototype.removeAllElements = function() {
    this.removeChildren();
    this.grid.restartsIndexes();
};

module.exports = GridLayoutPanel;

},{"./GridLayout":35}],37:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 11/10/2015.
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
 * @param level
 * @param backgroundKey {string} Texture's key of the background
 * @param dimensions {Array} Array containing the number of rows and columns
 * @param parent {Sprite} View or Sprite that opened this PopUp
 * @constructor
 */
var GridLayoutPopUp = function(backgroundKey, dimensions, parent) {
    PopUp.call(this, backgroundKey, parent);
    this.currentRow = 0;
    this.currentColumn = 0;

    var dims = dimensions || {};
    this.numberOfColumns = dims.numberOfColumns || MIN_NUMBER_OF_COLUMNS;
    this.numberOfRows = dims.numberOfRows || MIN_NUMBER_OF_ROWS;

    this.grid = new GridLayout(this.numberOfColumns, this.numberOfRows, this);

};

GridLayoutPopUp.prototype = Object.create(PopUp.prototype);
GridLayoutPopUp.prototype.constructor = GridLayoutPopUp;

/**
 * Add an element to the container in the next possible cell of the grid.
 * @param element
 */
GridLayoutPopUp.prototype.addElement = function(element) {
    this.grid.addElement(element);
};

/**
 * Remove all the elements that contains the PopUp
 */
GridLayoutPopUp.prototype.removeAllElements = function() {
    this.removeChildren(1);
    this.grid.restartsIndexes();
};

module.exports = GridLayoutPopUp;

},{"./GridLayout":35,"./PopUp":41}],38:[function(require,module,exports){
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

},{}],39:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 15/10/2015.
 */

var HorizontalLayout = require('./HorizontalLayout');
/**
 * Represents a panel that has a HorizontalLayout to arrange its elements.
 * @param backgroundKey {string} Texture's key for panel's background
 * @param optionals {Array} array containing optional parameters x and/or y
 * coordinates for the panel, it can be undefined (optional)
 * @constructor
 */
var HorizontalLayoutPanel = function(backgroundKey, optionals) {
    var ops = optionals || [];
    var x = ops.x || 0;
    var y = ops.y || 0;
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);
    this.layout = new HorizontalLayout(this);
};

HorizontalLayoutPanel.prototype = Object.create(Phaser.Sprite.prototype);
HorizontalLayoutPanel.prototype.constructor = HorizontalLayoutPanel;

/**
 * Adds an element to the Panel horizontally.
 * @param element
 */
HorizontalLayoutPanel.prototype.addElement = function(element) {
    this.layout.addElement(element);
};

module.exports = HorizontalLayoutPanel;

},{"./HorizontalLayout":38}],40:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 11/10/2015.
 */
/**
 * Created by Edwin Gamboa on 16/07/2015.
 */
var PopUp = require('./PopUp');
var Horizontalayout = require('./HorizontalLayout');

var HorizontalLayoutPopUP = function(backgroundKey, parent) {
    PopUp.call(this, backgroundKey, parent);
    this.layout = new Horizontalayout(this);
};

HorizontalLayoutPopUP.prototype = Object.create(PopUp.prototype);
HorizontalLayoutPopUP.prototype.constructor = HorizontalLayoutPopUP;

HorizontalLayoutPopUP.prototype.addElement = function(element) {
    this.layout.addElement(element);
};

module.exports = HorizontalLayoutPopUP;


},{"./HorizontalLayout":38,"./PopUp":41}],41:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 16/07/2015.
 */
var MARGIN = 10;
var PopUp = function(backgroundKey, parent) {
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
};

PopUp.prototype = Object.create(Phaser.Sprite.prototype);
PopUp.prototype.constructor = PopUp;

PopUp.prototype.close = function() {
    this.visible = false;
    level.activePopUps --;
    if (level.activePopUps === 0) {
        level.resume();
    }
    this.kill();
};

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

module.exports = PopUp;

},{}],42:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 15/10/2015.
 */

/**
 * Bar that shows the remaining part of a resource, for example a Health Bar
 * @param x {number} X coordinate of the bar.
 * @param y {number} Y coordinate of the bar.
 * @param size {Array} Array containing width and height of the bar,
 * it is optional
 * @constructor
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
 * @param barLevel
 */
ResourceBar.prototype.updateResourceBarLevel = function(barLevel) {
    this.bar.scale.x = barLevel;
};

module.exports = ResourceBar;

},{}],43:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 13/10/2015.
 */

/**
 * Tha class Utilities contains different functions or utilities that are useful
 * within other classes.
 * @constructor
 */
var Utilities = function() {};

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
        randomIndex = level.game.rnd.integerInRange(0, indexes.length - 1);
        randomIndexes.push(indexes[randomIndex]);
        indexes.splice(randomIndex, 1);
    }
    return randomIndexes;
};

module.exports = Utilities;

},{}],44:[function(require,module,exports){
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

},{}],45:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 13/10/2015.
 */

var VerticalLayout = require('./VerticalLayout');

/**
 * Represents a panel that has a VerticalLayout to arrange its elements.
 * @param {string} backgroundKey Texture's key for panel's background
 * @param {Array} optionals array containing optional parameters x and/or y
 * coordinates for the panel, it can be undefined (optional)
 * @constructor
 */
var VerticalLayoutPanel = function(backgroundKey, optionals) {
    var ops = optionals || [];
    var x = ops.x || 0;
    var y = ops.y || 0;
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);
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


},{"./VerticalLayout":44}],46:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 29/08/2015.
 */
var PopUp = require('../util/PopUp');
var ResourceBar = require('../util/ResourceBar');

var DEFAULT_CAR_SPEED = 400;
var DEFAULT_CAR_MAX_SPEED = 500;
var CAR_GRAVITY = 30000;
var MAX_DISTANCE = 400;

var InteractiveCar = function(x, y, backgroundKey) {
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
    this.occupied = false;
    this.stopLeftFrameIndex = 0;
    this.stopRightFrameIndex = 1;
    this.remainingGas = MAX_DISTANCE;
    this.maxDistance = MAX_DISTANCE;

    this.gasBar = new ResourceBar(-this.width / 2, -this.height - 10,
        {width: 80, height: 8});
    this.addChild(this.gasBar);
};

InteractiveCar.prototype = Object.create(Phaser.Sprite.prototype);
InteractiveCar.prototype.constructor = InteractiveCar;

InteractiveCar.prototype.getOn = function() {
    level.player.onVehicle = true;
    level.player.relocate(this.x, this.y - 100);
    level.player.changeSpeed(DEFAULT_CAR_SPEED, DEFAULT_CAR_MAX_SPEED);
    level.player.changeGravity(CAR_GRAVITY);
    this.occupied = true;
};

InteractiveCar.prototype.getOff = function() {
    this.stop();
    level.player.onVehicle = false;
    level.player.relocate(this.x + 100, this.y - 100);
    level.player.resetSpeed();
    level.player.resetGravity();
    this.occupied = false;
};

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
        }else {
            this.frame = this.stopLeftFrameIndex;
        }
        if (this.remainingGas <= 0) {
            this.getOff();
        }
        this.gasBar.updateResourceBarLevel(this.remainingGas /
            this.maxDistance);
    }
};

InteractiveCar.prototype.isStopped = function() {
    return this.body.velocity.x === 0;
};

InteractiveCar.prototype.stop = function() {
    this.body.velocity.x = 0;
};

module.exports = InteractiveCar;

},{"../util/PopUp":41,"../util/ResourceBar":42}],47:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 29/08/2015.
 */
var Store = require('../items/store/Store');

var InteractiveHouse = function(x, y, backgroundKey) {
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);

    this.anchor.set(0, 0);

    this.openDoorButton = level.game.make.sprite(this.width / 2,
        -this.height / 2, 'openDoor');
    this.openDoorButton.anchor.set(0.5);
    this.openDoorButton.inputEnabled = true;
    this.openDoorButton.input.priorityID = 2;
    this.openDoorButton.events.onInputDown.add(this.openActivity, this);

    this.addChild(this.openDoorButton);
};

InteractiveHouse.prototype = Object.create(Phaser.Sprite.prototype);
InteractiveHouse.prototype.constructor = InteractiveHouse;

InteractiveHouse.prototype.openActivity = function() {
    var popUp = new Store(level);
    level.game.add.existing(popUp);
    popUp.open();
};

module.exports = InteractiveHouse;

},{"../items/store/Store":21}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47]);
