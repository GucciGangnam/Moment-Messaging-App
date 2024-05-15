// IMPORTS
// Styles
import "./Navigator.css"
// React 
import { useState } from "react";



// COMPONENT
export const Navigator = () => {
    const [button1Selected, setButton1Selected] = useState(false);
    const [title, setTitle] = useState('Groups');

    const handleButtonClick = (buttonId) => {
        if (buttonId === 1) {
            setButton1Selected(true);
            setTitle('Contacts');
        } else {
            setButton1Selected(false);
            setTitle('Groups');
        }
    };

    return (
        <div className="Navigator">
            <div className="Header">
                <h1>Moment</h1>
                <div className="Devider"></div>
            </div>

            <div className="Buttons">
                <svg
                    className={button1Selected ? "Button-selected" : "Button"}
                    width="30px"
                    height="30px"
                    viewBox="0 0 48 48"
                    id="Layer_2"
                    onClick={() => handleButtonClick(1)}
                >
                    <path d="M10.35,4.5a2,2,0,0,0-1.95,2v35.1a2,2,0,0,0,1.95,2h27.3a2,2,0,0,0,2-2V6.45a2,2,0,0,0-2-1.95ZM24,13.27a5.37,5.37,0,1,1-5.36,5.37A5.37,5.37,0,0,1,24,13.27ZM24,26c6,0,10.73,1.67,10.73,3.66v5.12H13.27V29.61C13.27,27.62,18,26,24,26Z" />
                </svg>

                <svg
                    className={!button1Selected ? "Button-selected" : "Button"}
                    height="30px"
                    width="30px"
                    viewBox="0 0 24 24"
                    onClick={() => handleButtonClick(2)}
                >
                    <g id="group">
                        <path d="M24,15.9c0-2.8-1.5-5-3.7-6.1C21.3,8.8,22,7.5,22,6c0-2.8-2.2-5-5-5c-2.1,0-3.8,1.2-4.6,3c0,0,0,0,0,0c-0.1,0-0.3,0-0.4,0
                    c-0.1,0-0.3,0-0.4,0c0,0,0,0,0,0C10.8,2.2,9.1,1,7,1C4.2,1,2,3.2,2,6c0,1.5,0.7,2.8,1.7,3.8C1.5,10.9,0,13.2,0,15.9V20h5v3h14v-3h5
                    V15.9z M17,3c1.7,0,3,1.3,3,3c0,1.6-1.3,3-3,3c0-1.9-1.1-3.5-2.7-4.4c0,0,0,0,0,0C14.8,3.6,15.8,3,17,3z M13.4,4.2
                    C13.4,4.2,13.4,4.2,13.4,4.2C13.4,4.2,13.4,4.2,13.4,4.2z M15,9c0,1.7-1.3,3-3,3s-3-1.3-3-3s1.3-3,3-3S15,7.3,15,9z M10.6,4.2
                    C10.6,4.2,10.6,4.2,10.6,4.2C10.6,4.2,10.6,4.2,10.6,4.2z M7,3c1.2,0,2.2,0.6,2.7,1.6C8.1,5.5,7,7.1,7,9C5.3,9,4,7.7,4,6S5.3,3,7,3
                    z M5.1,18H2v-2.1C2,13.1,4.1,11,7,11v0c0,0,0,0,0,0c0.1,0,0.2,0,0.3,0c0,0,0,0,0,0c0.3,0.7,0.8,1.3,1.3,1.8
                    C6.7,13.8,5.4,15.7,5.1,18z M17,21H7v-2.1c0-2.8,2.2-4.9,5-4.9c2.9,0,5,2.1,5,4.9V21z M22,18h-3.1c-0.3-2.3-1.7-4.2-3.7-5.2
                    c0.6-0.5,1-1.1,1.3-1.8c0.1,0,0.2,0,0.4,0v0c2.9,0,5,2.1,5,4.9V18z"/>
                    </g>
                </svg>
            </div>

            <div className="Title">
                {title}
            </div>
            <input
                className="Search"
                placeholder="Search xxx">
            </input>
            <div className="Content">


                <div className="Contact">
                    First Last
                </div>
                <div className="Contact">
                    First Last
                </div>
                <div className="Contact">
                    First Last
                </div>

                
            </div>
            <div className="Bottom">
                <button></button>
                <button></button>
                <button></button>
            </div>

        </div>
    )
}