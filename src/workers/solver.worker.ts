import type { IGameState } from "../models/GameState";
import { solve } from "../Solver";

self.onmessage = async (e: MessageEvent<IGameState>) => {
  const gameState = structuredClone(e.data);

  const solved = await solve(gameState);

  self.postMessage({
    type: "done",
    solved,
    gameState,
  });
};
