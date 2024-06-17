import { Socket, io } from 'socket.io-client';
import React from 'react';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  'http://localhost:3000'
);
export const SocketContext = React.createContext(socket);
