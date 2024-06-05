// IMPORTS
// Styles 
import "./App.css"
// React 
import { useEffect, useState } from "react";
// RRD 
// Pages
// Components 
import { Loginsignup } from "./components/Loginsignup.jsx"
import { Landing } from "./components/Landing.jsx";
import { Navigator } from "./components/Navigator.jsx";
import { Room } from "./components/Room.jsx";
// Variables 
const backendUrl = import.meta.env.VITE_BACKEND_URL;


// COMPONENT
export const App = () => {

  // DARKMODE //
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Handle toggle dark theme
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };
  // UE to update rerender App when theme is toggled
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  // CLIENT VIEW //
  const [clientView, setClientView] = useState('login') // login || navigator
  const [currentGroupOBJ, setCurrentGroupOBJ] = useState('')

  // CLIENT ACCOUNT INFO //
  const [userData, setUserData] = useState({});
  // FETCH USER ACCOUNT INFO - Save to userData state
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
      }
    } catch (error) {
      console.error(error);
      // Set fetch error to true
    }
  }
  // UE to run fetch User Account Info on mount
  useEffect(() => {
    getUserAccountInfo();
  }, [])
  /////////////////////////////////////////////////

  // CLIENT GROUP INFO //
  const [userGroupData, setUserGroupData] = useState({});
  // Get Groups data for each of teh grousp that the user is in once UserData has been fetched
  useEffect(() => {
    getGroupData();
  }, [userData])
  // Fetch group Info for client
  const getGroupData = async () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('UserAccessToken')}`
      },
    };
    try {
      const response = await fetch(`${backendUrl}/groups/getgroupinfo`, requestOptions);
      const responseData = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
        } else {
          console.log('response wasnt good sir'); // What could cause this?
        }
      } else {
        // console.log(responseData); // DELETE ME
        setUserGroupData(responseData.groups);
      }
    } catch (error) {
      console.error(error);
      // Set fetch error to true
    }
  }




  // FUNCTIONS TO CHECK IF USER IS LOGGED IN //
  useEffect(() => {
    if (localStorage.getItem('UserAccessToken')) {
      verifyAccessToken();
    } else {
      return;
    }
  }, [])
  // Function to verify accessToken 
  const verifyAccessToken = async () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('UserAccessToken')}`
      },
    };
    // Try to validate access token
    try {
      const response = await fetch(`${backendUrl}/users/login`, requestOptions);
      const responseData = await response.json();
      if (!response.ok) {
        console.log("this jwt isn't valid m8  - delete that shit");
        localStorage.removeItem('UserAccessToken');
        // console.log(responseData);
      } else {
        setClientView('navigator')
        // console.log(responseData);
      }
    } catch (error) {
      console.error("An error occurred while verifying access token:", error);
    }
  };
  /////////////////////////////////////////////////


  //////// HANDLE LAYOUT CHANGE /////////
  const [layout, setLayout] = useState('App')
  const handleLayoutChange = () => {
    if (layout === 'App') {
      setLayout('App-Layout2')
    } else {
      setLayout('App')
    }
  } 



  // LOGOUT //
  const handleLogout = () => {
    localStorage.removeItem('UserAccessToken');
    setClientView('login');
  }
  /////////////////////////////////////////////////

  return (
    <div className={layout}>

      {/* layout button - absolute */}
      <svg
        onClick={handleLayoutChange}
        className="Layout-BTN"
        width="30px"
        height="30px"
        viewBox="0 0 24 24">
        <path d="M17.5 11H12.5M17.5 15H12.5M17.5 7H12.5M9 3L9 21M7.8 3H16.2C17.8802 3 18.7202 3 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C21 5.27976 21 6.11984 21 7.8V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V7.8C3 6.11984 3 5.27976 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.27976 3 6.11984 3 7.8 3Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* LEFT */}
      {clientView === 'login' ? (
        <Loginsignup
          toggleTheme={toggleTheme}
          isDarkMode={isDarkMode}
          setClientView={setClientView} />
      ) : (
        <Navigator
          toggleTheme={toggleTheme}
          isDarkMode={isDarkMode}
          handleLogout={handleLogout}
          userData={userData}
          getUserAccountInfo={getUserAccountInfo}
          userGroupData={userGroupData}
          setCurrentGroupOBJ={setCurrentGroupOBJ}
          getGroupData={getGroupData}
        />
      )}

      {/* RIGHT */}
      {clientView === 'login' || currentGroupOBJ === "" ?
        <Landing />
        :
        <Room
          // Dont need to pass in currentGroupOBJ but instead need to pass in userGroupData.[which ever object has the same ID as currentGroupOBJ.ID]
          currentGroupOBJ={currentGroupOBJ}
          userData={userData}
        />
      }
    </div>
  );
};
/////////////////////////////////////////////////