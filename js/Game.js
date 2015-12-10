var BGGame = BGGame || {};

//title screen
    var map,
        level = 0,
        player,
        playerStart,
        bigfoot,
        backgroundLayer,
        impassableLayer,
        baddies,
        numBaddies = 3,
        playerVsBaddieTime = 0,
        bigfootTween1,
        bigfootTween2,
        bigfootTween3,
        bigfootTween4,
        bigfootDirection,
        playerDirection,
        punchTime = 0,
        epicBattleTime = 0,
        bigfootKnockbackTime = 0,
        playerKnockbackTime = 0,
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
        spongebob,
        transitionObjects;

BGGame.Game = function() {};

BGGame.Game.prototype = {
    create: function() {     
        this.loadLevel();

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        cursors = this.game.input.keyboard.createCursorKeys();
        spacebar = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        livesText = this.game.add.text(650, 30, 'Lives: 3', {fontSize: '32px', fill: '#fff'});
        gameInterruptionText = this.game.add.text(this.game.world.centerX, 
                                             this.game.world.centerY, 
                                             '- Game Over -', 
                                             {font: "80px Arial", fill: "#fff", align: "center"});
        gameInterruptionText.visible = false;
        gameInterruptionText.anchor.x = 0.5;
        gameInterruptionText.anchor.y = 0.5;

        spongebob = this.game.add.image(this.game.world.centerX, this.game.world.centerY, 'spongebob');
        spongebob.anchor.x = 0.5;
        spongebob.anchor.y = 0.5;
        spongebob.animations.add('victoryScreech', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 30, true);
        spongebob.visible = false;
        // Was being used in combination with spongebob.revive(); as a re-usable win screen. May be needed in the future.
//        spongebob.kill();
    },
    
    loadLevel: function() {
        if (1 != level) {
//            this.loadLevel1();
            this.loadLevel2();
        } else {
            this.loadLevel2();
        }
    },
    
    loadLevel1: function() {
        if (map) {
            map.destroy();
        }
        map = this.game.add.tilemap('map1');
        this.loadTilesets();
        this.setUpMap();
    },
    
    loadLevel2: function() {
        if (map) {
            map.destroy();
        }
        map = this.game.add.tilemap('map2');
        this.loadTilesets();
        this.setUpMap();
    },
    
    loadTilesets: function() {
        map.addTilesetImage('high-fantasy-ground-tiles', 'high-fantasy-tiles')
        map.addTilesetImage('environment-1', 'misc-1-tiles')
        map.addTilesetImage('environment-2', 'misc-2-tiles')
        map.addTilesetImage('icons-and-equipment', 'icons-and-equipment')        
    },
    
    setUpMap: function() {
        
        backgroundlayer = map.createLayer('grass-base');
        impassableLayer = map.createLayer('impassable-environment');
        passableLayer = map.createLayer('background-passable-environment');
        objectsLayer = map.createLayer('objects')        ;
//        this.createLevelTransitionObjects();   
//        playerStart = this.getTransitionObjectByName("player-west");
//        console.log(playerStart);
        this.setUpCharacters();  
        passableLayer = map.createLayer('foreground-passable-environment');
        map.setCollisionBetween(1, 2000, true, 'impassable-environment'); 
    },
    
    setUpCharacters: function() {
        this.destroyCharacters();
        this.setupPlayer();
        this.setupBaddies();
        this.setupBigfoot();
    },
    
    destroyCharacters: function() {
        if (player) { 
            player.destroy();
        }
        if (bigfoot) {
            bigfoot.destroy();
        }
        
        if (baddies) {
            baddies.destroy(true);
        }
    },
    
    setupPlayer: function(startX, startY) {
//        player = this.game.add.sprite(playerStart.x, playerStart.y, 'player', 1);
        player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player', 1);
        playerDirection = "down";

        this.game.physics.arcade.enable(player);
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
    },
    
    setupBaddies: function() {
        baddies = this.game.add.group();
        baddies.enableBody = true;
        baddies.physicBodyType = Phaser.Physics.ARCADE;

        for (var i = 0; i < numBaddies; i++) {
            var baddie = baddies.create(this.getRandomNumber(100, 700), this.getRandomNumber(100, 700), 'baddie', 1);
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
    },


    setupBigfoot: function() {
        bigfoot = this.game.add.sprite(this.getRandomNumber(500, 700), this.getRandomNumber(100, 300), 'bigfoot');
        bigfootDirection = "bottomLeft";

        this.game.physics.arcade.enable(bigfoot);

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
    },
        
    createLevelTransitionObjects: function() {
                //create items
        transitionObjects = this.game.add.group();
        transitionObjects.enableBody = true;
        result = this.findObjectsByType('player-start', map, 'objects');
        result.forEach(function(element){
          this.createFromTiledObject(element, transitionObjects);
        }, this);
    },

    update: function() {
        if (playerLives <= 0 && !gameOver) {
            gameOver = true;
            this.endGame(false);
        } else if (bigfootLives <= 0 && !gameOver) {
            gameOver = true;
            this.endGame(true);
        }

        if (!gameOver) {
            this.game.physics.arcade.overlap(player, bigfoot, this.epicBattle, null, this);
            this.game.physics.arcade.collide(player, impassableLayer);
            this.game.physics.arcade.collide(baddie, baddies);

            this.checkMovePlayer();
            this.checkPlayerPunch();
            
            bigfoot.alpha = 75/this.game.physics.arcade.distanceBetween(bigfoot, player);

            if (this.game.physics.arcade.distanceBetween(bigfoot, player) < 200) {
                if (this.game.time.now > bigfootKnockbackTime) {                    
                    this.game.physics.arcade.moveToObject(bigfoot, player);
                    this.setBigfootsDirection();        
                }
            } else {
                this.stopBigfoot();
            }
            
            baddies.forEach(function(baddie) {
                this.game.physics.arcade.overlap(player, baddie, this.playerVsBaddie, null, this);
                this.game.physics.arcade.collide(baddie, impassableLayer);
                this.game.physics.arcade.collide(baddie, baddies);

                if (this.game.physics.arcade.distanceBetween(baddie, player) < 200) {
                    this.game.physics.arcade.moveToObject(baddie, player);
                    this.setBaddieDirection(baddie);
                } else {
                    this.stopBaddie(baddie);
                }
            }, this);

        }
    },
        
    playerVsBaddie: function(player, baddie) {
        if (this.game.time.now > playerVsBaddieTime) {
            if (this.playerIsPunching()) {
                baddie.kill();
            } else {
                player.animations.stop();                
                this.shootSpriteBack(player, baddie);
                playerLives--;
                livesText.text = "Lives: " + playerLives;
                playerKnockbackTime = this.game.time.now + 200;
            }

            playerVsBaddieTime = this.game.time.now + 1000;
        }
    },


    epicBattle: function(player, bigfoot) {
        if (this.game.time.now > epicBattleTime) {
            if (this.playerIsPunching()) {
                this.shootSpriteBack(bigfoot, player);
                bigfootKnockbackTime = this.game.time.now + 200;
                bigfootLives--;
            } else {
                player.animations.stop();
                this.shootSpriteBack(player, bigfoot);
                playerKnockbackTime = this.game.time.now + 200;
                playerLives--;
                livesText.text = "Lives: " + playerLives;
            }

            epicBattleTime = this.game.time.now + 1000;
        }
    },
    
    shootSpriteBack: function(flyingSprite, stationarySprite) {
        var angle = this.game.physics.arcade.angleBetween(flyingSprite, stationarySprite);
        flyingSprite.body.velocity.x += Math.cos(angle) * -700;
        flyingSprite.body.velocity.y += Math.sin(angle) * -700;
    },

    endGame: function(didWin) {
        this.game.input.enabled = false;
        
        player.body.velocity.setTo(0, 0);
        bigfoot.body.velocity.setTo(0, 0);
        baddies.forEach(function(baddie) {
          this.stopBaddie(baddie);  
        }, this);

        if (didWin) {
            bigfoot.kill();
            player.animations.play('punchDown', 8, true);

            gameInterruptionText.text = "YOU WIN!\n VICTORY SCREECH";
            gameInterruptionText.visible = true;
            gameInterruptionText.bringToTop();
//            spongebob.revive();
            spongebob.visible = true;
            spongebob.animations.play('victoryScreech');

            this.game.sound.play('victory-screech');
        } else {
            bigfoot.animations.play('standBottomLeft');
            player.animations.play('dead', 3, false, true);
            
            

            gameInterruptionText.visible = true;
            gameInterruptionText.bringToTop();

            this.game.sound.play('troll');
        }
    },
    
    stopBaddie: function(baddie) {
        baddie.body.velocity.x = 0;
        baddie.body.velocity.y = 0;
        baddie.animations.stop();
        baddie.frame = 1;
    },

    checkMovePlayer: function() {
        if (this.game.time.now > playerKnockbackTime) {
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            var animationPlaying = false;

            if (!this.playerIsDamaged()) {               
                if (cursors.up.isDown) {
                    player.body.velocity.y = -100;
                    if (!this.playerIsPunching() && !animationPlaying) {
                        player.animations.play('walkUp');
                        animationPlaying = true;
                    }
                    playerDirection = "up";
                } 

                if (cursors.down.isDown) {
                    player.body.velocity.y = 100;
                    if (!this.playerIsPunching() && !animationPlaying) {
                        animationPlaying = true;
                        player.animations.play('walkDown');
                    }
                    playerDirection = "down";
                }

                if (cursors.left.isDown) {
                    player.body.velocity.x = -100;
                    if (!this.playerIsPunching() && !animationPlaying) {
                        animationPlaying = true;
                        player.animations.play('walkLeft');
                    }
                    playerDirection = "left";
                }

                if (cursors.right.isDown) {
                    player.body.velocity.x = 100;
                    if (!this.playerIsPunching() && !animationPlaying) {
                        animationPlaying = true;
                        player.animations.play('walkRight');
                    }
                    playerDirection = "right";
                } 
                if (!cursors.right.isDown &&
                   !cursors.left.isDown &&
                   !cursors.up.isDown &&
                   !cursors.down.isDown){
                    if (!this.playerIsPunching()) {
                        player.animations.stop();
                    }
                }
            }
        }
    },

    playerIsPunching: function() {
        return playerPunchUpAnim.isPlaying ||
            playerPunchDownAnim.isPlaying ||
            playerPunchLeftAnim.isPlaying ||
            playerPunchRightAnim.isPlaying;
    },

    playerIsDamaged: function() {
        return playerDamagedUpAnim.isPlaying ||
            playerDamagedDownAnim.isPlaying ||
            playerDamagedLeftAnim.isPlaying ||
            playerDamagedRightAnim.isPlaying;        
    },

    checkPlayerPunch: function() {
        if (spacebar.isDown && !this.playerIsDamaged() && (this.game.time.now > punchTime)) {
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
            punchTime = this.game.time.now + 1500;
        }        
    },
        
    setBaddieDirection: function(baddie) {
        var currentAngle = (baddie.body.angle * 180) / Math.PI;

        if (this.valueIsBetween(currentAngle, -135, -45)) {               // facing up
            if (baddie.animations.currentAnim != baddie.animations.getAnimation("walkUp")) {
                baddie.animations.play("walkUp");
            }
        } else if (this.valueIsBetween(currentAngle, 45, 135)) {          // facing down
            if (baddie.animations.currentAnim != baddie.animations.getAnimation("walkDown")) {
                baddie.animations.play("walkDown");
            }
        } else if (currentAngle >= 135 || currentAngle <= -135) {    // facing left
            if (baddie.animations.currentAnim != baddie.animations.getAnimation("walkLeft")) {
                baddie.animations.play("walkLeft");
            }
        } else if (this.valueIsBetween(currentAngle, -45, 45)) {          // facing right
            if (baddie.animations.currentAnim != baddie.animations.getAnimation("walkRight")) {
                baddie.animations.play("walkRight");
            }
        }
    },

    setBigfootsDirection: function() {
        var currentAngle = (bigfoot.body.angle * 180) / Math.PI;

        if (this.valueIsBetween(currentAngle, 90, 180)) {
            if (bigfoot.animations.currentAnim != bigfoot.animations.getAnimation("walkBottomLeft")) {
                bigfoot.animations.play("walkBottomLeft");
                bigfootDirection = "bottomLeft";
            }
        } else if (this.valueIsBetween(currentAngle, 0, 90)) {
            if (bigfoot.animations.currentAnim != bigfoot.animations.getAnimation("walkBottomRight")) {
                bigfoot.animations.play("walkBottomRight");
                bigfootDirection = "bottomRight";
            }
        } else if (this.valueIsBetween(currentAngle, -90, 0)) {
            if (bigfoot.animations.currentAnim != bigfoot.animations.getAnimation("walkTopRight")) {
                bigfoot.animations.play("walkTopRight");
                bigfootDirection = "topRight";
            }
        } else if (this.valueIsBetween(currentAngle, -180, -90)) {
            if (bigfoot.animations.currentAnim != bigfoot.animations.getAnimation("walkTopLeft")) {
                bigfoot.animations.play("walkTopLeft");
                bigfootDirection = "topLeft";
            }
        }         
    },

    stopBigfoot: function() {        
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
    },

    valueIsBetween: function(toCompareVal, smallVal, bigVal) {
        return toCompareVal > smallVal && toCompareVal < bigVal;
        
    },
        
    getRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    //find objects in a Tiled layer that contain a property called "type" equal to a certain value
    findObjectsByType: function(type, map, layer) {
        var result = new Array();
            map.objects[layer].forEach(function(element){
              if(element.properties.type === type) {
                //Phaser uses top left, Tiled bottom left so we have to adjust the y position
                element.y -= map.tileHeight;
                result.push(element);
              }      
            });
        return result;
    },
        //create a sprite from an object
    createFromTiledObject: function(element, group) {
        var sprite = group.create(element.x, element.y, element.properties.sprite);
            //copy all properties to the sprite
            Object.keys(element.properties).forEach(function(key){
            sprite[key] = element.properties[key];
        });
    },
        
    getTransitionObjectByName: function(name) {
        for (var transitionObject in transitionObjects) {
            if (name === transitionObject.name){
                return transitionObject;
            }
        }
        return null;
    }
};
