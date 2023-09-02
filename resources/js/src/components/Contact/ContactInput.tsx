import * as React from 'react'
import {useState} from "react";

interface ContactInputProps {
    id : string,
    title : string,
    value : string,
    setValue : (data : string) => void,
    error ?: boolean,
    correct ?: boolean
}

function ContactInput(props : ContactInputProps) {

    let isCorrect = !props.error && props.value.length > 0 && (props.correct === undefined || props.correct)
    const [selected, setSelected] = useState<boolean>(false)

    return (
        <div className={"Contact__Input " + (props.error ? '_error' : (props.value.length > 0) ? '_filled' : '') } onFocus={() => setSelected(true)} onBlur={() => setSelected(false)} >
            <label htmlFor={props.id} className={selected ? '_selected' : ''}>
                <span>{ props.title }</span>
                { props.error && <span>невірний формат</span> }
            </label>
            <div className="Contact__Input__Wrapper">
                <input
                    type="text"
                    id={props.id}
                    value={props.value}
                    onChange={(e) => { props.setValue(e.target.value)} }
                />
                { props.error && (
                    <div className="Contact__Input__Icon">
                        <img src="/images/contact/error.svg" alt="Error icon"/>
                    </div>
                )}
                { isCorrect && (
                    <div className="Contact__Input__Icon">
                        <img src="/images/contact/check.svg" alt="Check icon"/>
                    </div>
                )}
            </div>
        </div>
    )

}

export default ContactInput