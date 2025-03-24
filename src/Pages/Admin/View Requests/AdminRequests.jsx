import React, { useEffect, useState } from "react";
import '../../../styles/Admin/View Requests/AdminRequests.css'
import '../../../styles/Faculty Dashboard/Dashboard.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEye } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import '../../../styles/Track Schedule Request/TrackRequest.css'
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

const AdminRequests = () => {
    const navigate = useNavigate()
    const [requests, setRequests] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [items, setItems] = useState([])
    const [searchValue, setSearchValue] = useState('');
    const [remarksValue, setRemarksValue] = useState({});
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const itemsPerPage = 10;
    // Get logged-in admin email from session storage or state
    const adminEmail = JSON.parse(localStorage.getItem("userData"))?.email;
    console.log(adminEmail)

    // Fetch training requests for the logged-in admin
    useEffect(() => {
        if (adminEmail) {
            axios.get(`https://ptms-backend.onrender.com/admins/${adminEmail}`)
                .then(response => {
                    setRequests(response.data);
                })
                .catch(error => {
                    console.error("Error fetching training requests:", error);
                });
        }
    }, [adminEmail]);
    console.log(requests);
    const handleApprove = async (id) => {
        try {
            await toast.promise(
                axios.put(`https://ptms-backend.onrender.com/api/trainings/${id}/request-status`, {
                    status: "Approved",
                    remarks: ""
                }),
                {
                    pending: "Updating request...",
                    success: "Request approved successfully! 🎉",
                    error: "Failed to approve request ❌"
                }
            );

            const updatedRequests = requests.map(request =>
                request['ID'] === id ? { ...request, "RequestStatus": "Approved" } : request
            );
            setRequests(updatedRequests);
        } catch (error) {
            console.error("Error approving request:", error);
        }
    };


    const handleRejectClick = (id) => {
        setSelectedRequestId(id); // Show remarks input for this request
    };


    const handleRemarksChange = (id, value) => {
        console.log(id, value)
        setRemarksValue({ ...remarksValue, [id]: value });
        console.log(remarksValue[id])
    };

    const handleRejectWithRemarks = async (id) => {
        try {
            const updatedRemark = remarksValue[id] || ""; // Ensure a default value

            await toast.promise(
                axios.put(`https://ptms-backend.onrender.com/api/trainings/${id}/request-status`, {
                    status: "Rejected",
                    remarks: updatedRemark
                }),
                {
                    pending: "Updating request...",
                    success: "Request rejected successfully! ❌",
                    error: "Failed to reject request ❌"
                }
            );

            const updatedRequests = requests.map(request =>
                request['ID'] === id ? { ...request, "RequestStatus": "Rejected", "Remarks": updatedRemark } : request
            );

            setRequests(updatedRequests);
            setRemarksValue(prev => ({ ...prev, [id]: "" })); // Reset only the specific remark
        } catch (error) {
            console.error("Error rejecting request:", error);
        }
    };


    const searchfn = (e) => {
        const getSearch = e.target.value;
        setSearchValue(getSearch)

        if (getSearch.length > 0) {
            const filteredItems = items.filter((request) =>
                String(request['ID']).includes(getSearch)
            );
            setRequests(filteredItems)
        }
        else {
            setRequests(items)
        }
    }
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentRequests = requests.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(items.length / itemsPerPage);



    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };
    const handleView = (id) => {
        console.log(id, "button clicked")
        navigate('/admin/view-full-request', { state: { "id": id } })
    }
    return (
        <>
            <div className="content-container">
                <h1>Submitted Requests</h1>
                <ToastContainer />
                <div className="search-bar">
                    <FontAwesomeIcon icon={faSearch} />

                    <input placeholder="Search here" onChange={searchfn} value={searchValue}></input>
                </div>
                <div className="table1-container">
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Resource</th>
                                    <th>Domain</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Description</th>
                                    <th>Trainer ID</th>
                                    <th>Duration (in days)</th>
                                    <th>Apex Details</th>
                                    <th>Vendor Name</th>
                                    <th>Venue Details</th>
                                    <th>Submitted On</th>
                                    <th>Request Status</th>
                                    <th>Remarks</th>
                                    <th>Training Status</th>
                                    <th>View</th>
                                </tr>
                            </thead>

                            {requests && currentRequests.map((request, index) => (
                                <>
                                    <tbody id="requests-table-body" key={index}>
                                        <tr>
                                            <td>{request['ID']}</td>
                                            <td>{request['Title']}</td>
                                            <td>{request["Resource"]}</td>
                                            <td>{request["Domain"]}</td>
                                            <td>{request["StartDate"]}</td>
                                            <td>{request["EndDate"]}</td>
                                            <td>{request["Description"]}</td>
                                            <td>{request["TrainerID"]}</td>
                                            <td>{request["Duration"]}</td>
                                            <td>{request["ApexDetails"]}</td>
                                            <td>{request["VendorName"]}</td>
                                            <td>{request["VenueDetails"]}</td>
                                            <td>{request["SubmittedOn"]}</td>


                                            <td>
                                                <div className="status-admin">
                                                    {request["RequestStatus"] === "Pending" ? (
                                                        <>
                                                            <button className="approve" onClick={() => handleApprove(request['ID'])}>Approve</button>
                                                            <button className="reject" onClick={() => handleRejectClick(request['ID'])}>Reject</button>
                                                        </>
                                                    ) : request["RequestStatus"] === "Approved" ? (
                                                        <span className="status-approved"><p>Approved</p></span>
                                                    ) : (
                                                        <span className="status-rejected"><p>Rejected</p></span>
                                                    )}
                                                </div>
                                            </td>

                                            <td>
                                                {selectedRequestId === request["ID"] ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter remarks"
                                                            value={remarksValue[request["ID"]] || ""}
                                                            onChange={(e) => setRemarksValue(prev => ({ ...prev, [request["ID"]]: e.target.value }))}
                                                        />
                                                        <button id="submit-btn" onClick={() => handleRejectWithRemarks(request['ID'])}>Submit</button>
                                                    </>
                                                ) : (
                                                    <div>{request["Remarks"]}</div>
                                                )}
                                            </td>
                                            <td>{request["TrainingStatus"]}</td>
                                            <td>
                                                <button className="view-icon" onClick={() => { handleView(request['ID']) }}><FontAwesomeIcon icon={faEye} /></button>
                                            </td>
                                        </tr>

                                    </tbody>
                                </>
                            ))}
                        </table>
                    </div>
                </div>

                <div className="pagination">
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className={currentPage === 1 ? "disabled" : "prev"}>Previous</button>

                    <span className="total-pages">{`Page ${currentPage} of ${totalPages}`}</span>
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className={currentPage === totalPages ? "disabled" : "next"}>Next</button>
                </div>




            </div>

        </>
    )
}
export default AdminRequests