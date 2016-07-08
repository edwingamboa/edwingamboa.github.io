/**
 * @ignore Created by Edwin Gamboa on 25/10/2015.
 */

/**
 * Phaser variable game.
 * @type {Phaser.Game}
 */
var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'WOPIC');

var Boot = require('./states/boot');
var Preloader = require('./states/preloader');
var Menu = require('./states/menu');
var Intro = require('./states/levels/Intro');
var LevelOne = require('./states/levels/levelOne');
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
