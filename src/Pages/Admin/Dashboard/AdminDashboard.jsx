import React from "react";
import { useState,useEffect } from "react";
import {useLocation} from 'react-router-dom';
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import '../../../styles/Faculty Dashboard/Dashboard.css'
const AdminDashboard = () =>
{
    const location = useLocation();
    const { state } = location;
    const [email, setEmail] = useState(localStorage.getItem('email') || '');
    const [name, setName] = useState(localStorage.getItem('name') || '');

    
    useEffect(() => {
        if (state) {
            const { email, name } = state;
            setEmail(email);
            setName(name);
            
            localStorage.setItem('email', email);
            localStorage.setItem('name', name);
        }
    }, [state]);
    
    return(
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
                <div className="add-request">
                    <FontAwesomeIcon icon={faEye} className="plus-icon"/>
                    <p><Link to="/admin/view-requests" id="request">View Requests</Link></p>
                </div>
            </div></>
    )
}
export default AdminDashboard