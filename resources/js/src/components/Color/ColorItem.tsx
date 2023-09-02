import React, {ReactNode} from 'react'
import Checkbox from "../global/Checkbox";
import {ColorElementInterface} from "../../interfaces/ColorElementInterface";

interface ColorProps extends ColorElementInterface {
    active : boolean,
    handleSelect : () => void
}

function ColorItem(props : ColorProps) {
    return (
        <div className={"ColorItem " + (props.isDark ? '_dark ' : '') + (props.light ? '_light' : '')} onClick={ props.handleSelect }>
            <div className="ColorItem__Background">
                {
                    props.image.includes('#') ?
                    <span style={{background: props.image}}></span> :
                    <img src={props.image} alt=""/>
                }
            </div>
            <div className="ColorItem__Content">
                <Checkbox active={ props.active } />
                <div>
                    { props.title }
                </div>
            </div>
        </div>
    )
}

export default ColorItem