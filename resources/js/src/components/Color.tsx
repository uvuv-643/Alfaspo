import React, {ReactNode, useEffect, useState} from 'react'
import MaterialElementInterface from "../interfaces/MaterialElementInterface";
import {DimensionsElementInterface} from "../interfaces/DimensionsElementInterface";
import ColorItem from "./Color/ColorItem";
import {ColorElementInterface} from "../interfaces/ColorElementInterface";
import {useNavigate} from "react-router-dom";

interface ColorProps {
    selectedMaterial : MaterialElementInterface | null,
    selectedHeight : DimensionsElementInterface | null,
    selectedColor : ColorElementInterface | null,
    handleSelectColor : (element : ColorElementInterface) => void,
    selectedSecondColor : ColorElementInterface | null,
    handleSelectSecondColor : (element : ColorElementInterface) => void,
    changeMode ?: boolean
}

function Color(props : ColorProps) {

    const [colorItems, setColorItems] = useState<ColorElementInterface[]>([])
    const [secondColorItems, setSecondColorItems] = useState<ColorElementInterface[]>([])

    const [color, setColor] = useState<ColorElementInterface | null>(props.selectedColor)
    const [secondColor, setSecondColor] = useState<ColorElementInterface | null>(props.selectedSecondColor)

    useEffect(() => {
        if (!props.changeMode) {
            if (color !== null) props.handleSelectColor(color)
            if (secondColor !== null) props.handleSelectSecondColor(secondColor)
        }
    }, [color, secondColor])

    const navigate = useNavigate()

    const handleBack = () => {
        if (props.changeMode) {
            navigate('/price')
        } else {
            navigate('/margin')
        }
    }

    const handleNext = () => {
        if (props.changeMode) {
            if (color !== null) props.handleSelectColor(color)
            if (secondColor !== null) props.handleSelectSecondColor(secondColor)
            navigate('/price')
        } else {
            navigate('/size')
        }
    }


    useEffect(() => {
        if (props.selectedMaterial?.id === 1) {
            setColorItems([
                {
                    id : 1,
                    isDark : true,
                    image : "#F4F8F4",
                    title : "RAL 9003"
                },
                {
                    id : 2,
                    isDark : true,
                    image : "/images/colors/1_2.png",
                    title : "Дерево 1"
                },
                {
                    id : 3,
                    isDark : true,
                    image : "#A5A8A6",
                    title : "RAL 9006"
                },
                {
                    id : 4,
                    isDark : true,
                    image : "/images/colors/1_4.png",
                    title : "Дерево 2"
                },
                {
                    id : 5,
                    isDark : false,
                    image : "#45494E",
                    title : "RAL 7024"
                },
                {
                    id : 6,
                    isDark : false,
                    image : "/images/colors/1_6.png",
                    title : "Дерево 3"
                },
                {
                    id : 7,
                    isDark : false,
                    image : "#0E0E10",
                    title : "RAL 9005"
                },
                {
                    id : 8,
                    isDark : false,
                    image : "#442F29",
                    title : "RAL 8017"
                },
            ])
            setSecondColorItems([
                {
                    id : 9,
                    isDark : false,
                    light: true,
                    image : "/images/colors/1_11.png",
                    title : "Стандарт"
                },
                {
                    id : 10,
                    isDark : false,
                    image : "#0E0E10",
                    title : "RAL 9005"
                },
                {
                    id : 11,
                    isDark : true,
                    image : "#F4F8F4",
                    title : "RAL 9003"
                },

            ])
        } else if (props.selectedMaterial?.id === 2) {
            setColorItems([
                {
                    id : 12,
                    isDark : true,
                    image : "#F4F8F4",
                    title : "RAL 9003"
                },
                {
                    id : 13,
                    isDark : true,
                    image : "#A5A8A6",
                    title : "RAL 9006"
                },
                {
                    id : 14,
                    isDark : false,
                    image : "/images/colors/2_3.png",
                    title : "Дерево 1"
                },
                {
                    id : 15,
                    isDark : false,
                    image : "#45494E",
                    title : "RAL 7024"
                },
                {
                    id : 16,
                    isDark : true,
                    image : "/images/colors/2_5.png",
                    title : "Дерево 2"
                },
                {
                    id : 17,
                    isDark : false,
                    image : "#0E0E10",
                    title : "RAL 9005"
                },
                {
                    id : 18,
                    isDark : true,
                    image : "/images/colors/2_7.png",
                    title : "Дерево 3"
                },
            ])
            setSecondColorItems([
                {
                    id : 19,
                    isDark : false,
                    image : "#0E0E10",
                    title : "RAL 9005"
                },
                {
                    id : 20,
                    isDark : true,
                    image : "#F4F8F4",
                    title : "RAL 9003"
                },
            ])
        } else if (props.selectedMaterial?.id === 3 && props.selectedHeight?.value !== 55) {
            setColorItems([
                {
                    id : 21,
                    isDark : true,
                    image : "/images/colors/3_1.png",
                    title : "Білий 7593"
                },
                {
                    id : 22,
                    isDark : true,
                    image : "/images/colors/3_2.png",
                    title : "Св. Сірий 7596"
                },
                {
                    id : 23,
                    isDark : false,
                    light: true,
                    image : "/images/colors/3_3.png",
                    title : "Т. Сірий 7598"
                },
                {
                    id : 24,
                    isDark : true,
                    image : "/images/colors/3_4.png",
                    title : "Сірий 7597"
                },
                {
                    id : 25,
                    isDark : false,
                    light: true,
                    image : "/images/colors/3_5.png",
                    title : "Чорний 7594"
                },
            ])
            setSecondColorItems([
                {
                    id : 27,
                    isDark : false,
                    image : "#0E0E10",
                    title : "RAL 9005"
                },
            ])
        } else if (props.selectedMaterial?.id === 3) {
            setColorItems([
                {
                    id : 28,
                    isDark : true,
                    image : "/images/colors/4_1.png",
                    title : "Білий 7593"
                },
                {
                    id : 29,
                    isDark : true,
                    image : "/images/colors/4_2.png",
                    title : "Кремовий 7575"
                },
                {
                    id : 30,
                    isDark : true,
                    image : "/images/colors/4_3.png",
                    title : "Св. Сірий 7596"
                },
                {
                    id : 31,
                    isDark : true,
                    image : "/images/colors/4_4.png",
                    title : "Св. Коричневий 7576"
                },
                {
                    id : 32,
                    isDark : true,
                    image : "/images/colors/4_5.png",
                    title : "Св. Сірий 7597"
                },
                {
                    id : 33,
                    isDark : true,
                    image : "/images/colors/4_6.png",
                    title : "Коричневий 7577"
                },
                {
                    id : 34,
                    isDark : false,
                    light: true,
                    image : "/images/colors/4_7.png",
                    title : "Т. Сірий 7598"
                },
                {
                    id : 35,
                    isDark : true,
                    image : "/images/colors/4_8.png",
                    title : "Т. Коричневий 7578"
                },
                {
                    id : 36,
                    isDark : false,
                    light: true,
                    image : "/images/colors/4_9.png",
                    title : "Чорний 7594"
                },
                {
                    id : 37,
                    isDark : true,
                    image : "/images/colors/4_10.png",
                    title : "Умбра 7579"
                },
            ])
            setSecondColorItems([
                {
                    id : 38,
                    isDark : false,
                    image : "#0E0E10",
                    title : "RAL 9005"
                },
            ])
        }
    }, [props.selectedHeight, props.selectedMaterial])

    useEffect(() => {
        if (colorItems.length && !colorItems.filter((element) => color?.id === element.id).length) {
            setColor(colorItems[0])
        }
    }, [colorItems])

    useEffect(() => {
        if (secondColorItems.length && !secondColorItems.filter((element) => secondColor?.id === element.id).length) {
            setSecondColor(secondColorItems[0])
        }
    }, [secondColorItems])

    return (
        <div className={"Color material-" + (props.selectedMaterial?.id) + " height-" + (props.selectedHeight?.id)}>
            <div className="ColorMain__Wrapper">
                <div className="Color__Title">
                    <h3>Колір Стелі</h3>
                </div>
                <div className="Color__Content">
                    {
                        colorItems.map((element) => (
                            <ColorItem {...element} active={color?.id === element.id} handleSelect={() => { setColor(element) }} />
                        ))
                    }
                </div>
            </div>
            <div className="ColorSecond__Wrapper">
                <div className="Color__Title">
                    <h3>Колір Несучого Профілю</h3>
                </div>
                <div className="Color__Content">
                    {
                        secondColorItems.map((element) => (
                            <ColorItem {...element} active={secondColor?.id === element.id} handleSelect={() => { setSecondColor(element) }} />
                        ))
                    }
                </div>
            </div>
            <div className="Buttons__Wrapper">
                <button onClick={handleBack}>
                    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 15L2 8L9 1" strokeWidth="2"/>
                    </svg>
                    Назад
                </button>
                <button onClick={handleNext}>
                    {
                        props.changeMode ? 'Змінити' : 'Далі'
                    }
                    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L8 8L1 15" strokeWidth="2"/>
                    </svg>
                </button>
            </div>
        </div>
    )

}

export default Color
