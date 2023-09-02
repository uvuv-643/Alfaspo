import React, {ReactNode} from 'react'
import MaterialElementInterface from "../../interfaces/MaterialElementInterface";

interface MaterialItemProps extends MaterialElementInterface {
    active : boolean,
    image : ReactNode,
    handleClick: () => void
}

function MaterialItem(props : MaterialItemProps) {

    return (
        <div className={"MaterialItem " + (props.active ? '_active' : '') }>
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
                {/*<LargeCheckbox active={props.active} className="MaterialItem__Checkbox" />*/}
                <div className="MaterialItem__List">
                    <ul>
                        { props.list.map((element : string) => (
                            <li>{ element }</li>
                        )) }
                    </ul>
                </div>
                <div className="MaterialItem__Button" onClick={props.handleClick} >
                    Обрати
                    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L8 8L1 15" strokeWidth="2"/>
                    </svg>
                </div>
            </div>
        </div>
    )

}

export default MaterialItem