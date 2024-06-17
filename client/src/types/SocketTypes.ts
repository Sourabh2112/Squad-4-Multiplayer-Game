interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  add_til: (columnIndex: number, roomToCheck: string) => void;
  invalidRoom: () => void;
  joinRoomSuccess: (role: string, num: number) => void;
  roomUpdate: (users: number) => void;
  joinRoom: string;
}

interface ClientToServerEvents {
  hello: () => void;
  joinRoom: (roomName: string | undefined, playerId: string | null) => void;
  leaveRoom: (playerId: string | null) => void;
  createRoom: (roomName: string) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}
