import Board from '../types/Board';
import Row from './Row';

interface GameRenderProps {
  board: Board;
  dispatch: any;
  win: boolean;
  socket: any;
}

const GameRender: React.FC<GameRenderProps> = ({
  board,
  dispatch,
  win,
  socket,
}) => {
  // props.board.forEach((value) => <Cell columns={value} />);

  return (
    <div className="flex  ">
      {board.map((boardRow, rowIndex) => {
        return (
          <Row
            key={rowIndex}
            index={rowIndex}
            boardRow={boardRow}
            dispatch={dispatch}
            win={win}
            socket={socket}
          />
        );
      })}
    </div>
  );
};

export default GameRender;
