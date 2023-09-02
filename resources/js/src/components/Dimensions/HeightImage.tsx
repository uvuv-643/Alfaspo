import React from 'react'

interface HeightImageProps {
    active : boolean,
    width : number,
    height : number,
}

function HeightImage(props : HeightImageProps) {

    return (
        <div className="HeightImage" style={{
            height : props.height * 2 + 'px',
            width : props.width * 2 + 'px',
            borderRadius: '10px',
            border : props.active ? '2px solid #080810' : '2px solid #AAAAAA',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            { (
                <div className="HeightImage__Arrow">
                    <div className="HeightImage__Arrow__Left" />
                    <div className="HeightImage__Arrow__Right" />
                </div>
            ) }
        </div>
    )

}

export default HeightImage