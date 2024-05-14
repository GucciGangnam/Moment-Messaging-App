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
    const [formState, setFormState] = useState("signup")


    return (
        <div className="Loginsignup">
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
                <form>
                    <input placeholder="First Name" />
                    <input placeholder="Last Name" />
                    <input placeholder="Email" />
                    <input placeholder="Phone" />
                    <input placeholder="Password" />
                    <button className="Form-Sumbit-BTN" type="submit">
                        Sign Up
                    </button>
                </form>
            )}

            {formState === "login" && (
                <form>
                    <input placeholder="Email" />
                    <input placeholder="Password" />
                    <button className="Form-Sumbit-BTN" type="submit">
                        Login
                    </button>
                </form>
            )}
        </div>
    )
}