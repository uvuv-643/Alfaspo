import React, {useEffect, useRef, useState} from 'react';
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
import {RealPointInterface} from "./components/Draw/utils/Utils";
import material from "./components/Material";

function App() {

    const [sendRedirectTo, setSendRedirectTo] = useState<string | null>(null)
    const [selectedMaterial, setSelectedMaterial] = useState<MaterialElementInterface | null>(JSON.parse(localStorage.getItem('material') || '{}'))
    const [selectedWidth, setSelectedWidth] = useState<DimensionsElementInterface | null>(JSON.parse(localStorage.getItem('width') || '{}'))
    const [selectedHeight, setSelectedHeight] = useState<DimensionsElementInterface | null>(JSON.parse(localStorage.getItem('height') || '{}'))
    const [selectedMargin, setSelectedMargin] = useState<MarginElementInterface | null>(JSON.parse(localStorage.getItem('margin') || '{}'))
    const [selectedColor, setSelectedColor] = useState<ColorElementInterface | null>(JSON.parse(localStorage.getItem('color') || '{}'))
    const [selectedSecondColor, setSelectedSecondColor] = useState<ColorElementInterface | null>(JSON.parse(localStorage.getItem('second-color') || '{}'))
    const [selectedSizeMode, setSelectedSizeMode] = useState<boolean>(JSON.parse(localStorage.getItem('size-mode') || 'true'))
    const [selectedSize, setSelectedSize] = useState<number>(JSON.parse(localStorage.getItem('size') || '1'))
    const [selectedSizePlacement, setSelectedSizePlacement] = useState<number>(JSON.parse(localStorage.getItem('size-placement') || '1'))
    const [selectedPoints, setSelectedPoints] = useState<RealPointInterface[]>(JSON.parse(localStorage.getItem('points') || '[]'))
    const [selectedAngle, setSelectedAngle] = useState<number | null>(JSON.parse(localStorage.getItem('angle') || 'null'))
    const [finishedBuilding, setFinishedBuilding] = useState<boolean>(JSON.parse(localStorage.getItem('finishedBuilding') || 'false'))

    const [selectedValues, setSelectedValues] = useState<SidebarSelectedValues>(JSON.parse(localStorage.getItem('selectedValues') || '{}'))
    const [availableRedirect, setAvailableRedirect] = useState(true)

    const [inputtedSides, setInputtedSides] = useState<string[]>([])

    const MaterialElement = (
        <Material
            selectedMaterial={selectedMaterial}
            handleSelectMaterial={setSelectedMaterial}
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

    const SizeElement = (
        <Size
            selectedSize={selectedSize}
            selectedMode={selectedSizeMode}
            selectedPlacement={selectedSizePlacement}
            handleSelectedPlacement={setSelectedSizePlacement}
            handleSelectMode={setSelectedSizeMode}
            handleSelectSize={setSelectedSize}
            handleGoToDraw={() => {
                setSendRedirectTo('/draw')
            }}
            setInputtedSides={setInputtedSides}
        />
    )

    const DrawElement = (
        <Draw selectedValues={selectedValues}
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
        />
    )

    const renderAttempts = useRef(0)

    const handleSizeSelected = () => {
        if (inputtedSides.filter((element) => {
            return (!isNaN(parseInt(element)) && parseInt(element) > 0 && parseInt(element) < 10000)
        }).length === inputtedSides.length) {
            let targetSides = inputtedSides.map(element => parseInt(element))
            if (targetSides.length === 2) {
                setSelectedPoints([
                    {x: -targetSides[1] / 2, y: -targetSides[0] / 2},
                    {x: -targetSides[1] / 2, y: targetSides[0] / 2},
                    {x: targetSides[1] / 2, y: targetSides[0] / 2},
                    {x: targetSides[1] / 2, y: -targetSides[0] / 2},
                    {x: -targetSides[1] / 2, y: -targetSides[0] / 2}
                ])
                if (selectedSizePlacement === 1) setSelectedAngle(Math.PI / 2)
                else setSelectedAngle(0)
            } else if (targetSides.length === 6 ) {
                let ab = targetSides[0]
                let bc = targetSides[1]
                let cd = targetSides[2]
                let de = targetSides[3]
                let ef = targetSides[4]
                let fa = targetSides[5]
                if (fa + de !== bc) {
                    alert('FA + DE має дорівнювати BC')
                    return
                }
                if (cd + ef !== ab) {
                    alert('CD + EF має дорівнювати AB')
                    return
                }
                setSelectedPoints([
                    {x: -bc / 2, y: ab / 2},
                    {x: -bc / 2, y: -ab / 2},
                    {x: bc / 2, y: -ab / 2},
                    {x: bc / 2, y: -ab / 2 + cd},
                    {x: bc / 2 - de, y: -ab / 2 + cd},
                    {x: bc / 2 - de, y: -ab / 2 + cd + ef},
                    {x: -bc / 2, y: ab / 2}
                ])
                if (selectedSizePlacement === 1) setSelectedAngle(Math.PI / 2)
                else setSelectedAngle(0)
            }
            setFinishedBuilding(true)
            setSendRedirectTo('/draw')
        } else {
            alert("Розміри не повинні перевищувати 10000 мм")
        }
    }

    useEffect(() => {
        localStorage.setItem('selectedValues', JSON.stringify(selectedValues))
    }, [selectedValues])

    useEffect(() => {
        if (selectedMaterial) {
            let selectedValuesClone = { ...selectedValues }
            selectedValuesClone[PAGES.MATERIAL] = selectedMaterial.title
            setSelectedValues(selectedValuesClone)
            localStorage.setItem('material', JSON.stringify(selectedMaterial))
        }
    }, [selectedMaterial])

    useEffect(() => {
        if (selectedWidth && selectedHeight) {
            let selectedValuesClone = { ...selectedValues }
            selectedValuesClone[PAGES.DIMENSIONS] = 'Рейка ' + selectedWidth.value + 'x' + selectedHeight.value + '(h)'
            setSelectedValues(selectedValuesClone)
            localStorage.setItem('width', JSON.stringify(selectedWidth))
            localStorage.setItem('height', JSON.stringify(selectedHeight))
        }
    }, [selectedWidth, selectedHeight])

    useEffect(() => {
        if (selectedMargin) {
            let selectedValuesClone = { ...selectedValues }
            selectedValuesClone[PAGES.MARGINS] = 'Відстань ' + selectedMargin.value + 'мм'
            setSelectedValues(selectedValuesClone)
            localStorage.setItem('margin', JSON.stringify(selectedMargin))
        }
    }, [selectedMargin])

    useEffect(() => {
        if (selectedColor && selectedSecondColor) {
            let selectedValuesClone = { ...selectedValues }
            selectedValuesClone[PAGES.COLORS] = selectedColor.title
            setSelectedValues(selectedValuesClone)
            localStorage.setItem('color', JSON.stringify(selectedColor))
            localStorage.setItem('second-color', JSON.stringify(selectedSecondColor))
        }
    }, [selectedColor, selectedSecondColor])

    useEffect(() => {
        if (selectedColor && selectedSecondColor) {
            localStorage.setItem('size-mode', JSON.stringify(selectedSizeMode))
            localStorage.setItem('size', JSON.stringify(selectedSize))
            localStorage.setItem('size-placement', JSON.stringify(selectedSizePlacement))
        }
    }, [selectedSizeMode, selectedSize, selectedSizePlacement])

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
                    <Route path="/size" element={<PageWrapper
                        selectedValues={selectedValues}
                        availableRedirect={availableRedirect}
                        handleNext={handleSizeSelected}
                        handleBack={() => {
                            setSendRedirectTo('/color')
                        }}
                        sendRedirectTo={sendRedirectTo}
                        currentPage={PAGES.SIZE}
                    >{SizeElement}</PageWrapper>}/>

                    <Route path="/draw"
                           element={DrawElement}
                    />


                </Routes>
            </div>
        </Router>
    )

}

export default App;
