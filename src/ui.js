import GameManager from "./game.js";

const game = GameManager();

const playerBoardEl = document.getElementById("player-board");
const computerBoardEl = document.getElementById("computer-board");

const infoEl = document.getElementById("info");
const toggleOrientBtn = document.getElementById("toggle-orientation");
const startGameBtn = document.getElementById("start-game");

function createBoard(container, isEnemy = false) {
  container.innerHTML = "";
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.x = x;
      cell.dataset.y = y;

      if (isEnemy) {
        cell.addEventListener("click", () => {
          if (!game.gameStarted) return;
          if (game.currentPlayer.name !== "You") return;

          if (game.playerMove(x, y)) {
            renderBoards();
          }
        });
      } else {
        // Player board click is for ship placement if game not started
        cell.addEventListener("click", () => {
          if (game.gameStarted) return;
          if (game.placePlayerShip(x, y)) {
            renderBoards();
            updateInfo();
          }
        });
      }

      container.appendChild(cell);
    }
  }
}

function renderBoards() {
  const playerBoard = game.player.gameboard.board;
  const computerBoard = game.computer.gameboard.board;
  const computerMissed = game.computer.gameboard.missedShots;
  const playerMissed = game.player.gameboard.missedShots;

  // Render player board
  Array.from(playerBoardEl.children).forEach((cellEl) => {
    const x = +cellEl.dataset.x;
    const y = +cellEl.dataset.y;
    const cell = playerBoard[x][y];

    cellEl.className = "cell"; // reset classes

    if (cell?.ship) cellEl.classList.add("ship");
    if (cell?.isHit) cellEl.classList.add("hit");
    if (playerMissed.some(([mx, my]) => mx === x && my === y)) {
      cellEl.classList.add("miss");
    }
  });

  // Render computer board
  Array.from(computerBoardEl.children).forEach((cellEl) => {
    const x = +cellEl.dataset.x;
    const y = +cellEl.dataset.y;
    const cell = computerBoard[x][y];

    cellEl.className = "cell"; // reset classes

    // Don't reveal ships on computer board (for player)
    // Only show hit/miss feedback
    if (cell?.isHit) cellEl.classList.add("hit");
    if (computerMissed.some(([mx, my]) => mx === x && my === y)) {
      cellEl.classList.add("miss");
    }
  });
}

function updateInfo() {
  gameMessageEl.textContent = "";
  if (!game.gameStarted) {
    infoEl.textContent = `Place ship length: ${game.currentShipLength} (Orientation: ${game.placingOrientation})`;
    startGameBtn.disabled = !game.allShipsPlaced();
  } else {
    infoEl.textContent = `Game in progress. Current turn: ${game.currentPlayer.name}`;
    startGameBtn.disabled = true;
  }
}

toggleOrientBtn.addEventListener("click", () => {
  game.toggleOrientation();
  updateInfo();
});

startGameBtn.addEventListener("click", () => {
  if (!game.allShipsPlaced()) return;
  game.startGame();
  renderBoards();
  updateInfo();
});

function init() {
  createBoard(playerBoardEl);
  createBoard(computerBoardEl, true);
  updateInfo();
  renderBoards();
}

const gameMessageEl = document.getElementById("game-message");
const restartButton = document.getElementById("restart-button");

function resetGame() {
  window.location.reload(); // Simple and clean for now
}

game.setEndGameCallback((winner) => {
  gameMessageEl.textContent = `${winner} wins!`;
  computerBoardEl.querySelectorAll(".cell").forEach((cell) => {
    cell.style.pointerEvents = "none"; // disable interaction
  });
  startGameBtn.disabled = true;
  toggleOrientBtn.disabled = true;
});

restartButton.addEventListener("click", resetGame);

init();
