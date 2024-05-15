// IMPORTS 
// React 
import { useState, useEffect } from "react"
// RRD
// Styles 
import "./Loginsignup.css"
// Components

// COMPONENT
export const Loginsignup = () => {
    // STATES
    // Display sign up or log in
    const [formState, setFormState] = useState("signup")

    // State for Sign Up form data
    const [signUpData, setSignUpData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: ''
    });

    // State for Log In form data
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    // Handlers for form input changes
    const handleSignUpChange = (e) => {
        const { name, value } = e.target;
        setSignUpData((prevData) => ({
            ...prevData,
            [name]: value
        }));
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
        console.log("Sign Up Data:", signUpData);
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        console.log("Login Data:", loginData);
    };



    return (
        <div className="Loginsignup">
            <h1>Moments</h1>
            <div className="Devider"></div>
            <div className="Form-BTN-CTR">
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
                        name="firstName"
                        value={signUpData.firstName}
                        onChange={handleSignUpChange}
                        placeholder="First Name"
                    />
                    <input
                        name="lastName"
                        value={signUpData.lastName}
                        onChange={handleSignUpChange}
                        placeholder="Last Name"
                    />
                    <input
                        type="email"
                        name="email"
                        value={signUpData.email}
                        onChange={handleSignUpChange}
                        placeholder="Email"
                    />
                    <input
                        name="phone"
                        value={signUpData.phone}
                        onChange={handleSignUpChange}
                        placeholder="Phone"
                    />
                    <input
                        type="password"
                        name="password"
                        value={signUpData.password}
                        onChange={handleSignUpChange}
                        placeholder="Password"
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
                    />
                    <input
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        placeholder="Password"
                    />
                    <button className="Form-Sumbit-BTN" type="submit">
                        Login
                    </button>
                </form>
            )}

        </div>
    )
}