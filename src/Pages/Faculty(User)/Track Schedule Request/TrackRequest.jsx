import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import "../../../styles/Faculty Dashboard/Dashboard.css";
import '../../../styles/Track Schedule Request/TrackRequest.css'
import { LinearProgress } from "@mui/material";


const TrackRequest = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [items, setItems] = useState([])
    const [searchValue, setSearchValue] = useState('');

    const [loading, setLoading] = useState(true);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentRequests = requests.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(items.length / itemsPerPage);
    useEffect(() => {
        fetch("https://ptms-backend.onrender.com/api/trainings/")
            .then((response) => response.json())
            .then((data) => {
                setRequests(data);
                setItems(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    const searchfn = (e) => {
        const getSearch = e.target.value.toLowerCase();
        setSearchValue(getSearch);

        if (getSearch.length > 0) {
            const filteredItems = requests.filter((request) =>
                request.Title.toLowerCase().startsWith(getSearch) ||
                request.ID.toString().startsWith(getSearch) // Ensure ID is treated as a string
            );
            setRequests(filteredItems);
        } else {
            setRequests(items);
        }
    };



    const handleView = (id) => {
        console.log(id, "button clicked")
        navigate('/dashboard/view-full-req/', { state: { "id": id } })
    }

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };
    return (
        <>
            <div className="content-container">
           
                <h1>Track Your Submitted Request</h1>
                <div className="search-bar">
                    <FontAwesomeIcon icon={faSearch} />

                    <input placeholder="Search here by Title or ID" onChange={searchfn} value={searchValue}></input>
                </div>
                <div className="table1-container">
                {loading && <LinearProgress />}
                    <div className="table-wrapper">
                        <table>
                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Resource</th>
                                    <th>Domain</th>
                                    <th>Year</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Custom Training</th>
                                    <th>Description</th>

                                    <th>Trainer ID</th>
                                    <th>Duration(in days)</th>
                                    <th>Apex Details</th>
                                    <th>Request To</th>
                                    <th>Venue Details</th>
                                    <th>Students List</th>
                                    <th>Submitted On</th>
                                    <th>Request Status</th>
                                    <th>Remarks</th>
                                    <th>Training Status</th>
                                    <th>Edit</th>
                                    {/* <th>View</th> */}
                                </tr>
                            </thead>
                            {currentRequests.map((request) => (
                                <>

                                    <tbody>
                                        <tr>
                                            <td>{request.ID}</td>
                                            <td>{request.Title}</td>
                                            <td>{request.Resource}</td>
                                            <td>{request.Domain}</td>
                                            <td>{request.Year}</td>
                                            <td>{request["StartDate"]}</td>
                                            <td>{request["EndDate"]}</td>
                                            <td>{request["StudentsList"] ? <td>Yes</td> : <td>No</td>}</td>
                                            <td>{request.Description}</td>
                                            <td>{request["TrainerID"]}</td>
                                            <td>{request.Duration}</td>
                                            <td>{request["filename"]}</td>
                                            <td>{request["AdminMail"]}</td>
                                            <td>{request["VenueDetails"]}</td>
                                            {request["StudentsList"] ? (
                                                <>
                                                    <td>{request["StudentsListFilename"]}</td>
                                                </>
                                            )
                                                :
                                                <td>{ }</td>
                                            }
                                            <td>{new Date(request["SubmittedOn"]).toLocaleString()}</td>


                                            {/* Show Request Status only when AdminMail is not null */}
                                            {request["AdminMail"] ? (
                                                <>
                                                    <div className={request["RequestStatus"] === "Approved" ? "approved" : request["RequestStatus"] === "Rejected" ? "rejected" : "pending"}>
                                                        <td><span id="status-text">{request["RequestStatus"]}</span></td>
                                                    </div>

                                                    {/* Show Remarks only if RequestStatus is Rejected */}
                                                    <td>{request["RequestStatus"] === "Rejected" ? request.Remarks : ""}</td>
                                                </>
                                            ) : (
                                                <>
                                                    <td></td> {/* Empty placeholders to maintain table structure */}
                                                    <td></td>
                                                </>
                                            )}



                                            {/* Training Status Column */}
                                            <td>{request["TrainingStatus"]}</td>

                                            {/* Edit Button only if AdminMail exists */}
                                            <td>
                                                {!(request["AdminMail"] && request["RequestStatus"] === "Pending" || request["RequestStatus"] === "Rejected") && (
                                                    <button className="view-icon" onClick={() => handleView(request.ID)}>
                                                        <FontAwesomeIcon icon={faPenToSquare} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>



                                </>
                            ))}
                        </table>
                    </div>
                    <div className="pagination">
                        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className={currentPage === 1 ? "disabled" : "prev"}>Previous</button>

                        <span className="total-pages">{`Page ${currentPage} of ${totalPages}`}</span>
                        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className={currentPage === totalPages ? "disabled" : "next"}>Next</button>
                    </div>
                </div>

            </div>
        </>

    )
}
export default TrackRequest