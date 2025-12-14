export interface ICell {
  on: boolean;
  row: number;
  col: number;
  value: number | null;
  domino: number | null;
}

export const defaultCell: ICell = {
  on: false,
  row: 0,
  col: 0,
  value: null,
  domino: null,
};
