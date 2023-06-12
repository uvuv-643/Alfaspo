import React from 'react'
import {DimensionsElementInterface} from "../../interfaces/DimensionsElementInterface";
import LargeCheckbox from "../global/LargeCheckbox";

interface WidthItemProps extends DimensionsElementInterface {
    active : boolean,
    handleSelect : () => void
}

function WidthItem(props : WidthItemProps) {

    return (
        <div onClick={props.handleSelect} className="WidthItem">
            <div className="WidthItem__Image">
                { props.image }
                <div className="WidthItem__Image__Title">
                    { props.title }
                </div>
            </div>
            <LargeCheckbox active={props.active }/>
        </div>
    )

}

export default WidthItem