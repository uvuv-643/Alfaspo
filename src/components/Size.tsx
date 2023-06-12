import React from 'react'
import LargeCheckbox from "./global/LargeCheckbox";
import Checkbox from "./global/Checkbox";

interface SizeProps {
    selectedMode : boolean,
    handleSelectMode : (mode : boolean) => void,
    selectedSize : number,
    handleSelectSize : (size : number) => void,
    selectedPlacement : number,
    handleSelectedPlacement : (placement : number) => void
}

function Size(props : SizeProps) {

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
                                        <img src="/images/size/a-active.svg" alt="#"/>
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
                                        <img src="/images/size/b-active.svg" alt="#"/>
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
                                    <label htmlFor="length1" className="Size__Length__Item">
                                        <div>AB i CD</div>
                                        <input id="length1" type="text" />
                                        <div>мм</div>
                                    </label>
                                    <label htmlFor="length2" className="Size__Length__Item">
                                        <div>BC i DA</div>
                                        <input id="length2" type="text" />
                                        <div>мм</div>
                                    </label>
                                </div>
                            ) : (
                                <div className="Size__Length__Wrapper">
                                    <label htmlFor="length3" className="Size__Length__Item">
                                        <div>AB</div>
                                        <input id="length3" type="text" />
                                        <div>мм</div>
                                    </label>
                                    <label htmlFor="length4" className="Size__Length__Item">
                                        <div>DE</div>
                                        <input id="length4" type="text" />
                                        <div>мм</div>
                                    </label>
                                    <label htmlFor="length5" className="Size__Length__Item">
                                        <div>BC</div>
                                        <input id="length5" type="text" />
                                        <div>мм</div>
                                    </label>
                                    <label htmlFor="length6" className="Size__Length__Item">
                                        <div>EF</div>
                                        <input id="length6" type="text" />
                                        <div>мм</div>
                                    </label>
                                    <label htmlFor="length7" className="Size__Length__Item">
                                        <div>CD</div>
                                        <input id="length7" type="text" />
                                        <div>мм</div>
                                    </label>
                                    <label htmlFor="length8" className="Size__Length__Item">
                                        <div>FA</div>
                                        <input id="length8" type="text" />
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
                        <div className="SizeHint SizeHint--Button">
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