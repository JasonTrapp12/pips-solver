import type { ICell } from "./Cell";
import type { IDomino } from "./Domino";
import type { IGroup } from "./Group";

export interface IGameState {
  cells: ICell[][];
  groups: IGroup[];
  dominos: IDomino[];
}
