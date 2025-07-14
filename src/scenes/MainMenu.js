import { Scene } from "phaser";

export class MainMenu extends Scene {
    constructor() {
        super("MainMenu");
    }

    create() {
        const menuTexts = this.registry.get("menuTexts");

        //  Get the current highscore from the registry
        const score = this.registry.get("highscore");
        const gameDuration = this.registry.get("gameDuration");

        const textStyle = {
            fontFamily: "Arial Black",
            fontSize: 18,
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 8,
        };

        this.add.image(322.5, 450, "background");

        const logo = this.add.image(322.5, -270, "logo").setScale(1);

        const objectValues = this.registry.get("objectValues");

        const spacingX = 160; // space between each object+text
        const baseY = this.scale.height - 380; // distance from bottom
        const startX = this.scale.width / 2 - spacingX; // first item centered left

        // display result for objects caught
        // Object 1
        // Object 1
        this.add
            .image(startX, baseY, "object", "object1")
            .setScale(0.3)
            .setOrigin(0.5);
        this.add
            .text(startX + 40, baseY, `+${objectValues.object1.value}`, {
                font: "24px Arial",
                fill: "#ffff00",
                stroke: "#000",
                strokeThickness: 2,
            })
            .setOrigin(0, 0.5);

        // Object 2
        this.add
            .image(startX + spacingX, baseY, "object", "object2")
            .setScale(0.3)
            .setOrigin(0.5);
        this.add
            .text(
                startX + spacingX + 40,
                baseY,
                ` ${objectValues.object2.value}`,
                {
                    font: "24px Arial",
                    fill: "#ff0000",
                    stroke: "#000",
                    strokeThickness: 2,
                }
            )
            .setOrigin(0, 0.5);

        // Object 3
        this.add
            .image(startX + spacingX * 2, baseY, "object", "object3")
            .setScale(0.3)
            .setOrigin(0.5);
        this.add
            .text(
                startX + spacingX * 2 + 40,
                baseY,
                `+${objectValues.object3.value}`,
                {
                    font: "24px Arial",
                    fill: "#00ff00",
                    stroke: "#000",
                    strokeThickness: 2,
                }
            )
            .setOrigin(0, 0.5);

        this.tweens.add({
            targets: logo,
            y: 270,
            duration: 1600,
            ease: "Bounce.easeOut",
        });

        this.add.text(
            32,
            32,
            `${menuTexts.highScoreLabel}: ${score}`,
            textStyle
        );

        // Instruction text Menu
        const instructionsText = menuTexts.instructions.replace(
            "{{duration}}",
            gameDuration
        );

        const instructions = this.add
            .text(322, 450, instructionsText, textStyle)
            .setAlign("center")
            .setOrigin(0.5);

        //Start Button
        const startButton = this.add
            .text(this.scale.width / 2, 600, menuTexts.startButton, {
                fontSize: "32px",
                color: "#000",
                backgroundColor: "#00aaff",
                padding: { x: 30, y: 15 },
                align: "center",
                fontStyle: "bold",
            })
            .setOrigin(0.5)
            .setInteractive();

        // Start Button hover effect
        startButton.on("pointerover", () =>
            startButton.setStyle({ backgroundColor: "#33ccff" })
        );
        startButton.on("pointerout", () =>
            startButton.setStyle({ backgroundColor: "#00aaff" })
        );

        startButton.on("pointerdown", () => {
            // Create a temporary background image for the fade effect

            let fadeRect = this.add
                .rectangle(
                    this.scale.width / 2,
                    this.scale.height / 2,
                    this.scale.width,
                    this.scale.height,
                    0x028af8
                )
                .setAlpha(0)
                .setDepth(999);

            // Fade it in as part of the transition
            this.tweens.add({
                targets: fadeRect,
                alpha: 1,
                duration: 1000,
                onComplete: () => {
                    this.scene.start("ClickerGame");
                },
            });

            // Animate the logo out
            this.tweens.add({
                targets: logo,
                x: 500,
                alpha: 0,
                duration: 1000,
                ease: "Cubic.easeIn",
            });

            // Animate the start button out
            this.tweens.add({
                targets: [startButton, instructions],
                scale: 1.1,
                x: 500,
                alpha: 0,
                duration: 1000,
                ease: "Cubic.easeIn",
            });
        });
    }
}

