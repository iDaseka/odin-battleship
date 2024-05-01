import gameLoop from './script';

const createComputer = (gameboard, name = 'Computer') => {
    let allCoordinates = []; let targetQueue = []; let lastHit; let firstHit; let direction;

    const removeDuplicates = (array) => {
        array.forEach((coord) => {
            const index = allCoordinates.findIndex((item) => item[0] === coord[0] && item[1] === coord[1]);
            if (index !== -1){
                allCoordinates.splice(index, 1);
            }
        });
    };

    function resetComputer(){
        allCoordinates = [];
        targetQueue = [];
        const gridSize = 10;
        for (let i = 0; i < gridSize; i += 1){
            for (let j = 0; j < gridSize; j += 1){
                allCoordinates.push([i, j]);
            }
        }

        for (let i = allCoordinates.length - 1; i > 0; i -= 1){
            const j = Math.floor(Math.random() * (i + 1));
            [allCoordinates[i], allCoordinates[j]] = [allCoordinates[j], allCoordinates[i]];
        }
    };

    const getNextDirection = (dir) => {
        switch (dir){
            case 'up':
                return 'down';
            case 'down':
                return 'left';
            case 'left':
                return 'right';
            default:
                return null;
        }
    };

    const getNextTargetInSameDirection = (playerGameboard, target) => {
        let validAttack = false;
        let triedAllDirections = false;

        while (!validAttack && !triedAllDirections){
            const nextTarget = [...target];
            switch (direction){
                case 'up':
                    nextTarget[0] -= 1;
                    break;
                case 'down':
                    nextTarget[0] += 1;
                    break;
                case 'left':
                    nextTarget[1] -= 1;
                    break;
                default:
                    nextTarget[1] += 1;
                    break;
            }

            if (playerGameboard.isBeyondBoard(nextTarget) || playerGameboard.isMissed(nextTarget[0], nextTarget[1]) || playerGameboard.isHit(nextTarget[0], nextTarget[1])){
                direction = getNextDirection(direction);
                if (direction === null){
                    triedAllDirections = true;
                }
                if (triedAllDirections){
                    return null;
                }
                target = target === lastHit ? firstHit : lastHit;
            }
            else{
                validAttack = true;
                return nextTarget;
            }
        }
        return null;
    };

    const computerAttack = () => {
        const playerGameboard = gameLoop.getPlayerGameboard();
        removeDuplicates(playerGameboard.getMissedArray());
        if (targetQueue.length > 0){
            removeDuplicates(targetQueue);
            const nextAttack = targetQueue.shift();
            playerGameboard.receiveAttack(nextAttack);
            if (playerGameboard.isHit(nextAttack[0], nextAttack[1])){
                if (playerGameboard.getShip(nextAttack[0], nextAttack[1]).sunk)
                    return;
                lastHit = nextAttack;
                const nextTarget = getNextTargetInSameDirection(playerGameboard, lastHit);
                if (nextTarget)
                    targetQueue.unshift(nextTarget);
            }
            else{
                direction = getNextDirection(direction);
                const nextTarget = getNextTargetInSameDirection(playerGameboard, firstHit);
                if (nextTarget)
                    targetQueue.unshift(nextTarget);
            }            
        }
        else{
            const nextAttack = allCoordinates.pop();
            playerGameboard.receiveAttack(nextAttack);
            if (playerGameboard.isHit(nextAttack[0], nextAttack[1])){
                firstHit = [...nextAttack];
                lastHit = nextAttack;
                direction = 'up';
                const nextTarget = getNextTargetInSameDirection(playerGameboard, lastHit);
                if (nextTarget)
                    targetQueue.unshift(nextTarget);
            }
        }
    };

    return {gameboard, name, resetComputer, computerAttack};
};

export default createComputer;