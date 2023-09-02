import * as React from 'react'

function ContactHeader() {

    return (
        <div className="Contact__Header">
            <div className="Contact__Header__Title">
                <h2>Давайте Обговоримо Ваш Проект</h2>
                <p>Заповніть форму і надішліть нам для зв'язку з вами.</p>
            </div>
            <div className="Contact__Header__Image">
                <img src="/images/contact/main.png" alt="Contact image"/>
            </div>
        </div>
    )

}

export default ContactHeader