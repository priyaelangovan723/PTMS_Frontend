import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import '../../../styles/Faculty Dashboard/Dashboard.css';
import '../../../styles/Schedule Request/RequestForm.css';
import { Link } from "react-router-dom";
import '../../../styles/View Full Submitted Request/UserViewRequests.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const AdminViewReq = () => {
    const location = useLocation();
    const { id } = location.state || {}; // Retrieve the ID passed via navigate
    const [requestDetails, setRequestDetails] = useState(null);
    const [trainingStatus, setTrainingStatus] = useState("");
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [updatedVenue, setUpdatedVenue] = useState("");
    const [emails, setEmails] = useState(["ragul.se21@bitsathy.ac.in","santhosh.se21@bitsathy.ac.in"]);
    const adminEmail = JSON.parse(localStorage.getItem("userData"))?.email;
    console.log(adminEmail)
    const handleEditClick = () => {
        setDropdownVisible(!isDropdownVisible);
        // Toggle dropdown visibility
    };

    const handleVenueChange = (venue) => {
        setSelectedVenue(venue);  // Set the selected venue

    };

  

    useEffect(() => {
        if (id) {
            fetchRequestDetails(id);
        }
    }, [id]);

    useEffect(() => {
        if (requestDetails && requestDetails["Venue Details"]) {
            setSelectedVenue(requestDetails["Venue Details"]); // Initialize selectedVenue once requestDetails is fetched
        }
    }, [requestDetails]);

    


    const fetchRequestDetails = async (id) => {
        try {
            const response = await axios.get(`https://ptms-backend.onrender.com/admins/${adminEmail}`);
            setRequestDetails(response.data);
            setSelectedVenue(response.data["Venue Details"]);

            // Ensure requestDetails is available before fetching responses
            if (response.data.length > 0) {
                fetchEmails(response.data[0].ID);
            }
        } catch (error) {
            console.error("Error fetching request details:", error);
        }
    };

    const fetchEmails = async (id) => {
        try {
            const response = await fetch(`https://ptms-backend.onrender.com/responses/fetch-responses/${id}`);
            const data = await response.json();
            if (data.data) {
                setEmails(data.data);
                console.log("Emails:", data.data);
            }
        } catch (error) {
            console.error("Error fetching emails:", error);
        }
    };

    const handleSubmit = async () => {
        try {
            const trainingId = requestDetails[0].ID;
            console.log(trainingId);
            console.log(selectedVenue);
            if (!trainingId || !selectedVenue) {
                toast.error("Invalid training ID or venue", { autoClose: 3000 });
                return;
            }
    
            const response = await axios.post(`https://ptms-backend.onrender.com/emails/venue-update-emails/${trainingId}`, {
                venueDetails: selectedVenue,
                emails: emails,
            });
            console.log(emails);
            console.log(response.data);
            toast.success("Venue updated & emails sent!", {
                autoClose: 4000, // Stay for 4 seconds
                onClose: () => setSelectedVenue(updatedVenue), // Update state after toast closes
            });
        } catch (error) {
            console.error("Error updating venue:", error);
            toast.error("Failed to update venue", { autoClose: 3000 });
        }
    };

    if (!requestDetails) {
        return <div>Loading request details...</div>;
    }

    return (
        <>
            <div className="content-container1">
                <ToastContainer/>
                <h1>View Full Requests</h1>
                <div className="card-container1">
                    <div className="card1">
                        <h2>{requestDetails[0].Title}</h2>
                        <p><strong>ID:</strong> {requestDetails[0].ID}</p>
                        <p><strong>Resource:</strong> {requestDetails[0].Resource}</p>
                        <p><strong>Start Date:</strong> {requestDetails[0]["StartDate"]}</p>
                        <p><strong>End Date:</strong> {requestDetails[0]["EndDate"]}</p>
                        <p><strong>Description:</strong> {requestDetails[0].Description}</p>
                        <p><strong>Trainer ID:</strong> {requestDetails[0]["TrainerID"]}</p>
                        <p><strong>Duration:</strong> {requestDetails[0].Duration}</p>
                        <div className="venue-container">
                            <p><strong>Venue Details:</strong> {updatedVenue ? updatedVenue : requestDetails[0]["VenueDetails"]}

                                <span className="edit-icon" onClick={handleEditClick}><FontAwesomeIcon icon={faPencil} /></span>
                            </p>
                        </div>

                        {/* Dropdown menu for venue change */}
                        {isDropdownVisible && (
                            <div className="dropdown-container">
                                <select className="form-select"
                                    value={selectedVenue}
                                    onChange={(e) => handleVenueChange(e.target.value)}
                                >
                                    <option value="SF Seminar Hall-1">SF Seminar Hall-1</option>
                                    <option value="SF Seminar Hall-2">SF Seminar Hall-2</option>
                                    <option value="Seminar Hall-3">Seminar Hall-3</option>
                                    <option value="ECE Seminar Hall">ECE Seminar Hall</option>
                                    <option value="BIT Auditorium">BIT Auditorium</option>
                                </select>
                                <button type="button" className="form-btn" onClick={handleSubmit}>Change Details</button>
                            </div>
                        )}
                        <p><strong>Request Status:</strong> {requestDetails[0]["RequestStatus"]}</p>
                        {requestDetails[0].Remarks && (
                            <p><strong>Remarks:</strong> {requestDetails[0].Remarks}</p>
                        )}


                        <p><a href="#">{requestDetails.View}</a></p>
                    </div>
                </div>


                <div>
                    <Link to="/admin/view-requests">
                        <button className="form-btn" >Back</button>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default AdminViewReq;
