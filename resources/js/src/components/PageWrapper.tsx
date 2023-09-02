import React, {ReactNode, useEffect} from 'react'
import Sidebar from "./global/Sidebar";
import {PAGES} from "../enums/Pages";
import '../assets/styles/main.scss'
import {SidebarSelectedValues} from "../interfaces/SidebarSelectedValues";
import {useNavigate} from "react-router-dom";

interface PageWrapperProps {
    children : ReactNode,
    currentPage : PAGES,
    sendRedirectTo : string | null,
    availableRedirect : boolean,
    handleNext : () => void,
    handleBack ?: () => void,
    setSendRedirectTo : (value : any) => void
    selectedValues : SidebarSelectedValues
}

function PageWrapper(props : PageWrapperProps) {

    const navigate = useNavigate()

    useEffect(() => {
        if (props.availableRedirect && props.sendRedirectTo !== null) {
            navigate(props.sendRedirectTo)
            props.setSendRedirectTo(null)
        }
    }, [props.sendRedirectTo])

    return (
        <div className="PageWrapper">
            <div className={"PageWrapper__Sidebar"}>
                <Sidebar handleBack={props.handleBack} handleNext={props.handleNext} currentPage={props.currentPage} selectedValues={props.selectedValues} />
            </div>
            <div className="PageWrapper__Content">
                { props.children }
            </div>
        </div>
    );

}

export default PageWrapper