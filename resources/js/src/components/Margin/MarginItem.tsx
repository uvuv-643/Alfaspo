import React, {ReactNode} from 'react'
import Checkbox from "../global/Checkbox";

interface MarginItemProps {
    id : number,
    active : boolean,
    image : ReactNode,
    imageActive : ReactNode,
    title : string
    handleSelect : () => void
}

function MarginItem(props : MarginItemProps) {
    return (
        <div className="MarginItem" onClick={props.handleSelect}>
            <div className="MarginItem__Wrapper">
                <div className="MarginItem__Image">
                    { props.active ? props.imageActive : props.image }
                </div>
                <div className="MarginItem__Content">
                    <div className={props.active ? '_active' : ''}>{ props.title }</div>
                    <div><Checkbox active={props.active} /></div>
                </div>
            </div>
        </div>
    )
}

export default MarginItem