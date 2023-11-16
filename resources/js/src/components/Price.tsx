import * as React from 'react'
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {ACOUSTIC_MAX_STRINGER, ALUMINUM_MAX_STRINGER, STEEL_MAX_STRINGER} from "./Draw/utils/Utils";
import RoomDataInterface from "../interfaces/RoomDataInterface";

interface PriceProps {
    addRoom : () => void,
    rooms : RoomDataInterface[],
    updateRoomData : () => void
}


function Price (props : PriceProps) {

    const [stringerLength, setStringerLength] = useState<number>(0)
    const [selectedRoomIndex, setSelectedRoomIndex] = useState<number>(0)
    const [selectedRoom, setSelectedRoom] = useState<RoomDataInterface>()

    const navigate = useNavigate()

    const handleBack = () => {
        navigate('/draw')
    }

    const handleNext = () => {
        navigate('/contact')
    }

    const addRoom = () => {
        props.addRoom()
    }

    const handleChangeColors = () => {
        navigate('/change-color')
    }

    useEffect(() => {
        setSelectedRoom(props.rooms[selectedRoomIndex])
    }, [selectedRoomIndex, props.rooms]);

    useEffect(() => {
        setSelectedRoomIndex(props.rooms.length - 1)
    }, [props.rooms]);

    useEffect(() => {
        if (selectedRoom?.material === 1) {
            setStringerLength(STEEL_MAX_STRINGER)
        } else if (selectedRoom?.material === 2) {
            setStringerLength(ALUMINUM_MAX_STRINGER)
        } else if (selectedRoom?.material === 3) {
            setStringerLength(ACOUSTIC_MAX_STRINGER)
        }
    }, [selectedRoom])

    useEffect(() => {
        props.updateRoomData()
    }, []);

    if (!selectedRoom) return <></>

    return <div className="Price">

        <div className="Price__Row">
            <div className="Price__Left">
                {
                    props.rooms.length > 1 && (
                        <div className="Price__Rooms">
                            {[...Array(Math.min(12, props.rooms.length))].map((_, index) => (
                                <div
                                    className={"Price__Rooms__Item " + (selectedRoomIndex === index ? '_active' : '')}
                                    onClick={() => setSelectedRoomIndex(index)}
                                >
                                    {
                                        props.rooms.length > 4 ?
                                        (index + 1) :
                                        <>
                                            Кімн. { index + 1 }
                                        </>
                                    }

                                </div>
                            ))}
                        </div>
                    )
                }
                <div className="Price__Chosen">
                    <h3>Ви Обрали:</h3>
                    <p>Кубоподібна стеля з {
                        selectedRoom.material === 1 && 'оцинкованої сталі'
                    } {
                        selectedRoom.material === 2 && 'алюмінію'
                    } {
                        selectedRoom.material === 3 && 'акустичній повсті'
                    }</p>
                    <p>Ширина панелей: { selectedRoom.width }мм</p>
                    <p>Висота панелей: { selectedRoom.height }мм</p>
                    <p>Відстань між панелями: { selectedRoom.margin }мм</p>
                    <p>Площа приміщення: { selectedRoom.square?.toFixed(1) }м²</p>
                    <p>Вага конструкції: { selectedRoom.weight?.toFixed(2) }кг ({ (selectedRoom.weight / selectedRoom.square)?.toFixed(2) }кг/м²)</p>
                    <p>Гайка шестигранна М6: { 2 * selectedRoom.totalConnectorsCount } шт.</p>
                    <p>Висота опускання конструкції: { selectedRoom.heightLowering }мм</p>
                </div>
                <hr />
                <div className="Price__Colors">
                    <div className="Price__Colors__Wrapper">
                        <div className="Price__Colors__Item">
                            <h5>Колір <br/>панелей: </h5>
                            <div className={"Price__Colors__Color " + (props.rooms.length > 1 ? '_active' : '') }>
                                <div className="Price__Colors__Color__Bg">
                                    {
                                        selectedRoom.color.image.includes('#') ?
                                        <span style={{background: selectedRoom.color.image}}></span> :
                                        <img src={selectedRoom.color.image} alt=""/>
                                    }
                                </div>
                                <div className="Price__Colors__Color__Title" style={{ color: selectedRoom.color.light ? 'white' : selectedRoom.color.isDark ? 'black' : 'white'}}>{ selectedRoom.color.title }</div>
                            </div>
                        </div>
                        <div className="Price__Colors__Item">
                            <h5>Колір несучих стрінгерів:</h5>
                            <div className={"Price__Colors__Color " + (props.rooms.length > 1 ? '_active' : '') }>
                                <div className="Price__Colors__Color__Bg">
                                    {
                                        selectedRoom.secondColor.image.includes('#') ?
                                        <span style={{background: selectedRoom.secondColor.image}}></span> :
                                        <img src={selectedRoom.secondColor.image} alt=""/>
                                    }
                                </div>
                                <div className="Price__Colors__Color__Title" style={{ color: selectedRoom.secondColor.light ? 'white' : selectedRoom.secondColor.isDark ? 'black' : 'white' }}>{ selectedRoom.secondColor.title }</div>
                            </div>
                        </div>
                    </div>
                    <div className="Price__Colors__Change" onClick={handleChangeColors}>Змінити коліри</div>
                </div>
            </div>
            <div className="Price__Right">
                <div className="Price__Reqs">
                    <h3>Для Обраного Приміщення Необхідно:</h3>
                    <p>Панелі: { (Math.round(selectedRoom.totalPanelLength / 100) / 10).toFixed(1) } м.пог.</p>
                    <p>Несучі профіля, { (stringerLength / 1000).toFixed(1) }м: { Math.ceil(selectedRoom.totalStringerCount) } шт.</p>
                    <p>З'єднувачі для панелей: { selectedRoom.totalConnectorsCount } шт.</p>
                    <p>Шпильки різьбові М6: { selectedRoom.totalConnectorsCount } шт.</p>
                    <p>Анкер різьбовий: { selectedRoom.totalConnectorsCount } шт.</p>
                    <p>Гайка шестигранна М6: { 2 * selectedRoom.totalConnectorsCount } шт.</p>
                </div>
                <hr/>
                <div className="Price__Final">
                    <h2>{ selectedRoom.price?.toFixed(2) } грн</h2>
                    <p>або { (selectedRoom.price / selectedRoom.square)?.toFixed(2)  } грн / м²</p>
                </div>
                <div className="Price__Notation">
                    Попередня вартість матеріалів з урахуванням усіх комплектуючих з ПДВ
                </div>
            </div>
        </div>

        <div className="Buttons__Wrapper Buttons__Wrapper--Price">
            <button onClick={handleBack}>
                <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 15L2 8L9 1" strokeWidth="2"/>
                </svg>
                Назад
            </button>
            <div>
                <button className="Buttons__AddRoom" onClick={addRoom}>Додати Кімнату</button>
                <button onClick={handleNext}>Далі
                    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L8 8L1 15" strokeWidth="2"/>
                    </svg>
                </button>
            </div>
        </div>

    </div>
}

export default Price
