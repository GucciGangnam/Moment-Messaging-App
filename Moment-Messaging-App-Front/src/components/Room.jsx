// IMPORTS 
// React 
import { useState, useEffect, useRef, useCallback } from "react";
// Styles 
import "./Room.css";
// Components 
import { AddMember } from "./AddMember";
import { ViewMembers } from "./ViewMembers";
// Variables 
const backendUrl = import.meta.env.VITE_BACKEND_URL;
// Socket IO 
import { io } from 'socket.io-client';

// Initialize socket outside the component to avoid reinitializing on every render
const socket = io(backendUrl, {
    withCredentials: true,
});

// COMPONENTS 
export const Room = ({ currentGroupOBJ, userData }) => {
    const [offlineGroupOBJ, setOfflineGroupOBJ] = useState({});
    const messageTimers = useRef({});  // Use ref to store timers

    // UE to log offlineGroup OBJ when updated
    useEffect(() => {
        console.log(offlineGroupOBJ)
    }, [offlineGroupOBJ])

    // STEP 1 - Fetch most up to date group OBJ
    const fetchUpToDtaGroup = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('UserAccessToken')}`
            },
        };
        try {
            const response = await fetch(`${backendUrl}/groups/getSingGroupInfo/${currentGroupOBJ.ID}`, requestOptions);
            const data = await response.json(); // Parse the JSON body
            if (!response.ok) {
                console.log('Error:', data);
            } else {
                // console.log(data.group);
                setOfflineGroupOBJ(data.group);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    const [socketConnected, setSocketConnected] = useState("")
    // ON GROUP CHANGE
    useEffect(() => {
        // FETCH MOST UP TO DATA GROUP OBJ
        fetchUpToDtaGroup();
        console.log("ROOM MOUNTED");
        setMessageInput("");
        // Connect to socket when the component mounts
        socket.connect();

        // Once connected, send the currentGroupOBJ to the server
        socket.on('connect', () => {
            console.log('Connected to socket');
            setSocketConnected("Online")
            // EMIT JOIN ROOM 
            socket.emit("join-room", currentGroupOBJ.ID);
        });

        // EMIT JOIN ROOM 
        socket.emit("join-room", currentGroupOBJ.ID);



        // LISTEN for update group data?
        socket.on('member-added', fetchUpToDtaGroup);

        // LISTEN  relay-message
        socket.on('relay-message', (OBJ) => {
            const message = OBJ.message;
            const userId = OBJ.user;
            console.log(OBJ);
            // setTime(300);

            setOfflineGroupOBJ(prevOfflineGroupOBJ => {
                const memberIndex = prevOfflineGroupOBJ.MEMBERS.findIndex(member => member.ID === userId);
                const username = prevOfflineGroupOBJ.MEMBERS[memberIndex].FIRST_NAME
                if (memberIndex !== -1) {
                    const updatedMembers = [...prevOfflineGroupOBJ.MEMBERS];
                    updatedMembers[memberIndex].MESSAGE = message;

                    // Clear existing timer for the user if it exists
                    if (messageTimers.current[userId]) {
                        clearTimeout(messageTimers.current[userId]);
                    }

                    // Set timeout duration based on message length
                    let timeoutDuration = 3000;
                    if (message.length > 100 && message.length <= 200) {
                        timeoutDuration = 5000; // 5 seconds
                    } else if (message.length > 200) {
                        timeoutDuration = 7000; // 7 seconds
                    }

                    // Set a new timer to reset the message after 3 seconds
                    messageTimers.current[userId] = setTimeout(() => {
                        setOfflineGroupOBJ(prevState => {
                            const memberIndex = prevState.MEMBERS.findIndex(member => member.ID === userId);
                            if (memberIndex !== -1) {
                                const resetMembers = [...prevState.MEMBERS];
                                resetMembers[memberIndex].MESSAGE = "";
                                return {
                                    ...prevState,
                                    MEMBERS: resetMembers
                                };
                            }
                            return prevState;
                        });
                    }, timeoutDuration);

                    // Update room name and creator only if they are initially null
                    if (prevOfflineGroupOBJ.ROOM_NAME === null && prevOfflineGroupOBJ.ROOM_CREATOR === null) {
                        return {
                            ...prevOfflineGroupOBJ,
                            MEMBERS: updatedMembers,
                            ROOM_TIMER: new Date(), // Update ROOM_TIMER to the current date and time
                            ROOM_NAME: message,
                            ROOM_CREATOR: username
                        };
                    } else {
                        return {
                            ...prevOfflineGroupOBJ,
                            MEMBERS: updatedMembers,
                            ROOM_TIMER: new Date() // Update ROOM_TIMER to the current date and time
                        };
                    }
                } else {
                    console.error('Member not found in offlineGroupOBJ');
                    return prevOfflineGroupOBJ; // Return the previous state unchanged
                }
            });
        });

        // CLEAN UP
        return () => {
            socket.off('relay-message');
            socket.off('member-added');
            // Handle socket disconnection
            socket.on('disconnect', () => {
                console.log('Socket disconnected 1');
                setSocketConnected("Offline")
                // Add your custom logic here for what to do when the socket disconnects
                // For example, you could show a message to the user or attempt to reconnect
            });
            socket.disconnect();
            console.log('Disconnected from socket 2');
            // Clear all timers when component unmounts
            Object.values(messageTimers.current).forEach(clearTimeout);
            messageTimers.current = {};
        };


    }, [currentGroupOBJ.ID]);

    /////////////////////////// SOCKET IO ////////////////////////////////

    const colors = {
        "red": {
            primary: "#f8a1ae",
            secondary: "#fbcbd2"
        },
        "orange": {
            primary: "#ffd1a9",
            secondary: "#ffe4c7"
        },
        "yellow": {
            primary: "#fff59d", // Darker pastel yellow
            secondary: "#fff9c4"
        },
        "green": {
            primary: "#c5e1a5", // Darker pastel green
            secondary: "#e6f3d5"
        },
        "blue": {
            primary: "#bbdefb",
            secondary: "#e3f2fd"
        },
        "indigo": {
            primary: "#c5cae9",
            secondary: "#e8eaf6"
        },
        "violet": {
            primary: "#e1bee7",
            secondary: "#f3e5f5"
        },
        "gray": {
            primary: "#bdbdbd", // Darker gray
            secondary: "#e0e0e0"
        }
    };
    const getColor = (index) => {
        const colorKeys = Object.keys(colors);
        return colors[colorKeys[index % colorKeys.length]];
    };

    // FUNCTION TO EMIT NEW MEMBER
    const memberAdded = () => {
        socket.emit('member-added')
    }


    // Add Memebr Compoenent 
    const [addMemberShowing, setAddMemberShowing] = useState(false);
    // View Members Component
    const [viewMembersShowing, setViewMembersShowing] = useState(false);

    //TOP
    //MIDDLE
    // BOTTOM 

    // Message input 
    const [messageInput, setMessageInput] = useState('')
    const handleMessageInputChnage = (e) => {
        setMessageInput(e.target.value)
    }
    // Send BTN 
    // handle send message // WARNING THIS IS CAUSING A RERENDER ON EVER KEY STROKE!!!!
    const handleSendMessage = useCallback(() => {
        if (messageInput === "") {
            return;
        }
        socket.emit("send-message", messageInput, userData.userInfo.ID);
        setMessageInput("");
    }, [messageInput, userData.userInfo.ID]); // Dependencies of handleSendMessage

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.keyCode === 13) {
                handleSendMessage();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleSendMessage]);

    ///
    // TIMER
    ///
    // const timerStartFrom =  offlineGroupOBJ.ROOM_TIMER



    return (
        <div className="Room">

            <div className="Top">

                <div className="Top-left">
                    {offlineGroupOBJ && offlineGroupOBJ.MEMBERS ? (
                        <div>{offlineGroupOBJ.MEMBERS.length}</div>
                    ) : (
                        <div>Loading...</div>
                    )}
                    <svg
                        onClick={() => {
                            setViewMembersShowing(prevState => {
                                if (!prevState) {
                                    setAddMemberShowing(false);
                                }
                                return !prevState;
                            });
                        }}
                        className={viewMembersShowing ? 'View-member-btn-selected' : 'View-member-btn'}
                        width="30px"
                        height="30px"
                        viewBox="0 0 512 512">
                        <g>
                            <path d="M147.57,320.188c-0.078-0.797-0.328-1.531-0.328-2.328v-6.828c0-3.25,0.531-6.453,1.594-9.5
		c0,0,17.016-22.781,25.063-49.547c-8.813-18.594-16.813-41.734-16.813-64.672c0-5.328,0.391-10.484,0.938-15.563
		c-11.484-12.031-27-18.844-44.141-18.844c-35.391,0-64.109,28.875-64.109,73.75c0,35.906,29.219,74.875,29.219,74.875
		c1.031,3.047,1.563,6.25,1.563,9.5v6.828c0,8.516-4.969,16.266-12.719,19.813l-46.391,18.953
		C10.664,361.594,2.992,371.5,0.852,383.156l-0.797,10.203c-0.406,5.313,1.406,10.547,5.031,14.438
		c3.609,3.922,8.688,6.125,14.016,6.125H94.93l3.109-39.953l0.203-1.078c3.797-20.953,17.641-38.766,36.984-47.672L147.57,320.188z"
                            />
                            <path d="M511.148,383.156c-2.125-11.656-9.797-21.563-20.578-26.531l-46.422-18.953
		c-7.75-3.547-12.688-11.297-12.688-19.813v-6.828c0-3.25,0.516-6.453,1.578-9.5c0,0,29.203-38.969,29.203-74.875
		c0-44.875-28.703-73.75-64.156-73.75c-17.109,0-32.625,6.813-44.141,18.875c0.563,5.063,0.953,10.203,0.953,15.531
		c0,22.922-7.984,46.063-16.781,64.656c8.031,26.766,25.078,49.563,25.078,49.563c1.031,3.047,1.578,6.25,1.578,9.5v6.828
		c0,0.797-0.266,1.531-0.344,2.328l11.5,4.688c20.156,9.219,34,27.031,37.844,47.984l0.188,1.094l3.094,39.969h75.859
		c5.328,0,10.406-2.203,14-6.125c3.625-3.891,5.438-9.125,5.031-14.438L511.148,383.156z"/>
                            <path d="M367.867,344.609l-56.156-22.953c-9.375-4.313-15.359-13.688-15.359-23.969v-8.281
		c0-3.906,0.625-7.797,1.922-11.5c0,0,35.313-47.125,35.313-90.594c0-54.313-34.734-89.234-77.594-89.234
		c-42.844,0-77.594,34.922-77.594,89.234c0,43.469,35.344,90.594,35.344,90.594c1.266,3.703,1.922,7.594,1.922,11.5v8.281
		c0,10.281-6.031,19.656-15.391,23.969l-56.156,22.953c-13.047,5.984-22.344,17.984-24.906,32.109l-2.891,37.203h139.672h139.672
		l-2.859-37.203C390.211,362.594,380.914,350.594,367.867,344.609z"/>
                        </g>
                    </svg>
                    {viewMembersShowing && (
                        <ViewMembers
                            offlineGroupOBJ={offlineGroupOBJ} />
                    )}



                    <svg
                        onClick={() => {
                            setAddMemberShowing(prevState => {
                                if (!prevState) {
                                    setViewMembersShowing(false);
                                }
                                return !prevState;
                            });
                        }}
                        className={addMemberShowing ? 'Add-member-btn-selected' : 'Add-member-btn'}
                        width="30px"
                        height="30px"
                        viewBox="0 0 24 24" >
                        <path d="M4 12H20M12 4V20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {addMemberShowing && (
                        <AddMember
                            userData={userData}
                            offlineGroupOBJ={offlineGroupOBJ}
                            setOfflineGroupOBJ={setOfflineGroupOBJ}
                            memberAdded={memberAdded}
                        />
                    )}

                </div>

                <div className="Top-min">
                    <div className="Room-info">
                        <div className="Room-title">
                            {offlineGroupOBJ && offlineGroupOBJ.ROOM_NAME ? (
                                <div>{offlineGroupOBJ.ROOM_NAME}</div>
                            ) : (
                                <div>Inactive</div>
                            )}
                        </div>
                        <div className="Room-meta">
                            <div className="Room-creator">
                                Created by {offlineGroupOBJ.ROOM_CREATOR}
                            </div>
                            <div className="Room-timer">
                                {/* // render  countdown to 0 starting from (timerStartFrom) */}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="Top-Right">
                            {socketConnected}
                </div>

            </div>
            <div className="Devider"></div>



            <div className="Main">
                {offlineGroupOBJ.MEMBERS ? (
                    offlineGroupOBJ.MEMBERS.map((member, index) => {
                        const color = getColor(index);
                        return (
                            <div
                                key={member.ID}
                                className={member.MESSAGE !== "" ? "Message-div" : "No-message-div"}
                                style={{ backgroundColor: color.secondary }}>
                                <div className="User-initials" style={{ backgroundColor: color.primary }}>
                                    {member.FIRST_NAME.charAt(0)}{member.LAST_NAME.charAt(0)}
                                </div>
                                {member.MESSAGE && (
                                    <div className="Message">{member.MESSAGE}</div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div>No members available</div>
                )}
            </div>





            <div className="Bottom">

                <button
                    onClick={() => { console.log("Microphone btn clicked") }}
                    className="Mic-button"
                    aria-label="Search">
                    <svg width="30px"
                        height="30px"
                        viewBox="0 0 24 24"
                    >
                        <path d="M19 10V12C19 15.866 15.866 19 12 19M5 10V12C5 15.866 8.13401 19 12 19M12 19V22M8 22H16M12 15C10.3431 15 9 13.6569 9 12V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V12C15 13.6569 13.6569 15 12 15Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <input
                    placeholder="Your message here"
                    value={messageInput}
                    onChange={handleMessageInputChnage}>
                </input>

                <div className="Message-Buttons">

                    <svg
                        onClick={() => { console.log("Pin message clicked") }}
                        className="Pin-btn"
                        width="30px"
                        height="30px"
                        viewBox="0 0 24 24"
                        fill="none">
                        <path d="M19.1835 7.80516L16.2188 4.83755C14.1921 2.8089 13.1788 1.79457 12.0904 2.03468C11.0021 2.2748 10.5086 3.62155 9.5217 6.31506L8.85373 8.1381C8.59063 8.85617 8.45908 9.2152 8.22239 9.49292C8.11619 9.61754 7.99536 9.72887 7.86251 9.82451C7.56644 10.0377 7.19811 10.1392 6.46145 10.3423C4.80107 10.8 3.97088 11.0289 3.65804 11.5721C3.5228 11.8069 3.45242 12.0735 3.45413 12.3446C3.45809 12.9715 4.06698 13.581 5.28476 14.8L6.69935 16.2163L2.22345 20.6964C1.92552 20.9946 1.92552 21.4782 2.22345 21.7764C2.52138 22.0746 3.00443 22.0746 3.30236 21.7764L7.77841 17.2961L9.24441 18.7635C10.4699 19.9902 11.0827 20.6036 11.7134 20.6045C11.9792 20.6049 12.2404 20.5358 12.4713 20.4041C13.0192 20.0914 13.2493 19.2551 13.7095 17.5825C13.9119 16.8472 14.013 16.4795 14.2254 16.1835C14.3184 16.054 14.4262 15.9358 14.5468 15.8314C14.8221 15.593 15.1788 15.459 15.8922 15.191L17.7362 14.4981C20.4 13.4973 21.7319 12.9969 21.9667 11.9115C22.2014 10.826 21.1954 9.81905 19.1835 7.80516Z" />
                    </svg>





                    <svg
                        onChange={handleMessageInputChnage}
                        onClick={handleSendMessage}
                        className="Send-btn"
                        width="30px"
                        height="30px"
                        viewBox="0 0 24 24"
                        fill="none">
                        <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>






                </div>

            </div>
        </div>
    )
}