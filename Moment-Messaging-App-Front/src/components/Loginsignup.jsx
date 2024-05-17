// IMPORTS
// Styles
import "./Loginsignup.css"
// React
import { useState } from "react";



// COMPONENT
export const Loginsignup = ({ toggleTheme, isDarkMode }) => {
    // STATES
    // Do password match
    const [passMatch, setPassMatch] = useState(true);
    // Display sign up or log in
    const [formState, setFormState] = useState("signup")

    // State for Sign Up form data
    const [signUpData, setSignUpData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    // State for Log In form data
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    // Handlers for form input changes
    const handleSignUpChange = (e) => {
        const { name, value } = e.target;
        setSignUpData((prevData) => {
            const updatedData = {
                ...prevData,
                [name]: value
            };

            // Check if passwords match and are non-empty
            if (updatedData.password && updatedData.confirmPassword) {
                setPassMatch(updatedData.password === updatedData.confirmPassword);
            } else {
                setPassMatch(true); // Set to true when either field is empty
            }

            return updatedData;
        });
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handlers for form submissions
    const handleSignUpSubmit = (e) => {
        e.preventDefault();
        if (signUpData.password === signUpData.confirmPassword) {
            console.log("Sign Up Data:", signUpData);
        }
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        console.log("Login Data:", loginData);
    };

    return (
        <div className="Loginsignup">
            <div className="Header">
                <h1>Moment</h1>
                <div className="Devider"></div>
            </div>

            <div className="Buttons">
                <button
                    className={formState === "signup" ? "Form-BTN-Selected" : "Form-BTN"}
                    onClick={() => setFormState("signup")}
                >
                    Sign Up
                </button>
                <button
                    className={formState === "login" ? "Form-BTN-Selected" : "Form-BTN"}
                    onClick={() => setFormState("login")}
                >
                    Log in
                </button>
            </div>

            {formState === "signup" && (
                <form onSubmit={handleSignUpSubmit}>
                    <input
                        type="text"
                        minLength={1}
                        maxLength={30}
                        name="firstName"
                        value={signUpData.firstName}
                        onChange={handleSignUpChange}
                        placeholder="First Name*"
                        pattern="[A-Za-z\s]+" // only allows letters and spaces
                        aria-label="First Name"
                        required
                    />
                    <input
                        type="text"
                        minLength={1}
                        maxLength={30}
                        name="lastName"
                        value={signUpData.lastName}
                        onChange={handleSignUpChange}
                        placeholder="Last Name*"
                        pattern="[A-Za-z\s]+" // only allows letters and spaces
                        aria-label="Last name"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={signUpData.email}
                        onChange={handleSignUpChange}
                        placeholder="Email*"
                        required
                    />
                    <input
                        name="phone"
                        value={signUpData.phone}
                        onChange={handleSignUpChange}
                        placeholder="Phone"
                    />
                    <input
                        minLength={8}
                        type="password"
                        name="password"
                        value={signUpData.password}
                        onChange={handleSignUpChange}
                        placeholder="Password*"
                        required
                    />
                    <input
                        className={!passMatch ? 'Input-invalid' : ''}
                        type="password"
                        name="confirmPassword"
                        value={signUpData.confirmPassword}
                        onChange={handleSignUpChange}
                        placeholder="Confirm Password*"
                        required
                    />
                    <button className="Form-Sumbit-BTN" type="submit">
                        Sign Up
                    </button>
                </form>
            )}

            {formState === "login" && (
                <form onSubmit={handleLoginSubmit}>
                    <input
                        type="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        placeholder="Password"
                        required
                    />
                    <button className="Form-Sumbit-BTN" type="submit">
                        Login
                    </button>
                </form>
            )}

            <div className="Bottom">
                <img className="Dark-Mode-Toggle-BTN"
                    onClick={toggleTheme}
                    src={isDarkMode ? "/Sun.png" : "/Moon.png"}
                    alt={isDarkMode ? "Sun" : "Moon"}
                ></img>

            </div>
        </div>
    )
}