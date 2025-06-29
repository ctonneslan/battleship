import Ship from "./ship.js";

export default function Gameboard() {
  const size = 10;
  // Each cell is either null or { ship: Ship, isHit: boolean }
  const board = Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));
  const missedShots = [];
  const ships = [];

  function placeShip(x, y, length, direction = "horizontal") {
    const positions = [];
    for (let i = 0; i < length; i++) {
      const row = direction === "horizontal" ? x : x + i;
      const col = direction === "horizontal" ? y + i : y;
      if (row >= size || col >= size || board[row][col]) {
        throw new Error("Invalid ship placement");
      }
      positions.push([row, col]);
    }
    const ship = Ship(length);
    ships.push({ ship, positions });
    positions.forEach(([r, c]) => {
      board[r][c] = { ship, isHit: false };
    });
  }

  function receiveAttack(x, y) {
    const cell = board[x][y];
    if (cell && cell.ship) {
      if (!cell.isHit) {
        cell.isHit = true;
        cell.ship.hit();
      }
    } else {
      // Avoid recording duplicate missed shots
      if (!missedShots.some(([mx, my]) => mx === x && my === y)) {
        missedShots.push([x, y]);
      }
    }
  }

  function allShipsSunk() {
    return ships.every(({ ship }) => ship.isSunk());
  }

  return {
    placeShip,
    receiveAttack,
    allShipsSunk,
    get missedShots() {
      return missedShots;
    },
    get board() {
      return board;
    },
  };
}
