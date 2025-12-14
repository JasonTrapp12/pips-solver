import type { ICell } from "./models/Cell";
import type { IDomino } from "./models/Domino";
import type { IGameState } from "./models/GameState";
import type { IGroup } from "./models/Group";

interface IMove {
  domino: IDomino;
  a: number;
  b: number;
  cellA: ICell;
  cellB: ICell;
}

interface IApplyMoveProps {
  move: IMove;
  gameState: IGameState;
}
const applyMove = ({ move, gameState }: IApplyMoveProps) => {
  const cellA = move.cellA;
  const cellB = move.cellB;

  if (cellA && cellB) {
    cellA.value = move.a;
    cellB.value = move.b;
    move.domino.used = true;
  }

  return gameState;
};

interface IUndoMoveProps {
  move: IMove;
  gameState: IGameState;
}
const undoMove = ({ move, gameState }: IUndoMoveProps) => {
  const cellA = move.cellA;
  const cellB = move.cellB;

  if (cellA && cellB) {
    cellA.value = null;
    cellB.value = null;
    move.domino.used = false;
  }

  return gameState;
};

interface IIsValidMoveProps {
  move: IMove;
  gameState: IGameState;
  isSolvedCheck: boolean;
}
const isValidMove = ({ move, gameState, isSolvedCheck }: IIsValidMoveProps) => {
  const cellA = move.cellA;
  const cellB = move.cellB;

  if (!cellA || !cellB) {
    return false;
  }

  if (!cellA.on || !cellB.on) {
    return false;
  }

  if (cellA.value !== null || cellB.value !== null) {
    return false;
  }

  const newGameState = applyMove({ move, gameState });
  const groups = newGameState.groups;
  const groupA = groups.find((group) =>
    group.cells.some((cell) => cell === cellA)
  );
  const groupB = groups.find((group) =>
    group.cells.some((cell) => cell === cellB)
  );

  switch (groupA?.rule.operator) {
    case "=":
      if (!checkEqual({ group: groupA, isSolvedCheck: isSolvedCheck })) {
        undoMove({ move, gameState: newGameState });
        return false;
      }
      break;
    case "≠":
      if (!checkNotEqual({ group: groupA, isSolvedCheck: isSolvedCheck })) {
        undoMove({ move, gameState: newGameState });
        return false;
      }
      break;
    case ">":
      if (!checkGreaterThan({ group: groupA, isSolvedCheck: isSolvedCheck })) {
        undoMove({ move, gameState: newGameState });
        return false;
      }
      break;
    case "<":
      if (!checkLessThan({ group: groupA, isSolvedCheck: isSolvedCheck })) {
        undoMove({ move, gameState: newGameState });
        return false;
      }
      break;
    case "+":
      if (!checkAddUp({ group: groupA, isSolvedCheck: isSolvedCheck })) {
        undoMove({ move, gameState: newGameState });
        return false;
      }
  }
  switch (groupB?.rule.operator) {
    case "=":
      if (!checkEqual({ group: groupB, isSolvedCheck: isSolvedCheck })) {
        undoMove({ move, gameState: newGameState });
        return false;
      }
      break;
    case "≠":
      if (!checkNotEqual({ group: groupB, isSolvedCheck: isSolvedCheck })) {
        undoMove({ move, gameState: newGameState });
        return false;
      }
      break;
    case ">":
      if (!checkGreaterThan({ group: groupB, isSolvedCheck: isSolvedCheck })) {
        undoMove({ move, gameState: newGameState });
        return false;
      }
      break;
    case "<":
      if (!checkLessThan({ group: groupB, isSolvedCheck: isSolvedCheck })) {
        undoMove({ move, gameState: newGameState });
        return false;
      }
      break;
  }
  undoMove({ move, gameState: newGameState });
  return true;
};

interface IChecksProps {
  group: IGroup;
  isSolvedCheck: boolean;
}

export const checkEqual = ({ group, isSolvedCheck }: IChecksProps) => {
  if (isSolvedCheck && group.cells.some((cell) => cell.value === null)) {
    return false;
  }

  const targetCell = group.cells.find((cell) => cell.value !== null);
  if (!targetCell && !isSolvedCheck) {
    return true;
  }

  for (const cell of group.cells) {
    if (cell.value !== null && cell.value !== targetCell!.value) {
      return false;
    }
  }
  return true;
};

export const checkNotEqual = ({ group, isSolvedCheck }: IChecksProps) => {
  if (isSolvedCheck && group.cells.some((cell) => cell.value === null)) {
    return false;
  }

  const values = group.cells
    .filter((cell) => cell.value !== null)
    .map((cell) => cell.value as number);

  return new Set(values).size === values.length;
};

export const checkGreaterThan = ({ group, isSolvedCheck }: IChecksProps) => {
  if (isSolvedCheck && group.cells.some((cell) => cell.value === null)) {
    return false;
  }

  if (isSolvedCheck) {
    let total = 0;
    group.cells.forEach((cell) => {
      total += cell.value!;
    });

    return total > group.rule.value;
  }
  return true;
};

export const checkLessThan = ({ group, isSolvedCheck }: IChecksProps) => {
  if (isSolvedCheck && group.cells.some((cell) => cell.value === null)) {
    return false;
  }

  let total = 0;
  group.cells.forEach((cell) => {
    total += cell.value!;
  });

  return total < group.rule.value;
};

export const checkAddUp = ({ group, isSolvedCheck }: IChecksProps) => {
  if (isSolvedCheck && group.cells.some((cell) => cell.value === null)) {
    return false;
  }
  let total = 0;
  group.cells.forEach((cell) => {
    total += cell.value!;
  });

  if (total > group.rule.value) {
    return false;
  }

  if (isSolvedCheck && total !== group.rule.value) {
    return false;
  }
  return true;
};

const isSolved = (gameState: IGameState): boolean => {
  if (!gameState.cells.flat().every((c) => !c.on || c.value !== null)) {
    return false;
  }
  for (const group of gameState.groups) {
    switch (group.rule.operator) {
      case "=":
        if (!checkEqual({ group, isSolvedCheck: true })) return false;
        break;
      case "≠":
        if (!checkNotEqual({ group, isSolvedCheck: true })) return false;
        break;
      case ">":
        if (!checkGreaterThan({ group, isSolvedCheck: true })) return false;
        break;
      case "<":
        if (!checkLessThan({ group, isSolvedCheck: true })) return false;
        break;
      case "+":
        if (!checkAddUp({ group, isSolvedCheck: true })) return false;
        break;
    }
  }
  return true;
};

const getAdjacentEmptyCells = (cell: ICell, gameState: IGameState): ICell[] => {
  const deltas = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 },
  ];

  const result: ICell[] = [];

  for (const { dr, dc } of deltas) {
    const r = cell.row + dr;
    const c = cell.col + dc;

    const row = gameState.cells[r];
    if (!row) continue;

    const neighbor = row[c];
    if (!neighbor) continue;

    if (neighbor.on && neighbor.value === null) {
      result.push(neighbor);
    }
  }

  return result;
};

export const printBoard = (gameState: IGameState) => {
  const output = gameState.cells.map((row) =>
    row
      .map((cell) => {
        if (!cell.on) return "·";
        if (cell.value === null) return "_";
        return cell.value.toString();
      })
      .join(" ")
  );

  console.log(output.join("\n"));
};

const findBestCell = (gameState: IGameState): ICell | null => {
  let best: ICell | null = null;
  let bestCount = Infinity;

  for (const cell of gameState.cells.flat()) {
    if (!cell.on || cell.value !== null) continue;

    const neighbors = getAdjacentEmptyCells(cell, gameState);
    if (neighbors.length < bestCount) {
      best = cell;
      bestCount = neighbors.length;
    }
  }

  return best;
};

export const solve = async (gameState: IGameState): Promise<boolean> => {
  if (isSolved(gameState)) {
    printBoard(gameState);
    return true;
  }

  const cellA = findBestCell(gameState);
  if (!cellA) return false;

  const neighbors = getAdjacentEmptyCells(cellA, gameState);

  for (const cellB of neighbors) {
    for (const domino of gameState.dominos) {
      if (domino.used) continue;

      const moves: IMove[] =
        domino.first === domino.second
          ? [{ domino, a: domino.first, b: domino.second, cellA, cellB }]
          : [
              { domino, a: domino.first, b: domino.second, cellA, cellB },
              { domino, a: domino.second, b: domino.first, cellA, cellB },
            ];

      for (const move of moves) {
        if (!isValidMove({ move, gameState, isSolvedCheck: false })) {
          continue;
        }

        applyMove({ move, gameState });

        if (await solve(gameState)) {
          return true;
        }

        undoMove({ move, gameState });
      }
    }
  }
  return false;
};
