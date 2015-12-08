var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, 
                                                       create: create, 
                                                       update: update});

var bigfootXPos = 500,
    bigfootYPos = 90,
    bigfootTween1,
    bigfootTween2,
    bigfootTween3,
    bigfootTween4,
    bigfootDirection,
    playerDirection,
    punchTime = 0,
    
    playerPunchUpAnim,
    playerPunchDownAnim,
    playerPunchLeftAnim,
    playerPunchRightAnim;



function preload() {
    game.load.spritesheet('player', 'assets/sprites/characters/player.png', 32, 32);
    game.load.spritesheet('bigfoot', 'assets/sprites/characters/bigfoot1.png', 85, 120);
}



function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    setupPlayer();
    setupBigfoot();
    
    cursors = game.input.keyboard.createCursorKeys();
    
    // MAY NEED TO DO SOMETHING WITH addKeyCapture() if there's issues
    spacebar = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
}



function setupPlayer() {
    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player', 1);
    playerDirection = "down";
    
    game.physics.arcade.enable(player);
    
    // ~~~~~~~MIGHT NEED TO REMOVE THIS! MAY IMPACT ABILITY TO INTERACT WITH EDGES OF MAP~~~~~~~~~~ //
    player.body.collideWorldBounds = true;
    
    player.animations.add('walkUp', [39, 40, 41], 8, true);
    player.animations.add('walkDown', [0, 1, 2], 8, true);
    player.animations.add('walkLeft', [13, 14, 15], 8, true);
    player.animations.add('walkRight', [26, 27, 28], 8, true);
    
    player.animations.add('damagedUp', [], 8, true);
    player.animations.add('damagedDown', [], 8, true);
    player.animations.add('damagedLeft', [], 8, true);
    player.animations.add('damagedRight', [], 8, true);
    
    player.animations.add('punchUp', [46, 47, 48, 49, 50, 51], 8);
    player.animations.add('punchDown', [7, 8, 9, 10, 11, 12], 8);
    player.animations.add('punchLeft', [20, 21, 22, 23, 24, 25], 8);
    player.animations.add('punchRight', [33, 34, 35, 36, 37, 38], 8);
    
    playerPunchUpAnim = player.animations.getAnimation("punchUp");
    playerPunchDownAnim = player.animations.getAnimation("punchDown");
    playerPunchLeftAnim = player.animations.getAnimation("punchLeft");
    playerPunchRightAnim = player.animations.getAnimation("punchRight");
    
    player.animations.add('dead', [6, 19, 32, 45], 8, true);
}



function setupBigfoot() {
    bigfoot = game.add.sprite(bigfootXPos, bigfootYPos, 'bigfoot');
    
    game.physics.arcade.enable(bigfoot);
    
    bigfoot.body.collideWorldBounds = true;
    
    bigfoot.animations.add('standBottomLeft', [0, 1, 2, 3, 4, 5, 6, 7], 6, true);
    bigfoot.animations.add('standBottomRight', [8, 9, 10, 11, 12, 13, 14, 15], 6, true);
    bigfoot.animations.add('standTopLeft', [16, 17, 18, 19, 20, 21], 6, true);
    bigfoot.animations.add('standTopRight', [24, 25, 26, 27, 28, 29], 6, true);
    
    bigfoot.animations.add('walkBottomLeft', [32, 33, 34, 35, 36, 37], 6, true);
    bigfoot.animations.add('walkBottomRight', [40, 41, 42, 43, 44, 45], 6, true);
    bigfoot.animations.add('walkTopLeft', [48, 49, 50, 51, 52, 53], 6, true);
    bigfoot.animations.add('walkTopRight', [56, 57, 58, 59, 60, 61], 6, true);
    
    bigfoot.animations.play('standBottomLeft');
    
//    addBigfootDocileBehavior();
}



//function addBigfootDocileBehavior() {    
//    bigfootTween1 = game.add.tween(bigfoot).to({x: bigfootXPos - 100, y: bigfootYPos + 100},
//                                            1200,
//                                            Phaser.Easing.Linear.None,
//                                            false,
//                                            3000);
//    var bigfootTween2 = game.add.tween(bigfoot).to({x: bigfootXPos + 100, y: bigfootYPos + 100},
//                                            1200,
//                                            Phaser.Easing.Linear.None,
//                                            false,
//                                            3000);
//    var bigfootTween3 = game.add.tween(bigfoot).to({x: bigfootXPos + 100, y: bigfootYPos - 100},
//                                            1200,
//                                            Phaser.Easing.Linear.None,
//                                            false,
//                                            3000);
//    var bigfootTween4 = game.add.tween(bigfoot).to({x: bigfootXPos - 100, y: bigfootYPos - 100},
//                                            1200,
//                                            Phaser.Easing.Linear.None,
//                                            false,
//                                            3000);
//    
//    bigfootTween1.onStart.add(function() {
//        bigfoot.animations.play('walkBottomLeft');
//    }, this);
//    bigfootTween2.onStart.add(function() {
//        bigfoot.animations.play('walkBottomRight');
//    }, this);
//    bigfootTween3.onStart.add(function() {
//        bigfoot.animations.play('walkTopRight');
//    }, this);
//    bigfootTween4.onStart.add(function() {
//        bigfoot.animations.play('walkTopLeft');
//    }, this);
//    
//    bigfootTween1.onComplete.add(function() {
//        bigfoot.animations.play('standBottomRight');
//        bigfootXPos = bigfoot.body.x;
//        bigfootYPos = bigfoot.body.y;
//        bigfootTween2.start();
//    }, this);
//    bigfootTween2.onComplete.add(function() {
//        bigfoot.animations.play('standTopRight');
//        bigfootXPos = bigfoot.body.x;
//        bigfootYPos = bigfoot.body.y;
//        bigfootTween3.start();
//    }, this);
//    bigfootTween3.onComplete.add(function() {
//        bigfoot.animations.play('standTopLeft');
//        bigfootXPos = bigfoot.body.x;
//        bigfootYPos = bigfoot.body.y;
//        bigfootTween4.start();
//    }, this);    
//    bigfootTween4.onComplete.add(function() {
//        bigfoot.animations.play('standBottomLeft');
//        bigfootXPos = bigfoot.body.x;
//        bigfootYPos = bigfoot.body.y;
//        bigfootTween1.start();
//    }, this);
//    
//    bigfootTween1.start();
//}



function update() {
    console.log(player.animations.currentAnim.name);
    game.physics.arcade.overlap(player, bigfoot, epicBattle, null, this);
    
    checkMovePlayer();
    checkPlayerPunch();
    
    if (game.physics.arcade.distanceBetween(bigfoot, player) < 200) {
        game.tweens.removeFrom(bigfoot);
        game.physics.arcade.moveToObject(bigfoot, player);
        
        setBigfootsDirection();        
    } else {
        stopBigfoot();
    }
}



function epicBattle(player, bigfoot) {
    // TODO: Handle collision
}



function checkMovePlayer() {
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    
    if (cursors.up.isDown) {
        player.body.velocity.y = -100;
        if (!playerIsPunching()) {
            player.animations.play('walkUp');
        }
        playerDirection = "up";
    } else if (cursors.down.isDown) {
        player.body.velocity.y = 100;
        if (!playerIsPunching()) {
            player.animations.play('walkDown');
        }
        playerDirection = "down";
    } else if (cursors.left.isDown) {
        player.body.velocity.x = -100;
        if (!playerIsPunching()) {
            player.animations.play('walkLeft');
        }
        playerDirection = "left";
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 100;
        if (!playerIsPunching()) {
            player.animations.play('walkRight');
        }
        playerDirection = "right";
    } else {
        if (!playerIsPunching()) {
            player.animations.stop();
        }
    }
}



function playerIsPunching() {
    return playerPunchUpAnim.isPlaying ||
        playerPunchDownAnim.isPlaying ||
        playerPunchLeftAnim.isPlaying ||
        playerPunchRightAnim.isPlaying;
}



function checkPlayerPunch() {
    if (spacebar.isDown) {
        if (game.time.now > punchTime) {
            switch (playerDirection) {
                case "up":
                    playerPunchUpAnim.play();
                    break;
                case "down":
                    playerPunchDownAnim.play();
                    break;
                case "left":
                    playerPunchLeftAnim.play();
                    break;
                case "right":
                    playerPunchRightAnim.play();
                    break;
                default:
                    break;
            }
            punchTime = game.time.now + 1500;
        }
    }
}



function setBigfootsDirection() {
    var currentAngle = (bigfoot.body.angle * 180) / Math.PI;
    
    if (valueIsBetween(currentAngle, 90, 180)) {
        if (bigfoot.animations.currentAnim != bigfoot.animations.getAnimation("walkBottomLeft")) {
            bigfoot.animations.play("walkBottomLeft");
            bigfootDirection = "bottomLeft";
        }
    } else if (valueIsBetween(currentAngle, 0, 90)) {
        if (bigfoot.animations.currentAnim != bigfoot.animations.getAnimation("walkBottomRight")) {
            bigfoot.animations.play("walkBottomRight");
            bigfootDirection = "bottomRight";
        }
    } else if (valueIsBetween(currentAngle, -90, 0)) {
        if (bigfoot.animations.currentAnim != bigfoot.animations.getAnimation("walkTopRight")) {
            bigfoot.animations.play("walkTopRight");
            bigfootDirection = "topRight";
        }
    } else if (valueIsBetween(currentAngle, -180, -90)) {
        if (bigfoot.animations.currentAnim != bigfoot.animations.getAnimation("walkTopLeft")) {
            bigfoot.animations.play("walkTopLeft");
            bigfootDirection = "topLeft";
        }
    } 
}



function stopBigfoot() {
    bigfoot.body.velocity.x = 0;
    bigfoot.body.velocity.y = 0;

    switch (bigfootDirection) {
        case "bottomLeft":
            bigfoot.animations.play("standBottomLeft");
            break;
        case "bottomRight":
            bigfoot.animations.play("standBottomRight");
            break;
        case "topLeft":
            bigfoot.animations.play("standTopLeft");
            break;
        case "topRight":
            bigfoot.animations.play("standTopRight");
            break;
        default:
            bigfoot.animations.play("standBottomLeft");
            break;
    }
}



function valueIsBetween(toCompareVal, smallVal, bigVal) {
    return toCompareVal > smallVal && toCompareVal < bigVal;
}