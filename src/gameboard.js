import {createShip} from './factories';

const gameboard = () => {
    let shipsArray = []; let missedArray = []; let hitArray = []; let vertical = false;

    const setVertical = () => (vertical = true);
    const setHorizontal = () => (vertical = false);

    const isBeyondBoard = ([row, col]) => {
        if (row < 0 || row > 9 || col < 0 || col > 9)
            return true;
        return false;
    };

    const isOccupied = ([row, col]) => shipsArray.some((ship) => ship.coordinates.some((coord) => coord[0] === row && coord[1] === col));

    const isHit = (row, col) => hitArray.some((coord) => coord[0] === row && coord[1] === col);

    const isMissed = (row, col) => missedArray.some((coord) => coord[0] === row && coord[1] === col);

    const isSunk = () => shipsArray.some((ship) => ship.sunk);

    const addToMissedArray = ([row, col]) => {
        if (!missedArray.find((mCoord) => mCoord[0] === row && mCoord[1] === col))
            missedArray.push([row, col]);
    };

    const generateShipCoordinates = (length, coordinates) => {
        let row = coordinates[0];
        let col = coordinates[1];
        const coordinatesArray = [];
        coordinatesArray.push(coordinates);

        for (let i = 0; i < length - 1; i += 1) {
            let newCoordinates;
            if (vertical)
                newCoordinates = [(row += 1), col];
            else
                newCoordinates = [row, (col += 1)];
        
        coordinatesArray.push(newCoordinates);
        }

        return coordinatesArray;
    };

    const placeShip = (length, coordinates) => {
        const coordinatesArray = generateShipCoordinates(length, coordinates);
        if (coordinatesArray.some((coords) => isOccupied(coords)) || coordinatesArray.some((coords) => isBeyondBoard(coords)))
            throw new Error('Invalid Coordinates');
    
        const coords = [...coordinatesArray];
        const shipInstance = createShip(length, coordinatesArray, coords[0]);
        shipsArray.push(shipInstance);
    };

    const receiveAttack = ([row, col]) => {
        const target = shipsArray.filter((ship) => ship.coordinates.some((coord) => coord[0] === row && coord[1] === col));
        if (target.length > 0) {
            target[0].hit();
            target[0].isSunk();
            hitArray.push([row, col]);
        }
        else
            missedArray.push([row, col]);
    };

    const autoPlaceShips = () => {
        shipsArray = [];
        missedArray = [];
        hitArray = [];
        const shipLengths = [5, 4, 3, 3, 2];

        shipLengths.forEach((length) => {
            let isValidPlacement = false;

            while (!isValidPlacement) {
                if (Math.random() < 0.5){
                    setVertical();
                }
                else{
                    setHorizontal();
                }

                const row = Math.floor(Math.random() * 10);
                const col = Math.floor(Math.random() * 10);
                const coordinates = [row, col];

                try{
                    placeShip(length, coordinates);
                    isValidPlacement = true;
                } catch (error) {}
            }
        });
    };

    const areAllShipsSunk = () => shipsArray.every((ship) => ship.sunk);

    const getShipsArray = () => shipsArray;

    const getMissedArray = () => missedArray;

    const getHitArray = () => hitArray;

    const getShip = (row, col) => {
        const array = shipsArray.filter((ship) => ship.coordinates.some((coord) => coord[0] === row && coord[1] === col));
        return array[0];
    };

    const getAllSunkShips = () => shipsArray.filter((ship) => ship.sunk);

    const updateShipCoordinates = (initialRow, initialCol, rowOffset, colOffset) => {
        const targetShip = getShip(initialRow, initialCol);
        if (!targetShip)
            return;
    
        const startCopy = [...targetShip.start];
        const coordinatesCopy = [...targetShip.coordinates];
        const newRow = startCopy[0] + rowOffset;
        const newCol = startCopy[1] + colOffset;

        if (coordinatesCopy[0][0] === targetShip.coordinates[1][0])
            setHorizontal();
        else
            setVertical();

        const newCoordniatesArray = generateShipCoordinates(targetShip.length, [newRow, newCol]);
        targetShip.start = [];
        targetShip.coordinates = [];
        
        if (newCoordniatesArray.some((coords) => isBeyondBoard(coords)) || newCoordniatesArray.some((coords) => isOccupied(coords))){
            targetShip.start = startCopy;
            targetShip.coordinates = coordinatesCopy;
            return;
        }

        targetShip.coordinates = newCoordniatesArray;
        targetShip.start = [newRow, newCol];
        return targetShip.start;
    };

    const rotateShip = (row, col) => {
        const targetShip = getShip(row, col);
        const coordinatesCopy = [...targetShip.coordinates];
        if (targetShip.coordinates[0][0] === targetShip.coordinates[1][0])
            setVertical();
        else
            setHorizontal();
        const newCoordniatesArray = generateShipCoordinates(targetShip.length, [row, col]);
        targetShip.coordinates = [];
        
        if (newCoordniatesArray.some((coords) => isBeyondBoard(coords)) || newCoordniatesArray.some((coords) => isOccupied(coords))){
            targetShip.coordinates = coordinatesCopy;
            return;
        }
    
        targetShip.coordinates = newCoordniatesArray;
        return newCoordniatesArray;
    };

    return {placeShip, setVertical, setHorizontal, getShipsArray, getMissedArray, getHitArray, getAllSunkShips, receiveAttack, areAllShipsSunk, autoPlaceShips,isHit, isMissed, isSunk, isBeyondBoard, getShip, addToMissedArray, updateShipCoordinates, rotateShip};
};

export default gameboard;