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



   this.registry.set('gameDuration', 15);  // Set the global game Timer in seconds

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

