import { useState, useEffect } from 'react'
import Canvas from './components/Canvas'
import RoomSelector from './components/RoomSelector'
import { useSocket } from './hooks/useSocket'
import './App.css'

function App() {
  const [roomId, setRoomId] = useState<string | null>(null);

  // Initialize socket connection when room is selected
  useSocket(roomId || '');

  // Check URL for room ID on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlRoomId = params.get('room');
    if (urlRoomId) {
      setRoomId(urlRoomId);
    }
  }, []);

  if (!roomId) {
    return <RoomSelector onRoomSelect={setRoomId} />;
  }

  return (
    <div className="app">
      <Canvas roomId={roomId} />
    </div>
  )
}

export default App
