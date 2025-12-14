import type { ICell } from "./Cell";

export interface IGroup {
  id: string;
  rule: IRule;
  cells: ICell[];
  outlineColor: string;
}

export interface IRule {
  operator: string;
  value: number;
}

export const defaultRule: IRule = {
  operator: "",
  value: 0,
};

export const defaultGroup: IGroup = {
  id: "",
  rule: defaultRule,
  cells: [],
  outlineColor: "",
};
