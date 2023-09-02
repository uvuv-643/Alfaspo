// @ts-ignore
import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from "react-dom/client";

import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import PageWrapper from "./components/PageWrapper";
import Material from "./components/Material";
import {PAGES} from "./enums/Pages";
import Dimensions from "./components/Dimensions";
import MaterialElementInterface from "./interfaces/MaterialElementInterface";
import {SidebarSelectedValues} from "./interfaces/SidebarSelectedValues";
import {DimensionsElementInterface} from "./interfaces/DimensionsElementInterface";
import Margin from "./components/Margin";
import {MarginElementInterface} from "./interfaces/MarginElementInterface";
import Color from "./components/Color";
import {ColorElementInterface} from "./interfaces/ColorElementInterface";
import Size from "./components/Size";
import Draw from "./components/Draw";
import {
    ACOUSTIC_MAX_STRINGER,
    ALUMINUM_MAX_STRINGER,
    RealPointInterface,
    STEEL_MAX_STRINGER
} from "./components/Draw/utils/Utils";
import Price from "./components/Price";
import RoomDataInterface from "./interfaces/RoomDataInterface";
import Contact from "./components/Contact";
import axios from "axios";


const ADMIN_URL = 'http://localhost:8000/api/price';

function App() {

    const [sendRedirectTo, setSendRedirectTo] = useState<string | null>(null)
    const [selectedMaterial, setSelectedMaterial] = useState<MaterialElementInterface | null>(JSON.parse(localStorage.getItem('material') || '{}'))
    const [selectedWidth, setSelectedWidth] = useState<DimensionsElementInterface | null>(JSON.parse(localStorage.getItem('width') || '{}'))
    const [selectedHeight, setSelectedHeight] = useState<DimensionsElementInterface | null>(JSON.parse(localStorage.getItem('height') || '{}'))
    const [selectedMargin, setSelectedMargin] = useState<MarginElementInterface | null>(JSON.parse(localStorage.getItem('margin') || '{}'))
    const [selectedColor, setSelectedColor] = useState<ColorElementInterface | null>(JSON.parse(localStorage.getItem('color') || '{}'))
    const [selectedSecondColor, setSelectedSecondColor] = useState<ColorElementInterface | null>(JSON.parse(localStorage.getItem('second-color') || '{}'))
    const [selectedSizeMode, setSelectedSizeMode] = useState<number>(JSON.parse(localStorage.getItem('size-mode') || '0'))
    const [selectedSize, setSelectedSize] = useState<number>(JSON.parse(localStorage.getItem('size') || '1'))
    const [selectedSizePlacement, setSelectedSizePlacement] = useState<number>(JSON.parse(localStorage.getItem('size-placement') || '1'))
    const [selectedPoints, setSelectedPoints] = useState<RealPointInterface[]>(JSON.parse(localStorage.getItem('points') || '[]'))
    const [selectedAngle, setSelectedAngle] = useState<number | null>(JSON.parse(localStorage.getItem('angle') || 'null'))
    const [finishedBuilding, setFinishedBuilding] = useState<boolean>(JSON.parse(localStorage.getItem('finishedBuilding') || 'false'))

    const [selectedValues, setSelectedValues] = useState<SidebarSelectedValues>(JSON.parse(localStorage.getItem('selectedValues') || '{}'))
    const [availableRedirect, setAvailableRedirect] = useState(true)

    const [inputtedSides, setInputtedSides] = useState<string[]>(JSON.parse(localStorage.getItem('inputtedSides') || '[]'))
    const [preferSize, setPreferSize] = useState<number>(0)

    const [square, setSquare] = useState<number | undefined>(JSON.parse(localStorage.getItem('square') || 'null'))
    const [heightLowering, setHeightLowering] = useState<number>(JSON.parse(localStorage.getItem('height-lowering') || '250'))
    const [totalPanelLength, setTotalPanelLength] = useState<number>(JSON.parse(localStorage.getItem('total-panel-length') || '0'))
    const [totalStringerLength, setTotalStringerLength] = useState<number>(JSON.parse(localStorage.getItem('total-stringer-length') || '0'))
    const [totalStringerCountActual, setTotalStringerCountActual] = useState<number>(JSON.parse(localStorage.getItem('total-stringer-count') || '0'))
    const [totalConnectorsCount, setTotalConnectorsCount] = useState<number>(JSON.parse(localStorage.getItem('total-connectors-count') || '0'))
    const [svg, setSVG] = useState<string>(JSON.parse(localStorage.getItem('svg') || '""'))

    const [rooms, setRooms] = useState<RoomDataInterface[]>(JSON.parse(localStorage.getItem('rooms') || '[]'))
    const [attemptToCreateNewRoom, setAttemptToCreateNewRoom] = useState<boolean>(JSON.parse(localStorage.getItem('attemptToCreateNewRoom') || 'false'))

    const [inputtedName, setInputtedName] = useState<string>('')
    const [inputtedCity, setInputtedCity] = useState<string>('')
    const [inputtedEmail, setInputtedEmail] = useState<string>('')
    const [inputtedCompany, setInputtedCompany] = useState<string>('')
    const [inputtedPhone, setInputtedPhone] = useState<string>('')
    const [inputtedComment, setInputtedComment] = useState<string>('')

    const [totalWeight, setTotalWeight] = useState<number>(0)
    const [totalPrice, setTotalPrice] = useState<number>(0)

    const updateRoomData = () => {
        if (selectedMaterial && selectedWidth && selectedHeight && selectedMargin && selectedColor && selectedSecondColor
            && totalPanelLength && totalStringerLength && totalConnectorsCount && square && heightLowering) {
            let currentRoom : RoomDataInterface = {
                material : selectedMaterial.id,
                width : selectedWidth.value,
                height : selectedHeight.value,
                margin : selectedMargin.value,
                square : square,
                weight: totalWeight,
                price: totalPrice,
                color : selectedColor,
                secondColor : selectedSecondColor,
                heightLowering : heightLowering,
                totalPanelLength : totalPanelLength,
                totalStringerLength : totalStringerLength,
                totalConnectorsCount : totalConnectorsCount,
                totalStringerCount : totalStringerCountActual,
                svg : svg
            }
            let copyOfCurrentRooms = JSON.parse(JSON.stringify(rooms))
            let shouldCreateRoom = rooms.length === 0 || attemptToCreateNewRoom
            if (shouldCreateRoom) {
                copyOfCurrentRooms.push(currentRoom)
            } else {
                copyOfCurrentRooms[copyOfCurrentRooms.length - 1] = currentRoom
            }
            setAttemptToCreateNewRoom(false)
            setRooms(copyOfCurrentRooms)
        }
    }

    const updateCoverageData = (panelLength : number, stringerLength : number, stringerCount : number, connectorsCount : number, svg : string) => {
        setTotalPanelLength(panelLength)
        setTotalStringerLength(stringerLength)
        setTotalStringerCountActual(stringerCount)
        setTotalConnectorsCount(connectorsCount)
        setSVG(svg)
    }

    useEffect(() => {
        if (selectedMaterial && selectedWidth && selectedHeight && selectedMargin && selectedColor) {
            let materialId = selectedMaterial?.id
            let stringerLength = 0
            if (materialId === 1) {
                stringerLength = STEEL_MAX_STRINGER
            } else if (materialId === 2) {
                stringerLength = ALUMINUM_MAX_STRINGER
            } else if (materialId === 3) {
                stringerLength = ACOUSTIC_MAX_STRINGER
            }
            axios.get(ADMIN_URL, {
                params: {
                    width: selectedWidth.value,
                    height: selectedHeight.value,
                    margin: selectedMargin.value,
                    material: selectedMaterial.title,
                    color: selectedColor.title
                }
            }).then(response => {
                if (response && response.status === 200) {

                    // обновляем вес конструкции
                    if (selectedMaterial.id === 3) {
                        // если выбран войлок
                        let weight = response.data.weight * square
                        setTotalWeight(weight)
                    } else {
                        let panelWeight = response.data.weight * (totalPanelLength / 1000)
                        let stringerWeight = response.data.weight_stringer * (totalStringerLength / stringerLength)
                        let connectorWeight = response.data.weight_connector * (totalConnectorsCount)
                        setTotalWeight(panelWeight + stringerWeight + connectorWeight)
                    }

                    // обновляем цену
                    let panelPrice = response.data.price * (totalPanelLength / 1000)
                    let stringerPrice = response.data.price_stringer * Math.ceil(totalStringerLength / stringerLength)
                    let connectorPrice = response.data.price_connector * totalConnectorsCount
                    let fastenersPrice = totalStringerCountActual * (
                        2 * response.data.price_screw + response.data.price_anchor + response.data.price_pin
                    )
                    console.log(response.data)
                    setTotalPrice(panelPrice + stringerPrice + connectorPrice + fastenersPrice)

                }
            }).catch(error => {
                console.error(error)
            })
        }
    }, [selectedMaterial, selectedWidth, selectedHeight, selectedMargin, selectedColor, totalPanelLength, totalStringerLength]);

    useEffect(() => {
        updateRoomData()
    }, [totalPrice, totalWeight])

    useEffect(() => {
        let totalPriceForAllRooms = rooms.reduce((prev, curr) => {
            return prev + curr.price
        }, 0)
        console.log(rooms, totalPriceForAllRooms)
        let selectedValuesClone = {...selectedValues}
        selectedValuesClone[PAGES.PRICE] = totalPriceForAllRooms.toFixed(2) + ' грн'
        setSelectedValues(selectedValuesClone)
    }, [rooms])

    const resetParams = () => {
        setSelectedMaterial(null)
        setSelectedWidth(null)
        setSelectedHeight(null)
        setSelectedMargin(null)
        setSelectedColor(null)
        setSelectedSecondColor(null)
        setSelectedSizeMode(0)
        setSelectedSize(1)
        setSelectedSizePlacement(1)
        setFinishedBuilding(false)
        setSelectedPoints([])
        setSelectedAngle(null)
        setSelectedValues({})
        setInputtedSides([])
        localStorage.removeItem('material')
        localStorage.removeItem('width')
        localStorage.removeItem('height')
        localStorage.removeItem('margin')
        localStorage.removeItem('color')
        localStorage.removeItem('second-color')
        localStorage.removeItem('size-mode')
        localStorage.removeItem('finishedBuilding')
        localStorage.removeItem('size-placement')
        localStorage.removeItem('points')
        localStorage.removeItem('angle')
        localStorage.removeItem('finishedBuilding')
        localStorage.removeItem('selectedValues')
        localStorage.removeItem('inputtedSides')
    }
    const handleAddRoom = () => {
        setAttemptToCreateNewRoom(true)
        setSendRedirectTo('/material')
        resetParams()
    }

    const handleSelectMaterial = (material: MaterialElementInterface) => {
        setSelectedMaterial(material)
        setSendRedirectTo('/dimension')
    }


    const MaterialElement = (
        <Material
            selectedMaterial={selectedMaterial}
            handleSelectMaterial={handleSelectMaterial}
        />
    )
    const DimensionsElement = (
        <Dimensions
            selectedWidth={selectedWidth}
            selectedHeight={selectedHeight}
            handleSelectWidth={setSelectedWidth}
            handleSelectHeight={setSelectedHeight}
            selectedMaterial={selectedMaterial}
        />
    )

    const MarginElement = (
        <Margin
            selectedWidth={selectedWidth}
            selectedHeight={selectedHeight}
            selectedMargin={selectedMargin}
            handleSelectMargin={setSelectedMargin}
        />
    )

    const ColorElement = (
        <Color
            selectedMaterial={selectedMaterial}
            selectedHeight={selectedHeight}
            selectedColor={selectedColor}
            selectedSecondColor={selectedSecondColor}
            handleSelectColor={setSelectedColor}
            handleSelectSecondColor={setSelectedSecondColor}
        />
    )

    const ChangeColorElement = (
        <div className="PageWrapper">
            <div className="PageWrapper__Content">
                <Color
                    selectedMaterial={selectedMaterial}
                    selectedHeight={selectedHeight}
                    selectedColor={selectedColor}
                    selectedSecondColor={selectedSecondColor}
                    handleSelectColor={setSelectedColor}
                    handleSelectSecondColor={setSelectedSecondColor}
                    changeMode={true}
                />
            </div>
        </div>

    )


    const SizeElement = (
        <Size
            selectedSize={selectedSize}
            selectedMode={selectedSizeMode}
            selectedPlacement={selectedSizePlacement}
            handleSelectedPlacement={setSelectedSizePlacement}
            handleSelectMode={setSelectedSizeMode}
            setFinishedBuilding={setFinishedBuilding}
            setPreferSize={setPreferSize}
            setSelectedAngle={setSelectedAngle}
            setSelectedPoints={setSelectedPoints}
            handleGoToDraw={() => {
                setSendRedirectTo('/draw')
            }}
            setInputtedSides={setInputtedSides}
            handleSelectSize={setSelectedSize}
            inputtedSides={inputtedSides}
        />
    )

    const DrawElement = (
        <Draw selectedValues={selectedValues}
              preferSize={preferSize}
              availableRedirect={availableRedirect}
              handleNext={() => {
                  setSendRedirectTo('/price')
              }}
              handleBack={() => {
                  setSendRedirectTo('/size')
              }}
              sendRedirectTo={sendRedirectTo}
              currentPage={PAGES.DRAW}
              width={selectedWidth}
              material={selectedMaterial}
              height={selectedHeight}
              margin={selectedMargin}
              points={selectedPoints}
              setPoints={setSelectedPoints}
              angle={selectedAngle}
              finishedBuilding={finishedBuilding}
              setFinishedBuilding={setFinishedBuilding}
              setSelectedAngle={setSelectedAngle}
              updateCoverageData={updateCoverageData}
              heightLowering={heightLowering}
              setHeightLowering={setHeightLowering}
              setSquare={setSquare}
              weight={totalWeight}
        />
    )

    const PriceElement = (
        selectedMaterial && selectedWidth && selectedHeight && selectedMargin && selectedColor && selectedSecondColor
        && totalPanelLength && totalStringerLength && totalConnectorsCount && square && heightLowering
    ) ? (
        <Price
            rooms={rooms}
            addRoom={handleAddRoom}
            updateRoomData={updateRoomData}
         />
    ) : <></>

    const ContactElement = (
        <Contact
            name={inputtedName} setName={setInputtedName}
            city={inputtedCity} setCity={setInputtedCity}
            email={inputtedEmail} setEmail={setInputtedEmail}
            company={inputtedCompany} setCompany={setInputtedCompany}
            phone={inputtedPhone} setPhone={setInputtedPhone}
            comment={inputtedComment} setComment={setInputtedComment}
        />
    )

    const renderAttempts = useRef(0)

    useEffect(() => {
        localStorage.setItem('rooms', JSON.stringify(rooms))
    }, [rooms]);

    useEffect(() => {
        localStorage.setItem('selectedValues', JSON.stringify(selectedValues))
    }, [selectedValues])

    useEffect(() => {
        if (selectedMaterial) {
            let selectedValuesClone = {...selectedValues}
            selectedValuesClone[PAGES.MATERIAL] = selectedMaterial.title
            setSelectedValues(selectedValuesClone)
            localStorage.setItem('material', JSON.stringify(selectedMaterial))
        }
    }, [selectedMaterial])

    useEffect(() => {
        if (selectedWidth && selectedHeight) {
            let selectedValuesClone = {...selectedValues}
            selectedValuesClone[PAGES.DIMENSIONS] = 'Рейка ' + selectedWidth.value + 'x' + selectedHeight.value + '(h)'
            setSelectedValues(selectedValuesClone)
            localStorage.setItem('width', JSON.stringify(selectedWidth))
            localStorage.setItem('height', JSON.stringify(selectedHeight))
        }
    }, [selectedWidth, selectedHeight])

    useEffect(() => {
        if (selectedMargin) {
            let selectedValuesClone = {...selectedValues}
            selectedValuesClone[PAGES.MARGINS] = 'Відстань ' + selectedMargin.value + 'мм'
            setSelectedValues(selectedValuesClone)
            localStorage.setItem('margin', JSON.stringify(selectedMargin))
        }
    }, [selectedMargin])

    useEffect(() => {
        if (selectedColor && selectedSecondColor && selectedColor.title && selectedSecondColor.title) {
            let selectedValuesClone = {...selectedValues}
            selectedValuesClone[PAGES.COLORS] = `${selectedColor.title.replace('ево', '.')} / ${selectedSecondColor.title.replace('ево', '.')}`
            setSelectedValues(selectedValuesClone)
            localStorage.setItem('color', JSON.stringify(selectedColor))
            localStorage.setItem('second-color', JSON.stringify(selectedSecondColor))
        }
    }, [selectedColor, selectedSecondColor])

    useEffect(() => {
        if (square) {
            let selectedValuesClone = {...selectedValues}
            selectedValuesClone[PAGES.SIZE] = square?.toFixed(1) + 'м²'
            setSelectedValues(selectedValuesClone)
            localStorage.setItem('square', JSON.stringify(square))
        }
    }, [square]);



    useEffect(() => {
        if (selectedColor && selectedSecondColor) {
            localStorage.setItem('size-mode', JSON.stringify(selectedSizeMode))
            localStorage.setItem('size', JSON.stringify(selectedSize))
            localStorage.setItem('size-placement', JSON.stringify(selectedSizePlacement))
        }
    }, [selectedSizeMode, selectedSize, selectedSizePlacement])

    useEffect(() => {
        localStorage.setItem('selectedAngle', JSON.stringify(selectedAngle))
    }, [selectedAngle])

    useEffect(() => {
        localStorage.setItem('inputtedSides', JSON.stringify(inputtedSides))
    }, [inputtedSides])

    useEffect(() => {
        localStorage.setItem('finishedBuilding', JSON.stringify(finishedBuilding))
    }, [finishedBuilding])

    useEffect(() => {
        localStorage.setItem('total-panel-length', JSON.stringify(totalPanelLength))
        localStorage.setItem('total-stringer-length', JSON.stringify(totalStringerLength))
        localStorage.setItem('total-stringer-count', JSON.stringify(totalStringerCountActual))
        localStorage.setItem('total-connectors-count', JSON.stringify(totalConnectorsCount))
        localStorage.setItem('svg', JSON.stringify(svg))
    }, [totalPanelLength, totalStringerLength, totalConnectorsCount, totalStringerCountActual, svg])

    useEffect(() => {
        localStorage.setItem('height-lowering', JSON.stringify(heightLowering))
    }, [heightLowering]);

    useEffect(() => {
        const handleBackEvent = () => {
            setAvailableRedirect(false)
        }
        window.addEventListener('popstate', handleBackEvent);
        return () => {
            window.removeEventListener('popstate', handleBackEvent);
        };
    }, []);

    useEffect(() => {
        if (renderAttempts.current > 1 && !availableRedirect) {
            setSendRedirectTo('/' + Math.random().toString())
        }
        renderAttempts.current += 1
    }, [availableRedirect])

    useEffect(() => {
        setAvailableRedirect(true)
    }, [sendRedirectTo])

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/material" element={<PageWrapper
                        setSendRedirectTo={setSendRedirectTo}
                        selectedValues={selectedValues}
                        availableRedirect={availableRedirect}
                        handleNext={() => {
                            if (selectedMaterial?.id) {
                                setSendRedirectTo('/dimension')
                            }
                        }}
                        sendRedirectTo={sendRedirectTo}
                        currentPage={PAGES.MATERIAL}
                    >{MaterialElement}</PageWrapper>}/>
                    <Route path="/dimension" element={<PageWrapper
                        setSendRedirectTo={setSendRedirectTo}
                        selectedValues={selectedValues}
                        availableRedirect={availableRedirect}
                        handleNext={() => {
                            if (selectedWidth?.id && selectedHeight?.id) {
                                setSendRedirectTo('/margin')
                            }
                        }}
                        handleBack={() => {
                            setSendRedirectTo('/material')
                        }}
                        sendRedirectTo={sendRedirectTo}
                        currentPage={PAGES.DIMENSIONS}
                    >{DimensionsElement}</PageWrapper>}/>
                    <Route path="/margin" element={<PageWrapper
                        setSendRedirectTo={setSendRedirectTo}
                        selectedValues={selectedValues}
                        availableRedirect={availableRedirect}
                        handleNext={() => {
                            setSendRedirectTo('/color')
                        }}
                        handleBack={() => {
                            setSendRedirectTo('/dimension')
                        }}
                        sendRedirectTo={sendRedirectTo}
                        currentPage={PAGES.MARGINS}
                    >{MarginElement}</PageWrapper>}/>
                    <Route path="/color" element={<PageWrapper
                        setSendRedirectTo={setSendRedirectTo}
                        selectedValues={selectedValues}
                        availableRedirect={availableRedirect}
                        handleNext={() => {
                            setSendRedirectTo('/size')
                        }}
                        handleBack={() => {
                            setSendRedirectTo('/margin')
                        }}
                        sendRedirectTo={sendRedirectTo}
                        currentPage={PAGES.COLORS}
                    >{ColorElement}</PageWrapper>}/>
                    <Route path="/change-color" element={ChangeColorElement}/>
                    <Route path="/size" element={<PageWrapper
                        setSendRedirectTo={setSendRedirectTo}
                        selectedValues={selectedValues}
                        availableRedirect={availableRedirect}
                        handleNext={() => {
                        }}
                        handleBack={() => {
                            setSendRedirectTo('/color')
                        }}
                        sendRedirectTo={sendRedirectTo}
                        currentPage={PAGES.SIZE}
                    >{SizeElement}</PageWrapper>}/>

                    <Route path="/draw"
                           element={DrawElement}
                    />

                    <Route path="/price"
                           element={<PageWrapper
                               setSendRedirectTo={setSendRedirectTo}
                               selectedValues={selectedValues}
                               availableRedirect={availableRedirect}
                               handleNext={() => {}}
                               handleBack={() => {}}
                               sendRedirectTo={sendRedirectTo}
                               currentPage={PAGES.PRICE}
                           >{PriceElement}</PageWrapper>}
                    />

                    <Route path="/contact"
                           element={<PageWrapper
                               setSendRedirectTo={setSendRedirectTo}
                               selectedValues={selectedValues}
                               availableRedirect={availableRedirect}
                               handleNext={() => {}}
                               handleBack={() => {}}
                               sendRedirectTo={sendRedirectTo}
                               currentPage={PAGES.FORM}
                           >{ContactElement}</PageWrapper>}
                    />


                </Routes>
            </div>
        </Router>
    )

}

if (document.getElementById('root')) {
    createRoot(document.getElementById('root')).render(<App />)
}
