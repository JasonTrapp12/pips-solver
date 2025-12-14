import { create } from "zustand";
import { defaultCell, type ICell } from "../models/Cell";
import { defaultGroup, type IGroup, type IRule } from "../models/Group";
import { v4 as uuidv4 } from "uuid";
import { getNextGroupColor } from "../hooks/GroupColors";
import type { IDomino } from "../models/Domino";
import { solve } from "../Solver";

export const GRID_SIZE = 12;

type IBoardStore = {
  cells: ICell[][];
  phase:
    | "Selecting Cells"
    | "Selecting Cell Groups"
    | "Creating Rules"
    | "Creating Dominos"
    | "Solving"
    | "Solved"
    | "Failed";
  selectedCells: ICell[];
  groups: IGroup[];
  toggleCell: (row: number, col: number) => void;

  currentGroup: IGroup;
  startGroup: (cell: ICell) => void;
  addCellToGroup: (cell: ICell) => void;
  finishGroup: () => void;
  isDragging: boolean;

  setGroupRule: (groupId: string, rule: IRule) => void;

  requestNext: () => void;
  completePhase: (failed?: boolean) => void;
  nextRequested: boolean;

  requestUndo: () => void;

  dominos: IDomino[];
  addDomino: (first: number, second: number) => void;
  clearDominos: () => void;
};

export const useBoardStore = create<IBoardStore>((set) => ({
  cells: Array.from({ length: GRID_SIZE }, (_, rowIndex) =>
    Array.from({ length: GRID_SIZE }, (_, colIndex) => ({
      ...defaultCell,
      row: rowIndex,
      col: colIndex,
    }))
  ),

  phase: "Selecting Cells",
  selectedCells: [],
  groups: [],
  currentGroup: defaultGroup,
  dominos: [],
  isDragging: false,
  nextRequested: false,

  toggleCell: (row, col) =>
    set((state) => {
      const cell = state.cells[row][col];

      switch (state.phase) {
        case "Selecting Cells":
          const newCells = state.cells.map((r) => r.map((c) => ({ ...c })));
          newCells[row][col].on = !newCells[row][col].on;
          return { cells: newCells };

        default:
          return state;
      }
    }),

  startGroup: (cell) =>
    set((state) => {
      const alreadyGrouped = state.groups.some((group) =>
        group.cells.includes(cell)
      );
      if (alreadyGrouped) {
        return state;
      }
      return {
        currentGroup: {
          ...defaultGroup,
          id: uuidv4(),
          cells: [cell],
          outlineColor: getNextGroupColor(),
        },
        isDragging: true,
      };
    }),

  addCellToGroup: (cell: ICell) =>
    set((state) => ({
      currentGroup: {
        ...state.currentGroup,
        cells: state.currentGroup.cells.includes(cell)
          ? state.currentGroup.cells
          : [...state.currentGroup.cells, cell],
      },
    })),

  finishGroup: () =>
    set((state) => {
      if (state.currentGroup.cells.length === 0) {
        return {
          isDragging: false,
          currentGroup: { ...defaultGroup, id: uuidv4(), cells: [] },
        };
      }

      return {
        groups: [...state.groups, state.currentGroup],
        currentGroup: { ...defaultGroup, id: uuidv4(), cells: [] },
        isDragging: false,
      };
    }),

  setGroupRule: (groupId, rule) => {
    set((state) => ({
      groups: state.groups.map((g) =>
        g.id === groupId ? { ...g, rule: { ...rule } } : g
      ),
    }));
  },

  addDomino: (first, second) =>
    set((state) => ({
      dominos: [...state.dominos, { id: uuidv4(), first, second, used: false }],
    })),
  clearDominos: () => set({ dominos: [] }),

  requestNext: () => {
    set({ nextRequested: true });
  },

  completePhase: (failed?) => {
    set((state) => {
      if (failed) return { phase: "Failed", nextRequested: false };
      switch (state.phase) {
        case "Selecting Cells":
          return { phase: "Selecting Cell Groups", nextRequested: false };
        case "Selecting Cell Groups":
          return { phase: "Creating Rules", nextRequested: false };
        case "Creating Rules":
          return { phase: "Creating Dominos", nextRequested: false };
        case "Creating Dominos":
          return { phase: "Solving", nextRequested: false };
        case "Solving":
          return { phase: "Solved", nextRequested: false };
        case "Solved":
          return { phase: "Selecting Cells", nextRequested: false };
        case "Failed":
          return { phase: "Selecting Cells", nextRequested: false };
      }
    });
  },

  requestUndo: () => {
    set((state) => {
      switch (state.phase) {
        case "Selecting Cell Groups": {
          if (state.groups.length === 0) return state;

          return {
            groups: state.groups.slice(0, -1),
          };
        }

        default:
          return state;
      }
    });
  },
}));
