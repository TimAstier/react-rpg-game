import { Reducer } from 'react';

import { GRID_HEIGHT, GRID_WIDTH } from '../constants/config';
import { CellTile } from '../typings/cell';
import { MoveDirection } from '../typings/moveDirection';
import { Position } from '../typings/position';

// ACTIONS

export type GameAction =
  | { type: '@@GAME/MOVE_PLAYER'; direction: MoveDirection }
  | { type: '@@GAME/SET_CURRENT_MAP'; currentMap: CellTile[][] }
  | { type: '@@GAME/INIT_PLAYER_SPAWN'; playerSpawn: Position };

const movePlayer = (direction: MoveDirection): GameAction => ({
  type: '@@GAME/MOVE_PLAYER',
  direction,
});

const setCurrentMap = (currentMap: CellTile[][]): GameAction => ({
  type: '@@GAME/SET_CURRENT_MAP',
  currentMap,
});

const initPlayerSpawn = (playerSpawn: Position): GameAction => ({
  type: '@@GAME/INIT_PLAYER_SPAWN',
  playerSpawn,
});

export const gameActions = {
  movePlayer,
  setCurrentMap,
  initPlayerSpawn,
};

// INITIAL_STATE

export interface GameState {
  currentMap: CellTile[][] | null;
  moveDirection: MoveDirection;
  playerPosition: Position;
  playerPreviousPosition: Position;
  shouldPlayerAnimate: boolean;
}

export const INITIAL_STATE: GameState = {
  currentMap: null,
  moveDirection: 'Right',
  playerPosition: [0, 0],
  playerPreviousPosition: [0, 0],
  shouldPlayerAnimate: false,
};

// REDUCER

const reduceMovePlayer = (state = INITIAL_STATE, moveDirection: MoveDirection) => {
  let nextTileX: number;
  let nextTileY: number;
  let nextTile: CellTile;

  if (state.currentMap === null) {
    return state;
  }

  const moveToNewPosition = (tile: Position) => {
    return {
      ...state,
      moveDirection,
      playerPosition: tile,
      playerPreviousPosition: state.playerPosition,
      shouldPlayerAnimate: true,
    };
  };

  const moveAndStayAtSamePosition = () => ({ ...state, moveDirection, shouldPlayerAnimate: false });

  switch (moveDirection) {
    case 'Left':
      nextTileX =
        state.playerPosition[0] > 0 ? state.playerPosition[0] - 1 : state.playerPosition[0];
      nextTileY = state.playerPosition[1];
      nextTile = state.currentMap[nextTileY][nextTileX];

      if (state.playerPosition[0] > 0 && nextTile !== 'X') {
        return moveToNewPosition([nextTileX, nextTileY]);
      }
      return moveAndStayAtSamePosition();

    case 'Right':
      nextTileX =
        state.playerPosition[0] < GRID_WIDTH
          ? state.playerPosition[0] + 1
          : state.playerPosition[0];
      nextTileY = state.playerPosition[1];

      nextTile = state.currentMap[nextTileY][nextTileX];

      if (state.playerPosition[0] < GRID_WIDTH - 1 && nextTile !== 'X') {
        return moveToNewPosition([nextTileX, nextTileY]);
      }
      return moveAndStayAtSamePosition();

    case 'Up':
      nextTileX = state.playerPosition[0];
      nextTileY =
        state.playerPosition[1] > 0 ? state.playerPosition[1] - 1 : state.playerPosition[1];
      nextTile = state.currentMap[nextTileY][nextTileX];

      if (state.playerPosition[1] > 0 && nextTile !== 'X') {
        return moveToNewPosition([nextTileX, nextTileY]);
      }
      return moveAndStayAtSamePosition();

    case 'Down':
      nextTileX = state.playerPosition[0];
      nextTileY =
        state.playerPosition[1] < GRID_HEIGHT - 1
          ? state.playerPosition[1] + 1
          : state.playerPosition[1];
      nextTile = state.currentMap[nextTileY][nextTileX];

      if (state.playerPosition[1] < GRID_HEIGHT - 1 && nextTile !== 'X') {
        return moveToNewPosition([nextTileX, nextTileY]);
      }
      return moveAndStayAtSamePosition();

    default:
      return state;
  }
};

export const game: Reducer<GameState, GameAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case '@@GAME/MOVE_PLAYER':
      return reduceMovePlayer(state, action.direction);
    case '@@GAME/SET_CURRENT_MAP':
      return { ...state, currentMap: action.currentMap };
    case '@@GAME/INIT_PLAYER_SPAWN':
      return {
        ...state,
        playerPosition: action.playerSpawn,
        playerPreviousPosition: action.playerSpawn,
      };
    default:
      return INITIAL_STATE;
  }
};
