import React, {useEffect, useState} from 'react'
import Checkbox from "./global/Checkbox";
import {useNavigate} from "react-router-dom";
import {PointInterface} from "./Draw/utils/Utils";

interface SizeProps {
    selectedMode : number,
    handleSelectMode : (mode : number) => void,
    selectedSize : number,
    handleSelectSize : (size : number) => void,
    selectedPlacement : number,
    handleSelectedPlacement : (placement : number) => void,
    handleGoToDraw : () => void,
    setInputtedSides : (data : string[]) => void,

    setPreferSize : (data : number) => void,
    setSelectedAngle : (data : number) => void,
    setFinishedBuilding : (data : boolean) => void,
    setSelectedPoints : (data : PointInterface[]) => void,

    inputtedSides : string[]

}

const enum SQUARE_SIDES {
    AB,
    BC
}

const enum POLYGON_SIDES {
    AB,
    BC,
    CD,
    DE,
    EF,
    FA,
}

function Size(props : SizeProps) {

    const [focusedSideSquare, setFocusedSideSquare] = useState<SQUARE_SIDES | null>(null)
    const [focusedSidePolygon, setFocusedSidePolygon] = useState<POLYGON_SIDES | null>(null)

    const [selectedSize, setSelectedSize] = useState<number>(JSON.parse(localStorage.getItem('size') || '0'))
    const [selectedSizePlacement, setSelectedSizePlacement] = useState<number>(JSON.parse(localStorage.getItem('size-placement') || '1'))

    const navigate = useNavigate()

    const handleUpdateSides = (side : number, event : any) => {
        if (side < props.inputtedSides.length) {
            let oldSides = [...props.inputtedSides]
            oldSides[side] = event.target.value
            props.setInputtedSides(oldSides)
        }
    }

    const handleSizeSelected = () => {
        if (props.inputtedSides.filter((element) => {
            return (!isNaN(parseInt(element)) && parseInt(element) > 0 && parseInt(element) < 10000)
        }).length === props.inputtedSides.length) {
            let targetSides = props.inputtedSides.map(element => parseInt(element))
            if (targetSides.length === 2) {
                let preferSizeValue = [10, 20, 50, 100, 200].reduce((prev, curr) => {
                    let X = Math.max(targetSides[0], targetSides[1]) / 10
                    return Math.abs(curr - X) < Math.abs(prev - X) ? curr : prev;
                })
                props.setSelectedPoints([
                    {x: -targetSides[1] / 2 - 6 * preferSizeValue, y: -targetSides[0] / 2 - 2 * preferSizeValue},
                    {x: -targetSides[1] / 2 - 6 * preferSizeValue, y: targetSides[0] / 2 - 2 * preferSizeValue},
                    {x: targetSides[1] / 2 - 6 * preferSizeValue, y: targetSides[0] / 2 - 2 * preferSizeValue},
                    {x: targetSides[1] / 2 - 6 * preferSizeValue, y: -targetSides[0] / 2 - 2 * preferSizeValue},
                    {x: -targetSides[1] / 2 - 6 * preferSizeValue, y: -targetSides[0] / 2 - 2 * preferSizeValue}
                ])
                props.setPreferSize(preferSizeValue)
                if (selectedSizePlacement === 1) props.setSelectedAngle(Math.PI / 2)
                else props.setSelectedAngle(0)
            } else if (targetSides.length === 6 ) {
                let ab = targetSides[0]
                let bc = targetSides[1]
                let cd = targetSides[2]
                let de = targetSides[3]
                let ef = targetSides[4]
                let fa = targetSides[5]
                if (fa + de !== bc) {
                    alert('FA + DE має дорівнювати BC')
                    return
                }
                if (cd + ef !== ab) {
                    alert('CD + EF має дорівнювати AB')
                    return
                }
                let preferSizeValue = [10, 20, 50, 100, 200].reduce((prev, curr) => {
                    let X = Math.max(ab, bc) / 10
                    return Math.abs(curr - X) < Math.abs(prev - X) ? curr : prev;
                })
                props.setSelectedPoints([
                    {x: -bc / 2 - 6 * preferSizeValue, y: ab / 2 - 2 * preferSizeValue},
                    {x: -bc / 2 - 6 * preferSizeValue, y: -ab / 2 - 2 * preferSizeValue},
                    {x: bc / 2 - 6 * preferSizeValue, y: -ab / 2 - 2 * preferSizeValue},
                    {x: bc / 2 - 6 * preferSizeValue, y: -ab / 2 + cd - 2 * preferSizeValue},
                    {x: bc / 2 - de - 6 * preferSizeValue, y: -ab / 2 + cd - 2 * preferSizeValue},
                    {x: bc / 2 - de - 6 * preferSizeValue, y: -ab / 2 + cd + ef - 2 * preferSizeValue},
                    {x: -bc / 2 - 6 * preferSizeValue, y: ab / 2 - 2 * preferSizeValue}
                ])
                props.setPreferSize(preferSizeValue)
                if (selectedSizePlacement === 1) props.setSelectedAngle(Math.PI / 2)
                else props.setSelectedAngle(0)
            }
            props.setFinishedBuilding(true)
            navigate('/draw')
        } else {
            alert("Розміри не повинні перевищувати 10000 мм")
        }
    }

    const handleBack = () => {
        navigate('/color')
    }

    const handleNext = () => {
        if (props.selectedMode === 1) {
            handleSizeSelected()
        } else {
            navigate('/draw')
        }
    }

    useEffect(() => {
        if (selectedSize === 1 && props.inputtedSides.length !== 2) {
            props.setInputtedSides(['', ''])
        } else if (selectedSize === 2 && props.inputtedSides.length !== 6) {
            props.setInputtedSides(['', '', '', '', '', ''])
        }
    }, [props.selectedSize])
    
    useEffect(() => {
        props.handleSelectSize(selectedSize)
    }, [selectedSize])
    useEffect(() => {
        props.handleSelectedPlacement(selectedSizePlacement)
    }, [selectedSizePlacement])

    return (
        <div className="Size">
            <div className="Size__Mode">
                <div className={"SizeMode " + (props.selectedMode === 1 ? '_active' : '')} onClick={() => props.handleSelectMode(1)}>
                    <h5>Стандарна Форма Кімнати</h5>
                    <div className={"Size__Mode__Button " + (props.selectedMode === 1 ? '_active' : '')}>
                        { props.selectedMode === 1 ? <>Обране</> : <>Обрати</>}
                        <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.5 8L8.57143 17L18.5 1" strokeWidth="2"/>
                        </svg>
                    </div>
                </div>
                <div className={"SizeMode " + (props.selectedMode === 2 ? '_active' : '')} onClick={() => props.handleSelectMode(2)}>
                    <h5>Нестандартна Форма Кімнати</h5>
                    <div className={"Size__Mode__Button " + (props.selectedMode === 2 ? '_active' : '')}>
                        { props.selectedMode === 2 ? <>Обране</> : <>Обрати</>}
                        <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.5 8L8.57143 17L18.5 1" strokeWidth="2"/>
                        </svg>
                    </div>
                </div>
            </div>
            {
                props.selectedMode === 1 ? (
                    <div className="Size__Items__Wrapper">
                        <div className="Size__Items">
                            <div className="SizeItem" onClick={() => setSelectedSize(1) }>
                                <div className="SizeItem__Content">
                                    <Checkbox active={selectedSize === 1} />
                                </div>
                                <div className="SizeItem__Image">
                                    { selectedSize === 1 ? (
                                        <>
                                            { focusedSideSquare === SQUARE_SIDES.AB && <img src="/images/size/a-activeAB.svg" alt="#"/> }
                                            { focusedSideSquare === SQUARE_SIDES.BC && <img src="/images/size/a-activeBC.svg" alt="#"/> }
                                            { focusedSideSquare === null && <img src="/images/size/a-active.svg" alt="#"/> }
                                        </>
                                    ) : (
                                        <img src="/images/size/a.svg" alt="#"/>
                                    )}
                                </div>

                            </div>
                            <div className="SizeItem" onClick={() => setSelectedSize(2) }>
                                <div className="SizeItem__Content">
                                    <Checkbox active={selectedSize === 2} />
                                </div>
                                <div className="SizeItem__Image">
                                    { selectedSize === 2 ? (
                                        <>
                                            { focusedSidePolygon === POLYGON_SIDES.AB && <img src="/images/size/b-activeAB.svg" alt="#"/> }
                                            { focusedSidePolygon === POLYGON_SIDES.BC && <img src="/images/size/b-activeBC.svg" alt="#"/> }
                                            { focusedSidePolygon === POLYGON_SIDES.CD && <img src="/images/size/b-activeCD.svg" alt="#"/> }
                                            { focusedSidePolygon === POLYGON_SIDES.DE && <img src="/images/size/b-activeDE.svg" alt="#"/> }
                                            { focusedSidePolygon === POLYGON_SIDES.EF && <img src="/images/size/b-activeEF.svg" alt="#"/> }
                                            { focusedSidePolygon === POLYGON_SIDES.FA && <img src="/images/size/b-activeAF.svg" alt="#"/> }
                                            { focusedSidePolygon === null && <img src="/images/size/b-active.svg" alt="#"/> }
                                        </>
                                    ) : (
                                        <img src="/images/size/b.svg" alt="#"/>
                                    )}
                                </div>

                            </div>
                        </div>
                        <div className={"Size__Length " + (selectedSize === 2 ? '_large' : '') }>
                            <h5>Довжина Стін</h5>
                            { selectedSize === 1 ? (
                                <div className="Size__Length__Wrapper">
                                    <label htmlFor="length1" className={ "Size__Length__Item " + (focusedSideSquare === SQUARE_SIDES.AB ? '_active' : '') }>
                                        <div>AB i CD</div>
                                        <input id="length1" type="text" value={props.inputtedSides[0]} onChange={(event) => handleUpdateSides(0, event)} onFocus={() => { setFocusedSideSquare(SQUARE_SIDES.AB) }} onBlur={ () => { setFocusedSideSquare(null) } }/>
                                        <div>мм</div>
                                    </label>
                                    <label htmlFor="length2" className={ "Size__Length__Item " + (focusedSideSquare === SQUARE_SIDES.BC ? '_active' : '') }>
                                        <div>BC i DA</div>
                                        <input id="length2" type="text" value={props.inputtedSides[1]} onChange={(event) => handleUpdateSides(1, event)}  onFocus={() => { setFocusedSideSquare(SQUARE_SIDES.BC) }} onBlur={ () => { setFocusedSideSquare(null) } } />
                                        <div>мм</div>
                                    </label>
                                </div>
                            ) : (
                                <div className="Size__Length__Wrapper">
                                    <label htmlFor="length3" className={ "Size__Length__Item " + (focusedSidePolygon === POLYGON_SIDES.AB ? '_active' : '') }>
                                        <div>AB</div>
                                        <input id="length3" type="text" value={props.inputtedSides[0]} onChange={(event) => handleUpdateSides(0, event)}  onFocus={() => { setFocusedSidePolygon(POLYGON_SIDES.AB) }} onBlur={ () => { setFocusedSidePolygon(null) } } />
                                        <div>мм</div>
                                    </label>
                                    <label htmlFor="length4" className={ "Size__Length__Item " + (focusedSidePolygon === POLYGON_SIDES.BC ? '_active' : '') } >
                                        <div>BC</div>
                                        <input id="length4" type="text" value={props.inputtedSides[1]} onChange={(event) => handleUpdateSides(1, event)}  onFocus={() => { setFocusedSidePolygon(POLYGON_SIDES.BC) }} onBlur={ () => { setFocusedSidePolygon(null) } } />
                                        <div>мм</div>
                                    </label>
                                    <label htmlFor="length5" className={ "Size__Length__Item " + (focusedSidePolygon === POLYGON_SIDES.CD ? '_active' : '') }>
                                        <div>CD</div>
                                        <input id="length5" type="text" value={props.inputtedSides[2]} onChange={(event) => handleUpdateSides(2, event)}  onFocus={() => { setFocusedSidePolygon(POLYGON_SIDES.CD) }} onBlur={ () => { setFocusedSidePolygon(null) } } />
                                        <div>мм</div>
                                    </label>
                                    <label htmlFor="length6" className={ "Size__Length__Item " + (focusedSidePolygon === POLYGON_SIDES.DE ? '_active' : '') }>
                                        <div>DE</div>
                                        <input id="length6" type="text" value={props.inputtedSides[3]} onChange={(event) => handleUpdateSides(3, event)}  onFocus={() => { setFocusedSidePolygon(POLYGON_SIDES.DE) }} onBlur={ () => { setFocusedSidePolygon(null) } } />
                                        <div>мм</div>
                                    </label>
                                    <label htmlFor="length7" className={ "Size__Length__Item " + (focusedSidePolygon === POLYGON_SIDES.EF ? '_active' : '') }>
                                        <div>EF</div>
                                        <input id="length7" type="text" value={props.inputtedSides[4]} onChange={(event) => handleUpdateSides(4, event)}  onFocus={() => { setFocusedSidePolygon(POLYGON_SIDES.EF) }} onBlur={ () => { setFocusedSidePolygon(null) } } />
                                        <div>мм</div>
                                    </label>
                                    <label htmlFor="length8" className={ "Size__Length__Item " + (focusedSidePolygon === POLYGON_SIDES.FA ? '_active' : '') }>
                                        <div>FA</div>
                                        <input id="length8" type="text" value={props.inputtedSides[5]} onChange={(event) => handleUpdateSides(5, event)}  onFocus={() => { setFocusedSidePolygon(POLYGON_SIDES.FA) }} onBlur={ () => { setFocusedSidePolygon(null) } } />
                                        <div>мм</div>
                                    </label>
                                </div>
                            ) }

                        </div>

                        <div className="Size__Placement">
                            <h5>
                                Розташування Панелей
                            </h5>
                            <div className="Size__Placement__Wrapper">
                                <div className="Size__Placement__Item" onClick={() => setSelectedSizePlacement(1)}>
                                    <Checkbox active={selectedSizePlacement === 1} />
                                    <div>По стороні АВ</div>
                                </div>
                                <div className="Size__Placement__Item" onClick={() => setSelectedSizePlacement(2)}>
                                    <Checkbox active={selectedSizePlacement === 2} />
                                    <div>По стороні BC</div>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : props.selectedMode === 2 && (

                    <div className="Size__Hints">
                        <div className="SizeHint">
                            <div className="SizeHint__Image">
                                <img src="/images/size/hint1.png" alt="#"/>
                            </div>
                            <div className="SizeHint__Content">Клік лівою клавішою миші - це початок або завершення побудови стіни.</div>
                        </div>
                        <div className="SizeHint">
                            <div className="SizeHint__Image">
                                <img src="/images/size/hint2.png" alt="#"/>
                            </div>
                            <div className="SizeHint__Content">Одна стіна має <br/>дві точки, контур <br/>і розмір в міліметрах</div>
                        </div>
                        {/*<div className="SizeHint">*/}
                        {/*    <div className="SizeHint__Image">*/}
                        {/*        <img src="/images/size/hint3.png" alt="#"/>*/}
                        {/*    </div>*/}
                        {/*    <div className="SizeHint__Content">Щоб видалити точку потрібно виділити ії та натиснути клавішу Delete.</div>*/}
                        {/*</div>*/}
                        <div className="SizeHint">
                            <div className="SizeHint__Image">
                                <img src="/images/size/hint4.png" alt="#"/>
                            </div>
                            <div className="SizeHint__Content">Контур можна швидко замкнути за допомогою Ctrl (⌘) + Enter.</div>
                        </div>
                        {/*<div className="SizeHint">*/}
                        {/*    <div className="SizeHint__Image">*/}
                        {/*        <img src="/images/size/hint5.png" alt="#"/>*/}
                        {/*    </div>*/}
                        {/*    <div className="SizeHint__Content">Щоб кут був кратен 45° потрібно зажати клавішу Shift поки ведите контур.</div>*/}
                        {/*</div>*/}
                        {/*<div className="SizeHint SizeHint--Button" onClick={props.handleGoToDraw}>*/}
                        {/*    <div>Накреслити Самостійно</div>*/}
                        {/*    <img src="/images/size/next.svg" alt="#"/>*/}
                        {/*</div>*/}
                    </div>
                )
            }

            <div className="Buttons__Wrapper">
                <button onClick={handleBack}>
                    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 15L2 8L9 1" strokeWidth="2"/>
                    </svg>
                    Назад
                </button>
                <button onClick={handleNext}>Далі
                    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L8 8L1 15" strokeWidth="2"/>
                    </svg>
                </button>
            </div>

        </div>
    )

}

export default Size