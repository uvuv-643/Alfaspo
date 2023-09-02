import React, {ReactNode, useEffect, useState} from 'react'
import {DimensionsElementInterface} from "../interfaces/DimensionsElementInterface";
import {MarginElementInterface} from "../interfaces/MarginElementInterface";
import MarginItem from "./Margin/MarginItem";
import {useNavigate} from "react-router-dom";

interface MarginProps {
    selectedWidth : DimensionsElementInterface | null,
    selectedHeight : DimensionsElementInterface | null,
    selectedMargin : MarginElementInterface | null,
    handleSelectMargin : (element : MarginElementInterface) => void
}

function Margin(props : MarginProps) {

    const [marginItems, setMarginItems] = useState<MarginElementInterface[]>([])

    const navigate = useNavigate()

    const handleBack = () => {
        navigate('/dimension')
    }

    const handleNext = () => {
        navigate('/color')
    }

    useEffect(() => {

        if ([35, 88].includes(props.selectedWidth?.value || -1)) {
            let targetElements = [
                {
                    id : 1,
                    title : '17мм',
                    value : 17,
                    image : <img src="/images/margin/17.svg" alt="#" />,
                    imageActive : <img src="/images/margin/17a.svg" alt="#" />
                },
                {
                    id : 2,
                    title : '69мм',
                    value : 69,
                    image : <img src="/images/margin/69.svg" alt="#" />,
                    imageActive : <img src="/images/margin/69a.svg" alt="#" />
                },
                {
                    id : 3,
                    title : '121мм',
                    value : 121,
                    image : <img src="/images/margin/121.svg" alt="#" />,
                    imageActive : <img src="/images/margin/121a.svg" alt="#" />
                }
            ]
            if ([35, 45, 55, 65].includes(props.selectedHeight?.value || -1)) {
                targetElements.splice(2, 1)
            } else if (props.selectedWidth?.value === 35 && [85, 95, 105].includes(props.selectedHeight?.value || -1)) {
                targetElements.splice(0, 1)
            } else if (props.selectedWidth?.value === 88 && [80].includes(props.selectedHeight?.value || -1)) {
                targetElements.splice(0, 1)
            }
            setMarginItems(targetElements)
        } else if ([30, 50, 85].includes(props.selectedWidth?.value || -1)) {
            let targetElements = ([
                {
                    id : 4,
                    title : '20мм',
                    value : 20,
                    image : <img src="/images/margin/20.svg" alt="#" />,
                    imageActive : <img src="/images/margin/20a.svg" alt="#" />
                },
                {
                    id : 5,
                    title : '30мм',
                    value : 30,
                    image : <img src="/images/margin/30.svg" alt="#" />,
                    imageActive : <img src="/images/margin/30a.svg" alt="#" />
                },
                {
                    id : 6,
                    title : '40мм',
                    value : 40,
                    image : <img src="/images/margin/40.svg" alt="#" />,
                    imageActive : <img src="/images/margin/40a.svg" alt="#" />
                },
                {
                    id : 7,
                    title : '70мм',
                    value : 70,
                    image : <img src="/images/margin/70.svg" alt="#" />,
                    imageActive : <img src="/images/margin/70a.svg" alt="#" />
                },
                {
                    id : 8,
                    title : '100мм',
                    value : 100,
                    image : <img src="/images/margin/100.svg" alt="#" />,
                    imageActive : <img src="/images/margin/100a.svg" alt="#" />
                }
            ])
            if (![30].includes(props.selectedWidth?.value || -1)) {
                targetElements.splice(0, 1)
            }
            setMarginItems(targetElements)
        } else {
            setMarginItems([
                {
                    id : 9,
                    title : '20мм',
                    value : 20,
                    image : <img src="/images/margin/20.svg" alt="#" />,
                    imageActive : <img src="/images/margin/20a.svg" alt="#" />
                },
                {
                    id : 10,
                    title : '30мм',
                    value : 30,
                    image : <img src="/images/margin/30.svg" alt="#" />,
                    imageActive : <img src="/images/margin/30a.svg" alt="#" />
                },
                {
                    id : 11,
                    title : '40мм',
                    value : 40,
                    image : <img src="/images/margin/40.svg" alt="#" />,
                    imageActive : <img src="/images/margin/40a.svg" alt="#" />
                },
                {
                    id : 12,
                    title : '50мм',
                    value : 50,
                    image : <img src="/images/margin/50.svg" alt="#" />,
                    imageActive : <img src="/images/margin/50a.svg" alt="#" />
                },
                {
                    id : 13,
                    title : '60мм',
                    value : 60,
                    image : <img src="/images/margin/60.svg" alt="#" />,
                    imageActive : <img src="/images/margin/60a.svg" alt="#" />
                }
            ])
        }
    }, [props.selectedWidth, props.selectedHeight])

    useEffect(() => {
        if (marginItems.length && !marginItems.filter((element) => props.selectedMargin?.id === element.id).length) {
            props.handleSelectMargin(marginItems[0])
        }
    }, [marginItems])

    return (
        <div className="Margin">
            <h3>Відстань Між Панелями</h3>
                <div className="Margin__Wrapper">
                { marginItems.map((element : MarginElementInterface) => {
                    return (
                        <MarginItem { ... element} active={ props.selectedMargin?.id === element.id} handleSelect={() => { props.handleSelectMargin(element) }}/>
                    )
                }) }
            </div>

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

export default Margin