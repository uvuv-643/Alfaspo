import React, {useEffect, useState} from 'react'
import LargeCheckbox from "./global/LargeCheckbox";
import Checkbox from "./global/Checkbox";

interface SizeProps {
    selectedMode : boolean,
    handleSelectMode : (mode : boolean) => void,
    selectedSize : number,
    handleSelectSize : (size : number) => void,
    selectedPlacement : number,
    handleSelectedPlacement : (placement : number) => void,
    handleGoToDraw : () => void,
    setInputtedSides : (data : string[]) => void,
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

    const [sides, setSides] = useState<string[]>([])

    const handleUpdateSides = (side : number, event : any) => {
        if (side < sides.length) {
            let oldSides = [...sides]
            oldSides[side] = event.target.value
            setSides(oldSides)
        }
    }

    useEffect(() => {
        if (props.selectedSize === 1) {
            setSides(['', ''])
        } else if (props.selectedSize === 2) {
            setSides(['', '', '', '', '', ''])
        }
    }, [props.selectedSize])

    useEffect(() => {
        props.setInputtedSides(sides)
    }, [sides])

    return (
        <div className="Size">
            <div className="Size__Mode">
                <div className={"SizeMode " + (props.selectedMode ? '_active' : '')} onClick={() => props.handleSelectMode(true)}>
                    <h5>Обрати з Стандарних Форм </h5>
                    <LargeCheckbox active={props.selectedMode} />
                </div>
                <div className={"SizeMode " + (!props.selectedMode ? '_active' : '')} onClick={() => props.handleSelectMode(false)}>
                    <h5>Нестандартна Форма Кімнати</h5>
                    <LargeCheckbox active={!props.selectedMode} />
                </div>
            </div>
            {
                props.selectedMode ? (
                    <div className="Size__Items__Wrapper">
                        <div className="Size__Items">
                            <div className="SizeItem" onClick={() => props.handleSelectSize(1) }>
                                <div className="SizeItem__Image">
                                    { props.selectedSize === 1 ? (
                                        <>
                                            { focusedSideSquare === SQUARE_SIDES.AB && <img src="/images/size/a-activeAB.svg" alt="#"/> }
                                            { focusedSideSquare === SQUARE_SIDES.BC && <img src="/images/size/a-activeBC.svg" alt="#"/> }
                                            { focusedSideSquare === null && <img src="/images/size/a-active.svg" alt="#"/> }
                                        </>
                                    ) : (
                                        <img src="/images/size/a.svg" alt="#"/>
                                    )}
                                </div>
                                <div className="SizeItem__Content">
                                    <Checkbox active={props.selectedSize === 1} />
                                </div>
                            </div>
                            <div className="SizeItem" onClick={() => props.handleSelectSize(2) }>
                                <div className="SizeItem__Image">
                                    { props.selectedSize === 2 ? (
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
                                <div className="SizeItem__Content">
                                    <Checkbox active={props.selectedSize === 2} />
                                </div>
                            </div>
                        </div>
                        <div className={"Size__Length " + (props.selectedSize === 2 ? '_large' : '') }>
                            <h5>Довжина Стін</h5>
                            { props.selectedSize === 1 ? (
                                <div className="Size__Length__Wrapper">
                                    <label htmlFor="length1" className={ "Size__Length__Item " + (focusedSideSquare === SQUARE_SIDES.AB ? '_active' : '') }>
                                        <div>AB i CD</div>
                                        <input id="length1" type="text" value={sides[0]} onChange={(event) => handleUpdateSides(0, event)} onFocus={() => { setFocusedSideSquare(SQUARE_SIDES.AB) }} onBlur={ () => { setFocusedSideSquare(null) } }/>
                                        <div>мм</div>
                                    </label>
                                    <label htmlFor="length2" className={ "Size__Length__Item " + (focusedSideSquare === SQUARE_SIDES.BC ? '_active' : '') }>
                                        <div>BC i DA</div>
                                        <input id="length2" type="text" value={sides[1]} onChange={(event) => handleUpdateSides(1, event)}  onFocus={() => { setFocusedSideSquare(SQUARE_SIDES.BC) }} onBlur={ () => { setFocusedSideSquare(null) } } />
                                        <div>мм</div>
                                    </label>
                                </div>
                            ) : (
                                <div className="Size__Length__Wrapper">
                                    <label htmlFor="length3" className={ "Size__Length__Item " + (focusedSidePolygon === POLYGON_SIDES.AB ? '_active' : '') }>
                                        <div>AB</div>
                                        <input id="length3" type="text" value={sides[0]} onChange={(event) => handleUpdateSides(0, event)}  onFocus={() => { setFocusedSidePolygon(POLYGON_SIDES.AB) }} onBlur={ () => { setFocusedSidePolygon(null) } } />
                                        <div>мм</div>
                                    </label>
                                    <label htmlFor="length4" className={ "Size__Length__Item " + (focusedSidePolygon === POLYGON_SIDES.BC ? '_active' : '') } >
                                        <div>DE</div>
                                        <input id="length4" type="text" value={sides[3]} onChange={(event) => handleUpdateSides(3, event)}  onFocus={() => { setFocusedSidePolygon(POLYGON_SIDES.BC) }} onBlur={ () => { setFocusedSidePolygon(null) } } />
                                        <div>мм</div>
                                    </label>
                                    <label htmlFor="length5" className={ "Size__Length__Item " + (focusedSidePolygon === POLYGON_SIDES.CD ? '_active' : '') }>
                                        <div>BC</div>
                                        <input id="length5" type="text" value={sides[1]} onChange={(event) => handleUpdateSides(1, event)}  onFocus={() => { setFocusedSidePolygon(POLYGON_SIDES.CD) }} onBlur={ () => { setFocusedSidePolygon(null) } } />
                                        <div>мм</div>
                                    </label>
                                    <label htmlFor="length6" className={ "Size__Length__Item " + (focusedSidePolygon === POLYGON_SIDES.DE ? '_active' : '') }>
                                        <div>EF</div>
                                        <input id="length6" type="text" value={sides[4]} onChange={(event) => handleUpdateSides(4, event)}  onFocus={() => { setFocusedSidePolygon(POLYGON_SIDES.DE) }} onBlur={ () => { setFocusedSidePolygon(null) } } />
                                        <div>мм</div>
                                    </label>
                                    <label htmlFor="length7" className={ "Size__Length__Item " + (focusedSidePolygon === POLYGON_SIDES.EF ? '_active' : '') }>
                                        <div>CD</div>
                                        <input id="length7" type="text" value={sides[2]} onChange={(event) => handleUpdateSides(2, event)}  onFocus={() => { setFocusedSidePolygon(POLYGON_SIDES.EF) }} onBlur={ () => { setFocusedSidePolygon(null) } } />
                                        <div>мм</div>
                                    </label>
                                    <label htmlFor="length8" className={ "Size__Length__Item " + (focusedSidePolygon === POLYGON_SIDES.FA ? '_active' : '') }>
                                        <div>FA</div>
                                        <input id="length8" type="text" value={sides[5]} onChange={(event) => handleUpdateSides(5, event)}  onFocus={() => { setFocusedSidePolygon(POLYGON_SIDES.FA) }} onBlur={ () => { setFocusedSidePolygon(null) } } />
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
                                <div className="Size__Placement__Item" onClick={() => props.handleSelectedPlacement(1)}>
                                    <Checkbox active={props.selectedPlacement === 1} />
                                    <div>По стороні АВ</div>
                                </div>
                                <div className="Size__Placement__Item" onClick={() => props.handleSelectedPlacement(2)}>
                                    <Checkbox active={props.selectedPlacement === 2} />
                                    <div>По стороні BC</div>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (

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
                        <div className="SizeHint">
                            <div className="SizeHint__Image">
                                <img src="/images/size/hint3.png" alt="#"/>
                            </div>
                            <div className="SizeHint__Content">Щоб видалити точку потрібно виділити ії та натиснути клавішу Delete.</div>
                        </div>
                        <div className="SizeHint">
                            <div className="SizeHint__Image">
                                <img src="/images/size/hint4.png" alt="#"/>
                            </div>
                            <div className="SizeHint__Content">Контур можна швидко замкнути за допомогою Ctrl (⌘) + Enter.</div>
                        </div>
                        <div className="SizeHint">
                            <div className="SizeHint__Image">
                                <img src="/images/size/hint5.png" alt="#"/>
                            </div>
                            <div className="SizeHint__Content">Щоб кут був кратен 45° потрібно зажати клавішу Shift поки ведите контур.</div>
                        </div>
                        <div className="SizeHint SizeHint--Button" onClick={props.handleGoToDraw}>
                            <div>Накреслити Самостійно</div>
                            <img src="/images/size/next.svg" alt="#"/>
                        </div>
                    </div>
                )
            }
        </div>
    )

}

export default Size