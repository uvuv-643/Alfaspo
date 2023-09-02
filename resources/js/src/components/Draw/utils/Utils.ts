import {CELL_SIZE, FULL_HEIGHT, FULL_WIDTH} from "../DrawArea";
import {SVG} from '@svgdotjs/svg.js';

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

const PANEL_NEAREST_DISTANCE = 300
const PANEL_INSIDE_DISTANCE = 1000
const STRINGER_SMALL_SIZE = 65

export const STEEL_MAX_STRINGER = 3900
export const STEEL_MAX_PANEL = 6000
export const ALUMINUM_MAX_STRINGER = 3600
export const ALUMINUM_MAX_PANEL = 4000
export const ACOUSTIC_MAX_STRINGER = 5000
export const ACOUSTIC_MAX_PANEL = 5000
export const ACOUSTIC_MAX_PANEL_H105 = 4000


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
        return {
            x: O.x + xs * Math.cos(phi / 180 * Math.PI) + ys * Math.sin(phi / 180 * Math.PI),
            y: O.y + ys * Math.cos(phi / 180 * Math.PI) - xs * Math.sin(phi / 180 * Math.PI),
        }
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

export function realPointToWindow(point: RealPointInterface, P : number): WindowPointInterface {
    return {
        x: point.x * CELL_SIZE / P + FULL_WIDTH / 2,
        y: point.y * CELL_SIZE / P + FULL_HEIGHT / 2
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

// export function findNearestCellPoint(point : WindowPointInterface, cellSize : number) {
//     return {
//         x: Math.round(point.x / cellSize) * cellSize,
//         y: Math.round(point.y / cellSize) * cellSize
//     }
// }

export function findNearestCellPoint(point : WindowPointInterface, P : number, initialPoint ?: RealPointInterface) {
    let xs = [...new Array(4 * FULL_WIDTH / CELL_SIZE)].map((_, index: number) => {
        return realPointToWindow({ x : (initialPoint ? initialPoint.x : 0) + P * (index), y: 0}, P).x
    })
    let ys = [...new Array(4 * FULL_HEIGHT / CELL_SIZE)].map((_, index: number) => {
        return realPointToWindow({ y : (initialPoint ? initialPoint.y : 0) + P * (index), x: 0}, P).y
    })
    return {
        x: Math.round(point.x / CELL_SIZE) * CELL_SIZE + (xs[0] % CELL_SIZE),
        y: Math.round(point.y / CELL_SIZE) * CELL_SIZE + (ys[0] % CELL_SIZE)
    }
}

function isPointInsidePolygonReal(point: RealPointInterface, polygon: RealPointInterface[]): boolean {
    let isInside = false;
    const numVertices = polygon.length;
    let j = numVertices - 1;
    for (let i = 0; i < numVertices; i++) {
        const vertexA = polygon[i]
        const vertexB = polygon[j]
        if (!isPointBetweenYCoordinates(vertexA, vertexB, point) && isPointToTheLeft(vertexA, vertexB, point)) {
            isInside = !isInside;
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

export function isPointBetweenYCoordinates(vertexA : PointInterface, vertexB : PointInterface, point : PointInterface) {
    return (
        (vertexA.y >= point.y || vertexB.y < point.y) &&
        (vertexB.y >= point.y || vertexA.y < point.y)
    );
}


export function isPointToTheLeft(vertexA : PointInterface, vertexB : PointInterface, point : PointInterface) {
    return (
        vertexA.x +
        ((point.y - vertexA.y) / (vertexB.y - vertexA.y)) * (vertexB.x - vertexA.x) <
        point.x
    );
}

export function getPanelLocation(points: RealPointInterface[], material: number, width: number, height: number, margin : number, angle: number, P : number) {

    angle = Math.round(angle * 180 / Math.PI) * Math.PI / 180

    const X_STEP = 5
    const Y_STEP = 5

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

    let rectangles : RealPointInterface[][] = []
    let panels : number[][][] = []
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
        let rects: number[][] = []
        let lastOpened = undefined;

        let currentPanelLimit = STEEL_MAX_PANEL;
        if (material === 2) {
            currentPanelLimit = ALUMINUM_MAX_PANEL
        } else if (material === 3) {
            currentPanelLimit = ACOUSTIC_MAX_PANEL
            if (height === 105) {
                currentPanelLimit = ACOUSTIC_MAX_PANEL_H105
            }
        }

        for (let i = 0; i < currentPlank.length; i += 1) {
            if (currentPlank[i]) {
                if (lastOpened === undefined) {
                    lastOpened = i
                } else {
                    if ((i - lastOpened) * X_STEP > currentPanelLimit) {
                        rects.push([lastOpened * X_STEP + 1, i * X_STEP - 1])
                        lastOpened = i
                    }
                }
            } else {
                if (lastOpened) {
                    rects.push([lastOpened * X_STEP + 1, i * X_STEP - 1])
                    lastOpened = undefined
                }
            }
        }
        if (lastOpened) {
            rects.push([lastOpened * X_STEP + 1 , currentPlank.length * X_STEP - 1])
            lastOpened = undefined
        }
        panels.push(rects)
        rectangles = rectangles.concat(rects.map((element) => {
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

    // const jsonData = JSON.stringify(panels);
    // const blob = new Blob([jsonData], { type: 'application/json' });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'data.json';
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // URL.revokeObjectURL(url);

    const bad_panels: { row: number[]; x: number[] }[] = [];

    function try_to_fix_panels(): number {
        for (let panelIndex = 0; panelIndex < bad_panels.length; panelIndex++) {
            const panel = bad_panels[panelIndex];
            const rows = panel.row;
            const borders = panel.x;
            for (let currentPanelIndex = 0; currentPanelIndex < bad_panels.length; currentPanelIndex++) {
                if (panelIndex === currentPanelIndex) {
                    continue;
                }
                const currentPanel = bad_panels[currentPanelIndex];
                const currentRows = currentPanel.row;
                const currentBorders = currentPanel.x;
                if (
                    Math.abs(rows[0] - currentRows[currentRows.length - 1]) === 1 ||
                    Math.abs(rows[rows.length - 1] - currentRows[0]) === 1
                ) {
                    const targetBorder = [
                        Math.max(currentBorders[0], borders[0]),
                        Math.min(currentBorders[1], borders[1])
                    ];
                    if (targetBorder[0] <= targetBorder[1]) {
                        if (panelIndex > currentPanelIndex) {
                            bad_panels.splice(panelIndex, 1);
                            bad_panels.splice(currentPanelIndex, 1);
                        } else if (panelIndex < currentPanelIndex) {
                            bad_panels.splice(currentPanelIndex, 1);
                            bad_panels.splice(panelIndex, 1);
                        } else {
                            bad_panels.splice(panelIndex, 1);
                        }
                        const newPanels = [...currentRows];
                        for (const row of rows) {
                            newPanels.push(row);
                        }
                        bad_panels.push({ row: Array.from(new Set(newPanels)).sort((a, b) => a - b), x: targetBorder });
                        return 0;
                    }
                }
            }
        }
        return 1;
    }

    function is_point_inside_panels(row: number, x: number): boolean {
        if (row >= 0) {
            if (panels[row]) {
                for (const panel of panels[row]) {
                    if (panel.length === 2 && panel[0] <= x && panel[1] >= x) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    let max_X = Math.max(...panels.flat(3).filter(item => Number.isInteger(item)));
    let min_X = Math.min(...panels.flat(3).filter(item => Number.isInteger(item)));
    const stringers: { [key: number]: number[] } = {};

    for (let x = PANEL_NEAREST_DISTANCE + min_X; x < max_X; x += PANEL_INSIDE_DISTANCE) {
        panels.forEach((plate, index) => {
            let is_met = false;
            plate.forEach(different_plate => {
                if (x > different_plate[0] && x < different_plate[1]) {
                    is_met = true;
                }
            });
            if (is_met) {
                if (x in stringers) {
                    stringers[x].push(index);
                } else {
                    stringers[x] = [index];
                }
            }
        });
    }

    const transformed_stringers: { [key: number]: number[][] } = {};
    for (const [key, value] of Object.entries(stringers)) {
        const sublists: number[][] = [];
        let start_num = value[0];
        let end_num = value[0];
        for (let i = 1; i < value.length; i++) {
            const num = value[i];
            if (num === end_num + 1) {
                end_num = num;
            } else {
                sublists.push([start_num, end_num]);
                start_num = num;
                end_num = num;
            }
        }
        if (value[value.length - 1] !== end_num + 1) {
            sublists.push([start_num, end_num]);
        }
        transformed_stringers[parseInt(key)] = sublists;
    }

    for (let row = 0; row < panels.length; row++) {
        for (let col = 0; col < panels[row].length; col++) {
            let count_intersections = 0;
            for (const [x, current_stringers] of Object.entries(transformed_stringers)) {
                for (const current_stringer of current_stringers) {
                    const is_row_between_interval = row >= current_stringer[0] && row <= current_stringer[1];
                    const is_col_between_interval = parseInt(x) >= panels[row][col][0] && parseInt(x) <= panels[row][col][1];
                    if (is_row_between_interval && is_col_between_interval) {
                        count_intersections += 1;
                    }
                }
            }
            if (count_intersections < 2) {
                bad_panels.push({ row: [row], x: [panels[row][col][0], panels[row][col][1]] });
            }
        }
    }

    const all_stringers_by_rows: { [key: number]: number[] } = {};
    for (const [x, current_stringers] of Object.entries(transformed_stringers)) {
        for (const stringer of current_stringers) {
            for (let stringer_row = stringer[0]; stringer_row <= stringer[1]; stringer_row++) {
                if (!(stringer_row in all_stringers_by_rows)) {
                    all_stringers_by_rows[stringer_row] = [];
                }
                all_stringers_by_rows[stringer_row].push(parseInt(x));
            }
        }
    }

    for (let row = 0; row < panels.length; row++) {
        for (let j = 0; j < panels[row].length; j++) {
            const [border_from, border_to] = panels[row][j];
            const first_panel = [border_from, border_from + PANEL_NEAREST_DISTANCE];
            const last_panel = [border_to - PANEL_NEAREST_DISTANCE, border_to];
            let is_met = false;
            if (row in all_stringers_by_rows) {
                for (const stringer of all_stringers_by_rows[row]) {
                    if (stringer >= first_panel[0] && stringer <= first_panel[1]) {
                        is_met = true;
                        break;
                    }
                }
            }
            if (!is_met) {
                bad_panels.push({ row: [row], x: first_panel });
            }
            is_met = false;
            if (row in all_stringers_by_rows) {
                for (const stringer of all_stringers_by_rows[row]) {
                    if (stringer >= last_panel[0] && stringer <= last_panel[1]) {
                        is_met = true;
                        break;
                    }
                }
            }
            if (!is_met) {
                bad_panels.push({ row: [row], x: last_panel });
            }
        }
    }

    while (true) {
        if (try_to_fix_panels()) {
            break;
        }
    }

    for (const panel of bad_panels) {
        const middle_x = (panel.x[1] + panel.x[0]) / 2;
        for (let stringer_row = panel.row[0]; stringer_row <= panel.row[panel.row.length - 1]; stringer_row++) {
            if (!(stringer_row in all_stringers_by_rows)) {
                all_stringers_by_rows[stringer_row] = [];
            }
            all_stringers_by_rows[stringer_row].push(middle_x);
        }
    }

    min_X = PANEL_INSIDE_DISTANCE * PANEL_INSIDE_DISTANCE;
    max_X = 0;
    for (const [_, row] of Object.entries(all_stringers_by_rows)) {
        min_X = Math.min(min_X, Math.min(...row));
        max_X = Math.max(max_X, Math.max(...row));
    }
    min_X = Math.floor(min_X);
    max_X = Math.ceil(max_X);
    const target_answer: { x: number; rows: number[] }[] = [];
    for (let x = min_X; x <= max_X + STRINGER_SMALL_SIZE; x += STRINGER_SMALL_SIZE) {
        const current_cx_answer: number[] = [];
        for (const [c_index, xx] of Object.entries(all_stringers_by_rows)) {
            for (const cx of xx) {
                if (Math.abs(x - cx) < STRINGER_SMALL_SIZE / 2) {
                    current_cx_answer.push(parseInt(c_index));
                }
            }
        }
        if (current_cx_answer.length) {
            const target_list = Array.from(new Set(current_cx_answer)).sort((a, b) => parseInt(a.toString()) - parseInt(b.toString()));
            target_answer.push({ x, rows: target_list });
        }
    }

    for (let i = 0; i < target_answer.length; i++) {
        const rows = target_answer[i].rows;
        for (let j = 0; j < rows.length - 1; j++) {
            if (rows[j + 1] - rows[j] !== 1) {
                target_answer.push({ x: target_answer[i].x, rows: rows.slice(j + 1) });
                rows.splice(j + 1);
                break;
            }
        }
    }

    for (let index = 0; index < target_answer.length; index++) {
        const element = target_answer[index];
        const x = element.x;
        let rows = element.rows;
        if (rows.length === 2) {
            if (is_point_inside_panels(rows[0] - 1, x)) {
                rows.unshift(rows[0] - 1);
            } else if (is_point_inside_panels(rows[1] + 1, x)) {
                rows.push(rows[1] + 1);
            }
        } else if (rows.length === 1) {
            if (is_point_inside_panels(rows[0] - 1, x) && is_point_inside_panels(rows[0] + 1, x)) {
                rows.unshift(rows[0] - 1);
                rows.push(rows[1] + 1);
            } else if (is_point_inside_panels(rows[0] + 1, x) && is_point_inside_panels(rows[0] + 2, x)) {
                rows.push(rows[0] + 1);
                rows.push(rows[0] + 2);
            } else if (is_point_inside_panels(rows[0] - 1, x) && is_point_inside_panels(rows[0] - 2, x)) {
                rows.unshift(rows[0] - 1);
                rows.unshift(rows[0] - 1);
            } else if (is_point_inside_panels(rows[0] - 1, x)) {
                rows.unshift(rows[0] - 1);
            } else if (is_point_inside_panels(rows[0] + 1, x)) {
                rows.push(rows[0] + 1);
            }
        }
        target_answer[index].rows = rows;
    }

    let currentStringersLimit = STEEL_MAX_STRINGER;
    if (material === 2) {
        currentStringersLimit = ALUMINUM_MAX_STRINGER
    } else if (material === 3) {
        currentStringersLimit = ACOUSTIC_MAX_STRINGER
    }

    for (let i = 0; i < target_answer.length; i++) {
        const rows = target_answer[i].rows;
        for (let j = 0; j < rows.length - 2; j++) {
            if (j * (margin + width) > currentStringersLimit) {
                target_answer.push({ x: target_answer[i].x + 100, rows: rows.slice(j + 1 - Math.ceil(100 / (margin + width))) });
                rows.splice(j + 1);
                break;
            }
        }
    }

    let stringerPoints : any[] = []
    for (let i = 0; i < target_answer.length; i++) {
        const leftBorder = target_answer[i].rows[0]
        const rightBorder = target_answer[i].rows[target_answer[i].rows.length - 1]
        const pointsCount = Math.max(2, ((rightBorder - leftBorder + 1) * (width + margin) - 2 * PANEL_NEAREST_DISTANCE) / PANEL_INSIDE_DISTANCE)
        if (pointsCount === 2 && rightBorder - leftBorder < 6) {
            if (rightBorder - leftBorder !== 2) {
                stringerPoints.push({'x': target_answer[i].x, 'row': leftBorder + 1})
                stringerPoints.push({'x': target_answer[i].x, 'row': rightBorder - 1})
            } else {
                stringerPoints.push({'x': target_answer[i].x, 'row': leftBorder})
                stringerPoints.push({'x': target_answer[i].x, 'row': rightBorder})
            }
        } else {
            for (let p = 0; p < pointsCount; p++) {
                let pointRow = leftBorder + Math.round((p + 1) * (rightBorder - leftBorder) / (pointsCount + 1))
                if (!(stringerPoints.length && pointRow === stringerPoints[stringerPoints.length - 1].row)) {
                    stringerPoints.push({'x': target_answer[i].x, 'row': pointRow})
                }
            }
        }
    }

    let connectionPoints : WindowPointInterface[] = []
    for (let i = 0; i < stringerPoints.length; i++) {
        let x = stringerPoints[i].x
        connectionPoints.push(realPointToWindow(rotatePointByAngle({
            x: minX + x,
            y: minY + margin + (width + margin) * stringerPoints[i].row + width * 0.5
        }, -angle), P))
    }


    let lines : any[] = []
    for (let i = 0; i < target_answer.length; i++) {
        let x = target_answer[i].x
        let rows = target_answer[i].rows
        lines.push({
            first: realPointToWindow(rotatePointByAngle({
                x: minX + x,
                y: minY + (width + margin) * rows[0]
            }, -angle), P),
            second: realPointToWindow(rotatePointByAngle({
                x: minX + x,
                y: Math.min(maxY, minY + (width + margin) * (rows[rows.length - 1] + 1) + margin)
            }, -angle), P)
        })
    }

    let figureLines: WindowLineInterface[] = []
    for (let i = 1; i < points.length; i++) {
        figureLines.push({
            first : realPointToWindow(points[i], P),
            second : realPointToWindow(points[i - 1], P)
        })
    }
    lines = lines.map((line : WindowLineInterface) => {
        let appropriateFigureLines = figureLines.filter((figureLine) => {
            let firstVector : PointInterface = {
                x : figureLine.second.x - figureLine.first.x,
                y : figureLine.second.y - figureLine.first.y
            }
            let secondVector : PointInterface = {
                x : line.second.x - line.first.x,
                y : line.second.y - line.first.y
            }
            return Math.abs(firstVector.x * secondVector.x + firstVector.y * secondVector.y) < 0.01
        })
        let targetLine = line;
        appropriateFigureLines.every((figureLine) => {
            if (Math.abs(figureLine.first.x - figureLine.second.x) < 0.01) {
                let distFromFirstPoint = Math.abs(figureLine.first.x - targetLine.first.x)
                let distFromSecondPoint = Math.abs(figureLine.first.x - targetLine.second.x)
                if (Math.min(distFromSecondPoint, distFromFirstPoint) < (width + margin) / ((1 / CELL_SIZE) * P) + margin) {
                    if (distFromFirstPoint < distFromSecondPoint) {
                        targetLine = {
                            first : {
                                x : figureLine.first.x,
                                y : targetLine.first.y
                            },
                            second : targetLine.second
                        }
                    } else {
                        targetLine = {
                            second : {
                                x : figureLine.first.x,
                                y : targetLine.second.y
                            },
                            first : targetLine.first
                        }
                    }
                    return true
                }
            }
            if (Math.abs(figureLine.first.y - figureLine.second.y) < 0.01) {
                let distFromFirstPoint = Math.abs(figureLine.first.y - targetLine.first.y)
                let distFromSecondPoint = Math.abs(figureLine.first.y - targetLine.second.y)
                if (Math.min(distFromSecondPoint, distFromFirstPoint) < (width + margin) / ((1 / CELL_SIZE) * P)) {
                    if (distFromFirstPoint < distFromSecondPoint) {
                        targetLine = {
                            first : {
                                x : targetLine.first.x,
                                y : figureLine.first.y
                            },
                            second : targetLine.second
                        }
                    } else {
                        targetLine = {
                            second : {
                                x : targetLine.second.x,
                                y : figureLine.first.y
                            },
                            first : targetLine.first
                        }
                    }
                    return true
                }
            }
            return true
        })
        return targetLine
    })

    const svg = SVG().size(2700, 1800);
    for (const rectangle of rectangles) {
        const polygon = svg.polygon(rectangle.map(point => {
            point = realPointToWindow(point, P)
            return `${point.x + FULL_WIDTH}, ${point.y + FULL_HEIGHT}`
        }).join(' '));
        polygon.fill('#808080');
    }
    for (const line of lines) {
        if (P >= 100) {
            svg.line(line.first.x + FULL_WIDTH, line.first.y + FULL_HEIGHT, line.second.x + FULL_WIDTH, line.second.y + FULL_HEIGHT)
                .stroke({ color: '#000', width: 2 })
        } else {
            svg.line(line.first.x + FULL_WIDTH, line.first.y + FULL_HEIGHT, line.second.x + FULL_WIDTH, line.second.y + FULL_HEIGHT)
                .stroke({ color: '#000', width: 4 })
        }
    }

    for (const point of connectionPoints) {
        if (P >= 100) {
            svg.rect(6, 6).fill('#000').move(900 + point.x - 3, FULL_HEIGHT + point.y - 3)
        } else {
            svg.rect(10, 10).fill('#000').move(900 + point.x - 5, FULL_HEIGHT + point.y - 5)
        }
    }

    let totalPanelLength = 0
    for (const rectangle of rectangles) {
        totalPanelLength += Math.sqrt(Math.pow(rectangle[2].x - rectangle[1].x, 2) + Math.pow(rectangle[2].y - rectangle[1].y, 2))
    }
    let totalStringerLength = 0
    for (const line of lines) {
        totalStringerLength += Math.sqrt(Math.pow(line.first.x - line.second.x, 2) + Math.pow(line.first.y - line.second.y, 2))
    }

    // totalPanelLength *= P / CELL_SIZE
    totalStringerLength *= P / CELL_SIZE

    return {
        totalPanelLength: totalPanelLength,
        totalStringerLength: totalStringerLength,
        totalStringerCountActual: lines.length,
        totalConnectorsCount: connectionPoints.length,
        svg: svg.svg()
    }

}

export function isPointsSame(point1 : PointInterface, point2 : PointInterface) : boolean {
    return (Math.abs(point1.x - point2.x) < 0.01 && Math.abs(point1.y - point2.y) < 0.01)
}
