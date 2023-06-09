import React from 'react'

interface LargeCheckboxProps {
    active : boolean
}

function LargeCheckbox(props : LargeCheckboxProps) {

    return (
        <div className="LargeCheckbox">
            { props.active && <img src="/images/material/checkbox.svg" alt="#" /> }
        </div>
    )

}

export default LargeCheckbox