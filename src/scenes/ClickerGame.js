import { Scene } from "phaser";

export class ClickerGame extends Scene {
    constructor() {
        super("ClickerGame");
    }

    create() {

        this.add.image(322.5, 450, "background");
        this.score = 0;

this.object1Counter =0;
this.object2Counter =0;
 this.object3Counter =0;


          const textStyle = {
            fontFamily: "Arial Black",
            fontSize: 38,
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 8,
        };


        this.trailCooldown = 0; // : throttle trail frequency

        this.timeLeft = this.registry.get('gameDuration');
    

        this.timerText = this.add.text(this.scale.width - 20, 16,`Time: ${this.timeLeft}`, textStyle).setOrigin(1,0).setDepth(10);

     

      
        this.ScoretextStyle = {
            fontFamily: "Arial Black",
            fontSize: "24px",
            fill: "#ffffff",
            stroke: "#000000",
            strokeThickness: 6,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: "#333333",
                blur: 2,
                fill: true,
            },
        };

        

        this.score = 0;
        this.scoreText = this.add
            .text(16, 16, "Score: 0")
            .setScrollFactor(0)
            .setDepth(1000)
            .setStyle(this.ScoretextStyle);

        this.objectFrames = this.textures.get("object").getFrameNames();
        this.objectGroup = this.physics.add.group([]);

        //Catcher
        // invisible catcher zone
        this.catcher = this.add.zone(0, 0, 40, 40); // 40x40 box
        this.physics.add.existing(this.catcher);
        this.catcher.body.setAllowGravity(false);
        this.catcher.body.setCircle(20); //make it circular
        this.catcher.setVisible(false); // hide unless debugging















        // Track pointer state
        this.isPointerDown = false;

        this.input.on("pointerdown", (pointer) => {
            this.isPointerDown = true;
            this.catcher.setVisible(true);
            this.catcher.setPosition(pointer.x, pointer.y);
            this.catcher.body.enable = true;
        });

        this.input.on("pointerup", () => {
            this.isPointerDown = false;
            this.catcher.setVisible(false);
            this.catcher.body.enable = false; //  DISABLE physics body
        });

        this.physics.add.overlap(
            this.catcher,
            this.objectGroup,
            this.catchObject,
            null,
            this
        );

        this.catcher.body.enable = false;

        this.speed = 50;
        this.spawnDelay = 480;

        this.spawnTimer = this.time.addEvent({
            delay: this.spawnDelay,
            loop: true,
            callback: this.spawnObject,
            callbackScope: this,
        });

      

this.timerEvent = this.time.addEvent({
  delay: 1000,
  loop: true,
  callback: () => {
    this.timeLeft--;
    this.timerText.setText(`Time: ${this.timeLeft}`);

    if (this.timeLeft <= 10) { this.timerText.setColor('#ff4444') }

  if (this.timeLeft <= 0) {
      this.timerEvent.remove();
      this.gameOver();
    }
  },
  callbackScope: this
});



    }

    spawnTrail(target) {
        const trail = this.add
            .image(target.x, target.y, "trail")
            .setAlpha(0.8)
            .setScale(0.8)
            .setTint(0xffffaa)
            .setDepth(0);

        this.tweens.add({
            targets: trail,
            alpha: 0,
            scale: 0,
            duration: 500,

            onComplete: () => trail.destroy(),
        });
    }

    update(time, delta) {
        if (this.isPointerDown) {
            const pointer = this.input.activePointer;
            this.catcher.setPosition(pointer.x, pointer.y);

            // Add glow trail effect every 5ms
            if (!this.lastGlowTime || time - this.lastGlowTime > 5) {
                this.spawnCatcherTrail();
                this.lastGlowTime = time;
            }
        }

        this.objectGroup.getChildren().forEach((child) => {
            if (!child.active) return;

            child.angle += 1;

            // Only create trails for object1 and object3
            const frameName = child.frame?.name;

            if (
                (frameName === "object1" || frameName === "object3") &&
                (!child.lastTrailTime || time - child.lastTrailTime > 30)
            ) {
                this.spawnTrail(child);
                child.lastTrailTime = time;
            }

            if (child.y > this.scale.height + 10) {
                child.setActive(false).setVisible(false);
            }
        });
    }

    spawnCatcherTrail() {
        const trail = this.add
            .image(this.catcher.x, this.catcher.y, "glow")
            .setAlpha(0.5)
            .setScale(0.4)
            .setDepth(5)
            .setBlendMode("ADD")
            .setTint(Phaser.Display.Color.RandomRGB().color);

        this.tweens.add({
            targets: trail,
            alpha: 0,
            scale: 0.3,
            duration: 800,
            onComplete: () => trail.destroy(),
        });
    }

    gameOver() {
        const highscore = this.registry.get("highscore");
         this.registry.set("score", this.score);
        if (this.score > highscore) {
            this.registry.set("highscore", this.score);
        }

        this.registry.set('object1Counter',this.object1Counter);
        this.registry.set('object2Counter',this.object2Counter);
        this.registry.set('object3Counter',this.object3Counter);

       this.input.enabled = false;

    // Start fade-out effect
    this.cameras.main.fadeOut(1000, 0, 0, 0); // (duration, red, green, blue)

    // Wait for fade to complete before changing scene
    this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameOver');
    });
    }

    spawnObject() {
        const objectFrame = Phaser.Utils.Array.GetRandom(this.objectFrames);

        const object = this.objectGroup.getFirstDead(
            true,
            Phaser.Math.RND.between(50, this.scale.width - 50),
            -20,
            "object"
        );

        object
            .setFrame(objectFrame)
            .setScale(0.3)
            .setActive(true)
            .setVisible(true)
            .setVelocity(0, this.speed)
            .setTint(0xffffff)
            .setDepth(1);

        object.caught = false;

        // Increase difficulty
        this.speed = Math.min(this.speed + 3, 500);
        this.spawnDelay = Math.max(this.spawnDelay - 4, 160);

        // Update spawn timer
        this.spawnTimer.reset({
            delay: this.spawnDelay,
            loop: true,
            callback: this.spawnObject,
            callbackScope: this,
        });
    }

    catchObject(catcher, object) {
        if (!object.active || object.caught) return;
        object.caught = true;

        let value = 0;
        let color = "#ffffff";
        let isGood = false;


        if (object.frame.name === "object1") {
            value = +1;
            color = "#ffff00";
            this.score += 1;
            this.object1Counter++;
            isGood = true;
        } else if (object.frame.name === "object2") {
            value = -3;
            color = "#ff0000";
            this.score -= 3;
            this.object2Counter++;
        } else if (object.frame.name === "object3") {
            value = +2;
            color = "#00ff00";
            this.score += 2;
            this.object3Counter++;
            isGood = true;
        }

        this.scoreText.setText("Score: " + this.score);

        const floatingText = this.add
            .text(object.x, object.y, (value > 0 ? "+" : "") + value, {
                font: "40px Arial",
                fill: color,
                stroke: "#000",
                strokeThickness: 3,
            })
            .setOrigin(0.5)
            .setDepth(2);

        this.tweens.add({
            targets: floatingText,
            y: object.y - 40,
            alpha: 0,
            duration: 800,
            ease: "Cubic.easeOut",
            onComplete: () => floatingText.destroy(),
        });

        if (isGood) {
            this.tweens.add({
                targets: object,
                x: this.scoreText.x,
                y: this.scoreText.y,
                scale: 0,
                angle: 360,
                duration: 600,
                ease: "Cubic.easeIn",
                onComplete: () => {
                    this.scoreText.setStyle({
                        ...this.ScoretextStyle,
                        fill: "#00ff66",
                    });
                    this.tweens.add({
                        targets: this.scoreText,
                        scale: 1.2,
                        duration: 100,
                        yoyo: true,
                        ease: "Sine.easeInOut",
                    });
                    this.time.delayedCall(200, () => {
                        this.scoreText.setStyle(this.ScoretextStyle);
                    });

                    object
                        .setActive(false)
                        .setVisible(false)
                        .setScale(0.3)
                        .setAngle(0);
                },
            });
        } else {
            this.tweens.add({
                targets: object,
                x: object.x + 10,
                yoyo: true,
                repeat: 2,
                duration: 50,
                onComplete: () => {
                    this.tweens.add({
                        targets: object,
                        scale: 0,
                        duration: 100,
                        ease: "Back.easeIn",
                        onComplete: () => {
                            this.scoreText.setStyle({
                                ...this.ScoretextStyle,
                                fill: "#ff4444",
                            });
                            this.time.delayedCall(200, () => {
                                this.scoreText.setStyle(this.ScoretextStyle);
                            });

                            object
                                .setActive(false)
                                .setVisible(false)
                                .setScale(0.3);
                        },
                    });
                },
            });
        }
    }
}

