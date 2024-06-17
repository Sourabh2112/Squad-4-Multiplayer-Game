import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Game from './Game.js';
import { SocketContext } from '../context/socket.js';

// const socket = '';

export default function App() {
  const { roomName } = useParams();
  const [invalidRoom, setInvalidRoom] = useState(false);
  const [numofUser, setNumOfUser] = useState(0);
  const [role, setRole] = useState('Not Connected');
  const [number, setNumber] = useState(0);
  const [gameReady, setGameReady] = useState(false);
  const socket = useContext(SocketContext);
  const [socketConnected, setSocketConnected] = useState(false);
  let username;
  let playerId: string | null = '';

  // async function validateSocketConnection() {
  //   socket.on('connect', () => {
  //     console.log('connection established');
  //     console.log('playeer id is ' + socket.id);
  //     if (!sessionStorage.getItem('id'))
  //       sessionStorage.setItem('id', socket.id);
  //     if (!sessionStorage.getItem('username'))
  //       sessionStorage.setItem('username', 'Default');

  //     console.log('Emiiting event, ' + playerId);
  //   });
  // }

  useEffect(() => {
    // const socket = io('http://localhost:3000');
    // Getting The Values

    // (async () => {
    //   await validateSocketConnection();
    // })();
    socket.on('connect', () => {
      console.log('connection established');
      setSocketConnected(true);
    });

    if (!socketConnected) return;

    console.log('connection established');
    console.log('playeer id is ' + socket.id);
    if (!sessionStorage.getItem('id')) sessionStorage.setItem('id', socket.id);
    if (!sessionStorage.getItem('username'))
      sessionStorage.setItem('username', 'Default');

    console.log('Emiiting event, ' + playerId);

    username = sessionStorage.getItem('username');
    playerId = sessionStorage.getItem('id');
    console.log('Emitting event,' + playerId + username);
    socket.emit('joinRoom', roomName, playerId);
    socket.on('invalidRoom', () => {
      setInvalidRoom(true);
    });

    // ! Emit a event and listen to it for each

    socket.on('joinRoomSuccess', (role: string, num: number) => {
      setRole(role);
      setNumber(num);
    });

    socket.on('roomUpdate', (users: number) => {
      console.log('Room Updated');
      setNumOfUser(users);
      if (users >= 2) setGameReady(true);
    });

    return () => {
      socket.emit('leaveRoom', playerId);
      socket.off('joinRoom', roomName);
      // socket.disconnect();
    };
  }, [roomName, socketConnected]);

  return (
    <>
      {invalidRoom && <div> Invalid Room Name</div>}
      {gameReady && <Game role={role} number={number} />}
      {!invalidRoom && !gameReady && (
        <div>
          Hey There!, This is the Waiting room ${roomName} and is populated by $
          {numofUser} and has the role ${role}. The id is ${playerId} and the
          username is {username};
        </div>
      )}
    </>
  );
}

/* 
Emit 'joinRoom' event with the room name
    socket.emit('joinRoom', roomName);

    Redirect to the room URL
    window.location.href = window.location.href + 'room/' + roomName;
    */
