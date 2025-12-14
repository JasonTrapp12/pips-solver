import { getNextGroupColor } from "./hooks/GroupColors";
import type { ICell } from "./models/Cell";
import type { IGroup } from "./models/Group";
import {
  checkAddUp,
  checkEqual,
  checkGreaterThan,
  checkLessThan,
  checkNotEqual,
} from "./Solver";
import { v4 as uuidv4 } from "uuid";

const makeCell = (value: number | null): ICell => ({
  on: true,
  row: 0,
  col: 0,
  value,
  domino: null,
});

const makeGroup = (
  values: Array<number | null>,
  operator: "=" | "≠" | ">" | "<" | "+",
  ruleValue = 0
): IGroup => ({
  cells: values.map(makeCell),
  rule: { operator, value: ruleValue },
  id: uuidv4(),
  outlineColor: getNextGroupColor(),
});

const test = (name: string, fn: () => boolean) => {
  try {
    const result = fn();
    console.log(`${result ? "✅" : "❌"} ${name}`);
  } catch (e) {
    console.log(`💥 ${name}`, e);
  }
};

// const testAsync = async (
//   name: string,
//   fn: () => Promise<boolean> | boolean
// ) => {
//   try {
//     const result = await fn();
//     console.log(`${result ? "✅" : "❌"} ${name}`);
//   } catch (e) {
//     console.log(`💥 ${name}`, e);
//   }
// };

test("checkEqual: partial group allowed during solve", () => {
  const group = makeGroup([1, null, null], "=");
  return checkEqual({ group, isSolvedCheck: false }) === true;
});

test("checkEqual: fails when values differ", () => {
  const group = makeGroup([1, 2], "=");
  return checkEqual({ group, isSolvedCheck: true }) === false;
});

test("checkEqual: succeeds when all equal", () => {
  const group = makeGroup([3, 3, 3], "=");
  return checkEqual({ group, isSolvedCheck: true }) === true;
});

test("checkNotEqual: allows partial group", () => {
  const group = makeGroup([1, null, 2], "≠");
  return checkNotEqual({ group, isSolvedCheck: false }) === true;
});

test("checkNotEqual: fails with duplicates", () => {
  const group = makeGroup([1, 2, 1], "≠");
  return checkNotEqual({ group, isSolvedCheck: true }) === false;
});

test("checkNotEqual: succeeds with all unique", () => {
  const group = makeGroup([1, 2, 3], "≠");
  return checkNotEqual({ group, isSolvedCheck: true }) === true;
});

test("checkGreaterThan: ignores partial during solve", () => {
  const group = makeGroup([2, null], ">", 5);
  return checkGreaterThan({ group, isSolvedCheck: false }) === true;
});

test("checkGreaterThan: succeeds when sum is greater", () => {
  const group = makeGroup([3, 4], ">", 5);
  return checkGreaterThan({ group, isSolvedCheck: true }) === true;
});

test("checkGreaterThan: fails when sum too small", () => {
  const group = makeGroup([2, 2], ">", 5);
  return checkGreaterThan({ group, isSolvedCheck: true }) === false;
});

test("checkLessThan: succeeds when sum is less", () => {
  const group = makeGroup([1, 2], "<", 5);
  return checkLessThan({ group, isSolvedCheck: true }) === true;
});

test("checkLessThan: fails when sum is equal or greater", () => {
  const group = makeGroup([3, 3], "<", 5);
  return checkLessThan({ group, isSolvedCheck: true }) === false;
});

test("checkAddUp: allows partial sum below target", () => {
  const group = makeGroup([2, null], "+", 5);
  return checkAddUp({ group, isSolvedCheck: false }) === true;
});

test("checkAddUp: fails if partial sum exceeds target", () => {
  const group = makeGroup([4, 3], "+", 5);
  return checkAddUp({ group, isSolvedCheck: false }) === false;
});

test("checkAddUp: succeeds when exact match", () => {
  const group = makeGroup([2, 3], "+", 5);
  return checkAddUp({ group, isSolvedCheck: true }) === true;
});

test("checkAddUp: fails when not exact at solve time", () => {
  const group = makeGroup([2, 2], "+", 5);
  return checkAddUp({ group, isSolvedCheck: true }) === false;
});

// testAsync("solve: test3.json solves successfully", async () => {
//   const gameState = structuredClone(test3 as IGameState);

//   const solved = await solve(gameState);

//   return solved === true;
// });
