import * as React from 'react'
import ContactHeader from "./Contact/ContactHeader";
import ContactInput from "./Contact/ContactInput";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

interface ContactProps {
    name: string,
    setName: (data: string) => void,
    city: string,
    setCity: (data: string) => void,
    email: string,
    setEmail: (data: string) => void,
    company: string,
    setCompany: (data: string) => void,
    phone: string,
    setPhone: (data: string) => void,
    comment: string,
    setComment: (data: string) => void,
}

const validateEmail = (email : string) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function Contact(props : ContactProps) {

    const [nameError, setNameError] = useState<boolean>(false)
    const [cityError, setCityError] = useState<boolean>(false)
    const [emailError, setEmailError] = useState<boolean>(false)
    const [companyError, setCompanyError] = useState<boolean>(false)
    const [phoneError, setPhoneError] = useState<boolean>(false)

    const [emailCorrect, setEmailCorrect] = useState<boolean>(false)
    const [phoneCorrect, setPhoneCorrect] = useState<boolean>(false)

    const navigate = useNavigate()

    const handleBack = () => {
        navigate('/price')
    }

    const handleNext = () => {
        let currentError = false
        if (props.name.length < 1) {
            setNameError(true)
            currentError = true
        }
        if (props.city.length < 1) {
            setCityError(true)
            currentError = true
        }
        if (!validateEmail(props.email)) {
            setEmailError(true)
            currentError = true
        }
        if (props.company.length < 1) {
            setCompanyError(true)
            currentError = true
        }
        if (props.phone.length <= 8) {
            setPhoneError(true)
            currentError = true
        }
        if (currentError) return
        console.warn(props.name, props.city, props.email, props.company, props.phone, props.comment)
    }

    useEffect(() => {
        if (props.name.length > 0) setNameError(false)
    }, [props.name]);
    useEffect(() => {
        if (props.city.length > 0) setCityError(false)
    }, [props.city]);
    useEffect(() => {
        if (validateEmail(props.email)) {
            setEmailCorrect(true)
            setEmailError(false)
        } else {
            setEmailCorrect(false)
        }
    }, [props.email]);
    useEffect(() => {
        if (props.company.length > 0) setCompanyError(false)
    }, [props.company]);
    useEffect(() => {
        if (props.phone.length > 8) {
            setPhoneCorrect(true)
            setPhoneError(false)
        } else {
            setPhoneCorrect(false)
        }
    }, [props.phone]);

    return (
        <div className="Contact">
            <ContactHeader />
            <div className="Contact__Form">
                <div className="Contact__Form__Element">
                    <ContactInput id={"name"} title={'Ім’я'} value={props.name} setValue={props.setName} error={nameError} />
                </div>
                <div className="Contact__Form__Element">
                    <ContactInput id={"city"} title={'Місто'} value={props.city} setValue={props.setCity} error={cityError} />
                </div>
                <div className="Contact__Form__Element">
                    <ContactInput id={"email"} title={'Ел. Пошта'} value={props.email} setValue={props.setEmail} error={emailError} />
                </div>
                <div className="Contact__Form__Element">
                    <ContactInput id={"company"} title={'Арх. Бюро / Компанія'} value={props.company} setValue={props.setCompany} error={companyError} />
                </div>
                <div className="Contact__Form__Element">
                    <ContactInput id={"phone"} title={'Телефон'} value={props.phone} setValue={props.setPhone} error={phoneError} />
                </div>
                <div className="Contact__Form__Element">
                    <ContactInput id={"comment"} title={'Коментар'} value={props.comment} setValue={props.setComment} />
                </div>
            </div>
            <div className="Buttons__Wrapper">
                <button onClick={handleBack}>
                    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 15L2 8L9 1" strokeWidth="2"/>
                    </svg>
                    Назад
                </button>
                <button onClick={handleNext}>Далі
                    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L8 8L1 15" strokeWidth="2"/>
                    </svg>
                </button>
            </div>

        </div>
    )
}

export default Contact