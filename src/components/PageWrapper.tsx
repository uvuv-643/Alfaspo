import React, {ReactNode, useState} from 'react'
import Sidebar from "./giobal/Sidebar";
import { PAGES } from "../enums/Pages";
import '../assets/styles/main.scss'
import {SidebarSelectedValues} from "../assets/interfaces/SidebarSelectedValues";

interface PageWrapperProps {
    children : ReactNode,
    currentPage : PAGES
}

function PageWrapper(props : PageWrapperProps) {

    const [selectedValues, setSelectedValues] = useState<SidebarSelectedValues>({})

    return (
        <div className="PageWrapper">
            <div className="PageWrapper__Sidebar">
                <Sidebar currentPage={props.currentPage} selectedValues={selectedValues} />
            </div>
            <div className="PageWrapper__Content">
                { props.children }
            </div>
        </div>
    );

}

export default PageWrapper