import React, {ReactNode} from 'react'
import LargeCheckbox from "../global/LargeCheckbox";

interface MaterialItemProps {
    active : boolean,
    image : ReactNode,
    title : string,
    description : string,
    list : string[]
}

function MaterialItem(props : MaterialItemProps) {

    return (
        <div className={"MaterialItem " + (props.active ? '_active' : '') }>
            <div className="MaterialItem__Image">
                { props.active && (
                    <div className="MaterialItem__Image__Actual">
                        { props.image }
                    </div>
                ) }
                <div className="MaterialItem__Image__Title">
                    <h5>{ props.title }</h5>
                    <p>{ props.description }</p>
                </div>
            </div>
            <div className="MaterialItem__Content">
                <LargeCheckbox active={props.active} />
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