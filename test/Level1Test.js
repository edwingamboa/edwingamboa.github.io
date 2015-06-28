QUnit.module("Level One")

QUnit.test("Right and left movement", function( assert ) {
		function move(expectedX) {
			assert.equal(LevelOne.player.body.velocity.x, expectedX);
		}
        LevelOne.create();
            //Move to left of screen
            LevelOne.game.cursors.left.isDown = true;
            LevelOne.update();
            LevelOne.move(-LevelOne.player.speed);
            LevelOne.game.cursors.left.isDown = false;

            //Move to left of screen
            LevelOne.game.cursors.right.isDown = true;
            LevelOne.update();
            move(LevelOne.player.speed);
        LevelOne.game.cursors.right.isDown = false;
	});
        
        QUnit.test("Run", function( assert ) {
		function run(expectedX) {
			assert.equal(LevelOne.player.body.velocity.x, expectedX);
		}
                
                var XKey = LevelOne.game.input.keyboard.addKey(Phaser.Keyboard.X)
            LevelOne.create();
                //Run to left of screen                
                LevelOne.cursors.left.isDown = true;
                XKey.isDown = true;
            LevelOne.update();
                run(-LevelOne.player.runningSpeed);
            LevelOne.cursors.left.isDown = false;
                XKey.isDown = false;
                        
                //Run to right of screen
            LevelOne.cursors.right.isDown = true;
                XKey.isDown = true;
            LevelOne.update();
                run(LevelOne.player.runningSpeed);
            LevelOne.cursors.right.isDown = false;
                XKey.isDown = false;
	});

