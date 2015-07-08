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
