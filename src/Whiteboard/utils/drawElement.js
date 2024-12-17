import { toolTypes } from '../../constants';
import { getStroke } from 'perfect-freehand';
import { getSvgPathFromStroke } from './getSvgPathFromStroke';

const drawPencilElement = (context, element) => {
    const myStroke = getStroke(element.points, {
        size: 10
    });

    const pathData = getSvgPathFromStroke(myStroke);
    const myPath = new Path2D(pathData);
    context.fill(myPath);
}
const drawTextElement = (context, element) => {
    context.textBaseline = "top";
    context.font = "24px sans-serif";
    context.fillText(element.text, element.x1, element.y1);
};

export const drawElement = ({ roughCanvas, context, element }) => {
    switch (element.type) {
        case toolTypes.LINE:
        case toolTypes.RECTANGLE:
            const parsedRoughElement = JSON.parse(element.roughElement);
            roughCanvas.draw(parsedRoughElement)
            break;
        case toolTypes.PENCIL:
            return drawPencilElement(context, element)
        case toolTypes.TEXT:
            return drawTextElement(context, element)

        default: new Error("Something went wrong when drawing element");
    }
}
