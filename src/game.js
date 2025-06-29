import Player from "./player.js";

export default function GameManager() {
  const player = Player("You");
  const computer = Player("Computer", true);
  const shipsToPlace = [5, 4, 3, 3, 2]; // typical battleship lengths
  let currentShipIndex = 0;
  let placingOrientation = "horizontal"; // can toggle later
  let gameStarted = false;
  let currentPlayer = player;

  function placePlayerShip(x, y) {
    if (gameStarted) return false;
    if (currentShipIndex >= shipsToPlace.length) return false;

    try {
      player.gameboard.placeShip(
        x,
        y,
        shipsToPlace[currentShipIndex],
        placingOrientation
      );
      currentShipIndex++;
      return true;
    } catch {
      return false;
    }
  }

  function allShipsPlaced() {
    return currentShipIndex >= shipsToPlace.length;
  }

  function startGame() {
    if (!allShipsPlaced()) return false;
    gameStarted = true;

    // Place computer ships randomly (simple example)
    const compShipLengths = [...shipsToPlace];
    while (compShipLengths.length) {
      const length = compShipLengths.pop();
      let placed = false;
      while (!placed) {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        const orientation = Math.random() > 0.5 ? "horizontal" : "vertical";
        try {
          computer.gameboard.placeShip(x, y, length, orientation);
          placed = true;
        } catch {
          // retry
        }
      }
    }
  }

  // (Keep playerMove, switchTurn, endGame as before...)

  function playerMove(x, y) {
    if (!gameStarted) return false;
    if (currentPlayer !== player) return false;
    if (!player.attack(computer, x, y)) return false;

    if (computer.gameboard.allShipsSunk()) {
      endGame("Player");
      return true;
    }

    switchTurn();

    setTimeout(() => {
      computer.computerAttack(player);
      if (player.gameboard.allShipsSunk()) {
        endGame("Computer");
        return;
      }
      switchTurn();
    }, 500);
    return true;
  }

  function switchTurn() {
    currentPlayer = currentPlayer === player ? computer : player;
  }

  let onGameEndCallback = null;

  function endGame(winner) {
    if (onGameEndCallback) onGameEndCallback(winner);
  }

  function setEndGameCallback(callback) {
    onGameEndCallback = callback;
  }

  function toggleOrientation() {
    placingOrientation =
      placingOrientation === "horizontal" ? "vertical" : "horizontal";
  }

  return {
    player,
    computer,
    placePlayerShip,
    allShipsPlaced,
    startGame,
    playerMove,
    toggleOrientation,
    setEndGameCallback,
    get placingOrientation() {
      return placingOrientation;
    },
    get currentShipLength() {
      return shipsToPlace[currentShipIndex];
    },
    get gameStarted() {
      return gameStarted;
    },
    get currentPlayer() {
      return currentPlayer;
    },
  };
}
