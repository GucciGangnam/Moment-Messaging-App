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
  // STATES
  // Darkmode
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Client view 
  const [clientView, setClientView] = useState('login') // login || navigator
  // Check if user already has a valid access token and log them in if they do.
/////////////////////////////////////////////////
// On mount. check if there is an access token, if there is, logem in, if not delete it 
useEffect(() => { 
  if (localStorage.getItem('UserAccessToken')){ 
    verifyAccessToken();
  } else { 
    return;
  }
},[])
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
      console.log(responseData);
    } else {
      setClientView('navigator')
      console.log(responseData);
    }
  } catch (error) {
    console.error("An error occurred while verifying access token:", error);
  }
};
/////////////////////////////////////////////////
  // ClientAccessToken
  const [userAccessToken, setUserAccessToken] = useState('')

    // LOGOUT
    const handleLogout = () => {
      localStorage.removeItem('UserAccessToken');
      setClientView('login');
    }
/////////////////////////////////////////////////
    // BUTTON HANDLERS
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
/////////////////////////////////////////////////
/////////////////////////////////////////////////
    return (
      <div className="App">

        {/* layout button - absolute */}
        <svg
          onClick={() => { console.log("Layout BTN clicked") }}
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
            setClientView={setClientView}
            handleLogout={handleLogout} />
        )}

        {/* RIGHT */}
        {clientView === 'login' ? <Landing /> : <Room />}


      </div>
    );
  };
  /////////////////////////////////////////////////