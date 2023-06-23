import React, {ReactNode, useEffect, useRef, useState} from 'react'
import '../assets/styles/main.scss'
import {
    findClosestSegment,
    getLengthWindow,
    isValidPolygon,
    RealPointInterface, realPointToWindow,
    WindowPointInterface, windowPointToReal
} from "./Draw/utils/Utils";
import Sidebar from "./global/Sidebar";
import {PAGES} from "../enums/Pages";
import {SidebarSelectedValues} from "../interfaces/SidebarSelectedValues";
import {useNavigate} from "react-router-dom";
import DrawArea from "./Draw/DrawArea";

interface DrawProps {
    currentPage : PAGES,
    sendRedirectTo : string | null,
    availableRedirect : boolean,
    handleNext : () => void,
    handleBack ?: () => void,
    selectedValues : SidebarSelectedValues,
}

function Draw(props : DrawProps) {

    const [cursorPosition, setCursorPosition] = useState<WindowPointInterface>()
    const [scroll, setScroll] = useState<number>(0)
    const [usedShift, setUsedShift] = useState<boolean>(false)
    const [points, setPoints] = useState<RealPointInterface[]>([])
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
            let currentPoint = {
                x : cursorPosition.x,
                y : cursorPosition.y
            }
            if (usedShift) {
                currentPoint = findClosestSegment(
                    realPointToWindow(points[points.length - 1], P, 0),
                    {
                        x : cursorPosition.x,
                        y : cursorPosition.y
                    }
                ).second
            }
            if (points.length >= 3 && getLengthWindow( { first: currentPoint, second: realPointToWindow(points[0], P, 0) } ) < 30) {
                currentPoint = realPointToWindow(points[0], P, 0)
                setFinishedBuilding(true)
            }
            let newPoint = windowPointToReal(currentPoint, P);
            let oldPoints = [...points]
            oldPoints.push(newPoint)
            setPoints(oldPoints)
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
        if ((event.ctrlKey || event.metaKey) && (event.keyCode === 13) && points.length >= 3 && !finishedBuilding) {
            let currentPoint = realPointToWindow(points[0], P, 0)
            let newPoint = windowPointToReal(currentPoint, P);
            let oldPoints = [...points]
            oldPoints.push(newPoint)
            if (isValidPolygon(oldPoints)) {
                setFinishedBuilding(true)
                setPoints(oldPoints)
            }
        }
        if (event.keyCode === 46 && finishedBuilding && selectedPoint) {
            if (angleMode) return
            let oldPoints = [...points]
            let index = oldPoints.indexOf(selectedPoint);
            if (index > 0 && index < points.length - 1) {
                oldPoints.splice(index, 1);
            }
            if (isValidPolygon(oldPoints)) {
                setPoints(oldPoints)
            }
        }
    }

    const handleReset = (event : React.MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        setPoints([])
        setInactiveLine(false)
        setFinishedBuilding(false)
    }

    const handleBack = (event : React.MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        if (points.length === 0) return
        let oldPoints = [...points]
        let items = oldPoints.splice(points.length - 1, 1)
        setPoints(oldPoints)
        let oldCancelledItems = [...cancelledItems]
        oldCancelledItems.push(items[0])
        setCancelledItems(oldCancelledItems)
    }

    const handleNext = (event : React.MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        if (cancelledItems.length === 0) return
        let oldPoints = [...points]
        oldPoints.push(cancelledItems[cancelledItems.length - 1])
        setPoints(oldPoints)
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

    const handleUpdatePoint = (index : number, newPosition : RealPointInterface) => {
        let oldPoints = [...points]
        if (index === 0 || index === points.length - 1) {
            oldPoints[0] = newPosition
            oldPoints[points.length - 1] = newPosition
        } else {
            oldPoints[index] = newPosition
        }
        if (isValidPolygon(oldPoints)) {
            setPoints(oldPoints)
        }
    }

    useEffect(() => {
        if (scroll > 0) {
            if (P === 100) setP(200)
            else if (P === 50) setP(100)
            else if (P === 20) setP(50)
            else if (P === 10) setP(20)
            else setP(200)
        } else if (scroll < 0) {
            if (P === 200) setP(100)
            else if (P === 100) setP(50)
            else if (P === 50) setP(20)
            else if (P === 20) setP(10)
            else setP(100)
        }
        setScroll(0)
    }, [scroll])

    useEffect(() => {
        if (finishedBuilding && !angleMode) {
            setSquare(parseFloat((calculateSquare(points) / 1000000).toFixed(2)))
            let allPoints = [...points]
            allPoints.forEach((point : RealPointInterface) => {
                let targetWindowPoint = realPointToWindow(point, P, 112)
                if (targetWindowPoint.x < 0 || targetWindowPoint.y < 0 || targetWindowPoint.x > 900 + 112 || targetWindowPoint.y > 600 + 112) {
                    setP(P * 2)
                    return
                }
            })
        }
    }, [finishedBuilding, points])

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
    }, [points, finishedBuilding, selectedPoint]);


    useEffect(() => {
        if (props.availableRedirect && props.sendRedirectTo !== null) {
            navigate(props.sendRedirectTo)
        }
    }, [props.sendRedirectTo])

    if (moveMode) {
        return (
            <div className="Draw" onClick={handleClickOnArea} onWheel={scrollHandler} onMouseMove={mouseMoveHandler} onMouseEnter={(event : React.MouseEvent) => setRect(event.currentTarget.getBoundingClientRect())}>
                <DrawArea
                    cursorPosition={cursorPosition}
                    scroll={scroll}
                    points={points}
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
                    isNeedToMakeAgain={isNeedToMakeAgain}
                    setActualAngle={setActualAngle}
                    setIsFinishedAngleChoose={setIsFinishedAngleChoose}
                    setIsStartedAngleChoose={setIsStartedAngleChoose}
                    cursorPosition={cursorPosition}
                    scroll={scroll}
                    straight={usedShift}
                    points={points}
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
                            <div className={"Draw__Hints--Angle__Next " + (isFinishedAngleChoose ? '_active' : '')}>
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
                        left={-112}
                        cursorPosition={cursorPosition}
                        scroll={scroll}
                        straight={usedShift}
                        points={points}
                        inactiveLine={inactiveLine}
                        setInactiveLine={setInactiveLine}
                        P={P}
                        finished={finishedBuilding}
                        setSelectedPoint={setSelectedPoint}
                        selectedPoint={selectedPoint}
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
                cursorPosition={cursorPosition}
                scroll={scroll}
                straight={usedShift}
                points={points}
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
                        style={{ opacity: points.length === 0 ? 0.5 : 1 }}
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