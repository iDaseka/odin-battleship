import {createPlayer} from './factories';
import createComputer from './pc';
import manageInterface from './interface';
import gameboard from './gameboard';
import './style.css';

const gameLoop = (() => {
    let player; let computer;

    const createPlayers = (name) => {
        player = createPlayer(gameboard(), name);
        computer = createComputer(gameboard());
    }

    const autoPlaceShips = () => {
        const arr = [player, computer];
        arr.forEach((player) => {
            player.gameboard.autoPlaceShips();
        });
    };

    const getPlayerGameboard = () => player.gameboard;
    const getComputerGameboard = () => computer.gameboard;
    const getComputer = () => computer;
    const getPlayer = () => player;

    const playerWin = () => computer.gameboard.areAllShipsSunk();
    const computerWins = () => player.gameboard.areAllShipsSunk();
    const resetComputer = () => computer.resetComputer();

    const checkWin = () => {
        if (playerWin())
            manageInterface.printMessage(getPlayer());
        else if (computerWins())
            manageInterface.printMessage(getComputer());

        if (playerWin() || computerWins()) {
            manageInterface.toggleGameboardEventListenerStatus();
            manageInterface.toggleButtonSectionDisplay();
            return true;
        }
    };

    function playRound(coord){
        computer.gameboard.receiveAttack(coord);
        manageInterface.updateComputerGameboard();

        if (checkWin())
            return;

        computer.computerAttack();
        manageInterface.updatePlayerGameboard();

        if (checkWin())
            return;
    };

    return {createPlayers, autoPlaceShips, getPlayerGameboard, getComputerGameboard, getComputer, getPlayer, resetComputer, playRound};
})();

window.addEventListener('load', () => {
    manageInterface.setUpNameSubmitEventListener();
});

export default gameLoop;