WebFontConfig = {
    google: {
        families: ['Shojumaru']
    }
};

/**
 * Phaser variable game.
 * @type {Phaser.Game}
 */
var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'WOPIC');
/**
 * Game Boot state
 * @type {Boot}
 */
var Boot = require('./states/Boot');
/**
 * Game preloader state, it loads all assets.
 * @type {Preloader}
 */
var Preloader = require('./states/Preloader');
/**
 * Main menu state, allows the player start a game.
 * @type {Menu}
 */
var Menu = require('./states/Menu');
/**
 * Game Intro, introduces the game backgroudn story to the player.
 * @type {Intro}
 */
var Intro = require('./states/levels/Intro');
/**
 * Level one state.
 * @type {LevelOne}
 */
var LevelOne = require('./states/levels/LevelOne');
/**
 * Level two state.
 * @type {LevelTwo}
 */
var LevelTwo = require('./states/levels/LevelTwo');
/**
 * Level two state.
 * @type {LevelThree}
 */
var LevelThree = require('./states/levels/LevelThree');

game.state.add('boot', Boot);
game.state.add('preloader', Preloader);
game.state.add('menu', Menu);
game.state.add('levelOne', LevelOne);
game.state.add('levelTwo', LevelTwo);
game.state.add('levelThree', LevelThree);
game.state.add('intro', Intro);
game.state.start('boot');
