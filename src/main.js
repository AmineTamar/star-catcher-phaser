import { Boot } from "./scenes/Boot";
import { ClickerGame } from "./scenes/ClickerGame";
import { Game } from "phaser";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";

//  Find out more information about the Game Config at: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 645,
    height: 900,
    parent: "game-container",
    backgroundColor: "#028af8",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: "arcade",
        arcade: {
            // Arcade physics plugin, manages physics simulation
            gravity: {
                x: 0,
                y: 150,
            },
            debug: true,
        },
    },
    scene: [Boot, Preloader, MainMenu, ClickerGame, GameOver],
};

export default new Game(config);

