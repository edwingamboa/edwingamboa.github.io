/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var HealthPack = require('../prefabs/healthPack');
var PopUp = require('../prefabs/popUp');
var ItemGroupView = require('../prefabs/itemGroupView');

var Inventory = function(level) {
    PopUp.call(this, level, 'inventory_background');
    this.anchor.set(0.5, 0.5);
    var healthPack5 =  new HealthPack('healthPack', 5, 300,
        0.7 + Math.random() * 0.2, this.level.player.body.x, 100, this.level);
    this.healthPack5Group = new ItemGroupView(level , -this.width / 2 + 20,
        -this.height / 2 + 20, 'healthPack5', healthPack5, this);

    this.addChild(this.healthPack5Group);

    this.healthPacks = [];
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

Inventory.prototype.showHealthPacks = function() {
    //TODO
};
module.exports = Inventory;
