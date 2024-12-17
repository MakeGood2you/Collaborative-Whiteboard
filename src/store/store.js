import { configureStore } from '@reduxjs/toolkit';
import whiteboardSliceReducer from '../Whiteboard/whiteboardSlice';
import cursorSliceReducer from '../cursorOverlay/cursorSlice';


export const store = configureStore({
    reducer: {
        whiteboard: whiteboardSliceReducer,
        cursor: cursorSliceReducer
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            ignoreActions: ['whiteboard/setElement'],
            ignorePaths: ['whiteboard.elements'],
        })
});
