// IMPORTS
// Styles
import "./Navigator.css"
// React 
import { useEffect, useState } from "react";
// Variables 
const backendUrl = import.meta.env.VITE_BACKEND_URL;



// COMPONENT
export const Navigator = ({ toggleTheme, isDarkMode, setClientView, handleLogout, roomID, setRoomID }) => {

    // STATES 
    // Loading and errors 
    const [loading, setLoading] = useState(true);
    const [fetchEror, setFetchError] = useState(false);
    // Client info 
    const [userData, setUserData] = useState({});
    // USEEFFECT - Run fetch on mount.
    useEffect(() => {
        getUserAccountInfo();
    }, [])
    // FETCH user info and save it to userData state.
    const getUserAccountInfo = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('UserAccessToken')}`
            },
        };
        // Fetch user info
        try {
            const response = await fetch(`${backendUrl}/users/account`, requestOptions);
            const responseData = await response.json();
            if (!response.ok) {
                if (response.status === 401) {
                    handleLogout();
                } else {
                    console.log('response wasnt good sir'); // What could cause this?
                }
            } else {
                // console.log(responseData); // DELETE ME
                setUserData(responseData);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            // Set fetch error to true
        }
    }

    // Navigator view controlls
    const [title, setTitle] = useState('Groups');
    const handleButtonClick = (buttonId) => {
        if (buttonId === 1) {
            setTitle('Contacts');
        } else if (buttonId === 2) {
            setTitle('Groups');
        } else if (buttonId === 3) {
            setTitle('Profile');
        }
    };


    // CONTACTS
    // Add contact
    const [addContactActive, setAddContactActive] = useState(false);
    const [addContactInput, setAddContactInput] = useState("");
    const [userNotFound, setUserNotFound] = useState(false);

    // CONTACTS
    // Handle change input function 
    const hanldeAddContactInputChange = (e) => {
        setAddContactInput(e.target.value)
    }
    // Add new contact BTN
    const addContact = async (e) => {
        e.stopPropagation();
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('UserAccessToken')}`
            },
            body: JSON.stringify({
                contact: addContactInput
            })
        };
        try {
            const response = await fetch(`${backendUrl}/users/addcontact`, requestOptions);
            // const responseData = await response.json();
            if (!response.ok) {
                setUserNotFound(true);
                setAddContactInput('');
            } else {
                setUserNotFound(false);
                getUserAccountInfo();
            }
        } catch (error) {
            console.error(error);
        }
    }
    // Remove Contact BTN 
    const removeContact = async (contactId) => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('UserAccessToken')}`
            },
            body: JSON.stringify({
                contact: contactId
            })
        };
        try {
            const response = await fetch(`${backendUrl}/users/removecontact`, requestOptions);
            // const responseData = await response.json();
            if (!response.ok) {
                alert("try again later")
            } else {
                getUserAccountInfo();
            }
        } catch (error) {
            console.error(error);
        }
    };

    // GROUPS
    // Add Group
    const [addGroupActive, setAddGroupActive] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [groupsData, setGroupsData] = useState([]);
    // UseEffect - when userData is updated, fetch info for each group in the .GROUPS array
    useEffect(() => {
        if (userData && userData.userInfo && Array.isArray(userData.userInfo.GROUPS)) {
            // Define an async function inside useEffect
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('UserAccessToken')}`
                },
                body: JSON.stringify({ array: userData.userInfo.GROUPS })
            };

            const fetchData = async () => {
                try {
                    const response = await fetch(`${backendUrl}/groups/getgroupbyid`, requestOptions);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setGroupsData(data.groups); // Log the response data
                } catch (error) {
                    console.error('Fetch error:', error);
                }
            };
            fetchData();
        }
        console.log(userData)
    }, [userData]);
    // Button handlers 
    const handleNewGroupNameChange = (e) => {
        setNewGroupName(e.target.value)
    }
    // Add group BTN 
    const addGroup = async (e) => {
        e.stopPropagation();
        console.log("adding group FE")

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('UserAccessToken')}`
            },
            body: JSON.stringify({
                groupName: newGroupName
            })
        };
        try {
            const response = await fetch(`${backendUrl}/groups/creategroup`, requestOptions);
            // const responseData = await response.json();
            if (!response.ok) {
                alert("not ok")
            } else {
                getUserAccountInfo();
            }
        } catch (error) {
            console.error(error);
        }



    }
    // Leave group BTN
    const leaveGroup = async (groupId) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('UserAccessToken')}`
            },
            body: JSON.stringify({ groupId: groupId })
        };
        try {
            const response = await fetch(`${backendUrl}/groups/leavegroupbyid`, requestOptions);
            if (!response.ok) {
                console.log('NOT OK')
                getUserAccountInfo();
                throw new Error('Network response was not ok');

            } else {
                console.log("res OK")
                getUserAccountInfo();
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }
    // ROOM 
    // Enter Room function 
    const [selectedRoom, setSelectedRoom] = useState("");

    const enterRoom = (groupID, groupNAME) => {

        // Color the group to an active color
        // console.log(e.target.group.ID)
        // setRoomID(groupId)
        setSelectedRoom(groupID)
        console.log(groupNAME)
    }



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

            {/* SEARCH BOX */}
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
                        <div
                            className="Add-contact-btn"
                            onClick={() => setAddContactActive(prevState => !prevState)}
                        >
                            Add Contact
                            {addContactActive && (
                                <>
                                    <input
                                        style={{ outline: userNotFound ? '2px solid red' : '' }}
                                        value={addContactInput}
                                        onChange={hanldeAddContactInputChange}
                                        type="search"
                                        placeholder={userNotFound ? 'User not found' : 'Enter user address'}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <button
                                        onClick={addContact}
                                    >Add</button>
                                </>
                            )}
                        </div>
                        {userData.userInfo && userData.userInfo.CONTACTS && userData.userInfo.CONTACTS.map(contact => (
                            <div key={contact.ID} className="Contact">
                                {contact.FIRST_NAME} {contact.LAST_NAME}
                                <button
                                    className="Remove-contact-BTN"
                                    onClick={() => removeContact(contact.ID)}>Remove</button>
                            </div>
                        ))}
                    </>
                ) : title === 'Groups' ? (
                    <>
                        <div
                            className="Add-group-btn"
                            onClick={() => setAddGroupActive(prevState => !prevState)}
                        >
                            {addGroupActive ?
                                'Add Group BTN'
                                :
                                <>
                                    <input
                                        value={newGroupName}
                                        onChange={handleNewGroupNameChange}
                                        onClick={(e) => e.stopPropagation()}
                                        placeholder="New group name"
                                    />
                                    <button
                                        onClick={addGroup}
                                    >Add</button>
                                </>
                            }
                        </div>
                        {/* for each group in the user data - map each group */}
                        {groupsData.map((group, index) => (
                            <div
                                key={index}
                                className={selectedRoom === group.ID ? "Group-selected" : "Group"}
                                onClick={() => enterRoom(group.ID, group.NAME)}
                            >
                                {group.NAME}
                                <button
                                    className="Remove-contact-BTN"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        leaveGroup(group.ID);
                                    }}
                                >Leave</button>
                            </div>
                        ))}
                    </>
                ) : title === 'Profile' ? (
                    <>
                        {/* for each prfile info in the user data - map each profile info */}
                        <img src="/account-svgrepo-com.svg" className="Profile-picture-div"></img>
                        <div className="Profile-div">{'Name: ' + userData.userInfo.FIRST_NAME + ' ' + userData.userInfo.LAST_NAME}</div>
                        <div className="Profile-div">{'Email: ' + userData.userInfo.EMAIL}</div>
                        <div className="Profile-div">{'Phone: ' + userData.userInfo.PHONE}</div>
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
                    onClick={handleLogout}
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