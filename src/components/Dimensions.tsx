import React, {useEffect, useState} from 'react'
import {DimensionsElementInterface} from "../interfaces/DimensionsElementInterface";
import WidthItem from "./Dimensions/WidthItem";
import HeightItem from "./Dimensions/HeightItem";
import MaterialElementInterface from "../interfaces/MaterialElementInterface";
import WidthImage from "./Dimensions/WidthImage";
import HeightImage from "./Dimensions/HeightImage";

interface DimensionsProps {
    selectedMaterial: MaterialElementInterface | null,
    selectedWidth: DimensionsElementInterface | null,
    selectedHeight: DimensionsElementInterface | null,
    handleSelectWidth: (element: DimensionsElementInterface) => void,
    handleSelectHeight: (element: DimensionsElementInterface) => void
}

function Dimensions(props: DimensionsProps) {

    const [widthItem, setWidthItem] = useState<DimensionsElementInterface[]>([])
    const [heightItem, setHeightItem] = useState<DimensionsElementInterface[]>([])

    useEffect(() => {
        if (props.selectedMaterial?.id === 1) {
            setWidthItem([{
                id: 1,
                image: <WidthImage width={35} height={40} active={props.selectedWidth?.id === 1}/>,
                title: '35мм',
                value: 35
            }, {
                id: 2,
                image: <WidthImage width={88} height={40} active={props.selectedWidth?.id === 2}/>,
                title: '88мм',
                value: 88
            }])
        } else if (props.selectedMaterial?.id === 2) {
            setWidthItem([{
                id: 3,
                image: <WidthImage width={30} height={40} active={props.selectedWidth?.id === 3}/>,
                title: '30мм',
                value: 30
            }, {
                id: 4,
                image: <WidthImage width={50} height={40} active={props.selectedWidth?.id === 4}/>,
                title: '50мм',
                value: 50
            }, {
                id: 5,
                image: <WidthImage width={85} height={40} active={props.selectedWidth?.id === 5}/>,
                title: '85мм',
                value: 85
            }])
        } else if (props.selectedMaterial?.id === 3) {
            setWidthItem([{
                id: 6,
                image: <WidthImage width={40} height={40} active={props.selectedWidth?.id === 6}/>,
                title: '40мм',
                value: 40
            }])
        }
    }, [props.selectedMaterial])

    useEffect(() => {
        console.log('m', props)
        if (props.selectedMaterial?.id === 1 && [1, 2].includes(props.selectedWidth?.id || -1)) return
        if (props.selectedMaterial?.id === 2 && [3, 4, 5].includes(props.selectedWidth?.id || -1)) return
        if (props.selectedMaterial?.id === 3 && [6].includes(props.selectedWidth?.id || -1)) return
        if (widthItem.length) {
            props.handleSelectWidth(widthItem[0])
        }
    }, [widthItem])

    useEffect(() => {
        console.log('h', props.selectedWidth, props.selectedHeight)
        if (props.selectedWidth?.id === 1 && [1, 2, 3, 4, 5, 6, 7, 8].includes(props.selectedHeight?.id || -1)) return;
        if (props.selectedWidth?.id === 2 && [9, 10, 11, 12, 13].includes(props.selectedHeight?.id || -1)) return;
        if (props.selectedWidth?.id === 3 && [14, 15, 16, 17].includes(props.selectedHeight?.id || -1)) return;
        if (props.selectedWidth?.id === 4 && [18, 19, 20].includes(props.selectedHeight?.id || -1)) return;
        if (props.selectedWidth?.id === 5 && [21, 22, 23].includes(props.selectedHeight?.id || -1)) return;
        if (props.selectedWidth?.id === 6 && [24, 25, 26].includes(props.selectedHeight?.id || -1)) return;
        if (heightItem.length) {
            props.handleSelectHeight(heightItem[0])
        }
    }, [heightItem])

    useEffect(() => {
        if (props.selectedWidth?.id === 1) {
            setHeightItem([{
                id: 1,
                image: <HeightImage width={32.5} height={35} active={props.selectedHeight?.id === 1}/>,
                margin: 0,
                title: '35мм',
                value: 35
            }, {
                id: 2,
                image: <HeightImage width={32.5} height={45} active={props.selectedHeight?.id === 2}/>,
                margin: 10,
                title: '45мм',
                value: 45
            }, {
                id: 3,
                image: <HeightImage width={32.5} height={55} active={props.selectedHeight?.id === 3}/>,
                margin: 10,
                title: '55мм',
                value: 55
            }, {
                id: 4,
                image: <HeightImage width={32.5} height={62.5} active={props.selectedHeight?.id === 4}/>,
                margin: 10,
                title: '65мм',
                value: 65
            }, {
                id: 5,
                image: <HeightImage width={32.5} height={70} active={props.selectedHeight?.id === 5}/>,
                margin: 10,
                title: '75мм',
                value: 75
            }, {
                id: 6,
                image: <HeightImage width={32.5} height={77.5} active={props.selectedHeight?.id === 6}/>,
                margin: 10,
                title: '85мм',
                value: 85
            }, {
                id: 7,
                image: <HeightImage width={32.5} height={82.5} active={props.selectedHeight?.id === 7}/>,
                margin: 10,
                title: '95мм',
                value: 95
            }, {
                id: 8,
                image: <HeightImage width={32.5} height={90} active={props.selectedHeight?.id === 8}/>,
                margin: 10,
                title: '105мм',
                value: 105
            }])
        } else if (props.selectedWidth?.id === 2) {
            setHeightItem([{
                id: 9,
                image: <HeightImage width={50} height={35} active={props.selectedHeight?.id === 9}/>,
                margin: 0,
                title: '35мм',
                value: 35
            }, {
                id: 10,
                image: <HeightImage width={50} height={45} active={props.selectedHeight?.id === 10}/>,
                margin: 10,
                title: '45мм',
                value: 45
            }, {
                id: 11,
                image: <HeightImage width={50} height={55} active={props.selectedHeight?.id === 11}/>,
                margin: 10,
                title: '55мм',
                value: 55
            }, {
                id: 12,
                image: <HeightImage width={50} height={65} active={props.selectedHeight?.id === 12}/>,
                margin: 10,
                title: '65мм',
                value: 65
            }, {
                id: 13,
                image: <HeightImage width={50} height={80} active={props.selectedHeight?.id === 13}/>,
                margin: 10,
                title: '80мм',
                value: 80
            }])
        } else if (props.selectedWidth?.id === 3) {
            setHeightItem([{
                id: 14,
                image: <HeightImage width={32.5} height={45} active={props.selectedHeight?.id === 14}/>,
                margin: 0,
                title: '40мм',
                value: 40
            }, {
                id: 15,
                image: <HeightImage width={32.5} height={62.5} active={props.selectedHeight?.id === 15}/>,
                margin: 20,
                title: '60мм',
                value: 60
            }, {
                id: 16,
                image: <HeightImage width={32.5} height={77.5} active={props.selectedHeight?.id === 16}/>,
                margin: 20,
                title: '80мм',
                value: 80
            }, {
                id: 17,
                image: <HeightImage width={32.5} height={90} active={props.selectedHeight?.id === 17}/>,
                margin: 20,
                title: '100мм',
                value: 100
            }])
        } else if (props.selectedWidth?.id === 4) {
            setHeightItem([{
                id: 18,
                image: <HeightImage width={50} height={55} active={props.selectedHeight?.id === 18}/>,
                margin: 0,
                title: '50мм',
                value: 50
            }, {
                id: 19,
                image: <HeightImage width={50} height={77.5} active={props.selectedHeight?.id === 19}/>,
                margin: 20,
                title: '80мм',
                value: 80
            }, {
                id: 20,
                image: <HeightImage width={50} height={90} active={props.selectedHeight?.id === 20}/>,
                margin: 20,
                title: '100мм',
                value: 100
            }])
        } else if (props.selectedWidth?.id === 5) {
            setHeightItem([{
                id: 21,
                image: <HeightImage width={70} height={62.5} active={props.selectedHeight?.id === 21}/>,
                margin: 0,
                title: '65мм',
                value: 65
            }, {
                id: 22,
                image: <HeightImage width={70} height={77.5} active={props.selectedHeight?.id === 22}/>,
                margin: 20,
                title: '85мм',
                value: 85
            }, {
                id: 23,
                image: <HeightImage width={70} height={90} active={props.selectedHeight?.id === 23}/>,
                margin: 20,
                title: '105мм',
                value: 105
            }])
        } else if (props.selectedWidth?.id === 6) {
            setHeightItem([{
                id: 24,
                image: <HeightImage width={32.5} height={65} active={props.selectedHeight?.id === 24}/>,
                margin: 0,
                title: '55мм',
                value: 55
            }, {
                id: 25,
                image: <HeightImage width={32.5} height={77.5} active={props.selectedHeight?.id === 25}/>,
                margin: 160,
                title: '80мм',
                value: 80
            }, {
                id: 26,
                image: <HeightImage width={32.5} height={90} active={props.selectedHeight?.id === 26}/>,
                margin: 160,
                title: '105мм',
                value: 105
            }])
        }
    }, [props.selectedWidth])

    return (
        <div className="Dimensions">
            <div className="Dimensions__Width">
                {widthItem.map(element => (
                    <WidthItem handleSelect={() => {
                        console.log(element);
                        props.handleSelectWidth(element)
                    }} {...element} active={props.selectedWidth?.id === element.id}/>
                ))}
            </div>
            <div className="Dimensions__Height">
                {heightItem.map(element => (
                    <HeightItem handleSelect={() => {
                        props.handleSelectHeight(element)
                    }} {...element} active={props.selectedHeight?.id === element.id}/>
                ))}
            </div>
        </div>
    )

}

export default Dimensions