import { Scene } from "phaser";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(322.5, 450, "preloader");
    }

    preload() {
        //  Load the assets for the game - Replace with the path to your own assets

        this.load.setPath("assets");
        this.load.image("background", "background.png");
        this.load.image("gameover_bg", "gameover_bg.png");
        this.load.image("trail", "trail.png");
        this.load.image("glow", "glow.png");


        this.load.image("logo", "cc-logo.png");
        this.load.atlas("object", "object.png", "sprite_sheet.json");
    }
    

    create() {
        //  When all the assets are loaded go to the next scene.
        //  We can go there immediately via: this.scene.start('MainMenu');
        //  Or we could use a Scene transition to fade between the two scenes:

        // Global Variables

        this.registry.set("gameDuration", 30); // Set the global game Timer in seconds

        // Game speed and spawn delay
        this.registry.set("initialSpeed", 50);
        this.registry.set("initialSpawnDelay", 400);

        //  A global value to store the highscore in
     //   this.registry.set("highscore", 0);

        //  A global value to store the score in
        this.registry.set("score", 0);



        //local storage for high score

        // Get the highscore from localStorage, or default to 0
const savedHighscore = localStorage.getItem("gameHighscore");
this.registry.set("highscore", savedHighscore ? parseInt(savedHighscore) : 0);


        // Value / bonus for the each object /  isGood = true ==> good object
        this.registry.set("objectValues", {
            object1: { value: 30, color: "#ffff00", isGood: true },
            object2: { value: -66, color: "#ff0000", isGood: false },
            object3: { value: 50, color: "#00ff00", isGood: true },
        });

        // Game Texts and Labels for Main Menu
        this.registry.set("menuTexts", {
            highScoreLabel: "High Score",
            instructions:
                "Click and Drag\nHow many can you catch in {{duration}} seconds?",
            startButton: "Start Game",
            playAgain: "Play Again",
            timeLabel: "Time"
        });

        // Game Texts and Labels for Gameover scene
        this.registry.set("gameOverLabels", {
            playAgainLabel: "Play Again",
            gameOverMessage: (highscore, score) =>
                `Game Over\n\nYour Score: ${score} \n\n highest Score: ${highscore}`,
        });

        // Object Info Display on Menu
        this.registry.set("menuObjectDisplay", [
            {
                frame: "object1",
                valuePrefix: "+",
                valueKey: "object1",
            },
            {
                frame: "object2",
                valuePrefix: "",
                valueKey: "object2",
            },
            {
                frame: "object3",
                valuePrefix: "+",
                valueKey: "object3",
            },
        ]);

        // transition
        this.scene.transition({
            target: "MainMenu",
            duration: 2000,
            moveBelow: true,
            onUpdate: (progress) => {
                this.cameras.main.setAlpha(1 - progress);
            },
        });
        //  When the transition completes, it will move automatically to the MainMenu scene
    }
}

