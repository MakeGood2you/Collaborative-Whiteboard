import { toolTypes } from '../../constants';
import { createElement } from './index';
import { store } from '../../store/store';
import { setElements } from '../whiteboardSlice';
import { emitElementUpdate } from '../../socketConn/socketConn';


export const updatePencilElementWhenMoving = (
    { index, newPoints },
    elements
) => {
    const elementsCopy = [...elements];

    elementsCopy[index] = {
        ...elementsCopy[index],
        points: newPoints,
    };

    console.log("updating pencil element");

    const updatedPencilElement = elementsCopy[index];

    store.dispatch(setElements(elementsCopy));

    emitElementUpdate(updatedPencilElement);
};
export const updateElement = ({ index, toolType, id, x1, y1, x2, y2, text }, elements) => {
    const copyElements = [...elements];
    // console.log('copyElements ==>', copyElements)

    switch (toolType) {
        case toolTypes.LINE:
        case toolTypes.RECTANGLE:
            const updatedElement = createElement({ toolType, id, x1, y1, x2, y2 });
            copyElements[index] = updatedElement;

            store.dispatch(setElements(copyElements));

            emitElementUpdate(updatedElement)
            break
        case toolTypes.PENCIL:
            copyElements[index] = {
                ...copyElements[index],
                points: [...copyElements[index].points,
                    {
                        x: x2,
                        y: y2
                    }
                ],
            }
            const updatePencilElement = copyElements[index];

            store.dispatch(setElements(copyElements));

            emitElementUpdate(updatePencilElement)
            break

        case toolTypes.TEXT:
            const textWidth = document
                .getElementById("canvas")
                .getContext("2d")
                .measureText(text).width;

            const textHeight = 24;

            copyElements[index] = {
                ...createElement({
                    id,
                    x1,
                    y1,
                    x2: x1 + textWidth,
                    y2: y1 + textHeight,
                    toolType,
                    text,
                }),
            }

            const updatedTextElement = copyElements[index];

            store.dispatch(setElements(copyElements));

            emitElementUpdate(updatedTextElement)
            break;
        default:
            throw  new Error(`Error: updateElement Invalid tool type: ${toolType}`);
    }
}

