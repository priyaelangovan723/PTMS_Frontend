import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faChartSimple, faChalkboardUser, faEye } from "@fortawesome/free-solid-svg-icons";

import '../../styles/Sidebar/Sidebar.css'

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const handleResize = () => {
            const mobileView = window.innerWidth <= 1469;
            setIsMobile(mobileView);
            setIsOpen(!mobileView); // Always open if it's a desktop or large tablet
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => {
        if (isMobile) {
            setIsOpen(!isOpen);
        }
    };

    const handleItemClick = (itemName) => {
        setSelectedItem(itemName);
        if (isMobile) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {isMobile && (
                <button className="toggle-btn" onClick={toggleSidebar}>
                    <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
                </button>
            )}

            <div className={`side-container ${isMobile && !isOpen ? "closed" : "open"}`}>
                <p id="dash"><b>Dashboard</b></p>
                <Link to="/admin/dashboard">
                    <div className={`dashboard ${selectedItem === 'dashboard' ? 'selected' : ''}`} onClick={() => handleItemClick('dashboard')}>
                        <div className="dashboard-heading" >
                            <p><b>Dashboard</b></p>
                        </div>
                        <div className="logo2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="dashboard"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M4 13h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zm0 8h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm10 0h6c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zM13 4v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1z"></path></svg>
                        </div>
                    </div>
                </Link>

                <p id="dash"><b>Actions</b></p>
                <Link to="/admin/view-requests">
                    <div className={`dashboard ${selectedItem === 'your request' ? 'selected' : ''}`} onClick={() => handleItemClick('your request')}>
                        <div className="dashboard-heading">
                            <p><b>Request</b></p>
                        </div>
                        <div className="logo2">
                            <FontAwesomeIcon icon={faEye} />
                        </div>
                    </div>
                </Link>
                <br></br>

                <Link to="/admin/Ongoing">
                    <div className={`dashboard ${selectedItem === 'ongoing' ? 'selected' : ''}`} onClick={() => handleItemClick('ongoing')}>
                        <div className="dashboard-heading"><p><b>Ongoing</b></p></div>
                        <FontAwesomeIcon className="logo2" icon={faChalkboardUser} />
                    </div>
                </Link>
                <br></br>
                <Link to="/admin/analytics">
                    <div className={`dashboard ${selectedItem === 'analytics' ? 'selected' : ''}`} onClick={() => handleItemClick('analytics')}>
                        <div className="dashboard-heading">

                            <p><b>Analytics</b></p>

                        </div>
                        <div className="logo2">
                            <FontAwesomeIcon icon={faChartSimple} />
                        </div>
                    </div>
                </Link>
            </div>
        </>
    );
};

export default Sidebar;
