import { Cell } from '../types/Board';

interface RowProps {
  index: number;
  boardRow: Cell[];
  dispatch: any;
  win: boolean;
  socket: any;
}

const Row: React.FC<RowProps> = ({ boardRow, socket, index, win }) => {
  const row = boardRow;
  function computeStyle(arrayValue: Cell) {
    if (arrayValue === null) return '';
    if (arrayValue[0] == '9')
      return arrayValue[2] == 'o' ? 'bg-blue-500' : 'bg-green-500';
    return arrayValue == 'one' ? 'bg-blue-600' : 'bg-green-600';
  }

  /*
    onClick function
    In this upon click I call the setGame function passed down from the App.jsx file which changes or calls the things in 
    main 'game' object. 
    Upon Calling it I pass the column to addTile function.
  */

  return (
    <div
      className="flex flex-col my-[10px] bg-[#a4a6a7] hover:bg-sky-700"
      onClick={() => {
        const roomName = window.location.pathname.substring(6);
        socket.emit('add_tile', index, roomName);
        // console.log('Clicked Once');
        // dispatch({
        //   type: ACTION_TYPE.ADD_TILE,
        //   payload: index,
        // });
      }}
    >
      {row.map((boardCell, columnIndex) => {
        return (
          <div
            key={columnIndex}
            className="h-[90px] bg-white m-[10px] w-[90px]"
          >
            <div
              className={
                (win && boardCell && boardCell[0] != '9' ? 'opacity-50' : '') +
                ' h-full rounded-[35%]' +
                ' ' +
                computeStyle(boardCell)
              }
            />
          </div>
        );
      })}
    </div>
  );
};

export default Row;
