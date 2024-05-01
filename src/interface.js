import gameLoop from "./script";

const manageInterface = (() => {
  const gameboardContainers = document.querySelectorAll('.gameboard-container');
  const messageDisplay = document.querySelector('.message-display');

  let initialRow; let initialCol; let placeMode = true; let gameOver = false;

  const createGrids = () => {
    const gridSize = 10;
    gameboardContainers.forEach((container) => {
      for (let i = 0; i < gridSize; i += 1) {
        for (let j = 0; j < gridSize; j += 1) {
          const cell = document.createElement('div');
          cell.classList.add('board-cell');
          cell.dataset.row = i;
          cell.dataset.col = j;
          container.append(cell);
        }
      }
    });
  };
  
  const clearGameBoard = () => {
    const draggables = document.querySelectorAll('.draggable');
    draggables.forEach((draggable) => {
      const targetBoardCells = draggable.closest('.board-cell');
      targetBoardCells.textContent = '';
    });
  };

  const clearDisplayMessage = () => {
    messageDisplay.textContent = '';
  };
  
  const resetGameBoard = () => {
    gameboardContainers.forEach((container) => {
      container.textContent = '';
    });
  };
  
  const renderShips = () => {
    const shipsArray = gameLoop.getPlayerGameboard().getShipsArray();
    shipsArray.forEach((ship) => {
      const shipInstance = document.createElement('div');
      const size = 'clamp(0.8rem, 0.2rem + 2.2vw, 2.5rem)';
      
      if (ship.coordinates[0][0] === ship.coordinates[1][0]) {
        shipInstance.style.width = `calc(${ship.length} * ${size})`;
        shipInstance.style.height = size;
      }
      else{
        shipInstance.style.width = size;
        shipInstance.style.height = `calc(${ship.length} * ${size})`;
      }
      shipInstance.classList.add('ship', 'draggable');
      shipInstance.draggable = true;
  
      const boardCell = document.querySelector(`[data-row='${ship.start[0]}'][data-col='${ship.start[1]}']`);
      boardCell.append(shipInstance);
    });
  };
  
  const populateGameboard = () => {
    gameLoop.autoPlaceShips();
    renderShips();
  };
  
  const toggleGameboardEventListenerStatus = () => {
    const computerGameboard = document.querySelector('.computer-gameboard');
    const playerGameboard = document.querySelector('.player-gameboard');
    
    if (placeMode && !gameOver) {
      computerGameboard.style.pointerEvents = 'none';
      computerGameboard.classList.add('inactive');
      playerGameboard.style.pointerEvents = 'auto';
      playerGameboard.classList.remove('inactive');
    }
    else if (!placeMode && !gameOver) {
      computerGameboard.style.pointerEvents = 'auto';
      computerGameboard.classList.remove('inactive');
      playerGameboard.style.pointerEvents = 'none';
      playerGameboard.classList.add('inactive');
    }
    else if (gameOver) {
      computerGameboard.style.pointerEvents = 'none';
      computerGameboard.classList.add('inactive');
    }
  };
  
  const toggleButtonSectionDisplay = () => {
    const randomButton = document.querySelector('.random-button');
    const startGameButton = document.querySelector('.start-button');
    const restartButton = document.querySelector('.restart-button');
    if (placeMode) {
        randomButton.classList.remove('hide');
        startGameButton.classList.remove('hide');
        restartButton.classList.add('hide');
      }
  
      if (!placeMode && !gameOver) {
        randomButton.classList.add('hide');
        startGameButton.classList.add('hide');
        restartButton.classList.remove('hide');
      }
    };
  
  const updateComputerGameboard = () => {
    const computerGameboard = gameLoop.getComputerGameboard();
    const hitArray = computerGameboard.getHitArray();
    const missArray = computerGameboard.getMissedArray();
    
    hitArray.forEach((coord) => {
      const targetCell = document.querySelector(`.computer-gameboard > [data-row='${coord[0]}'][data-col='${coord[1]}']`);
      targetCell.classList.add('hit');
    });
    missArray.forEach((coord) => {
      const targetCell = document.querySelector(`.computer-gameboard > [data-row='${coord[0]}'][data-col='${coord[1]}']`);
      targetCell.classList.add('missed');
    });
  };
  
  const updatePlayerGameboard = () => {
    const playerGameboard = gameLoop.getPlayerGameboard();
    const hitArray = playerGameboard.getHitArray();
    const missArray = playerGameboard.getMissedArray();

    hitArray.forEach((coord) => {
      const targetCell = document.querySelector(`.player-gameboard > [data-row='${coord[0]}'][data-col='${coord[1]}']`);
      targetCell.classList.add('hit');
    });
    missArray.forEach((coord) => {
      const targetCell = document.querySelector(`.player-gameboard > [data-row='${coord[0]}'][data-col='${coord[1]}']`);
      targetCell.classList.add('missed');
    });
  };
  
  const printMessage = (player) => {
    if (placeMode) {
      const message = 'Click the ship to rotate it.';
      messageDisplay.textContent = message;
      return;
    }

    if (player.name !== 'Computer')
      messageDisplay.textContent = `${player.name} wins.`;
    else if (player.name === 'Computer')
      messageDisplay.textContent = 'Computer wins.';
    gameOver = true;
  };
  
  const printNames = () => {
    const player = gameLoop.getPlayer();
    const computer = gameLoop.getComputer();
    const playerName = document.querySelector('.player-name');
    const computerName = document.querySelector('.computer-name');
    playerName.textContent = player.name;
    computerName.textContent = computer.name;
  };
  
  const setUpAttackEventListener = () => {
    const computerGameboardContainer = document.querySelector('.computer-gameboard');
    computerGameboardContainer.addEventListener('click', (event) => {
      const { target } = event;
  
      if (target.classList.contains('missed') || target.classList.contains('hit'))
        return;
  
      if (target.closest('.board-cell')) {
        const row = parseInt(target.dataset.row, 10);
        const col = parseInt(target.dataset.col, 10);
        const attackCoord = [row, col];
        gameLoop.playRound(attackCoord);
      }
    });
  };
  
  const showGameContent = () => {
    const gameContent = document.querySelector('.game-section');
    const introContent = document.querySelector('.intro-content');
    const buttonSection = document.querySelector('.button-section');
    buttonSection.classList.remove('hide');
    gameContent.classList.remove('hide');
    introContent.classList.add('hide');
  };
  
  const setupRandomizeShipsEventListener = () => {
    const randomButton = document.querySelector('.random-button');
    randomButton.addEventListener('click', () => {
      clearGameBoard();
      populateGameboard();
      shipManagementEventListeners();
    });
  };
  
  const setupStartGameEventListener = () => {
    const startButton = document.querySelector('.start-button');
    startButton.addEventListener('click', () => {
      placeMode = false;
      clearDisplayMessage();
      toggleGameboardEventListenerStatus();
      toggleButtonSectionDisplay();
    });
  };
  
  const setupRestartGameEventListener = () => {
    const restartButton = document.querySelector('.restart-button');
    restartButton.addEventListener('click', () => {
      placeMode = true;
      gameOver = false;
      toggleButtonSectionDisplay();
      resetGameBoard();
      clearDisplayMessage();
      setUpGame();
    });
  };
  
  function setUpAllEventListeners() {
    setUpAttackEventListener();
    shipManagementEventListeners();
    setupRandomizeShipsEventListener();
    setupStartGameEventListener();
    setupRestartGameEventListener();
  }
  
  const shipManagementEventListeners = () => {
    const draggables = document.querySelectorAll('.draggable');
  
    draggables.forEach((draggable) => {
      draggable.addEventListener('dragstart', (event) => {
        draggable.classList.add('dragging');
        const clickedX = event.clientX;
        const clickedY = event.clientY;
  
        const playerGameboard = document.querySelector('.player-gameboard');
        const boundingBox = playerGameboard.getBoundingClientRect();
  
        const relativeX = clickedX - boundingBox.left;
        const relativeY = clickedY - boundingBox.top;
  
        const cellWidth = playerGameboard.querySelector('.board-cell').offsetWidth;
        const cellHeight = playerGameboard.querySelector('.board-cell').offsetHeight;
  
        const clickedRow = Math.floor(relativeY / cellHeight);
        const clickedCol = Math.floor(relativeX / cellWidth);
  
        const initialCell = playerGameboard.querySelector(`[data-row='${clickedRow}'][data-col='${clickedCol}']`);
  
        if (initialCell){
          initialRow = clickedRow;
          initialCol = clickedCol;
        }
        else{
          initialRow = null;
          initialCol = null;
        }
      });
  
      draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging');
        initialRow = null;
        initialCol = null;
      });
    });

    const container = document.querySelector('.player-gameboard');
  
    container.addEventListener('dragover', (event) => {
      event.preventDefault();
    });
  
    container.addEventListener('drop', (event) => {
      event.preventDefault();
      const draggable = document.querySelector('.dragging');
  
      const boardCellSize = container.querySelector('.board-cell').getBoundingClientRect();
      const targetRow = Math.floor((event.clientY - container.getBoundingClientRect().top) / boardCellSize.height);
      const targetCol = Math.floor((event.clientX - container.getBoundingClientRect().left) / boardCellSize.width);
  
      const targetCell = container.querySelector(`[data-row='${targetRow}'][data-col='${targetCol}']`);
  
      if (draggable && targetCell) {
        if (initialRow !== null && initialCol !== null) {
          const rowOffset = targetRow - initialRow;
          const colOffset = targetCol - initialCol;
          const playerGameboard = gameLoop.getPlayerGameboard();
          const newStart = playerGameboard.updateShipCoordinates(initialRow, initialCol, rowOffset, colOffset);
  
          if (!newStart)
            return;
  
          const realTarget = document.querySelector(`.player-gameboard > [data-row='${newStart[0]}'][data-col='${newStart[1]}']`);
  
          if (realTarget !== draggable.parentNode){
            realTarget.appendChild(draggable);
          }
        }
      }
    });

    draggables.forEach((draggable) => {
      draggable.addEventListener('click', (event) => {
        event.stopPropagation();
        const playerGameboard = gameLoop.getPlayerGameboard();
        const targetCell = event.target.closest('.board-cell');
        const targetRow = parseInt(targetCell.dataset.row, 10);
        const targetCol = parseInt(targetCell.dataset.col, 10);
        const newCoordinatesArray = playerGameboard.rotateShip(targetRow, targetCol);
        
        if (!newCoordinatesArray) {
          event.target.classList.add('shake');
          return;
        }
        targetCell.textContent = '';
        clearGameBoard();
        renderShips();
        
        shipManagementEventListeners();
        //setUpShipsDraggableEventListener();
        //setUpRotateShipEventListener();
      });
    });
  }
  function setUpGame() {
    createGrids();
    gameLoop.resetComputer();
    printNames();
    printMessage();
    populateGameboard();
    setUpAllEventListeners();
    toggleGameboardEventListenerStatus();
  }
  
  const setUpNameSubmitEventListener = () => {
    const submitButton = document.querySelector('.submit-button');
    const input = document.querySelector('.name-input');
    submitButton.addEventListener('click', (event) => {
      event.preventDefault();
      const name = input.value;
      
      if (name === '')
        gameLoop.createPlayers();
      else
        gameLoop.createPlayers(name);
      
      setUpGame();
      showGameContent();
    });
  };
  
  return {printMessage, updatePlayerGameboard, updateComputerGameboard, setUpNameSubmitEventListener, toggleGameboardEventListenerStatus, toggleButtonSectionDisplay};
  })();

export default manageInterface;