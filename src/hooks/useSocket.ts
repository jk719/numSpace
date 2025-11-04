import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useWhiteboardStore } from '../store/whiteboardStore';

const SOCKET_URL = 'http://localhost:3001';

interface TextElement {
  id: string;
  x: number;
  y: number;
  content: string;
  fontSize: number;
  color: string;
}

export const useSocket = (roomId: string) => {
  const socketRef = useRef<Socket | null>(null);
  const { elements } = useWhiteboardStore();
  const lastUpdateRef = useRef<TextElement[]>([]);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL);

    const socket = socketRef.current;

    // Join the room
    socket.emit('join-room', roomId);

    // Listen for room state on join
    socket.on('room-state', (state: { elements: TextElement[] }) => {
      if (state.elements && state.elements.length > 0) {
        // Update store with room state
        useWhiteboardStore.setState({ elements: state.elements });
      }
    });

    // Listen for updates from other users
    socket.on('elements-updated', (updatedElements: TextElement[]) => {
      useWhiteboardStore.setState({ elements: updatedElements });
      lastUpdateRef.current = updatedElements;
    });

    socket.on('user-joined', (userId: string) => {
      console.log('User joined:', userId);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  // Sync local changes to server
  useEffect(() => {
    if (!socketRef.current) return;

    // Avoid sending updates if they came from the server
    if (JSON.stringify(elements) === JSON.stringify(lastUpdateRef.current)) {
      return;
    }

    socketRef.current.emit('update-elements', {
      roomId,
      elements,
    });
  }, [elements, roomId]);

  return socketRef.current;
};
