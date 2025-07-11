import { Scene } from "phaser";

export class GameOver extends Scene {
    constructor() {
        super("GameOver");
    }

    create() {
        this.add.image(322.5, 450, "gameover_bg");

        //  Get the current highscore from the registry
        const score = this.registry.get("highscore");

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

        const textStyle = {
            fontFamily: "Arial Black",
            fontSize: 44,
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 8,
        };

        const gameOverText = this.add
            .text(322, 450, `Game Over\n\nHigh Score: ${score}`, textStyle)
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

