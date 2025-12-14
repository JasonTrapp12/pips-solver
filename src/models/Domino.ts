// models/Domino.ts
export interface IDomino {
  id: string; // unique identifier
  first: number; // first number
  second: number; // second number
  used: boolean;
}

export const defaultDomino: IDomino = {
  id: "",
  first: 0,
  second: 0,
  used: false,
};
