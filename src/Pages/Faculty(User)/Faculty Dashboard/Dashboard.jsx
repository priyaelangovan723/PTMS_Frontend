import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import "../../../styles/Faculty Dashboard/Dashboard.css";


const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const [email, setEmail] = useState(localStorage.getItem('email') || '');
    const [name, setName] = useState(localStorage.getItem('name') || '');

    // Update context with email and name
    useEffect(() => {
        if (state) {
            const { email, name } = state;
            setEmail(email);
            setName(name);
            // Save to local storage
            localStorage.setItem('email', email);
            localStorage.setItem('name', name);
        }
    }, [state]);

    return (
        <>
            <div className="content-container">
                <div className="contents">
                    <div className="content-card">
                        <p id="short-text">Welcome back,</p>
                        <h4 className="name">{name}</h4>
                    </div>
                    <div className="content-card">
                        <p id="short-text">Your emailId</p>
                        <h4 className="name">{email}</h4>
                    </div>
                </div>


                <div className="add-request" onClick={() => { navigate("/dashboard/add-request", { state: { name: name } }) }}>
                    <FontAwesomeIcon icon={faPlus} className="plus-icon" />
                    <p id="request">
                        Create a request</p>
                </div>
                <div className="add-request2"
                    onClick={() => {
                        navigate("/dashboard/request-past-data", {
                            state:
                                { name: name }
                        })
                    }}>
                    <p id="request2">
                        Request Past Data</p>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
