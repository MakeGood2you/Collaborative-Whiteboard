import React, {useEffect} from 'react';
import Whiteboard from './Whiteboard/Whiteboard';
import { connectSocketServer } from './socketConn/socketConn';
import CursorOverlay from './cursorOverlay/cursorOverlay';

function App() {
    useEffect(() => {
        connectSocketServer();
    }, []);
    return (
        <div className="App">
            <Whiteboard/>
            <CursorOverlay/>
        </div>
    );
}

export default App;
