import { useState } from 'react';
import './RoomSelector.css';

interface RoomSelectorProps {
  onRoomSelect: (roomId: string) => void;
}

const RoomSelector = ({ onRoomSelect }: RoomSelectorProps) => {
  const [roomInput, setRoomInput] = useState('');

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateRoom = () => {
    const newRoomId = generateRoomId();
    const url = new URL(window.location.href);
    url.searchParams.set('room', newRoomId);
    window.history.pushState({}, '', url.toString());
    onRoomSelect(newRoomId);
  };

  const handleJoinRoom = () => {
    if (roomInput.trim()) {
      const url = new URL(window.location.href);
      url.searchParams.set('room', roomInput.trim().toUpperCase());
      window.history.pushState({}, '', url.toString());
      onRoomSelect(roomInput.trim().toUpperCase());
    }
  };

  return (
    <div className="room-selector">
      <div className="room-selector-content">
        <h1>numSpace</h1>
        <p className="subtitle">Mobile Math Tutoring Whiteboard</p>

        <div className="room-actions">
          <button className="create-room-btn" onClick={handleCreateRoom}>
            Create New Session
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <div className="join-room">
            <input
              type="text"
              placeholder="Enter room code"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
              maxLength={6}
            />
            <button onClick={handleJoinRoom} disabled={!roomInput.trim()}>
              Join Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomSelector;
