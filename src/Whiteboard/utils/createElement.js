import { toolTypes } from '../../constants';
import rough from 'roughjs';

const generator = rough.generator();

const generateRectangle = ({ x1, y1, x2, y2 }) => {
    return generator.rectangle(x1, y1, x2 - x1, y2 - y1);  // x, y, width, height
}
const generateLine = ({ x1, y1, x2, y2 }) => {
    return generator.line(x1, y1, x2, y2);  // x, y, width, height
}

const generateText = ({ x, y, text }) => {

}

export const createElement = ({ x1, y1, x2, y2, toolType, id, text }) => {
    let roughElement;

    switch (toolType) {
        case toolTypes.RECTANGLE:
            roughElement = generateRectangle({ x1, y1, x2, y2 });
            return {
                id,
                roughElement: JSON.stringify(roughElement),
                type: toolType,
                x1,
                y1,
                x2,
                y2,
            }
        case toolTypes.LINE:
            roughElement = generateLine({ x1, y1, x2, y2 });
            return {
                id,
                roughElement: JSON.stringify(roughElement),
                type: toolType,
                x1,
                y1,
                x2,
                y2,
            }
        case toolTypes.PENCIL:

            return {
                id,
                type: toolType,
                points: [{ x: x1, y: y1 }],
            }
        case toolTypes.TEXT:
            return { id, type: toolType, x1, y1, x2, y2, text: text || "" };
        default:
            throw  new Error(`Error: Invalid tool type: ${toolType}`);
    }
}

