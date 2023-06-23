import React from 'react'
import {RealPointInterface} from "./utils/Utils";

interface PointProps {
    point : RealPointInterface,
    index : number,
    finished : boolean,
    selected : boolean,
    setSelected : () => void,
    inactive : boolean,
    onMouseDown : (index : number) => void
}

function Point(props : PointProps) {
    return (
        <div onMouseDown={() => props.onMouseDown(props.index) } onClick={props.setSelected} className={"DrawArea__Point " + (props.inactive ? '_inactive' : props.selected ? '_selected' : props.finished ? '_finished' : '')} style={{
            left: props.point.x,
            top: props.point.y
        }} />
    )
}

export default Point