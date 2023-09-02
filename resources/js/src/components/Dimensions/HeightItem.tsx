import React from 'react'
import {DimensionsElementInterface} from "../../interfaces/DimensionsElementInterface";
import LargeCheckbox from "../global/LargeCheckbox";
import Checkbox from "../global/Checkbox";

interface HeightItemProps extends DimensionsElementInterface {
    active : boolean,
    handleSelect : () => void
}

function HeightItem(props : HeightItemProps) {

    return (
        <div onClick={props.handleSelect} className="HeightItem" style={{ marginLeft : props.margin }}>
            <div className="HeightItem__Image">
                { props.image }
                <div className={"HeightItem__Image__Title " + (props.active ? '_active' : '')}>
                    { props.title }
                </div>
            </div>
            <Checkbox active={props.active } />
        </div>
    )

}

export default HeightItem