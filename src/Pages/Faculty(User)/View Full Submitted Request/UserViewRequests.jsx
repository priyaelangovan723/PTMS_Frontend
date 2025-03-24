import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../../../styles/Faculty Dashboard/Dashboard.css';
import '../../../styles/Schedule Request/RequestForm.css';
import '../../../styles/View Full Submitted Request/UserViewRequests.css';
import * as XLSX from "xlsx";

const UserViewRequests = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = location.state || {};
    const [requestDetails, setRequestDetails] = useState(null);
    const [trainingStatus, setTrainingStatus] = useState("");
    const [studentFileUrl, setStudentFileUrl] = useState("");
    const [apexFileUrl, setApexFileUrl] = useState("");
    const [emails, setEmails] = useState([]);

    useEffect(() => {
        if (id) {
            fetchRequestDetails(id);
            fetchStudentFile(id);
            fetchApexFile(id);
        }
    }, [id]);

    const fetchRequestDetails = async (id) => {
        try {
            const response = await fetch(`https://ptms-backend.onrender.com/api/trainings/${id}`);
            if (!response.ok) throw new Error("Failed to fetch request details");
            const data = await response.json();
            setRequestDetails(data);
            setTrainingStatus(data.TrainingStatus || "");
        } catch (error) {
            console.error("Error fetching request details:", error);
        }
    };

    const fetchStudentFile = async (id) => {
        try {
            const response = await fetch(`https://ptms-backend.onrender.com/media/students/${id}`);
            if (!response.ok) throw new Error("Failed to fetch student file");
            const data = await response.json();
            setStudentFileUrl(data.downloadUrl);
        } catch (error) {
            console.error("Error fetching student file:", error);
        }
    };

    const fetchApexFile = async (id) => {
        try {
            const response = await fetch(`https://ptms-backend.onrender.com/media/${id}`);
            if (!response.ok) throw new Error("Failed to fetch Apex file");
            const data = await response.json();
            setApexFileUrl(data.downloadUrl);
        } catch (error) {
            console.error("Error fetching Apex file:", error);
        }
    };

    const handleStatusUpdate = async () => {
        if (!trainingStatus) {
            toast.warn("Please select a training status before saving.");
            return;
        }

        try {
            const response = await fetch(`https://ptms-backend.onrender.com/api/trainings/${id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: trainingStatus })
            });

            if (!response.ok) throw new Error("Failed to update training status");

            await new Promise((resolve) => {
                toast.success("Training Status updated successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    onClose: resolve  // Ensures navigation only happens after toast closes
                });

            });
            navigate("/dashboard/track-request") // Redirect after 2s
        } catch (error) {
            console.error("Error updating training status:", error);
            toast.error("Failed to update training status.");
        }
    };

    const handleRegistration = async () => {
        let emailsToSend = [];

        if (!requestDetails.StudentsListFilename) {
            // ✅ Manually set email based on Year
            const emailMap = {
                "I Year": "santhosh.se21@bitsathy.ac.in",
                "II Year": "ragul.se21@bitsathy.ac.in",
                "III Year": "dharani.cb21@bitsathy.ac.in",
                "IV Year": "priyadharshini.ad21@bitsathy.ac.in"
            };
            emailsToSend.push(emailMap[requestDetails.Year]);
        } else {
            try {
                // ✅ Ensure requestDetails.id exists
                if (!requestDetails.ID) throw new Error("Training ID is missing");
                const response = await fetch(`https://ptms-backend.onrender.com/media/students/${requestDetails.ID}`);
                if (!response.ok) throw new Error("Failed to fetch student file");

                const data = await response.json();
                console.log(data);

                // ✅ Enable Download Link
                setStudentFileUrl(data.downloadUrl);

                

                // ✅ Fetch & Parse Excel File to Extract Emails
                const emailList = await fetchEmailsFromExcel(data.downloadUrl);
                emailsToSend = emailList || [];
            } catch (error) {
                console.error("Error fetching student file:", error);
                return;
            }
        }

        if (!emailsToSend || emailsToSend.length === 0) {
            toast.error("No emails to send", { position: "top-right" });
            return;
        }

        // ✅ Call Backend to Send Emails
        try {
            const trainingDetails = { ...requestDetails };
            console.log("Training Details:", trainingDetails);

            const emailResponse = await fetch("https://ptms-backend.onrender.com/emails/send-registration-emails", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emails: emailsToSend, trainingDetails })
            });

            const emailResult = await emailResponse.json();
            if (emailResponse.ok) {
                await new Promise((resolve) => {
                    toast.success("Email sent successfully!", {
                        position: "top-right",
                        autoClose: 3000,
                        onClose: resolve  // Ensures navigation only happens after toast closes
                    });
                });
                navigate("/dashboard/track-request");
                console.log("Emails sent successfully:", emailResult);
            } else {
                toast.error("Failed to send Email", { position: "top-right" });
                console.error("Failed to send emails:", emailResult);
            }
        } catch (error) {
            console.error("Error sending emails:", error);
        }
    };
    const fetchEmailsFromExcel = async (fileUrl) => {
        try {
            // ✅ Fetch the Excel file as a Blob
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error("Failed to download Excel file");

            const blob = await response.blob();
            const reader = new FileReader();

            return new Promise((resolve, reject) => {
                reader.onload = (e) => {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: "array" });

                    // ✅ Assume first sheet contains emails
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];

                    // ✅ Convert sheet to JSON
                    const jsonData = XLSX.utils.sheet_to_json(sheet);
                    console.log("Excel Parsed Data:", jsonData);

                    // ✅ Extract Emails (assuming column name is 'Email')
                    const emailList = jsonData.map(row => row.email).filter(email => email);
                    resolve(emailList);
                };

                reader.onerror = (error) => reject(error);
                reader.readAsArrayBuffer(blob);
            });
        } catch (error) {
            console.error("Error reading Excel file:", error);
            return [];
        }
    };



    if (!requestDetails) {
        return <div>Loading request details...</div>;
    }

    return (
        <>
            <div className="content-container1">
                <ToastContainer />
                <h1>View Full Requests</h1>
                <div className="card-container1">
                    <div className="card1">
                        <h2>{requestDetails.Title}</h2>
                        <p><strong>ID:</strong> {requestDetails.ID}</p>
                        <p><strong>Resource:</strong> {requestDetails.Resource}</p>
                        <p><strong>Domain:</strong> {requestDetails.Domain}</p>
                        <p><strong>Year:</strong> {requestDetails.Year}</p>
                        <p><strong>Start Date:</strong> {requestDetails.StartDate}</p>
                        <p><strong>End Date:</strong> {requestDetails.EndDate}</p>
                        <p><strong>Description:</strong> {requestDetails.Description}</p>
                        <p><strong>Trainer ID:</strong> {requestDetails.TrainerID}</p>
                        <p><strong>Duration:</strong> {requestDetails.Duration}</p>
                        {requestDetails.Remarks && (
                            <p>
                                <strong>Requested To:</strong> {requestDetails.AdminMail}
                            </p>
                        )}
                        <p><strong>Submitted On:</strong>{new Date(requestDetails.SubmittedOn).toLocaleString()}</p>
                        <p><strong>Venue Details:</strong> {requestDetails.VenueDetails}</p>
                        <p><strong>Request Status:</strong> {requestDetails.RequestStatus}</p>
                        {requestDetails.Remarks && (
                            <p>
                                <strong>Remarks:</strong> {requestDetails.Remarks}
                            </p>
                        )}


                        {/* Student File Download */}
                        {studentFileUrl && (
                            <p>
                                <strong>Student File:</strong>{" "}
                                <a href={studentFileUrl} target="_blank" rel="noopener noreferrer">{requestDetails.StudentsListFilename}</a>
                            </p>
                        )}

                        {/* Apex File Download */}
                        {apexFileUrl && (
                            <p>
                                <strong>Apex File:</strong> {<a href={apexFileUrl} target="_blank" rel="noopener noreferrer">{requestDetails.filename}</a>}

                            </p>
                        )}
                    </div>
                </div>

                {/* Dropdown for Training Status */}
                <div className="dropdown-container">
                    <label htmlFor="trainingStatus">Training Status</label>
                    <select
                        className="form-select"
                        value={trainingStatus}
                        onChange={(e) => setTrainingStatus(e.target.value)}
                    >
                        <option value="">Select Status</option>
                        <option value="Not Yet Started">Not Yet Started</option>
                        <option value="Registration Completed">Registration Completed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <div>
                    <button className="form-btn" onClick={handleStatusUpdate}>Save</button>
                </div>
                <div>
                    <button className="form-btn" onClick={handleRegistration}>Send Registration Mail</button>
                </div>
            </div>
        </>
    );
};

export default UserViewRequests;
