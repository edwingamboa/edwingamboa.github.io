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
