import React from 'react';
import './App.css';
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import PageWrapper from "./components/PageWrapper";
import Material from "./components/Material";

import {PAGES} from "./enums/Pages";

function App() {

    const MaterialElement = (
        <Material />
    )

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<PageWrapper currentPage={PAGES.MATERIAL}>{ MaterialElement }</PageWrapper>} />
                </Routes>
            </div>
        </Router>
    )

}

export default App;
