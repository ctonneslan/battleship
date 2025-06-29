export default function Ship(length) {
  let hits = 0;
  return {
    length,
    hit() {
      if (hits < length) hits++;
    },
    isSunk() {
      return hits >= length;
    },
    get hits() {
      return hits;
    },
  };
}
