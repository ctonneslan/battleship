import Gameboard from "./gameboard.js";

export default function Player(name = "Player", isComputer = false) {
  const gameboard = Gameboard();
  const attacksMade = new Set();

  function attack(opponent, x, y) {
    const key = `${x},${y}`;
    if (attacksMade.has(key)) return false; // prevent duplicate attack
    opponent.gameboard.receiveAttack(x, y);
    attacksMade.add(key);
    return true;
  }

  function getRandomCoord() {
    return [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
  }

  function computerAttack(opponent) {
    let x, y, key;
    do {
      [x, y] = getRandomCoord();
      key = `${x},${y}`;
    } while (attacksMade.has(key));
    return attack(opponent, x, y);
  }

  return {
    name,
    isComputer,
    gameboard,
    attack,
    computerAttack,
    get attacksMade() {
      return Array.from(attacksMade);
    },
  };
}
