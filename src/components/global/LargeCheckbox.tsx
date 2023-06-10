import React from 'react'

interface LargeCheckboxProps {
    active : boolean,
    className ?: string,
    onClick ?: () => void
}

function LargeCheckbox(props : LargeCheckboxProps) {

    return (
        <div onClick={props.onClick} className={ "LargeCheckbox " + props.className + (props.active ? ' _active' : '') }>
            { props.active && <img src="/images/material/checkbox.svg" alt="#" /> }
        </div>
    )

}

export default LargeCheckbox