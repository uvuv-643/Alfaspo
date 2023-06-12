import React from 'react'

interface WidthImageProps {
    active : boolean,
    width : number,
    height : number
}

function WidthImage(props : WidthImageProps) {

    return (
        <div className="WidthImage" style={{
            height : props.height * 2 + 'px',
            width : props.width * 2 + 'px',
            borderRadius: '10px',
            border : props.active ? '2px solid #080810' : '2px solid #AAAAAA',
            padding: '10px',
            display: 'flex',
            alignItems: 'center'
        }}>
            { (
                <div className="WidthImage__Arrow">
                    <div className="WidthImage__Arrow__Left" />
                    <div className="WidthImage__Arrow__Right" />
                </div>
            ) }
        </div>
    )

}

export default WidthImage