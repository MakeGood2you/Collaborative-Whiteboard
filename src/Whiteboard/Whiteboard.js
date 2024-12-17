import React, { useRef, useLayoutEffect, useState } from 'react';
import Menu from './Menu';
import rough from 'roughjs';
import { useSelector, useDispatch } from 'react-redux';
import { toolTypes, actions, cursorPositions } from '../constants';
import {
    createElement,
    updateElement,
    drawElement,
    adjustmentIsRequired,
    adjustmentElementCoordinates,
    getElementAtPosition,
    getCursorForPositions,
    getResizedCoordinates,
    updatePencilElementWhenMoving
} from './utils';
import { v4 as uuid } from 'uuid';
import { updateElement as updateElementInStore } from './whiteboardSlice';
import { emitCursorPosition } from '../socketConn/socketConn';

let isEmitCursor = true;
let lastCursorPosition;
let lastEmittedCursorData;

const Whiteboard = () => {
    const canvasRef = useRef(null);
    const textAreaRef = useRef(null);

    const toolType = useSelector(state => state.whiteboard.tool);
    const elements = useSelector(state => state.whiteboard.elements);

    const [action, setAction] = useState(null);
    const [selectedElement, setSelectedElement] = useState(null);

    const dispatch = useDispatch();

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height);

        const roughCanvas = rough.canvas(canvas);
        elements.forEach(element => {
            drawElement({ roughCanvas, context, element });
        }, [elements]);

    })


    const handleMouseMove = (event) => {
        const { clientX, clientY } = event;

        lastCursorPosition = { x: clientX, y: clientY };

        emitCursorPosition({
            x: clientX,
            y: clientY,
        })

        if (isEmitCursor) {
            isEmitCursor = false
            lastEmittedCursorData = { x: clientX, y: clientY };
            console.log('sending cursor position');
            setTimeout(() => {
                isEmitCursor = true;
                emitCursorPosition(lastCursorPosition)
            }, 50)
        }

        if (action === actions.DRAWING) {
            const index = elements.findIndex(element => element.id === selectedElement.id);

            if (index !== -1) {
                updateElement({
                    index,
                    toolType: elements[index].type,
                    id: elements[index].id,
                    x1: elements[index].x1,
                    y1: elements[index].y1,
                    x2: clientX,
                    y2: clientY
                }, elements)
            }
        }


        if (toolType === toolTypes.SELECTION) {
            const element = getElementAtPosition(clientX, clientY, elements);
            if (element) {
                console.log(element)
                event.target.style.cursor = element
                    ? getCursorForPositions(element.position)
                    : "default";
            } else event.target.style.cursor = "default";

            if (
                selectedElement &&
                toolType === toolTypes.SELECTION &&
                action === actions.MOVING &&
                selectedElement.type === toolTypes.PENCIL
            ) {
                const newPoints = selectedElement.points.map((_, index) => ({
                    x: clientX - selectedElement.xOffsets[index],
                    y: clientY - selectedElement.yOffsets[index],
                }));

                const index = elements.findIndex((el) => el.id === selectedElement.id);

                if (index !== -1) {
                    updatePencilElementWhenMoving({ index, newPoints }, elements);
                }
                return;
            }
        }

        if (
            toolType === toolTypes.SELECTION
            && action === actions.MOVING
            && selectedElement
        ) {

            const { id, type, x1, y1, x2, y2, offsetX, offsetY, text } = selectedElement;

            const width = x2 - x1;
            const height = y2 - y1;

            const newX1 = clientX - offsetX;
            const newY1 = clientY - offsetY;

            const index = elements.findIndex(element => element.id === selectedElement.id);
            if (index !== -1) {
                updateElement(
                    {
                        toolType: type,
                        id,
                        x1: newX1,
                        y1: newY1,
                        x2: newX1 + width,
                        y2: newY1 + height,
                        index,
                        text
                        // position: cursorPositions.INSIDE

                    }, elements
                )
            }
        }
        if (
            toolType === toolTypes.SELECTION
            && action === actions.RESIZING
            && selectedElement
        ) {
            const { id, type, position, ...coordinates } = selectedElement;
            const { x1, x2, y1, y2 } = getResizedCoordinates(clientX, clientY, coordinates, position);
            const selectedElementIndex = elements.findIndex(element => element.id === selectedElement.id);
            if (selectedElementIndex !== -1) {
                updateElement({
                        index: selectedElementIndex,
                        toolType: type,
                        id,
                        x1,
                        y1,
                        x2,
                        y2
                    }, elements
                )
            }
        }
    }

    const handleMouseUp = (event) => {
        const selectedElementIndex = elements.findIndex(element => element.id === selectedElement?.id);

        if (selectedElementIndex !== -1) {
            if (action === actions.DRAWING && action === actions.RESIZING) {
                if (adjustmentIsRequired(elements[selectedElementIndex].type)) {

                    const { x1, x2, y1, y2 } = adjustmentElementCoordinates(elements[selectedElementIndex]);

                    updateElement({
                            index: selectedElementIndex,
                            toolType: elements[selectedElementIndex].type,
                            id: elements[selectedElementIndex].id,
                            x1,
                            y1,
                            x2,
                            y2
                        }, elements
                    )
                }
            }


        }

        setAction(null)
        setSelectedElement(null);
    }

    const handleMouseDown = (event) => {
        const { clientX, clientY } = event;

        if (selectedElement && action === actions.WRITING) return

        switch (toolType) {
            case toolTypes.RECTANGLE:
            case toolTypes.LINE:
            case toolTypes.PENCIL:
                const element = createElement({
                    x1: clientX,
                    y1: clientY,
                    x2: clientX,
                    y2: clientY,
                    toolType,
                    id: uuid()
                })

                setAction(actions.DRAWING)

                setSelectedElement(element)

                dispatch(updateElementInStore(element))
                break;
            case toolTypes.TEXT:
                const textElement = createElement({
                    x1: clientX,
                    y1: clientY,
                    x2: clientX,
                    y2: clientY,
                    toolType,
                    id: uuid()
                })

                setAction(actions.WRITING)

                setSelectedElement(textElement)

                dispatch(updateElementInStore(textElement))
                break;

            case toolTypes.SELECTION:
                const selectedElement = getElementAtPosition(clientX, clientY, elements);
                if (
                    selectedElement &&
                    (
                        selectedElement.type === toolTypes.RECTANGLE ||
                        selectedElement.type === toolTypes.TEXT ||
                        selectedElement.type === toolTypes.LINE
                    )
                ) {
                    setAction(
                        selectedElement.position === cursorPositions.INSIDE
                            ? actions.MOVING
                            : actions.RESIZING
                    );

                    const offsetX = clientX - selectedElement.x1;
                    const offsetY = clientY - selectedElement.y1;

                    setSelectedElement({ ...selectedElement, offsetX, offsetY });
                }

                if (selectedElement && selectedElement.type === toolTypes.PENCIL) {
                    setAction(actions.MOVING);

                    const xOffsets = selectedElement.points.map((point) => clientX - point.x);
                    const yOffsets = selectedElement.points.map((point) => clientY - point.y);

                    setSelectedElement({ ...selectedElement, xOffsets, yOffsets });
                }
                break;
            default:
                new Error('Invalid tool type')
        }


    }

    const handleTextareaBlur = (event) => {
        const { id, x1, y1, type } = selectedElement;

        const index = elements.findIndex((el) => el.id === selectedElement.id);
        if (index !== -1) {
            updateElement(
                { id, x1, y1, toolType: type, text: event.target.value, index },
                elements
            );

            setAction(null);
            setSelectedElement(null);
        }
    };

    /**/
    return (
        <>
            <Menu/>
            {action === actions.WRITING ? (<textarea
                ref={textAreaRef}
                onBlur={handleTextareaBlur}
                style={{
                    position: 'absolute',
                    top: selectedElement.y1 - 3,
                    left: selectedElement.x1,
                    font: '24px sans-serif',
                    margin: 0,
                    padding: 0,
                    border: 0,
                    outline: 0,
                    resize: 'auto',
                    overflow: 'hidden',
                    whiteSpace: 'pre',
                    background: 'transparent'
                }}
            />) : null}

            <canvas
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
                id="canvas"
            />
        </>
    );
};

export default Whiteboard;