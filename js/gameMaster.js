var game = new Phaser.Game(800, 800, Phaser.AUTO, '', {preload: preload, 
                                                       create: create, 
                                                       update: update});

var map,
    backgroundLayer,
    impassableLayer,
    bigfootTween1,
    bigfootTween2,
    bigfootTween3,
    bigfootTween4,
    bigfootDirection,
    playerDirection,
    punchTime = 0,
    epicBattleTime = 0,
    
    baddies,
    numBaddies = 3,
    playerVsBaddieTime = 0,
    
    playerPunchUpAnim,
    playerPunchDownAnim,
    playerPunchLeftAnim,
    playerPunchRightAnim,
    playerDamagedUpAnim,
    playerDamagedDownAnim,
    playerDamagedLeftAnim,
    playerDamagedRightAnim,
    
    playerLives = 3,
    bigfootLives = 5,
    livesText,
    
    gameInterruptionText,
    gameOver = false,
    spongebob;



function preload() {
    game.load.spritesheet('player', 'assets/sprites/characters/player.png', 28, 28);
    game.load.spritesheet('baddie', 'assets/sprites/characters/baddie.png', 28, 28);
    game.load.spritesheet('bigfoot', 'assets/sprites/characters/bigfoot1.png', 85, 120);
    
    game.load.tilemap('map1', 'assets/maps/map1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map2', 'assets/maps/map2.json', null, Phaser.Tilemap.TILED_JSON);
    
    game.load.image('high-fantasy-tiles', 'assets/sprites/scenery/HF1_A2.png');
    game.load.image('misc-1-tiles', 'assets/sprites/scenery/setMisc1.png');
    game.load.image('misc-2-tiles', 'assets/sprites/scenery/setMisc2.png');
    game.load.image('icons-and-equipment', 'assets/sprites/scenery/setIcons.png');
    
    game.load.spritesheet('spongebob', 'assets/sprites/victory-screech.png', 500, 360);
    
    game.load.audio('victory-screech', 'assets/audio/victory-screech.m4a');
    game.load.audio('troll', 'assets/audio/troll.m4a');
}



function create() {
    map = game.add.tilemap('map2');
    
    map.addTilesetImage('high-fantasy-ground-tiles', 'high-fantasy-tiles')
    map.addTilesetImage('environment-1', 'misc-1-tiles')
    map.addTilesetImage('high-fantasy-misc', 'misc-2-tiles')
    map.addTilesetImage('icons-and-equipment', 'icons-and-equipment')
    
    backgroundlayer = map.createLayer('grass-base');
    impassableLayer = map.createLayer('impassable-environment');
    passableLayer = map.createLayer('passable-environment');
    map.setCollisionBetween(1, 2000, true, 'impassable-environment');
    
    
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    cursors = game.input.keyboard.createCursorKeys();
    spacebar = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    
    livesText = game.add.text(650, 30, 'Lives: 3', {fontSize: '32px', fill: '#fff'});
    gameInterruptionText = game.add.text(game.world.centerX, 
                                         game.world.centerY, 
                                         '- Game Over -', 
                                         {font: "80px Arial", fill: "#fff", align: "center"});
    gameInterruptionText.visible = false;
    gameInterruptionText.anchor.x = 0.5;
    gameInterruptionText.anchor.y = 0.5;
    
    spongebob = game.add.image(game.world.centerX, game.world.centerY, 'spongebob');
    spongebob.anchor.x = 0.5;
    spongebob.anchor.y = 0.5;
    spongebob.animations.add('victoryScreech', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 30, true);
    spongebob.animations.play('victoryScreech');
    spongebob.kill();
    
    setupPlayer();
    setupBaddies();
    setupBigfoot();
}



function setupPlayer() {
    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player', 1);
    playerDirection = "down";
    
    game.physics.arcade.enable(player);
    player.anchor.x = 0.5;
    player.anchor.y = 0.5;
    
    // ~~~~~~~MIGHT NEED TO REMOVE THIS! MAY IMPACT ABILITY TO INTERACT WITH EDGES OF MAP~~~~~~~~~~ //
    player.body.collideWorldBounds = true;
    
    player.animations.add('walkUp', [39, 40, 41], 8, true);
    player.animations.add('walkDown', [0, 1, 2], 8, true);
    player.animations.add('walkLeft', [13, 14, 15], 8, true);
    player.animations.add('walkRight', [26, 27, 28], 8, true);
    
    player.animations.add('damagedUp', [42, 43, 44], 6);
    player.animations.add('damagedDown', [3, 4, 5], 6);
    player.animations.add('damagedLeft', [16, 17, 18], 6);
    player.animations.add('damagedRight', [29, 30, 31], 6);
    
    player.animations.add('punchUp', [46, 47, 48, 49, 50, 51], 8);
    player.animations.add('punchDown', [7, 8, 9, 10, 11, 12], 8);
    player.animations.add('punchLeft', [20, 21, 22, 23, 24, 25], 8);
    player.animations.add('punchRight', [33, 34, 35, 36, 37, 38], 8);
    
    playerPunchUpAnim = player.animations.getAnimation("punchUp");
    playerPunchDownAnim = player.animations.getAnimation("punchDown");
    playerPunchLeftAnim = player.animations.getAnimation("punchLeft");
    playerPunchRightAnim = player.animations.getAnimation("punchRight");
    
    playerDamagedUpAnim = player.animations.getAnimation("damagedUp");
    playerDamagedDownAnim = player.animations.getAnimation("damagedDown");
    playerDamagedLeftAnim = player.animations.getAnimation("damagedLeft");
    playerDamagedRightAnim = player.animations.getAnimation("damagedRight");
    
    player.animations.add('dead', [6, 19, 32, 45], 2);
}



function setupBaddies() {
    baddies = game.add.group();
    baddies.enableBody = true;
    baddies.physicBodyType = Phaser.Physics.ARCADE;
    
    for (var i = 0; i < numBaddies; i++) {
        var baddie = baddies.create(getRandomNumber(100, 700), getRandomNumber(100, 700), 'baddie', 1);
        baddie.body.collideWorldBounds = true;
        baddie.anchor.setTo(0.5, 0.5); 
        baddieDirection = "down";
        
        baddie.animations.add('walkUp', [39, 40, 41], 8, true);
        baddie.animations.add('walkDown', [0, 1, 2], 8, true);
        baddie.animations.add('walkLeft', [13, 14, 15], 8, true);
        baddie.animations.add('walkRight', [26, 27, 28], 8, true);

        baddie.animations.add('damagedUp', [42, 43, 44], 6);
        baddie.animations.add('damagedDown', [3, 4, 5], 6);
        baddie.animations.add('damagedLeft', [16, 17, 18], 6);
        baddie.animations.add('damagedRight', [29, 30, 31], 6);

        baddie.animations.add('punchUp', [46, 47, 48, 49, 50, 51], 8);
        baddie.animations.add('punchDown', [7, 8, 9, 10, 11, 12], 8);
        baddie.animations.add('punchLeft', [20, 21, 22, 23, 24, 25], 8);
        baddie.animations.add('punchRight', [33, 34, 35, 36, 37, 38], 8);
        
        baddie.animations.add('dead', [6, 19, 32, 45], 2);
    }
}



function setupBigfoot() {
    bigfoot = game.add.sprite(getRandomNumber(500, 700), getRandomNumber(100, 300), 'bigfoot');
    bigfootDirection = "bottomLeft";
    
    game.physics.arcade.enable(bigfoot);
    
    bigfoot.anchor.x = 0.5;
    bigfoot.anchor.y = 0.5;
    
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
    
    bigfoot.alpha = 0.4;
}



function update() {
    if (playerLives <= 0 && !gameOver) {
        gameOver = true;
        endGame(false);
    } else if (bigfootLives <= 0 && !gameOver) {
        gameOver = true;
        endGame(true);
    }
    
    if (!gameOver) {
        game.physics.arcade.overlap(player, bigfoot, epicBattle, null, this);
        game.physics.arcade.collide(player, impassableLayer);
        game.physics.arcade.collide(bigfoot, baddies);

        checkMovePlayer();
        checkPlayerPunch();

        if (game.physics.arcade.distanceBetween(bigfoot, player) < 200) {
            if (bigfoot.alpha != 1) {
                bigfoot.alpha = 1;
            }
            game.physics.arcade.moveToObject(bigfoot, player);
            setBigfootsDirection();        
        } else {
            stopBigfoot();
        }
        
        baddies.forEach(function(baddie) {
            game.physics.arcade.overlap(player, baddie, playerVsBaddie, null, this);
            game.physics.arcade.collide(baddie, impassableLayer);
            game.physics.arcade.collide(baddie, baddies);
            
            if (game.physics.arcade.distanceBetween(baddie, player) < 200) {
                game.physics.arcade.moveToObject(baddie, player);
                setBaddieDirection(baddie);
            } else {
                stopBaddie(baddie);
            }
        });
    }
}



function epicBattle(player, bigfoot) {
    if (game.time.now > epicBattleTime) {
        if (playerIsPunching()) {
            switch (bigfootDirection) {
                case "bottomLeft":
                    shootSpriteBack(bigfoot, (bigfoot.body.x + 20), (bigfoot.body.y - 20));
                    break;
                case "bottomRight":
                    shootSpriteBack(bigfoot, (bigfoot.body.x - 20), (bigfoot.body.y - 20));
                    break;
                case "topLeft":
                    shootSpriteBack(bigfoot, (bigfoot.body.x + 20), (bigfoot.body.y + 20));
                    break;
                case "topRight":
                    shootSpriteBack(bigfoot, (bigfoot.body.x - 20), (bigfoot.body.y + 20));
                    break;
                default:
                    bigfoot.animations.play("standBottomLeft");
                    break;
            }
            bigfootLives--;
        } else {
            player.animations.stop();
            
            switch (playerDirection) {
                case "up":
                    shootSpriteBack(player, player.body.x, (player.body.y + 150));
                    player.animations.play('damagedUp');
                    break;
                case "down":
                    shootSpriteBack(player, player.body.x, (player.body.y - 150));
                    player.animations.play('damagedDown');
                    break;
                case "left":
                    shootSpriteBack(player, (player.body.x + 150), player.body.y);
                    player.animations.play('damagedLeft');
                    break;
                case "right":
                    shootSpriteBack(player, (player.body.x - 150), player.body.y);
                    player.animations.play('damagedRight');
                    break;
                default:
                    break;
            }
            
            playerLives--;
            livesText.text = "Lives: " + playerLives;
        }
        
        epicBattleTime = game.time.now + 1000;
    }
}



function playerVsBaddie(player, baddie) {
    if (game.time.now > playerVsBaddieTime) {
        if (playerIsPunching()) {
            baddie.kill();
        } else {
            player.animations.stop();
            
            switch (playerDirection) {
                case "up":
                    shootSpriteBack(player, player.body.x, (player.body.y + 20));
                    player.animations.play('damagedUp');
                    break;
                case "down":
                    shootSpriteBack(player, player.body.x, (player.body.y - 20));
                    player.animations.play('damagedDown');
                    break;
                case "left":
                    shootSpriteBack(player, (player.body.x + 20), player.body.y);
                    player.animations.play('damagedLeft');
                    break;
                case "right":
                    shootSpriteBack(player, (player.body.x - 20), player.body.y);
                    player.animations.play('damagedRight');
                    break;
                default:
                    break;
            }
            
            playerLives--;
            livesText.text = "Lives: " + playerLives;
        }
        
        playerVsBaddieTime = game.time.now + 1000;
    }
}



function shootSpriteBack(sprite, toX, toY) {
    var tween = game.add.tween(sprite).to({x: toX, y: toY},
                                          350,
                                          Phaser.Easing.Exponential.Out,
                                          true);
}



function endGame(didWin) {
    game.input.enabled = false;
    
    player.body.velocity.setTo(0, 0);
    bigfoot.body.velocity.setTo(0, 0);
    baddies.forEach(function(baddie) {
        stopBaddie(baddie);
    });
    
    if (didWin) {
        bigfoot.kill();
        player.animations.play('punchDown', 8, true);
        
        gameInterruptionText.text = "YOU WIN!\n VICTORY SCREECH";
        gameInterruptionText.visible = true;
        gameInterruptionText.bringToTop();
        spongebob.revive();
        
        game.sound.play('victory-screech');
    } else {
        bigfoot.animations.play('standBottomLeft');
        player.animations.play('dead', 3, false, true);

        gameInterruptionText.visible = true;
        gameInterruptionText.bringToTop();
        
        game.sound.play('troll');
    }
}



function checkMovePlayer() {
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    
    if (!playerIsDamaged()) {
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
}



function playerIsPunching() {
    return playerPunchUpAnim.isPlaying ||
        playerPunchDownAnim.isPlaying ||
        playerPunchLeftAnim.isPlaying ||
        playerPunchRightAnim.isPlaying;
}



function playerIsDamaged() {
    return playerDamagedUpAnim.isPlaying ||
        playerDamagedDownAnim.isPlaying ||
        playerDamagedLeftAnim.isPlaying ||
        playerDamagedRightAnim.isPlaying;
}



function checkPlayerPunch() {
    if (spacebar.isDown && !playerIsDamaged() && (game.time.now > punchTime)) {
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



function setBaddieDirection(baddie) {
    var currentAngle = (baddie.body.angle * 180) / Math.PI;
    
    if (valueIsBetween(currentAngle, -135, -45)) {               // facing up
        if (baddie.animations.currentAnim != baddie.animations.getAnimation("walkUp")) {
            baddie.animations.play("walkUp");
        }
    } else if (valueIsBetween(currentAngle, 45, 135)) {          // facing down
        if (baddie.animations.currentAnim != baddie.animations.getAnimation("walkDown")) {
            baddie.animations.play("walkDown");
        }
    } else if (currentAngle >= 135 || currentAngle <= -135) {    // facing left
        if (baddie.animations.currentAnim != baddie.animations.getAnimation("walkLeft")) {
            baddie.animations.play("walkLeft");
        }
    } else if (valueIsBetween(currentAngle, -45, 45)) {          // facing right
        if (baddie.animations.currentAnim != baddie.animations.getAnimation("walkRight")) {
            baddie.animations.play("walkRight");
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



function stopBaddie(baddie) {
    baddie.body.velocity.x = 0;
    baddie.body.velocity.y = 0;
    baddie.animations.stop();
    baddie.frame = 1;
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



function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}