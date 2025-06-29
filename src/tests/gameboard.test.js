import Gameboard from "../gameboard.js";

describe("Gameboard", () => {
  let gameboard;

  beforeEach(() => {
    gameboard = Gameboard();
  });

  test("places a ship and occupies correct cells", () => {
    gameboard.placeShip(0, 0, 3);
    expect(gameboard.board[0][0]).toBeTruthy();
    expect(gameboard.board[0][1]).toBeTruthy();
    expect(gameboard.board[0][2]).toBeTruthy();
  });

  test("throws error on invalid ship placement", () => {
    gameboard.placeShip(0, 0, 3);
    expect(() => gameboard.placeShip(0, 1, 3)).toThrow(
      "Invalid ship placement"
    );
  });

  test("records hit and miss correctly", () => {
    gameboard.placeShip(0, 0, 2);
    gameboard.receiveAttack(0, 0);
    expect(gameboard.board[0][0].hits).toBe(1);
    gameboard.receiveAttack(5, 5);
    expect(gameboard.missedShots).toContainEqual([5, 5]);
  });

  test("reports all ships sunk correctly", () => {
    gameboard.placeShip(0, 0, 1);
    expect(gameboard.allShipsSunk()).toBe(false);
    gameboard.receiveAttack(0, 0);
    expect(gameboard.allShipsSunk()).toBe(true);
  });
});
