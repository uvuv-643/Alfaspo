import React from 'react'
import {PAGES} from '../../enums/Pages'
import {SidebarSelectedValues} from "../../interfaces/SidebarSelectedValues";
import Checkbox from "./Checkbox";

interface SidebarProps {
    currentPage : PAGES,
    selectedValues : SidebarSelectedValues,
    handleNext : () => void,
    handleBack ?: () => void,
    selectedDropping ?: number,
    setSelectedDropping ?: (dropping : number) => void,
    square ?: number,
    weight ?: number
}

function Sidebar(props : SidebarProps) {

    let afterActive = false;
    return (
        <div className="Sidebar">
            <div className="Sidebar__Wrapper">
                {
                    Object.entries(PAGES).map((element : [string, PAGES], index) => {
                        if (props.currentPage === PAGES.DRAW && index > 4) return <></>
                            if (props.currentPage === PAGES.DRAW && index === 4) {
                            return (
                                <>
                                    <div className="Sidebar__Item--Draw">
                                        <h3>Опускання Стелі</h3>
                                        <div className="Sidebar__Item--Draw__Items">
                                            <div onClick={ () => props.setSelectedDropping?.(1) } className={"Sidebar__Item--Draw__Item " + (props.selectedDropping === 1 ? '_active' : '') }>
                                                <div>
                                                    <Checkbox active={props.selectedDropping === 1} />
                                                    <p>250мм</p>
                                                </div>
                                            </div>
                                            <div onClick={ () => props.setSelectedDropping?.(4) } className={"Sidebar__Item--Draw__Item " + (props.selectedDropping === 4 ? '_active' : '') }>
                                                <div>
                                                    <Checkbox active={props.selectedDropping === 4} />
                                                    <p>1000мм</p>
                                                </div>
                                            </div>
                                            <div onClick={ () => props.setSelectedDropping?.(2) } className={"Sidebar__Item--Draw__Item " + (props.selectedDropping === 2 ? '_active' : '') }>
                                                <div>
                                                    <Checkbox active={props.selectedDropping === 2} />
                                                    <p>500мм</p>
                                                </div>
                                            </div>
                                            <div onClick={ () => props.setSelectedDropping?.(5) } className={"Sidebar__Item--Draw__Item " + (props.selectedDropping === 5 ? '_active' : '') }>
                                                <div>
                                                    <Checkbox active={props.selectedDropping === 5} />
                                                    <p>1500мм</p>
                                                </div>
                                            </div>
                                            <div onClick={ () => props.setSelectedDropping?.(3) } className={"Sidebar__Item--Draw__Item " + (props.selectedDropping === 3 ? '_active' : '') }>
                                                <div>
                                                    <Checkbox active={props.selectedDropping === 3} />
                                                    <p>750мм</p>
                                                </div>
                                            </div>
                                            <div onClick={ () => props.setSelectedDropping?.(6) }className={"Sidebar__Item--Draw__Item " + (props.selectedDropping === 6 ? '_active' : '') }>
                                                <div>
                                                    <Checkbox active={props.selectedDropping === 6} />
                                                    <p>2000мм</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="Sidebar__Item--Square">
                                        <p>Площа кімнати: <span><span id="target-square">{ props.square }</span>м<sup>2</sup></span></p>
                                        <p>Вага конструкції: <span><span id="target-weight">{ props.weight }</span>кг</span></p>
                                    </div>
                                </>
                            )
                        }
                        const [key, value] = element
                        if (props.currentPage === value) {
                            afterActive = true
                            return (
                                <div className="Sidebar__Item">
                                    <h4>{ value }</h4>
                                </div>
                            )
                        } else {
                            if (value === PAGES.DRAW) return <></>
                            return (
                                <div className="Sidebar__Item Sidebar__Item--done">
                                    <div className="Sidebar__Item__Wrapper">
                                        <div className="Sidebar__Item__Image">
                                            {
                                                afterActive ? (
                                                    <img src="/images/sidebar/checkbox.svg" alt="#"/>
                                                ) : (
                                                    <img src="/images/sidebar/active-checkbox.svg" alt="#"/>
                                                )
                                            }
                                        </div>
                                        <div className="Sidebar__Item__Content">
                                            { afterActive ? (
                                                value
                                            ) : (
                                                props.selectedValues[value]
                                            ) }
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                    })
                }
            </div>
            <div className="Sidebar__Button">
                {
                    props.currentPage !== PAGES.MATERIAL && (
                        <button onClick={props.handleBack}><img src="/images/sidebar/prev.svg" alt="#"/></button>
                    )
                }
                <button onClick={props.handleNext} className="_active">Далі <img src="/images/sidebar/next.svg" alt="#"/></button>
            </div>
        </div>
    )

}

export default Sidebar