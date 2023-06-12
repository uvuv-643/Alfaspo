import React, {ReactNode, useEffect, useState} from 'react'
import {DimensionsElementInterface} from "../interfaces/DimensionsElementInterface";
import {MarginElementInterface} from "../interfaces/MarginElementInterface";
import MarginItem from "./Margin/MarginItem";

interface MarginProps {
    selectedWidth : DimensionsElementInterface | null,
    selectedHeight : DimensionsElementInterface | null,
    selectedMargin : MarginElementInterface | null,
    handleSelectMargin : (element : MarginElementInterface) => void
}

function Margin(props : MarginProps) {

    const [marginItems, setMarginItems] = useState<MarginElementInterface[]>([])

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
            if ([30].includes(props.selectedWidth?.value || -1)) {
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
            { marginItems.map((element : MarginElementInterface) => {
                return (
                    <MarginItem { ... element} active={ props.selectedMargin?.id === element.id} handleSelect={() => { props.handleSelectMargin(element) }}/>
                )
            }) }
        </div>
    )

}

export default Margin