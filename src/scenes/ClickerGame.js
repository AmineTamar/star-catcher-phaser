import { Scene } from "phaser";

export class ClickerGame extends Scene {
    constructor() {
        super("ClickerGame");
    }

    create() {
        this.add.image(322.5, 450, "background");
        this.score = 0;

        this.object1Counter = 0;
        this.object2Counter = 0;
        this.object3Counter = 0;

        const menuTexts = this.registry.get("menuTexts");

        const textStyle = {
            fontFamily: "Arial Black",
            fontSize: 38,
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 8,
        };

        this.trailCooldown = 0; // : throttle trail frequency

        // Timer
        this.timeLeft = this.registry.get("gameDuration");

        this.timerText = this.add
            .text(
                this.scale.width - 20,
                16,
                `${menuTexts.timeLabel}: ${this.timeLeft}`,
                textStyle
            )
            .setOrigin(1, 0)
            .setDepth(10);

        //Score text
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

        this.speed = this.registry.get("initialSpeed"); //objects speed
        this.spawnDelay = this.registry.get("initialSpawnDelay"); //objects spawn delay

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
                this.timerText.setText(
                    `${menuTexts.timeLabel}: ${this.timeLeft}`
                );

                if (this.timeLeft <= 10) {
                    this.timerText.setColor("#ff4444");
                }

                if (this.timeLeft <= 0) {
                    this.timerEvent.remove();
                    this.gameOver();
                }
            },
            callbackScope: this,
        });
    }

    // star trail partical
    spawnTrail(target) {
        const trail = this.add
            .image(target.x, target.y, "trail")
            .setAlpha(0.5)
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

    //update function

    update(time, delta) {
        const floatAmplitude = 0.5; // pixels / ghost floating
        const floatFrequency = 0.005; // speed of Ghost drifting

        if (this.isPointerDown) {
            const pointer = this.input.activePointer;
            this.catcher.setPosition(pointer.x, pointer.y);

            // Add glow trail effect every 5ms
            if (!this.lastGlowTime || time - this.lastGlowTime > 20) {
                this.spawnCatcherTrail();
                this.lastGlowTime = time;
            }
        }

        this.objectGroup.getChildren().forEach((child) => {
            if (!child.active) return;

            const frameName = child.frame?.name;

            // Rotate only good objects
            if (frameName === "object1" || frameName === "object3") {
                child.angle += 1;
            }

            if (
                //|| frameName === "object3"
                frameName === "object1" &&
                (!child.lastTrailTime || time - child.lastTrailTime > 20)
            ) {
                this.spawnTrail(child);
                child.lastTrailTime = time;
            }

            if (child.y > this.scale.height + 10) {
                child.setActive(false).setVisible(false);
            }

            if (child.frame.name === "object2") {
                child.angle = 0; // no rotation

                // Apply slow horizontal floating (drift)
                child.x +=
                    floatAmplitude * Math.sin(floatFrequency * this.time.now);
            }
        });
    }

    //Catcher partical effect

    spawnCatcherTrail() {
        const trail = this.add
            .image(
                this.catcher.x + Phaser.Math.RND.between(5, 30),
                this.catcher.y + Phaser.Math.RND.between(5, 30),
                "glow"
            )
            .setAlpha(0.8)
            .setScale(Phaser.Math.RND.between(0.2, 8) / 10)
            .setDepth(5)
            .setBlendMode("ADD");
        //.setTint(Phaser.Display.Color.RandomRGB().color);

        this.tweens.add({
            targets: trail,
            alpha: 0.3,
            scale: Phaser.Math.RND.between(0.2, 8) / 10,
            duration: 800,
            onComplete: () => trail.destroy(),
        });
    }

    //Gameover logic

    gameOver() {
        const highscore = this.registry.get("highscore");
        this.registry.set("score", this.score);
        if (this.score > highscore) {
            this.registry.set("highscore", this.score);
            // Save to localStorage
            localStorage.setItem("gameHighscore", this.score.toString());
        }

        this.registry.set("object1Counter", this.object1Counter);
        this.registry.set("object2Counter", this.object2Counter);
        this.registry.set("object3Counter", this.object3Counter);

        this.input.enabled = false;

        // Start fade-out effect
        this.cameras.main.fadeOut(1000, 0, 0, 0); // (duration, red, green, blue)

        // Wait for fade to complete before changing scene
        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("GameOver");
        });
    }

    //object spanw logic
    spawnObject() {
        // Weighted random selection: object1 and object2 more common
        const randomValue = Math.random(); // value between 0 and 1
        let objectFrame;

        if (randomValue < 0.4) {
            objectFrame = "object1"; // 40% chance
        } else if (randomValue < 0.8) {
            objectFrame = "object2"; // 40% chance
        } else {
            objectFrame = "object3"; // 20% chance
        }

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
            .setDepth(1)
            .setAngle(0);

        //ghost animation

        // After setting velocity and active status in spawnObject()
        if (objectFrame === "object2") {
            // Kill any existing tweens on this object first
            this.tweens.killTweensOf(object);

            // Reset alpha fully visible
            object.setAlpha(1);

            // Start pulsing tween
            this.tweens.add({
                targets: object,
                alpha: { from: 0.7, to: 1 },
                duration: 600,
                yoyo: true,
                repeat: -1,
                ease: "Sine.easeInOut",
            });
        } else {
            // Kill any existing tweens and reset alpha for other objects
            this.tweens.killTweensOf(object);
            object.setAlpha(1);
        }

        // Apply different speed if it's object3
        let fallSpeed = this.speed;
        if (objectFrame === "object3") {
            fallSpeed += 250; // Increase speed only for object3
        }

        object.setVelocity(0, fallSpeed);

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

        const objectValues = this.registry.get("objectValues");
        const frameName = object.frame.name;

        if (!objectValues[frameName]) return;

        const { value, color, isGood } = objectValues[frameName];

        this.score += value;

        switch (frameName) {
            case "object1":
                this.object1Counter++;
                break;
            case "object2":
                this.object2Counter++;
                break;
            case "object3":
                this.object3Counter++;
                break;
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

