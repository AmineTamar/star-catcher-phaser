import { Scene } from "phaser";

export class MainMenu extends Scene {
    constructor() {
        super("MainMenu");
    }

    create() {
        //  Get the current highscore from the registry
        const score = this.registry.get("highscore");
         const gameDuration = this.registry.get('gameDuration');

        const textStyle = {
            fontFamily: "Arial Black",
            fontSize: 18,
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 8,
        };

        this.add.image(322.5, 450, "background");

        const logo = this.add.image(322.5, -270, "logo").setScale(0.5);

        this.tweens.add({
            targets: logo,
            y: 270,
            duration: 1600,
            ease: "Bounce.easeOut",
        });

        this.add.text(32, 32, `High Score: ${score}`, textStyle);

        const instructions = this.add
            .text(
                322,
                450,
                `Click and Drag\nHow many can you catch in ${gameDuration} seconds?`,
                textStyle
            )
            .setAlign("center")
            .setOrigin(0.5);

        const startButton = this.add
            .text(this.scale.width / 2, 600, "Start Game", {
                fontSize: "32px",
                color: "#000",
                backgroundColor: "#00aaff", // Sky blue
                padding: { x: 30, y: 15 },
                align: "center",
                fontStyle: "bold",
            })
            .setOrigin(0.5)
            .setInteractive();

        // Optional hover effect
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

