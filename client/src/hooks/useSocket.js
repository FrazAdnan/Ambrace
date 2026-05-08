import { io } from 'socket.io-client';
import { useEffect, useRef, useCallback } from 'react';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(SERVER_URL, {
      transports: ['websocket'],
      autoConnect: false,
    });
  }
  return socket;
}

export function useSocket(handlers = {}) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const s = getSocket();
    if (!s.connected) s.connect();

    const registeredEvents = [];

    Object.entries(handlersRef.current).forEach(([event, handler]) => {
      const wrappedHandler = (...args) => handlersRef.current[event]?.(...args);
      s.on(event, wrappedHandler);
      registeredEvents.push([event, wrappedHandler]);
    });

    return () => {
      registeredEvents.forEach(([event, handler]) => {
        s.off(event, handler);
      });
    };
  }, []);

  const emit = useCallback((event, data) => {
    const s = getSocket();
    s.emit(event, data);
  }, []);

  return { emit, socket: getSocket() };
}
