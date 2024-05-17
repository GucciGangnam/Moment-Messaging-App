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


// COMPONENT
export const App = () => {
  // STATES
  // Darkmode
  const [isDarkMode, setIsDarkMode] = useState(false);

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


  return (
    <div className="App">

{/* LEFT */}
      {/* <Loginsignup
      toggleTheme={toggleTheme}
      isDarkMode={isDarkMode}/> */}

      <Navigator
      toggleTheme={toggleTheme}
      isDarkMode={isDarkMode}/>

{/* RIGHT */}
      {/* <Landing /> */}
      <Room/>

    </div>
  );
};