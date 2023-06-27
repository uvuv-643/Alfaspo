import {CELL_SIZE, FULL_HEIGHT, FULL_WIDTH} from "../DrawArea";
import margin from "../../Margin";
import {PointArray, SVG} from '@svgdotjs/svg.js';

export interface PointInterface {
    x: number,
    y: number
}

export interface RealPointInterface extends PointInterface {
}

export interface WindowPointInterface extends PointInterface {
}

export interface WindowLineInterface {
    first: WindowPointInterface,
    second: WindowPointInterface,
}

export function checkForLineIntersections(lines: WindowLineInterface[]) : boolean {

    function areCrossing(
        v11: PointInterface,
        v12: PointInterface,
        v21: PointInterface,
        v22: PointInterface,
        crossing?: PointInterface
    ): boolean {
        const cut1: [number, number, number] = [v12.x - v11.x, v12.y - v11.y, 0];
        const cut2: [number, number, number] = [v22.x - v21.x, v22.y - v21.y, 0];
        const prod1 = crossProduct(cut1, [v21.x - v11.x, v21.y - v11.y, 0]);
        const prod2 = crossProduct(cut1, [v22.x - v11.x, v22.y - v11.y, 0]);
        if (Math.sign(prod1[2]) === Math.sign(prod2[2]) || prod1[2] === 0 || prod2[2] === 0) {
            return false;
        }
        const prod3 = crossProduct(cut2, [v11.x - v21.x, v11.y - v21.y, 0]);
        const prod4 = crossProduct(cut2, [v12.x - v21.x, v12.y - v21.y, 0]);
        if (Math.sign(prod3[2]) === Math.sign(prod4[2]) || prod3[2] === 0 || prod4[2] === 0) {
            return false;
        }
        if (crossing) {
            crossing.x = v11.x + cut1[0] * Math.abs(prod3[2]) / Math.abs(prod4[2] - prod3[2]);
            crossing.y = v11.y + cut1[1] * Math.abs(prod3[2]) / Math.abs(prod4[2] - prod3[2]);
        }
        return true;
    }

    function crossProduct(v1: [number, number, number], v2: [number, number, number]): [number, number, number] {
        const x = v1[1] * v2[2] - v1[2] * v2[1];
        const y = v1[2] * v2[0] - v1[0] * v2[2];
        const z = v1[0] * v2[1] - v1[1] * v2[0];
        return [x, y, z];
    }

    const count = lines.length;
    for (let i = 0; i < count - 1; i++) {
        for (let j = i + 1; j < count; j++) {
            if (areCrossing(lines[i].first, lines[i].second, lines[j].first, lines[j].second)) {
                return true;
            }
        }
    }
    return false;

}

export
function isValidPolygon(points: WindowPointInterface[]): boolean {
    let newFigureLines = []
    if (points.length < 4) return false
    for (let i = 0; i < points.length - 1; i++) {
        newFigureLines.push({first: points[i], second: points[i + 1]})
    }
    return !checkForLineIntersections(newFigureLines)
}

export
function getCoordinatesOfCircle(O : WindowPointInterface | undefined, theta : number, R : number, phi : number) : WindowPointInterface {
    phi = 90 - phi
    let xs = R * Math.cos(theta / 180 * Math.PI)
    let ys = R * Math.sin(theta / 180 * Math.PI)
    if (O) {
        let target = {
            x : O.x + xs * Math.cos(phi / 180 * Math.PI) + ys * Math.sin(phi / 180 * Math.PI),
            y: O.y + ys * Math.cos(phi / 180 * Math.PI) - xs * Math.sin(phi / 180 * Math.PI),
        }
        return target
    }
    return {
        x : 0,
        y : 0
    }
}

export
function calculateAngle(line : WindowLineInterface): number {
    const deltaX = line.second.x - line.first.x;
    const deltaY = line.second.y - line.first.y;
    const angleRad = Math.atan2(deltaY, deltaX);
    return (angleRad * (180 / Math.PI) + 180) % 180;
}


export function windowPointToReal(point: WindowPointInterface, P : number): RealPointInterface {
    return {
        x: (point.x - FULL_WIDTH / 2) * (1 / CELL_SIZE) * P,
        y: (point.y - FULL_HEIGHT / 2) * (1 / CELL_SIZE) * P
    }
}

export function realPointToWindow(point: RealPointInterface, P : number, left : number): WindowPointInterface {
    return {
        x: point.x * CELL_SIZE / P + FULL_WIDTH / 2 + left,
        y: point.y * CELL_SIZE / P + FULL_HEIGHT / 2 + left * 0.666
    }
}

export function getLengthWindow(line: WindowLineInterface | null | undefined) {
    if (line) {
        let x1 = (line.first).x
        let y1 = (line.first).y
        let x2 = (line.second).x
        let y2 = (line.second).y
        return Math.round(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)))
    }
    return 0
}

export function findClosestSegment(A: WindowPointInterface, B: WindowPointInterface): WindowLineInterface {
    let closestSegments: WindowLineInterface[] = [];
    for (let angle = 0; angle < 360; angle += 45) {
        const x = A.x + Math.cos(angle / 180 * Math.PI) * getLengthWindow({ first : A, second : B } )
        const y = A.y + Math.sin(angle / 180 * Math.PI) * getLengthWindow({ first : A, second : B } )
        closestSegments.push( { first : A, second : { x, y } } )
    }
    closestSegments.sort((f1 : WindowLineInterface, f2: WindowLineInterface) => {
        return getLengthWindow( { first : B, second : f1.second } ) > getLengthWindow( { first : B, second : f2.second } ) ? 1 : -1
    })
    return closestSegments[0];
}

export function calculateDistance(point: PointInterface, lines: WindowLineInterface[]): number {

    function calculatePointToLineDistance(point: PointInterface, lineStart: PointInterface, lineEnd: PointInterface): number {
        const { x: x1, y: y1 } = lineStart;
        const { x: x2, y: y2 } = lineEnd;
        const { x: x0, y: y0 } = point;

        const dotProduct = (x0 - x1) * (x2 - x1) + (y0 - y1) * (y2 - y1);
        const lineLengthSquared = (x2 - x1) ** 2 + (y2 - y1) ** 2;

        let t = Math.max(0, Math.min(1, dotProduct / lineLengthSquared));
        const projectedX = x1 + t * (x2 - x1);
        const projectedY = y1 + t * (y2 - y1);

        return Math.sqrt((x0 - projectedX) ** 2 + (y0 - projectedY) ** 2);
    }

    let closestDistance = Infinity;
    for (const line of lines) {
        const { first, second } = line;
        const distance = calculatePointToLineDistance(point, first, second);
        closestDistance = Math.min(closestDistance, distance);
    }
    return closestDistance;

}

export function findNearestCellPoint(point : WindowPointInterface, cellSize : number) {
    return {
        x: Math.round(point.x / cellSize) * cellSize,
        y: Math.round(point.y / cellSize) * cellSize
    }
}

function isPointInsidePolygonReal(point: RealPointInterface, polygon: RealPointInterface[]): boolean {
    let isInside = false;
    const numVertices = polygon.length;
    let j = numVertices - 1;
    for (let i = 0; i < numVertices; i++) {
        const vertexA = polygon[i]
        const vertexB = polygon[j]
        if (
            (vertexA.y < point.y && vertexB.y >= point.y) ||
            (vertexB.y < point.y && vertexA.y >= point.y)
        ) {
            if (
                vertexA.x +
                ((point.y - vertexA.y) / (vertexB.y - vertexA.y)) *
                (vertexB.x - vertexA.x) <
                point.x
            ) {
                isInside = !isInside;
            }
        }
        j = i;
    }
    return isInside;
}

export function rotatePointByAngle(point : PointInterface, angle : number) {
    return {
        x: point.x * Math.cos(angle) - point.y * Math.sin(angle),
        y: point.y * Math.cos(angle) + point.x * Math.sin(angle)
    }
}

export function getPanelLocation(points: RealPointInterface[], width: number, height: number, margin : number, angle: number, P : number) {

    const X_STEP = 1
    const Y_STEP = 1


    console.log('initial point to window points', points.map((point) => {
        return realPointToWindow(point, P, -112)
    }))

    // поворачиваем фигуру так, чтобы панели лежали вдоль OX
    let rotatedPoints: RealPointInterface[] = points.map((point: RealPointInterface) => {
        return rotatePointByAngle(point, angle)
    })

    // получаем минимальные координаты для нашей фигуры
    let minY : number, minX : number, maxY : number, maxX : number;
    minY = rotatedPoints.reduce((acc: number, point: RealPointInterface) => {
        return Math.min(point.y, acc)
    }, rotatedPoints[0].y)
    minX = rotatedPoints.reduce((acc: number, point: RealPointInterface) => {
        return Math.min(point.x, acc)
    }, rotatedPoints[0].x)
    maxY = rotatedPoints.reduce((acc: number, point: RealPointInterface) => {
        return Math.max(point.y, acc)
    }, rotatedPoints[0].y)
    maxX = rotatedPoints.reduce((acc: number, point: RealPointInterface) => {
        return Math.max(point.x, acc)
    }, rotatedPoints[0].x)


    let answer : RealPointInterface[][] = []
    for (let y = minY + margin; y < maxY + width; y += width + margin) {
        let currentPlank : boolean[] = []
        for (let x_0 = minX; x_0 < maxX; x_0 += X_STEP) {
            let isGoodLine : boolean = true
            for (let y_0 = y; y_0 < y + width; y_0 += Y_STEP) {
                if (!isPointInsidePolygonReal({
                    x : x_0,
                    y : y_0
                }, rotatedPoints)) {
                    isGoodLine = false
                }
            }
            currentPlank.push(isGoodLine)
        }
        let rects = []
        let lastOpened = undefined;
        for (let i = 0; i < currentPlank.length; i++) {
            if (currentPlank[i]) {
                if (lastOpened === undefined) {
                    lastOpened = i
                } else {
                    if ((i - lastOpened) * X_STEP > height) {
                        rects.push([lastOpened + 1, i - 1])
                        lastOpened = i
                    }
                }
            } else {
                if (lastOpened) {
                    rects.push([lastOpened + 1, i - 1])
                    lastOpened = undefined
                }
            }
        }
        answer = answer.concat(rects.map((element) => {
            return [{
                x : element[0] + minX,
                y : y
            }, {
                x : element[0] + minX,
                y : y + width
            }, {
                x : element[1] + minX,
                y : y + width
            }, {
                x : element[1] + minX,
                y : y
            }]
                .map((element) => rotatePointByAngle(element, -angle))
        }))

    }

    console.log('initial points', points)
    console.log('actual answer', answer)

    const svg = SVG().size(674, 487);

    for (const rectangle of answer) {
        const polygon = svg.polygon(rectangle.map(point => {
            point = realPointToWindow(point, P, -112)
            return `${point.x}, ${point.y}`
        }).join(' '));
        polygon.fill('#75757526');
    }

    return svg.svg();

    // const fileBlob = new Blob([svgString], { type: 'text/plain' });
    // const fileUrl = URL.createObjectURL(fileBlob);
    //
    // const link = document.createElement('a');
    // link.href = fileUrl;
    // link.download = 'data.txt';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // URL.revokeObjectURL(fileUrl);

}