import React from 'react'

interface CheckboxProps {
    active : boolean
}

function Checkbox(props : CheckboxProps) {

    return (
        <div className={"Checkbox " + (props.active ? '_active' : '')}>
            <div className="Checkbox__Content" />
        </div>
    )

}

export default Checkbox