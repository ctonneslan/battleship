import Player from "../player.js";

describe("Player", () => {
  let player1, player2;

  beforeEach(() => {
    player1 = Player("Alice");
    player2 = Player("Bob");
  });

  test("attacks opponent and records coordinate", () => {
    const result = player1.attack(player2, 1, 1);
    expect(result).toBe(true);
    expect(player1.attacksMade).toContain("1,1");
  });

  test("prevents attacking same spot twice", () => {
    player1.attack(player2, 2, 2);
    const result = player1.attack(player2, 2, 2);
    expect(result).toBe(false);
    expect(player1.attacksMade.filter((c) => c === "2,2").length).toBe(1);
  });

  test("computer makes only legal random attacks", () => {
    const computer = Player("Computer", true);
    for (let i = 0; i < 100; i++) {
      computer.computerAttack(player1);
    }
    const uniqueCoords = new Set(computer.attacksMade);
    expect(uniqueCoords.size).toBe(computer.attacksMade.length);
  });
});
