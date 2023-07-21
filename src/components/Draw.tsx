import React, {ReactNode, useEffect, useRef, useState} from 'react'
import '../assets/styles/main.scss'
import {
    findClosestSegment, findNearestCellPoint,
    getLengthWindow, getPanelLocation,
    isValidPolygon,
    RealPointInterface, realPointToWindow,
    WindowPointInterface, windowPointToReal
} from "./Draw/utils/Utils";
import Sidebar from "./global/Sidebar";
import {PAGES} from "../enums/Pages";
import {SidebarSelectedValues} from "../interfaces/SidebarSelectedValues";
import {useNavigate} from "react-router-dom";
import DrawArea, {CELL_SIZE} from "./Draw/DrawArea";
import {DimensionsElementInterface} from "../interfaces/DimensionsElementInterface";
import {MarginElementInterface} from "../interfaces/MarginElementInterface";
import MaterialElementInterface from "../interfaces/MaterialElementInterface";

interface DrawProps {
    currentPage : PAGES,
    sendRedirectTo : string | null,
    availableRedirect : boolean,
    handleNext : () => void,
    handleBack ?: () => void,
    selectedValues : SidebarSelectedValues,
    material : MaterialElementInterface | null,
    width : DimensionsElementInterface | null,
    height : DimensionsElementInterface | null,
    margin : MarginElementInterface | null,
    setPoints : (points : RealPointInterface[]) => void,
    points : RealPointInterface[],
    angle : number | null,
    finishedBuilding : boolean,
    preferSize : number
}

function Draw(props : DrawProps) {

    const [cursorPosition, setCursorPosition] = useState<WindowPointInterface>()
    const [scroll, setScroll] = useState<number>(0)
    const [usedShift, setUsedShift] = useState<boolean>(false)
    // const [points, setPoints] = useState<RealPointInterface[]>([])
    const [inactiveLine, setInactiveLine] = useState<boolean>(false)
    const [P, setP] = useState(100)
    const [finishedBuilding, setFinishedBuilding] = useState<boolean>(false)
    const [square, setSquare] = useState<number>(0)
    const [selectedPoint, setSelectedPoint] = useState<RealPointInterface>()
    const [selectedDropping, setSelectedDropping] = useState<number>(1)
    const [cancelledItems, setCancelledItems] = useState<WindowPointInterface[]>([])
    const [rect, setRect] = useState<DOMRect>()
    const [actualAngle, setActualAngle] = useState<number>()
    const [isStartedAngleChoose, setIsStartedAngleChoose] = useState<boolean>(false)
    const [isFinishedAngleChoose, setIsFinishedAngleChoose] = useState<boolean>(false)
    const [isNeedToMakeAgain, setIsNeedToMakeAgain] = useState<boolean>(false)
    const [angleMode, setAngleMode] = useState<boolean>(false)
    const [moveMode, setMoveMode] = useState<boolean>(false)
    const [coverage, setCoverage] = useState<string>('')

    const isUpdatingScroll = useRef(false)
    const navigate = useNavigate()

    function calculateSquare(points: RealPointInterface[]): number {
        let square = 0;
        for (let i = 0; i < points.length; i++) {
            const currentPoint = points[i];
            const nextPoint = points[(i + 1) % points.length];
            square += currentPoint.x * nextPoint.y - nextPoint.x * currentPoint.y;
        }
        return Math.abs(square / 2);
    }

    function mouseMoveHandler(event : React.MouseEvent) {
        if (rect) {
            setCursorPosition({
                x: event.pageX - rect.x,
                y: event.pageY - rect.y
            })
        }
    }

    function scrollHandler(event : React.WheelEvent) {
        event.preventDefault()
        if (event.ctrlKey) event.stopPropagation();
        if (event.ctrlKey) event.preventDefault();
        if (!isUpdatingScroll.current && (event.ctrlKey || event.metaKey)) {
            setScroll(event.deltaY / Math.abs(event.deltaY))
            isUpdatingScroll.current = true
            setTimeout(() => {
                isUpdatingScroll.current = false
            }, 200)
        }
    }

    function handleClickOnArea(event : React.MouseEvent) {
        if (cursorPosition && !inactiveLine && !finishedBuilding) {
            let currentPoint = findNearestCellPoint({
                x : cursorPosition.x,
                y : cursorPosition.y
            }, P, props.points.length ? props.points[0] : undefined)
            if (usedShift) {
                currentPoint = findClosestSegment(
                    realPointToWindow(props.points[props.points.length - 1], P, 0),
                    currentPoint
                ).second
            }
            if (props.points.length >= 3 && getLengthWindow( { first: currentPoint, second: realPointToWindow(props.points[0], P, 0) } ) < 30) {
                currentPoint = realPointToWindow(props.points[0], P, 0)
                setFinishedBuilding(true)
            }
            let newPoint = windowPointToReal(currentPoint, P);
            let oldPoints = [...props.points]
            oldPoints.push(newPoint)
            props.setPoints(oldPoints)
            setCancelledItems([])
        }
    }

    const handleKeyPress = (event : any) => {
        event.preventDefault()
        if (event.shiftKey) setUsedShift(true)
        if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '=')) {
            setScroll(-1)
            isUpdatingScroll.current = true
            setTimeout(() => {
                isUpdatingScroll.current = false
            }, 200)
        }
        if ((event.ctrlKey || event.metaKey) && (event.key === '-')) {
            setScroll(1)
            isUpdatingScroll.current = true
            setTimeout(() => {
                isUpdatingScroll.current = false
            }, 200)
        }
        if ((event.ctrlKey || event.metaKey) && (event.keyCode === 13) && props.points.length >= 3 && !finishedBuilding) {
            let currentPoint = realPointToWindow(props.points[0], P, 0)
            let newPoint = windowPointToReal(currentPoint, P);
            let oldPoints = [...props.points]
            oldPoints.push(newPoint)
            if (isValidPolygon(oldPoints)) {
                setFinishedBuilding(true)
                props.setPoints(oldPoints)
            }
        }
        if (event.keyCode === 46 && finishedBuilding && selectedPoint) {
            if (angleMode) return
            let oldPoints = [...props.points]
            let index = oldPoints.indexOf(selectedPoint);
            if (index > 0 && index < props.points.length - 1) {
                oldPoints.splice(index, 1);
            }
            if (isValidPolygon(oldPoints)) {
                props.setPoints(oldPoints)
            }
        }
    }

    const handleReset = (event : React.MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        props.setPoints([])
        setInactiveLine(false)
        setFinishedBuilding(false)
    }

    const handleBack = (event : React.MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        if (props.points.length === 0) return
        let oldPoints = [...props.points]
        let items = oldPoints.splice(props.points.length - 1, 1)
        props.setPoints(oldPoints)
        let oldCancelledItems = [...cancelledItems]
        oldCancelledItems.push(items[0])
        setCancelledItems(oldCancelledItems)
    }

    const handleNext = (event : React.MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        if (cancelledItems.length === 0) return
        let oldPoints = [...props.points]
        oldPoints.push(cancelledItems[cancelledItems.length - 1])
        props.setPoints(oldPoints)
        let oldCancelledItems = [...cancelledItems]
        oldCancelledItems.splice(oldCancelledItems.length - 1, 1)
        setCancelledItems(oldCancelledItems)
    }

    const handleBackToSize = (event : React.MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        if (props.handleBack) {
            props.handleBack()
        }
    }

    const handleAngleBack = () => {
        setAngleMode(false)
        setIsFinishedAngleChoose(false)
        setIsStartedAngleChoose(false)
        setActualAngle(90)
    }

    const handleAngleReset = () => {
        setIsNeedToMakeAgain(!isNeedToMakeAgain)
    }

    const handleAngleDone = () => {
        setAngleMode(false)
    }

    const handleUpdatePoint = (index : number, newPosition : RealPointInterface) => {
        let oldPoints = [...props.points]
        if (index === 0 || index === props.points.length - 1) {
            oldPoints[0] = newPosition
            oldPoints[props.points.length - 1] = newPosition
        } else {
            oldPoints[index] = newPosition
        }
        if (isValidPolygon(oldPoints)) {
            props.setPoints(oldPoints)
        }
    }

    useEffect(() => {
        if (finishedBuilding && !angleMode) {
            setSquare(parseFloat((calculateSquare(props.points) / 1000000).toFixed(2)))
        }
    }, [finishedBuilding, props.points])

    useEffect(() => {
        if (!finishedBuilding) {
            setP(100)
        }
    }, [finishedBuilding])

    useEffect(() => {
        if (props.preferSize) {
            setP(props.preferSize)
        }
    }, [props.preferSize])

    useEffect(() => {
        if (scroll > 0) {
            if (P === 100) setP(200)
            else if (P === 50) setP(100)
            else if (P === 20) setP(50)
            else if (P === 10) setP(20)
            else if (P === 200) {}
            else setP(200)
        } else if (scroll < 0) {
            if (P === 200) setP(100)
            else if (P === 100) setP(50)
            else if (P === 50) setP(20)
            else if (P === 20) {}
            else setP(100)
        }
        setScroll(0)
    }, [scroll])

    useEffect(() => {
        let testPlane = document.querySelector('.Draw');
        let callback = function (event : any) { event.preventDefault(); };
        if (testPlane) {
            testPlane.addEventListener('mousewheel', callback);
            testPlane.addEventListener('wheel', callback);
        }
    }, [])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        document.addEventListener('keyup', () => {
            setUsedShift(false)
        })
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [props.points, finishedBuilding, selectedPoint]);

    useEffect(() => {
        if (props.availableRedirect && props.sendRedirectTo !== null) {
            navigate(props.sendRedirectTo)
        }
    }, [props.sendRedirectTo])

    useEffect(() => {
        if (!angleMode && !moveMode && finishedBuilding && actualAngle !== undefined) {
            if (props.width && props.height && props.margin && props.points.length) {
                setCoverage(getPanelLocation(props.points, Number(props.material?.id), props.width.value, props.height.value, props.margin.value, actualAngle, P))
            }
        }
    }, [angleMode, moveMode, finishedBuilding, actualAngle, P, props.points])

    useEffect(() => {
        if (props.angle !== null) {
            setActualAngle(props.angle)
        }
    }, [props.angle])

    useEffect(() => {
        setFinishedBuilding(props.finishedBuilding)
    }, [props.finishedBuilding])

    useEffect(() => {
        localStorage.setItem('finishedBuilding', JSON.stringify(finishedBuilding))
    }, [finishedBuilding])

    useEffect(() => {
        localStorage.setItem('points', JSON.stringify(props.points))
        if (actualAngle !== undefined) {
            localStorage.setItem('angle', JSON.stringify(actualAngle))
        }
    }, [props.points, actualAngle])

    if (moveMode) {
        return (
            <div className="Draw" onClick={handleClickOnArea} onWheel={scrollHandler} onMouseMove={mouseMoveHandler} onMouseEnter={(event : React.MouseEvent) => setRect(event.currentTarget.getBoundingClientRect())}>
                <DrawArea
                    setPoints={props.setPoints}
                    cursorPosition={cursorPosition}
                    scroll={scroll}
                    points={props.points}
                    updatePoint={handleUpdatePoint}
                    P={P}
                    left={0}
                    finished={true}
                    inactiveLine={false}
                    setInactiveLine={() => {}}
                    setSelectedPoint={() => {}}
                    straight={false}
                    moveMode
                />
                <div className="Draw__Hints Draw__Hints--Move">
                    <div className="Draw__Hints__Wrapper">
                        <button className="Draw__Hints--Again" onClick={() => setMoveMode(false)}>Далi</button>
                    </div>
                </div>
            </div>
        )
    }
    if (angleMode) {
        return (
            <div className="Draw" onClick={handleClickOnArea} onWheel={scrollHandler} onMouseMove={mouseMoveHandler} onMouseEnter={(event : React.MouseEvent) => setRect(event.currentTarget.getBoundingClientRect())}>
                <DrawArea
                    setPoints={props.setPoints}
                    isNeedToMakeAgain={isNeedToMakeAgain}
                    setActualAngle={setActualAngle}
                    setIsFinishedAngleChoose={setIsFinishedAngleChoose}
                    setIsStartedAngleChoose={setIsStartedAngleChoose}
                    cursorPosition={cursorPosition}
                    scroll={scroll}
                    straight={usedShift}
                    points={props.points}
                    inactiveLine={inactiveLine}
                    setInactiveLine={setInactiveLine}
                    P={P}
                    finished={finishedBuilding}
                    setSelectedPoint={setSelectedPoint}
                    selectedPoint={selectedPoint}
                    left={0}
                    angleMode
                />
                <div className="Draw__Hints--Angle">
                    <div className="Draw__Hints--Angle__Main">
                        <span>!</span>
                        {
                            !isStartedAngleChoose ?
                                <>1. Оберіть стіну відносно якої буде кут напрямку панелей</> :
                                <>2. Рухаючи стрілку оберіть необхідний кут та натистніть “Додати”</>
                        }
                    </div>
                    <div className="Draw__Hints--Angle__Wrapper">
                        <div className="Draw__Hints--Angle__Back" onClick={handleAngleBack}>
                            <div>
                                <img src="/images/sidebar/prev.svg" alt="#"/>
                            </div>
                            <p>Задати Напрямок</p>
                        </div>
                        <div className="Draw__Hints--Angle__Controls">
                            <div className="Draw__Hints--Angle__Again" onClick={handleAngleReset}>Заново</div>
                            <div className={"Draw__Hints--Angle__Next " + (isFinishedAngleChoose ? '_active' : '')} onClick={handleAngleDone}>
                                Додати
                                {
                                    !isFinishedAngleChoose ?
                                    <img src="/images/draw/next-inactive.svg" alt="#"/> :
                                    <img src="/images/draw/next.svg" alt="#" />
                                }
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    if (finishedBuilding) {
        return <div className="PageWrapper">
            <div className="PageWrapper__Sidebar">
                <Sidebar
                    handleBack={props.handleBack}
                    handleNext={props.handleNext}
                    currentPage={props.currentPage}
                    selectedValues={props.selectedValues}
                    selectedDropping={selectedDropping}
                    setSelectedDropping={setSelectedDropping}
                    square={square}
                />
            </div>
            <div className="PageWrapper__Content" style={{position: 'relative'}}>
                <div className="Draw" style={{width : '674px', height: '487px'}} onClick={handleClickOnArea} onWheel={scrollHandler} onMouseMove={mouseMoveHandler} onMouseEnter={(event : React.MouseEvent) => setRect(event.currentTarget.getBoundingClientRect())}>
                    <DrawArea
                        setPoints={props.setPoints}
                        left={0}
                        cursorPosition={cursorPosition}
                        scroll={scroll}
                        straight={usedShift}
                        points={props.points}
                        inactiveLine={inactiveLine}
                        setInactiveLine={setInactiveLine}
                        P={P}
                        finished={finishedBuilding}
                        setSelectedPoint={setSelectedPoint}
                        selectedPoint={selectedPoint}
                        coverage={coverage}
                    />
                </div>
                <div className="Draw__Manage">
                    <div className="Draw__Manage__Wrapper">
                        <button className="Draw__Manage__Button" onClick={() => setMoveMode(true)}>Рухати Кут</button>
                        <button className="Draw__Manage__Button" onClick={() => setAngleMode(true)}>Задати Напрямок</button>
                        <button className="Draw__Manage__Button" onClick={handleReset}>Накреслити Заново</button>
                    </div>
                </div>
            </div>
        </div>
    }
    return (
        <div className="Draw" onClick={handleClickOnArea} onWheel={scrollHandler} onMouseMove={mouseMoveHandler} onMouseEnter={(event : React.MouseEvent) => setRect(event.currentTarget.getBoundingClientRect())}>
            <DrawArea
                setPoints={props.setPoints}
                cursorPosition={cursorPosition}
                scroll={scroll}
                straight={usedShift}
                points={props.points}
                inactiveLine={inactiveLine}
                setInactiveLine={setInactiveLine}
                P={P}
                finished={finishedBuilding}
                setSelectedPoint={setSelectedPoint}
                selectedPoint={selectedPoint}
                left={0}
            />
            <div className="Draw__Hints">
                <div className="Draw__Hints__Wrapper">
                    <button className="Draw__Hints--Back" onClick={handleBackToSize}><img src="/images/sidebar/prev.svg" alt="#" /></button>
                    <button className="Draw__Hints--Hint">Інструкція</button>
                </div>
                <div className="Draw__Hints__Wrapper">
                    <button className="Draw__Hints--Again" onClick={handleReset}>Накреслити Заново</button>
                    <button
                        onClick={handleBack}
                        className="Draw__Hints--Back"
                        style={{ opacity: props.points.length === 0 ? 0.5 : 1 }}
                    ><img src="/images/draw/back.svg" alt="#"/></button>
                    <button
                        onClick={handleNext}
                        className="Draw__Hints--Forward"
                        style={{ opacity: cancelledItems.length === 0 ? 0.5 : 1 }}
                    ><img src="/images/draw/forward.svg" alt="#"/></button>
                </div>
            </div>
        </div>
    )

}

export default Draw