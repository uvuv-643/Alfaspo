import React, {useEffect, useRef, useState} from 'react'
import {
    calculateAngle,
    calculateDistance,
    getCoordinatesOfCircle,
    getLengthWindow, realPointToWindow,
    WindowLineInterface,
    WindowPointInterface
} from "./utils/Utils";
import {FULL_HEIGHT, FULL_WIDTH} from "./DrawArea";

const VECTOR_DIRECTION_SIZE = 130;
const LINE_LIMIT_THRESHOLD = 15;
const DEFAULT_THETA = 90

interface DrawLineProps {
    line?: WindowLineInterface,
    length: number,
    lastLine?: boolean
    supportLine?: boolean,
    inactive?: boolean,
    active?: boolean,
    cursorPosition?: WindowPointInterface,
    angleMode?: boolean,
    setActiveAngle?: (line: WindowLineInterface) => void,
    activeAngle?: boolean,
    points?: WindowPointInterface[],
    P?: number,
    isFinishedAngleChoose ?: boolean,
    angleLine ?: WindowLineInterface,
    setAngleLine ?: (line : WindowLineInterface) => void,
}


function DrawLine(props: DrawLineProps) {

    function projectPointOnLineSegment(point: WindowPointInterface, lineStart: WindowPointInterface, lineEnd: WindowPointInterface) {

        function dotProduct(p1: WindowPointInterface, p2: WindowPointInterface): number {
            return p1.x * p2.x + p1.y * p2.y;
        }

        function getMagnitude(vector: WindowPointInterface): number {
            return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        }

        function subtractPoints(p1: WindowPointInterface, p2: WindowPointInterface): WindowPointInterface {
            return {x: p1.x - p2.x, y: p1.y - p2.y};
        }

        function multiplyPointByScalar(p: WindowPointInterface, scalar: number): WindowPointInterface {
            return {x: p.x * scalar, y: p.y * scalar};
        }

        function addPoints(p1: WindowPointInterface, p2: WindowPointInterface): WindowPointInterface {
            return {x: p1.x + p2.x, y: p1.y + p2.y};
        }

        const lineVector = subtractPoints(lineEnd, lineStart);
        const pointVector = subtractPoints(point, lineStart);
        const lineMagnitude = getMagnitude(lineVector);
        const dotProductValue = dotProduct(pointVector, lineVector);
        const normalizedProjection = multiplyPointByScalar(lineVector, dotProductValue / (lineMagnitude * lineMagnitude));
        let projection: WindowPointInterface;
        if (dotProductValue < 0) {
            projection = lineStart;
        } else if (dotProductValue > lineMagnitude * lineMagnitude) {
            projection = lineEnd;
        } else {
            projection = addPoints(lineStart, normalizedProjection);
        }
        return projection;

    }

    function findCrossLine(line: WindowLineInterface, C: WindowPointInterface, R: number, points: WindowPointInterface[], P: number): WindowLineInterface {

        function subtractPoints(p1: WindowPointInterface, p2: WindowPointInterface): WindowPointInterface {
            return {x: p1.x - p2.x, y: p1.y - p2.y};
        }

        function normalizeVector(vector: WindowPointInterface): WindowPointInterface {
            const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
            return {x: vector.x / magnitude, y: vector.y / magnitude};
        }

        function multiplyPointByScalar(p: WindowPointInterface, scalar: number): WindowPointInterface {
            return {x: p.x * scalar, y: p.y * scalar};
        }

        function dotProduct(p1: WindowPointInterface, p2: WindowPointInterface): number {
            return p1.x * p2.x + p1.y * p2.y;
        }

        function addPoints(p1: WindowPointInterface, p2: WindowPointInterface): WindowPointInterface {
            return {x: p1.x + p2.x, y: p1.y + p2.y};
        }

        let A = line.first
        let B = line.second
        const AB = subtractPoints(B, A);
        const normalizedAB = normalizeVector(AB);
        const AC = subtractPoints(C, A);
        const projectionMagnitude = multiplyPointByScalar(normalizedAB, dotProduct(AC, normalizedAB));
        const E = addPoints(A, projectionMagnitude);
        const perpendicularVector = {x: normalizedAB.y, y: -normalizedAB.x};
        let EF;
        if (isPointInsidePolygon(addPoints(E, multiplyPointByScalar(perpendicularVector, -R / 15)), points, P)) {
            EF = multiplyPointByScalar(perpendicularVector, -R)
            setDirection(false)
        } else {
            EF = multiplyPointByScalar(perpendicularVector, R)
            setDirection(true)
        }
        const F = addPoints(E, EF);
        return {first: E, second: F};

    }

    function isPointInsidePolygon(point: WindowPointInterface, polygon: WindowPointInterface[], P: number): boolean {
        let isInside = false;
        const numVertices = polygon.length;
        let j = numVertices - 1;
        for (let i = 0; i < numVertices; i++) {
            const vertexA = realPointToWindow(polygon[i], P, 0);
            const vertexB = realPointToWindow(polygon[j], P, 0);
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

    function arePointsOnSameSide(pointA: WindowPointInterface, pointB: WindowPointInterface, line: WindowLineInterface): boolean {

        function crossProduct(p1: WindowPointInterface, p2: WindowPointInterface): number {
            return p1.x * p2.y - p1.y * p2.x;
        }

        const vectorAB: WindowPointInterface = {
            x: line.second.x - line.first.x,
            y: line.second.y - line.first.y,
        };
        const vectorAC: WindowPointInterface = {
            x: pointA.x - line.first.x,
            y: pointA.y - line.first.y,
        };
        const vectorAD: WindowPointInterface = {
            x: pointB.x - line.first.x,
            y: pointB.y - line.first.y,
        };
        const crossProductABAC = crossProduct(vectorAB, vectorAC);
        const crossProductABAD = crossProduct(vectorAB, vectorAD);
        return crossProductABAC * crossProductABAD > 0;

    }

    function normalizeSegment(line: WindowLineInterface, desiredLength: number): WindowLineInterface {
        const vectorX = line.second.x - line.first.x;
        const vectorY = line.second.y - line.first.y;
        const currentLength = Math.sqrt(vectorX * vectorX + vectorY * vectorY);
        const scale = desiredLength / currentLength;
        const normalizedVectorX = vectorX * scale;
        const normalizedVectorY = vectorY * scale;
        return {
            first: line.first,
            second: {
                x: line.first.x + normalizedVectorX,
                y: line.first.y + normalizedVectorY,
            }
        }
    }

    function calculateAngleBetweenLines(line1: WindowLineInterface, line2: WindowLineInterface): number {
        const vector1X = line1.second.x - line1.first.x;
        const vector1Y = line1.second.y - line1.first.y;
        const vector2X = line2.second.x - line2.first.x;
        const vector2Y = line2.second.y - line2.first.y;
        const dotProduct = vector1X * vector2X + vector1Y * vector2Y;
        const magnitude1 = Math.sqrt(vector1X * vector1X + vector1Y * vector1Y);
        const magnitude2 = Math.sqrt(vector2X * vector2X + vector2Y * vector2Y);
        const cosAngle = dotProduct / (magnitude1 * magnitude2);
        const angleInRadians = Math.acos(cosAngle);
        return (angleInRadians * 180) / Math.PI;
    }

    const [activeLine, setActiveLine] = useState<boolean>(false)
    const [pPoint, setPPoint] = useState<WindowPointInterface>()
    const [currentAngle, setCurrentAngle] = useState<number>(0)
    const [theta, setTheta] = useState<number>(DEFAULT_THETA)
    const [direction, setDirection] = useState<boolean>(true)

    const isAbleToChangeAngle = useRef(false)

    function handleStartAngle() {
        if (!props.angleLine && !props.isFinishedAngleChoose && props.P && activeLine && pPoint && props.line && props.setActiveAngle && props.points && props.setAngleLine) {
            props.setAngleLine(findCrossLine(props.line, pPoint, VECTOR_DIRECTION_SIZE, props.points, props.P))
            setTheta(DEFAULT_THETA)
            isAbleToChangeAngle.current = false
            props.setActiveAngle(props.line)
            setTimeout(() => {
                isAbleToChangeAngle.current = true
            }, 500)
        }
    }

    useEffect(() => {
        if (!props.isFinishedAngleChoose && props.activeAngle && props.angleLine && isAbleToChangeAngle.current && props.cursorPosition && props.line) {
            if (arePointsOnSameSide(props.cursorPosition, props.angleLine.second, props.line) && props.setAngleLine) {
                let copyOfAbleLine = {...props.angleLine}
                copyOfAbleLine.second = props.cursorPosition
                let targetSegment = normalizeSegment(copyOfAbleLine, VECTOR_DIRECTION_SIZE);
                let targetAngle = Math.round(calculateAngleBetweenLines(targetSegment, props.line))
                if (props.line.first.y - props.line.second.y > 0) {
                    targetAngle = 180 - targetAngle
                }
                setTheta(targetAngle)
                props.setAngleLine(targetSegment)
            }
        }
    }, [props.cursorPosition])

    useEffect(() => {
        if (props.line && !props.angleLine) {
            setCurrentAngle(calculateAngle(props.line))
        }
    }, [props.angleLine])

    useEffect(() => {
        if (props.isFinishedAngleChoose || props.angleLine) {
            setActiveLine(false)
        }
        if (props.angleMode && props.cursorPosition && props.line) {
            let targetDistance = calculateDistance(props.cursorPosition, [props.line])
            if (getLengthWindow({first: props.cursorPosition, second: props.line.first}) < LINE_LIMIT_THRESHOLD) {
                setActiveLine(false)
            } else if (getLengthWindow({first: props.cursorPosition, second: props.line.second}) < LINE_LIMIT_THRESHOLD) {
                setActiveLine(false)
            } else {
                setActiveLine(targetDistance < LINE_LIMIT_THRESHOLD / 2)
            }
        }
    }, [props.cursorPosition])

    useEffect(() => {
        if (props.cursorPosition && props.line && !props.angleLine) {
            setPPoint(projectPointOnLineSegment(props.cursorPosition, props.line.first, props.line.second))
        }
    }, [props.cursorPosition])

    if (props.line) {
        return (
            <div onClick={handleStartAngle}
                 className={"DrawLine " + (!props.activeAngle && props.angleLine ? '_inactive' : activeLine ? '_active' : props.lastLine ? '_last' : props.supportLine ? '_support' : '')}>
                <div className={"DrawLine__Line " + (props.inactive ? '_inactive' : '')}>
                    <svg width={900} height={600}>
                        <line
                            x1={props.line?.first.x}
                            y1={props.line?.first.y}
                            x2={props.line?.second.x}
                            y2={props.line?.second.y}
                        />
                    </svg>
                </div>
                {
                    activeLine && !props.angleLine && (
                        <div className={"DrawLine__Point"} style={{
                            left: (pPoint?.x ?? 0) - 5,
                            top: (pPoint?.y ?? 0) - 5
                        }}/>
                    )}

                {
                    props.activeAngle && props.angleLine && (
                        <>
                            <div className="DrawLine__AngleNumber" style={{
                                left: (props.angleLine.first.x + props.angleLine.second.x) / 2,
                                top: (props.angleLine.first.y + props.angleLine.second.y) / 2,
                            }}>
                                {Math.round(theta)}°
                            </div>
                            <div className="DrawLine__Angle">
                                <svg width={900} height={600}>
                                    <defs>
                                        <marker id="arrow" markerWidth="8" markerHeight="8" refX="5" refY="4"
                                                orient="auto">
                                            <path d="M 0 0 L 7 4 L 0 7 z"
                                                  className={"line-marker"}
                                            />
                                        </marker>
                                    </defs>
                                    <line
                                        className={"line-arrow"}
                                        markerEnd="url(#arrow)"
                                        x1={props.angleLine.first.x}
                                        y1={props.angleLine.first.y}
                                        x2={props.angleLine.second.x}
                                        y2={props.angleLine.second.y}
                                    />
                                </svg>
                            </div>
                            <div className="DrawLine__Angle DrawLine__Angle--Quoter">
                                <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
                                    <path d={
                                        [
                                            "M",
                                            getCoordinatesOfCircle(props.angleLine.first, (direction && props.line.second.y - props.line.first.y >= 0) || (!direction && props.line.first.y - props.line.second.y >= 0) ? 90 : 90 + theta, 80, currentAngle).x,
                                            getCoordinatesOfCircle(props.angleLine.first, (direction && props.line.second.y - props.line.first.y >= 0) || (!direction && props.line.first.y - props.line.second.y >= 0) ? 90 : 90 + theta, 80, currentAngle).y,
                                            "A", 80, 80, 0, 0, 0,
                                            getCoordinatesOfCircle(props.angleLine.first, (direction && props.line.second.y - props.line.first.y >= 0) || (!direction && props.line.first.y - props.line.second.y >= 0) ? 90 - theta : 90, 80, currentAngle).x,
                                            getCoordinatesOfCircle(props.angleLine.first, (direction && props.line.second.y - props.line.first.y >= 0) || (!direction && props.line.first.y - props.line.second.y >= 0) ? 90 - theta : 90, 80, currentAngle).y
                                        ].join(" ")
                                    } fill="none"/>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
                                    <path d={
                                        [
                                            "M",
                                            getCoordinatesOfCircle(props.angleLine.first, (direction && props.line.second.y - props.line.first.y >= 0) || (!direction && props.line.first.y - props.line.second.y >= 0) ? 90 - theta : -90, 80, currentAngle).x,
                                            getCoordinatesOfCircle(props.angleLine.first, (direction && props.line.second.y - props.line.first.y >= 0) || (!direction && props.line.first.y - props.line.second.y >= 0) ? 90 - theta : -90, 80, currentAngle).y,
                                            "A", 80, 80, 0, 0, 0,
                                            getCoordinatesOfCircle(props.angleLine.first, (direction && props.line.second.y - props.line.first.y >= 0) || (!direction && props.line.first.y - props.line.second.y >= 0) ? -90 : 90 + theta, 80, currentAngle).x,
                                            getCoordinatesOfCircle(props.angleLine.first, (direction && props.line.second.y - props.line.first.y >= 0) || (!direction && props.line.first.y - props.line.second.y >= 0) ? -90 : 90 + theta, 80, currentAngle).y
                                        ].join(" ")
                                    } fill="none"/>
                                </svg>
                                <svg>
                                    <line
                                        x1={getCoordinatesOfCircle(props.angleLine.first, 90, 80, currentAngle).x}
                                        y1={getCoordinatesOfCircle(props.angleLine.first, 90, 80, currentAngle).y}
                                        x2={getCoordinatesOfCircle(props.angleLine.first, -90, 80, currentAngle).x}
                                        y2={getCoordinatesOfCircle(props.angleLine.first, -90, 80, currentAngle).y}
                                    />
                                </svg>
                            </div>
                        </>
                    )
                }

                {
                    props.lastLine ? (
                        <div className="DrawLine__Size DrawLine__Size--Current" style={{
                            left: props.line.second.x + (props.line.second.x > FULL_WIDTH - 50 ? -50 : 15),
                            top: props.line.second.y + (props.line.second.y > FULL_HEIGHT - 50 ? -40 : 15)
                        }}>{props.length}мм</div>
                    ) : (
                        <div className="DrawLine__Size" style={{
                            left: (props.line.second.x + props.line.first.x) / 2 - 20,
                            top: (props.line.second.y + props.line.first.y) / 2 - 9
                        }}>{props.length}мм</div>
                    )
                }
            </div>
        )
    }
    return <></>


}

export default DrawLine