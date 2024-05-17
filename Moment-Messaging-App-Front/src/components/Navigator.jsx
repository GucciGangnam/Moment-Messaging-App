// IMPORTS
// Styles
import "./Navigator.css"
// React 
import { useEffect, useState } from "react";



// COMPONENT
export const Navigator = ({ toggleTheme, isDarkMode }) => {
    const [selectedButton, setSelectedButton] = useState(1);
    const [title, setTitle] = useState('Groups');

    // UE to log title when chajnged 
    useEffect(() => {
        console.log(title)
    }, [title])

    const handleButtonClick = (buttonId) => {
        setSelectedButton(buttonId);
        if (buttonId === 1) {
            setTitle('Contacts');
        } else if (buttonId === 2) {
            setTitle('Groups');
        } else if (buttonId === 3) {
            setTitle('Profile');
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
                    className={title === 'Contacts' ? "Button-selected" : "Button"}
                    width="30px"
                    height="30px"
                    viewBox="0 0 48 48"
                    id="Layer_2"
                    onClick={() => handleButtonClick(1)}
                    style={{ cursor: 'pointer' }}
                >
                    <path d="M10.35,4.5a2,2,0,0,0-1.95,2v35.1a2,2,0,0,0,1.95,2h27.3a2,2,0,0,0,2-2V6.45a2,2,0,0,0-2-1.95ZM24,13.27a5.37,5.37,0,1,1-5.36,5.37A5.37,5.37,0,0,1,24,13.27ZM24,26c6,0,10.73,1.67,10.73,3.66v5.12H13.27V29.61C13.27,27.62,18,26,24,26Z" />
                </svg>

                <svg
                    className={title === 'Groups' ? "Button-selected" : "Button"}
                    height="30px"
                    width="30px"
                    viewBox="0 0 24 24"
                    onClick={() => handleButtonClick(2)}
                    style={{ cursor: 'pointer' }}
                >
                    <g id="group">
                        <path d="M24,15.9c0-2.8-1.5-5-3.7-6.1C21.3,8.8,22,7.5,22,6c0-2.8-2.2-5-5-5c-2.1,0-3.8,1.2-4.6,3c0,0,0,0,0,0c-0.1,0-0.3,0-0.4,0 c-0.1,0-0.3,0-0.4,0c0,0,0,0,0,0C10.8,2.2,9.1,1,7,1C4.2,1,2,3.2,2,6c0,1.5,0.7,2.8,1.7,3.8C1.5,10.9,0,13.2,0,15.9V20h5v3h14v-3h5 V15.9z M17,3c1.7,0,3,1.3,3,3c0,1.6-1.3,3-3,3c0-1.9-1.1-3.5-2.7-4.4c0,0,0,0,0,0C14.8,3.6,15.8,3,17,3z M13.4,4.2 C13.4,4.2,13.4,4.2,13.4,4.2C13.4,4.2,13.4,4.2,13.4,4.2z M15,9c0,1.7-1.3,3-3,3s-3-1.3-3-3s1.3-3,3-3S15,7.3,15,9z M10.6,4.2 C10.6,4.2,10.6,4.2,10.6,4.2C10.6,4.2,10.6,4.2,10.6,4.2z M7,3c1.2,0,2.2,0.6,2.7,1.6C8.1,5.5,7,7.1,7,9C5.3,9,4,7.7,4,6S5.3,3,7,3 z M5.1,18H2v-2.1C2,13.1,4.1,11,7,11v0c0,0,0,0,0,0c0.1,0,0.2,0,0.3,0c0,0,0,0,0,0c0.3,0.7,0.8,1.3,1.3,1.8 C6.7,13.8,5.4,15.7,5.1,18z M17,21H7v-2.1c0-2.8,2.2-4.9,5-4.9c2.9,0,5,2.1,5,4.9V21z M22,18h-3.1c-0.3-2.3-1.7-4.2-3.7-5.2 c0.6-0.5,1-1.1,1.3-1.8c0.1,0,0.2,0,0.4,0v0c2.9,0,5,2.1,5,4.9V18z" />
                    </g>
                </svg>

                <svg
                    className={title === 'Profile' ? "Button-selected" : "Button"}
                    width="30px"
                    height="30px"
                    viewBox="0 0 24 24"
                    onClick={() => handleButtonClick(3)}
                    style={{ cursor: 'pointer' }}
                >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>

            </div>

            <div className="Title">
                {title}
            </div>


            {(title === 'Contacts' || title === 'Groups') && (
                <input
                    className="Search"
                    placeholder={`Search ${title}`}
                />
            )}


            <div className="Content">
                {title === 'Contacts' ? (
                    <>
                        {/* for each contact in the user data - map each contact */}
                        <div className="Contact">Add Contact BTN</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                        <div className="Contact">First Last</div>
                    </>
                ) : title === 'Groups' ? (
                    <>
                        {/* for each group in the user data - map each group */}
                        <div className="Group">Add Group BTN</div>
                        <div className="Group">Group Name</div>
                        <div className="Group">Group Name</div>
                        <div className="Group">Group Name</div>
                        <div className="Group">Group Name</div>
                        <div className="Group">Group Name</div>
                        <div className="Group">Group Name</div>
                        <div className="Group">Group Name</div>
                        <div className="Group">Group Name</div>
                    </>
                ) : title === 'Profile' ? (
                    <>
                        {/* for each prfile info in the user data - map each profile info */}
                        <img src="/account-svgrepo-com.svg" className="Profile-picture-div"></img>
                        <div className="Profile-div">Name: John Doe</div>
                        <div className="Profile-div">Email: john.doe@example.com</div>
                        <div className="Profile-div">Phone: 123-456-7890</div>
                        <div className="Profile-div">Address: 123 Main St, Anytown, USA</div>
                        {/* Add more profile details as needed */}
                    </>
                ) : null}
            </div>
            <div className="Bottom">

                <img className="Dark-Mode-Toggle-BTN"
                    onClick={toggleTheme}
                    src={isDarkMode ? "/Sun.png" : "/Moon.png"}
                    alt={isDarkMode ? "Sun" : "Moon"}
                ></img>

                <svg
                    onClick={() => { console.log("Logout BTN clicked") }}
                    className="Log-out-btn"
                    width="30px"
                    height="30px"
                    viewBox="0 0 24 24"
                    fill="none" >
                    <path d="M15 12L2 12M2 12L5.5 9M2 12L5.5 15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9.00195 7C9.01406 4.82497 9.11051 3.64706 9.87889 2.87868C10.7576 2 12.1718 2 15.0002 2L16.0002 2C18.8286 2 20.2429 2 21.1215 2.87868C22.0002 3.75736 22.0002 5.17157 22.0002 8L22.0002 16C22.0002 18.8284 22.0002 20.2426 21.1215 21.1213C20.3531 21.8897 19.1752 21.9862 17 21.9983M9.00195 17C9.01406 19.175 9.11051 20.3529 9.87889 21.1213C10.5202 21.7626 11.4467 21.9359 13 21.9827" strokeWidth="1.5" strokeLinecap="round" />
                </svg>

            </div>

        </div>
    )
}