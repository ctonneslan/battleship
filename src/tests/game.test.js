import GameManager from "../game.js";

describe("GameManager", () => {
  let game;

  beforeEach(() => {
    game = GameManager();
    game.startGame();
  });

  test("starts with player turn", () => {
    expect(game.currentPlayer.name).toBe("You");
  });

  test("player can attack computer", () => {
    // Player attacks coordinate (0,0) where computer ship is placed
    const attacked = game.playerMove(0, 0);
    expect(attacked).not.toBe(false);
  });

  test("does not allow player to move out of turn", () => {
    // Player attacks once, then tries again immediately
    game.playerMove(0, 0);
    // Current turn should be computer now
    expect(game.currentPlayer.name).toBe("Computer");

    // Player tries to attack again during computer's turn
    const result = game.playerMove(1, 1);
    expect(result).toBeUndefined(); // returns nothing (move ignored)
  });

  test("switches turn after player move and computer move", (done) => {
    game.playerMove(0, 0);
    // After player move, currentPlayer switches to computer
    expect(game.currentPlayer.name).toBe("Computer");

    // Wait for computer move (500ms timeout)
    setTimeout(() => {
      expect(game.currentPlayer.name).toBe("You");
      done();
    }, 600);
  });

  test("ends game when all ships sunk", () => {
    // Manually sink all computer ships for test
    game.computer.gameboard.board.forEach((row) => {
      row.forEach((cell) => {
        if (cell) {
          for (let i = 0; i < cell.length; i++) {
            cell.hit();
          }
        }
      });
    });

    // Spy on alert
    global.alert = jest.fn();

    // Player attacks to trigger game end check
    game.playerMove(9, 9);

    expect(global.alert).toHaveBeenCalledWith("Player wins!");
  });
});
