import React, {ReactNode} from 'react'
import LargeCheckbox from "../global/LargeCheckbox";
import MaterialElementInterface from "../../interfaces/MaterialElementInterface";

interface MaterialItemProps extends MaterialElementInterface {
    active : boolean,
    image : ReactNode,
    handleClick: () => void
}

function MaterialItem(props : MaterialItemProps) {

    return (
        <div onClick={props.handleClick} className={"MaterialItem " + (props.active ? '_active' : '') }>
            <div className="MaterialItem__Image">
                <div className="MaterialItem__Image__Actual">
                    { props.image }
                </div>
                <div className="MaterialItem__Image__Title">
                    <h5>{ props.title }</h5>
                    <p>{ props.description }</p>
                </div>
            </div>
            <div className="MaterialItem__Content">
                <LargeCheckbox active={props.active} className="MaterialItem__Checkbox" />
                <div className="MaterialItem__List">
                    <ul>
                        { props.list.map((element : string) => (
                            <li>{ element }</li>
                        )) }
                    </ul>
                </div>
            </div>
        </div>
    )

}

export default MaterialItem