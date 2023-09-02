import React from 'react'
import {DimensionsElementInterface} from "../../interfaces/DimensionsElementInterface";
import LargeCheckbox from "../global/LargeCheckbox";
import Checkbox from "../global/Checkbox";

interface WidthItemProps extends DimensionsElementInterface {
    active : boolean,
    handleSelect : () => void,
    single : boolean
}

function WidthItem(props : WidthItemProps) {

    return (
        <div onClick={props.handleSelect} className="WidthItem">
            <div className="WidthItem__Image">
                { props.image }
                <div className={"WidthItem__Image__Title " + (props.active ? '_active' : '')}>
                    { props.title }
                </div>
                { !props.single && (
                    <div className="WidthItem__Image__Checkbox">
                        <Checkbox active={props.active } />
                    </div>
                )}
            </div>
        </div>
    )

}

export default WidthItem