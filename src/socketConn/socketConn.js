import { io } from 'socket.io-client';
import { store } from '../store/store';
import { setElements, updateElement } from '../Whiteboard/whiteboardSlice';
import { updateCursorPosition, removeCursorPosition } from '../cursorOverlay/cursorSlice';

let socket;

export const connectSocketServer = () => {
    socket = io('http://localhost:3003');
    socket.on('connect', (elements) => {
        console.log('Connected to socket server', elements);
    })
    socket.on('whiteboard-state', (elements) => {
        console.log('Received whiteboard state from server', elements);
        store.dispatch(setElements(elements));
    })

    socket.on('element-update', (updatedElement) => {
        store.dispatch(updateElement(updatedElement));
    })

    socket.on('whiteboard-clear', (updatedElement) => {
        store.dispatch(setElements([]));
    })
    socket.on('cursor-position', (cursorData) => {
        store.dispatch(updateCursorPosition(cursorData));
    })

    socket.on('user-disconnected', (userId) => {
        console.log('User disconnected', userId);
        store.dispatch(removeCursorPosition(userId));
    })
}

export const emitElementUpdate = (elementData) => {
    socket.emit('element-update', elementData);
}

export const emitClearWhiteboard = () => {
    socket.emit('whiteboard-clear');
}

export const emitCursorPosition = (cursorData) => {
    socket.emit('cursor-position', cursorData);
}

