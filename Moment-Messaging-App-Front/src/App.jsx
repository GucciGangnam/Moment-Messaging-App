// IMPORTS
// Styles 
import "./App.css"
// React 
import { useEffect, useState } from "react";
// RRD 
// Pages
// Components 
import { Loginsignup } from "./components/Loginsignup.jsx"


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

      <div className="Navigator">
        <h1>Moments</h1>
        <div className="Devider"></div>
        <Loginsignup />
        <img className="Dark-Mode-Toggle-BTN"
        onClick={toggleTheme}
        src={isDarkMode ? "/Sun.png" : "/Moon.png"}
        alt={isDarkMode ? "Sun" : "Moon"}
        ></img>
      </div>

      <div className="Body">
        
      </div>

    </div>
  );
};