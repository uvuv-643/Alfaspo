import React, {useLayoutEffect, useRef} from 'react'
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

    const elementRef : React.RefObject<HTMLDivElement> = useRef(null);

    useLayoutEffect(() => {
        if (elementRef.current !== null && elementRef.current) {
            elementRef.current.style.left = `${props.point.x}px`;
            elementRef.current.style.top = `${props.point.y}px`;
        }
    }, [props.point.x, props.point.y]);

    return (
        <div ref={elementRef} onMouseDown={() => props.onMouseDown(props.index) } onClick={props.setSelected} className={"DrawArea__Point " + (props.inactive ? '_inactive' : props.selected ? '_selected' : props.finished ? '_finished' : '')} style={{

        }} />
    )
}

export default Point