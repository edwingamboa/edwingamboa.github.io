var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'WOPIC');

//Game States
var LevelOneState = require('./states/levelOne');

game.state.add('play', LevelOneState);
game.state.start('play');
