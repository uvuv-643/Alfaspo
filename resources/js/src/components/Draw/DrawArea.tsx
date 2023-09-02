import React, {MutableRefObject, useEffect, useRef, useState} from 'react'
import Point from './Point'
import DrawLine from "./DrawLine";
import {
    calculateDistance,
    checkForLineIntersections,
    findClosestSegment, findNearestCellPoint,
    getLengthWindow, isPointsSame,
    PointInterface,
    RealPointInterface,
    realPointToWindow,
    WindowLineInterface,
    WindowPointInterface,
    windowPointToReal
} from "./utils/Utils";

export const FULL_WIDTH = 900
export const FULL_HEIGHT = 600
export const CELL_SIZE = 20

interface DrawAreaProps {
    cursorPosition?: WindowPointInterface,
    scroll: number,
    points: PointInterface[],
    setPoints: (points : PointInterface[]) => void,
    inactiveLine: boolean,
    setInactiveLine: (inactiveLine: boolean) => void,
    straight: boolean,
    P: number,
    finished: boolean,
    setSelectedPoint: (point: RealPointInterface) => void,
    selectedPoint?: RealPointInterface,
    angleMode?: boolean,
    setActualAngle ?: (angle : number) => void,
    setIsFinishedAngleChoose ?: (isFinishedAngleChoose : boolean) => void,
    setIsStartedAngleChoose ?: (isStartedAngleChoose : boolean) => void,
    isNeedToMakeAgain ?: boolean,
    moveMode ?: boolean,
    updatePoint ?: (index : number, point : RealPointInterface) => void,
    coverage ?: string,
    setWasMovedMouse : (wasMovedMouse : boolean) => void
}


function DrawArea(props: DrawAreaProps) {

    const [figureLines, setFigureLines] = useState<WindowLineInterface[]>([])
    const [supportLines, setSupportLines] = useState<WindowLineInterface[]>([])
    const [currentLine, setCurrentLine] = useState<WindowLineInterface>()
    const [currentAngle, setCurrentAngle] = useState<WindowLineInterface>()
    const [isFinishedAngleChoose, setIsFinishedAngleChoose] = useState<boolean>(false)
    const [angleLine, setAngleLine] = useState<WindowLineInterface>()
    const [actualAngle, setActualAngle] = useState<number>(0) // theta
    const [movedPoint, setMovedPoint] = useState<number>()

    const [initialPositionMovingPointsOnPlane, setInitialPositionMovingPointsOnPlane] = useState<WindowPointInterface>()
    const [targetOffsetMovingPointsOnPlane, setTargetOffsetMovingPointsOnPlane] = useState<WindowPointInterface>()
    const [targetOffsetMovingPointsOnPlanePoint, setTargetOffsetMovingPointsOnPlanePoint] = useState<WindowPointInterface>()

    const movRef = useRef(false)

    function getLengthReal(line: WindowLineInterface | null | undefined) {
        if (line) {
            let x1 = windowPointToReal(line.first, props.P).x
            let y1 = windowPointToReal(line.first, props.P).y
            let x2 = windowPointToReal(line.second, props.P).x
            let y2 = windowPointToReal(line.second, props.P).y
            return Math.round(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)))
        }
        return 0
    }

    const handleClickOnArea = () => {
        if (angleLine) {
            setIsFinishedAngleChoose(true)
        }
    }

    const handleMouseDownPoint = (pointIndex : number) => {
        setMovedPoint(pointIndex)
    }


    const handleMouseMovePoint = () => {
        if (movRef.current) {
            if (movedPoint !== undefined && props.cursorPosition && props.updatePoint) {
                props.updatePoint(movedPoint, (windowPointToReal(findNearestCellPoint(props.cursorPosition, props.P, props.points.length ? props.points[0] : undefined), props.P)))
            }
            if (!props.moveMode) handleMouseMovePlane()
        }
    }

    const handleMouseUpPoint = () => {
        setMovedPoint(undefined)
        handleMouseUpMovePlane()
    }

    const handleMouseUpMovePlane = () => {
        movRef.current = false
        if (targetOffsetMovingPointsOnPlane) {
            let newPoints = [...props.points].map(point => {
                return {
                    x : point.x + targetOffsetMovingPointsOnPlane.x * (1 / CELL_SIZE) * props.P,
                    y : point.y + targetOffsetMovingPointsOnPlane.y * (1 / CELL_SIZE) * props.P,
                }
            })
            props.setPoints(newPoints)
            setTargetOffsetMovingPointsOnPlanePoint(undefined)
        }
    }

    useEffect(() => {
        props.setWasMovedMouse(!!targetOffsetMovingPointsOnPlane && (targetOffsetMovingPointsOnPlane.x !== 0 || targetOffsetMovingPointsOnPlane.y !== 0))
    }, [targetOffsetMovingPointsOnPlane])

    useEffect(() => {
        setTargetOffsetMovingPointsOnPlane(undefined)
    }, [props.points])

    const handleMouseMovePlane = () => {
        if (movRef.current && initialPositionMovingPointsOnPlane && props.cursorPosition) {
            setTargetOffsetMovingPointsOnPlane({
                x: props.cursorPosition.x - initialPositionMovingPointsOnPlane.x,
                y: props.cursorPosition.y - initialPositionMovingPointsOnPlane.y
            })
            setTargetOffsetMovingPointsOnPlanePoint({
                x: props.cursorPosition.x - initialPositionMovingPointsOnPlane.x,
                y: props.cursorPosition.y - initialPositionMovingPointsOnPlane.y
            })
        }
    }

    const handleMouseDownMove = () => {
        movRef.current = true
        setInitialPositionMovingPointsOnPlane(props.cursorPosition)
    }

    useEffect(() => {
        if (props.cursorPosition && props.points.length) {
            if (getLengthWindow({
                first: {
                    x: props.cursorPosition.x,
                    y: props.cursorPosition.y
                }, second: realPointToWindow(props.points[0], props.P)
            }) < 30) {
                setCurrentLine({
                    first: realPointToWindow(props.points[props.points.length - 1], props.P),
                    second: realPointToWindow(props.points[0], props.P)
                })
            } else {
                if (props.straight) {
                    setCurrentLine(findClosestSegment(
                        realPointToWindow(props.points[props.points.length - 1], props.P),
                        findNearestCellPoint({
                            x: props.cursorPosition.x,
                            y: props.cursorPosition.y
                        }, props.P, props.points.length ? props.points[0] : undefined)
                    ))
                } else {
                    setCurrentLine({
                        first: realPointToWindow(props.points[props.points.length - 1], props.P),
                        second: findNearestCellPoint({
                            x: props.cursorPosition.x,
                            y: props.cursorPosition.y
                        }, props.P, props.points.length ? props.points[0] : undefined)
                    })
                }
            }

        }
    }, [props.cursorPosition, figureLines, props.P])
    useEffect(() => {
        let newFigureLines = []
        for (let i = 0; i < props.points.length - 1; i++) {
            newFigureLines.push({
                first: realPointToWindow(props.points[i], props.P),
                second: realPointToWindow(props.points[i + 1], props.P)
            })
        }
        setFigureLines(newFigureLines)
    }, [props.points, props.P])
    useEffect(() => {
        if (currentLine) {
            let newSupportLines = []
            for (let i = 0; i < props.points.length - 1; i++) {
                newSupportLines.push({
                    first: realPointToWindow(props.points[i], props.P),
                    second: currentLine.second
                })
            }
            setSupportLines(newSupportLines)
            if (!props.points.length) {
                setCurrentLine(undefined)
                props.setInactiveLine(false)
                return
            }
            if (checkForLineIntersections([...figureLines, currentLine]) || calculateDistance(currentLine.second, figureLines) < 10) {
                if (getLengthReal({
                    first: currentLine.second,
                    second: realPointToWindow(props.points[0], props.P)
                }) < 3) {
                    props.setInactiveLine(false)
                } else {
                    props.setInactiveLine(true)
                }
            } else {
                props.setInactiveLine(false)
            }
        }
    }, [props.points, currentLine, props.P])
    useEffect(() => {
        setCurrentAngle(undefined)
        setAngleLine(undefined)
        setIsFinishedAngleChoose(false)
    }, [props.P, props.isNeedToMakeAgain])
    useEffect(() => {
        if (props.setActualAngle) {
            props.setActualAngle(actualAngle)
        }
    }, [actualAngle])
    useEffect(() => {
        if (angleLine && props.setIsStartedAngleChoose) {
            props.setIsStartedAngleChoose(!!angleLine)
        }
    }, [angleLine])
    useEffect(() => {
        if (props.setIsFinishedAngleChoose) {
            props.setIsFinishedAngleChoose(isFinishedAngleChoose)
        }
    }, [isFinishedAngleChoose])

    return (
        <div onMouseDown={handleMouseDownMove} className="DrawArea" onClick={handleClickOnArea} onMouseLeave={handleMouseUpPoint} onMouseUp={handleMouseUpPoint} onMouseMove={handleMouseMovePoint}>
            <div className="DrawArea__Coverage" style={{ left : targetOffsetMovingPointsOnPlane?.x, top: targetOffsetMovingPointsOnPlane?.y }}>
                { typeof props.coverage === 'string' && <div dangerouslySetInnerHTML={{__html: props.coverage}}/> }
            </div>
            <div className="DrawArea__Lines" style={{ left : targetOffsetMovingPointsOnPlanePoint?.x, top: targetOffsetMovingPointsOnPlanePoint?.y }}>
                <div className="DrawArea__Lines--X">
                    {[...new Array(4 * FULL_WIDTH / CELL_SIZE)].map((_, index: number) => {
                        return (
                            <div style={{
                                left: realPointToWindow({ x : (props.points.length ? props.points[0].x : 0) + props.P * (index), y: 0}, props.P).x
                            }}/>
                        )
                    })}
                </div>
                <div className="DrawArea__Lines--Y">
                    {[...new Array(4 * FULL_HEIGHT / CELL_SIZE)].map((_, index: number) => {
                        return (
                            <div style={{
                                top: realPointToWindow({ y : (props.points.length ? props.points[0].y : 0) + props.P * (index), x: 0}, props.P).y
                            }}/>
                        )
                    })}
                </div>
                <div className="DrawArea__Lines--X DrawArea__Lines--X--Large">
                    {[...new Array(FULL_WIDTH / CELL_SIZE)].map((_, index: number) => {
                        return (
                            <div style={{
                                left: realPointToWindow({ x : (props.points.length ? props.points[0].x : 0) + 4 * props.P * (index), y: 0}, props.P).x
                            }}/>
                        )
                    })}
                </div>
                <div className="DrawArea__Lines--Y DrawArea__Lines--Y--Large">
                    {[...new Array(FULL_HEIGHT / CELL_SIZE)].map((_, index: number) => {
                        return (
                            <div style={{
                                top: realPointToWindow({ y : (props.points.length ? props.points[0].y : 0) + 4 * props.P * (index), x: 0}, props.P).y
                            }}/>
                        )
                    })}
                </div>
            </div>
            {props.points.length && !props.finished && (props.points.length <= 2 || !isPointsSame(props.points[0], props.points[props.points.length - 1]))   ? (
                <div className="DrawArea__Axis" style={{ left : targetOffsetMovingPointsOnPlane?.x, top: targetOffsetMovingPointsOnPlane?.y }}>
                    <div className="DrawArea__Axis--X"
                         style={{
                             left: realPointToWindow(props.points[props.points.length - 1], props.P).x,
                        }}/>
                    <div className="DrawArea__Axis--Y"
                         style={{
                             top: realPointToWindow(props.points[props.points.length - 1], props.P).y
                        }}/>
                </div>
            ) : <></>}
            <div className="DrawArea__Points" style={{ left : targetOffsetMovingPointsOnPlanePoint?.x, top: targetOffsetMovingPointsOnPlanePoint?.y }}>
                {props.points.map((point, index) => {
                    return (
                        <Point
                            index={index}
                            onMouseDown={handleMouseDownPoint}
                            inactive={ !!(angleLine && currentAngle && getLengthWindow({ first: currentAngle.first, second : realPointToWindow(point, props.P) }) > 10 && getLengthWindow({ first: currentAngle.second, second : realPointToWindow(point, props.P) }) > 10) }
                            selected={point === props.selectedPoint && !props.angleMode} setSelected={() => {
                            props.finished && props.setSelectedPoint(point)
                        }} finished={props.finished || (props.points.length > 2 && isPointsSame(props.points[0], props.points[props.points.length - 1]))} point={realPointToWindow(point, props.P)}/>
                    )
                })}
            </div>
            <div className="DrawArea__Figure" style={{ left : targetOffsetMovingPointsOnPlane?.x, top: targetOffsetMovingPointsOnPlane?.y }}>
                {
                    figureLines.map((line) => (
                        <DrawLine angleLine={angleLine} isFinishedAngleChoose={isFinishedAngleChoose} setAngleLine={setAngleLine} P={props.P} points={props.points}
                                  activeAngle={JSON.stringify(currentAngle) === JSON.stringify(line)} setActiveAngle={setCurrentAngle}
                                  angleMode={props.angleMode} cursorPosition={props.cursorPosition}
                                  line={line} length={getLengthReal(line)}
                                  setActualAngle={setActualAngle}
                                  
                        />
                    ))
                }
            </div>
            {!props.finished && (props.points.length < 2 || !isPointsSame(props.points[0], props.points[props.points.length - 1])) && (
                <div className="DrawArea__SupportLines" style={{ display : (targetOffsetMovingPointsOnPlane?.x !== undefined && targetOffsetMovingPointsOnPlane?.y !== undefined) ? 'none' : 'block' }}>
                    {
                        supportLines.map((line) => (
                            <DrawLine line={line} length={getLengthReal(line)} supportLine/>
                        ))
                    }
                </div>
            )}
            {!props.finished && (props.points.length < 2 || !isPointsSame(props.points[0], props.points[props.points.length - 1])) && (
                <div className="DrawArea__CurrentLine" style={{ display : (targetOffsetMovingPointsOnPlane?.x !== undefined && targetOffsetMovingPointsOnPlane?.y !== undefined) ? 'none' : 'block' }}>
                    <DrawLine line={currentLine} length={getLengthReal(currentLine)} lastLine
                              inactive={props.inactiveLine}/>
                </div>
            )}

        </div>
    )

}

export default DrawArea