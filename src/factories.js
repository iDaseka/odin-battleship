const createShip = (length, coordinates, start) => ({
    length, coordinates, start, hitNumber: 0, sunk: false,
    hit(){
        this.hitNumber += 1;
    },
    isSunk(){
        this.sunk = this.length === this.hitNumber;
    }
});

const createPlayer = (gameboard, name = 'Player') => ({
    name, gameboard
});

export {createShip, createPlayer};