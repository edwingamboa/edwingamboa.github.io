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
