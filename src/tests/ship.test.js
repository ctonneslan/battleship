import Ship from "../ship.js";

describe("Ship", () => {
  test("registers hits and reports sunk", () => {
    const ship = Ship(3);
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.hits).toBe(1);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
    // hits should not exceed length
    ship.hit();
    expect(ship.hits).toBe(3);
  });
});
