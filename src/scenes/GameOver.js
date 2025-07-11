import { Scene } from "phaser";

export class GameOver extends Scene {
    constructor() {
        super("GameOver");
    }

    create() {
        this.add.image(322.5, 450, "gameover_bg");

        const textStyle = {
            fontFamily: "Arial Black",
            fontSize: 44,
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 8,
        };

        //  Get the current highscore from the registry
        const score = this.registry.get("score");
        const highscore = this.registry.get("highscore");

        // object caught counter

        const object1Counter = this.registry.get("object1Counter");
        const object2Counter = this.registry.get("object2Counter");
        const object3Counter = this.registry.get("object3Counter");

        const spacingX = 160; // space between each object+text
        const baseY = this.scale.height - 400; // distance from bottom
        const startX = this.scale.width / 2 - spacingX; // first item centered left

        // display result for objects caught
        // Object 1
        // Object 1
        this.add
            .image(startX, baseY, "object", "object1")
            .setScale(0.3)
            .setOrigin(0.5);
        this.add
            .text(startX + 40, baseY, `x ${object1Counter}`, {
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
            .text(startX + spacingX + 40, baseY, `x ${object2Counter}`, {
                font: "24px Arial",
                fill: "#ff0000",
                stroke: "#000",
                strokeThickness: 2,
            })
            .setOrigin(0, 0.5);

        // Object 3
        this.add
            .image(startX + spacingX * 2, baseY, "object", "object3")
            .setScale(0.3)
            .setOrigin(0.5);
        this.add
            .text(startX + spacingX * 2 + 40, baseY, `x ${object3Counter}`, {
                font: "24px Arial",
                fill: "#00ff00",
                stroke: "#000",
                strokeThickness: 2,
            })
            .setOrigin(0, 0.5);






        const playAgainButton = this.add
            .text(this.scale.width / 2, 600, "Play Again", {
                fontSize: "32px",
                color: "#000",
                backgroundColor: "#00aaff", // Sky blue
                padding: { x: 30, y: 15 },
                align: "center",
                fontStyle: "bold",
            })
            .setOrigin(0.5)
            .setInteractive();

        //  hover effect
        playAgainButton.on("pointerover", () =>
            playAgainButton.setStyle({ backgroundColor: "#33ccff" })
        );
        playAgainButton.on("pointerout", () =>
            playAgainButton.setStyle({ backgroundColor: "#00aaff" })
        );

        const gameOverText = this.add
            .text(
                322,
                450,
                `Game Over\n\nHigh Score: ${highscore} \n\n Your Score: ${score}`,
                textStyle
            )
            .setAlign("center")
            .setOrigin(0.5);

        this.tweens.add({
            targets: [gameOverText],
            y: 270,
            duration: 1600,
            ease: "Bounce.easeOut",
        });

        playAgainButton.on("pointerdown", () => {
            this.tweens.add({
                targets: [gameOverText],
                x: -500,
                alpha: 0,
                duration: 1000,
                ease: "Cubic.easeIn",
            });

            this.tweens.add({
                targets: [playAgainButton],
                scale: 1.1,
                x: -500,
                alpha: 0,
                duration: 1000,
                ease: "Cubic.easeIn",
                onComplete: () => {
                    this.scene.start("MainMenu");
                },
            });
        });
    }
}

