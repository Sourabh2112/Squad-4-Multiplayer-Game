import GameRender from './GameRender.js';
import gameLogic from './GameLogic.js';
import { useImmerReducer } from 'use-immer';
import { useEffect, useContext } from 'react';
// import { io } from 'socket.io-client';
// import { socket } from './sockets.js';
import { SocketContext } from '../context/socket.js';
import Board from '../types/Board.js';

// const socket = io('http://localhost:3000');
// const socket = '';

// socket.on('connect', () => {
//   console.log('connection established');
// });

function reverseArray(board: Board) {
  const reversedArray = Array.from(
    { length: board[0].length },
    (_, columnIndex) => {
      return board.map((row) => row[columnIndex]);
    }
  );
  return reversedArray;
}

export const ACTION_TYPE = {
  ADD_TILE: 'add_tile',
  SWITCH_PLAYER: 'switch_player',
  RESET_GAME: 'reset_game',
};

interface BoardState {
  board: Board;
  currentPlayer: string;
  win: boolean;
  draw: boolean;
  clickedTile: [null | number, null | number, null | string];
}

const initialState: BoardState = {
  board: [
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
  ],
  currentPlayer: 'one',
  win: false,
  draw: false,
  clickedTile: [null, null, null],
};

interface BoardAction {
  type: string;
  payload: number;
}

function reducer(state: BoardState, action: BoardAction) {
  switch (action.type) {
    case ACTION_TYPE.ADD_TILE: {
      const inverseArray = reverseArray(state.board);
      if (inverseArray[0][action.payload]) {
        return;
      }
      for (const [index, row] of inverseArray.entries()) {
        if (row[action.payload]) {
          inverseArray[index - 1][action.payload] = state.currentPlayer;
          state.clickedTile = [index - 1, action.payload, state.currentPlayer];
          break;
        }
        if (index == 5) {
          inverseArray[index][action.payload] = state.currentPlayer;
          state.clickedTile = [index, action.payload, state.currentPlayer];
        }
      }
      state.currentPlayer == 'one'
        ? (state.currentPlayer = 'two')
        : (state.currentPlayer = 'one');
      state.win = gameLogic.checkWin(
        inverseArray,
        state.clickedTile,
        state.win
      );
      state.draw = gameLogic.checkDraw(inverseArray, state.win);
      state.board = reverseArray(inverseArray);
      return state;
    }
    case ACTION_TYPE.RESET_GAME: {
      // state = initialState;
      // console.log(state);
      return initialState;
    }
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

interface GameProps {
  role: string;
  number: number;
}

const Game: React.FC<GameProps> = ({ role, number }) => {
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const socket = useContext(SocketContext);

  // useEffect(() => {
  //   socket.connect();
  //   socket.on('connect', () => {
  //     console.log('connection established');
  //   });

  //   return () => {
  //     socket.off('connect');
  //     socket.disconnect();
  //   };
  // }, []);

  useEffect(() => {
    socket.on('add_til', (columnIndex: number, roomToCheck: string) => {
      console.log(columnIndex);
      const roomName = window.location.pathname.substring(6);
      if (roomName == roomToCheck) addTile(columnIndex);
    });
    return () => {
      socket.off('add_til');
    };
  }, [socket]);

  function addTile(columnIndex: number) {
    dispatch({
      type: ACTION_TYPE.ADD_TILE,
      payload: columnIndex,
    });
  }

  console.log(role, number);

  return (
    <>
      <GameRender
        board={state.board}
        dispatch={dispatch}
        win={state.win}
        socket={socket}
      />
      <button
        className="bg-red-500"
        onClick={() => dispatch({ type: ACTION_TYPE.RESET_GAME, payload: 0 })}
      >
        RESET
      </button>
    </>
  );
};

export default Game;
