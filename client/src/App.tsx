import HomePage from './components/HomePage';
import WaitingRoom from './components/WaitingRoom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketContext, socket } from './context/socket';

// TODO a 404 page for not valid path and check what happens when invalid roomName type etc, and /room path is empty

export default function App() {
  return (
    <SocketContext.Provider value={socket}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/room/:roomName" element={<WaitingRoom />} />
        </Routes>
      </Router>
    </SocketContext.Provider>
  );
}
