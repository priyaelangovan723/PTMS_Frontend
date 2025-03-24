import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles
import "../../../styles/Schedule Request/RequestForm.css";
import { Link } from "react-router-dom";

const RequestForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        Title: "",
        Resource: "",
        Domain: "",
        Technical: "",
        Year: "",
        StartDate: "",
        EndDate: "",
        Description: "",
        TrainingStatus: "",
        TrainerID: "",
        Duration: 0,
        Assessments: "",
        ApexDetails: null,  // File should be stored as an object
        VenueDetails: "",
        SubmittedOn: new Date().toISOString().slice(0, 19).replace("T", " "),
        RequestStatus: "Pending",
        Remarks: "",
        View: "",
        VendorName: "",
        AdminMail: ""
    });


    const [errors, setErrors] = useState({});
    const [existingTrainings, setExistingTrainings] = useState([]);
    useEffect(() => {
        const fetchExistingTrainings = async () => {
            try {
                const response = await fetch("https://ptms-backend.onrender.com/api/trainings/");
                if (!response.ok) throw new Error("Failed to fetch existing schedules");
                const data = await response.json();
                setExistingTrainings(data);
            } catch (error) {
                console.error("Error fetching training schedules:", error);
            }
        };
        fetchExistingTrainings();
    }, []);

    const isScheduleConflict = (newStartDate, newEndDate, newYear) => {
        const newStart = new Date(newStartDate);
        const newEnd = new Date(newEndDate);
        return existingTrainings.some(training => {
            if (training.Year === newYear) {
                const existingStart = new Date(training.StartDate);
                const existingEnd = new Date(training.EndDate);
                return (newStart <= existingEnd && newEnd >= existingStart);
            }
            return false;
        });
    };


    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setFormData((prevState) => {
            let updatedData = {
                ...prevState,
                [name]: files ? files[0] : value // ✅ Handle both file and text inputs correctly
            };

            // ✅ Calculate Duration if both dates exist
            if (updatedData["StartDate"] && updatedData["EndDate"]) {
                const startDate = new Date(updatedData["StartDate"]);
                const endDate = new Date(updatedData["EndDate"]);

                updatedData.Duration = startDate <= endDate
                    ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
                    : 0;
            }

            return updatedData;
        });

        // ✅ Reset error for the field
        setErrors((prevState) => ({ ...prevState, [name]: "" }));
    };




    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submit Button clicked");
        const newErrors = {};

        Object.keys(formData).forEach((key) => {
            if (
                !formData[key] &&
                key !== "Remarks" && key !== "View" &&
                key !== "TrainingStatus" && key !== "RequestStatus" &&
                key !== "AdminMail" && key != "Technical"
            ) {
                // ✅ Only require ApexDetails & VendorName if Resource is "Outside BIT"
                if (key === "ApexDetails" || key === "VendorName") {
                    if (formData.Resource === "Outside BIT") {
                        newErrors[key] = `${key} is required.`;
                    }
                } else {
                    newErrors[key] = `${key} is required.`;
                }
            }
        });

        console.log("Validation errors:", newErrors);
        if (Object.keys(newErrors).length > 0) {
            setErrors({ ...newErrors });
            console.log("Errors set:", newErrors);
            return;
        }
        if (isScheduleConflict(formData.StartDate, formData.EndDate, formData.Year)) {
            toast.error("Schedule conflict detected! Choose different dates.", { position: "top-right" });
            return;
        }
        console.log(formData)
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            const response = await fetch("https://ptms-backend.onrender.com/api/trainings", {
                method: "POST",
                body: formDataToSend, // Automatically sets Content-Type to multipart/form-data
            });

            if (response.ok) {
                await new Promise((resolve) => {
                    toast.success("Schedule created successfully!", {
                        position: "top-right",
                        autoClose: 3000,
                        onClose: resolve  // Ensures navigation only happens after toast closes
                    });
                    if (formData.ApexDetails) {
                        toast.success("File uploaded successfully!", {
                            position: "top-right",
                            autoClose: 3000,
                            onClose: resolve
                        });
                    }
                });

                navigate("/dashboard/track-request");
            } else {
                toast.error("Failed to submit training request", { position: "top-right" });
                console.error("Failed to submit training request");
            }
        } catch (error) {
            toast.error("Error submitting the form!", { position: "top-right" });
            console.error("Error in Submitting the form:", error);
        }

    };




    return (
        <div className="color-container">
            <ToastContainer />
            <div className="form-container">
                <h1>Schedule Request Form</h1>
                <form onSubmit={handleSubmit}>
                    <table className="form-table">
                        <tbody>
                            <tr>
                                <td className="label-cell">Title</td>
                                <td>
                                    <input
                                        type="text"
                                        name="Title"
                                        value={formData.Title}
                                        onChange={handleChange}
                                        className="form-select"
                                    />
                                    {errors.Title && <div className="error">{errors.Title}</div>}
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">Resource</td>
                                <td>
                                    <select
                                        name="Resource"
                                        value={formData["Resource"]}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="">Select</option>
                                        <option value="Inside BIT">Inside BIT</option>
                                        <option value="Outside BIT">Outside BIT </option>
                                    </select>
                                    {errors.Resource && (
                                        <div className="error">{errors.Resource}</div>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">Domain</td>
                                <td>
                                    <select
                                        name="Domain"
                                        value={formData["Domain"]}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="">Select</option>
                                        <option value="Aptitude">Aptitude</option>
                                        <option value="Verbal">Verbal</option>
                                        <option value="Technical">Technical</option>
                                        <option value="Mock Interview">Mock Interview</option>
                                    </select>
                                    {errors.Domain && (
                                        <div className="error">{errors.Domain}</div>
                                    )}
                                </td>
                            </tr>
                            {formData.Domain === "Technical" && (

                                <tr>
                                    <td className="label-cell">Technical Content</td>
                                    <td>
                                        <select
                                            name="Technical"
                                            value={formData["Technical"]}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            <option value="">Select</option>
                                            <option value="OOPS">OOPS</option>
                                            <option value="C">C Programming</option>
                                            <option value="C++">C++</option>
                                            <option value="JAVA">JAVA</option>
                                            <option value="Python">Python</option>
                                            <option value="DBMS">DBMS</option>
                                            <option value="DSA">DSA</option>
                                            <option value="Debugging">Debugging</option>
                                        </select>
                                        {errors.Technical && (
                                            <div className="error">{errors.Technical}</div>
                                        )}
                                    </td>
                                </tr>

                            )}
                            <tr>
                                <td className="label-cell">Year</td>
                                <td>
                                    <select
                                        name="Year"
                                        value={formData["Year"]}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="">Select</option>
                                        <option value="I Year">I Year</option>
                                        <option value="II Year">II Year</option>
                                        <option value="III Year">III Year</option>
                                        <option value="IV Year">IV Year</option>
                                    </select>
                                    {errors.Year && (
                                        <div className="error">{errors.Year}</div>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">Start Date</td>
                                <td>
                                    <input
                                        type="date"
                                        name="StartDate"
                                        value={formData["StartDate"]}
                                        onChange={handleChange}
                                        className="form-date"
                                    />
                                    {errors["StartDate"] && (
                                        <div className="error">{errors["StartDate"]}</div>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">End Date</td>
                                <td>
                                    <input
                                        type="date"
                                        name="EndDate"
                                        value={formData["EndDate"]}
                                        onChange={handleChange}
                                        className="form-date"
                                    />
                                    {errors["EndDate"] && (
                                        <div className="error">{errors["EndDate"]}</div>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">Description</td>
                                <td>
                                    <textarea
                                        name="Description"
                                        value={formData.Description}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                    {errors.Description && (
                                        <div className="error">{errors.Description}</div>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">Request To</td>
                                <td>
                                    <textarea
                                        name="AdminMail"
                                        value={formData.AdminMail}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                    {errors.Description && (
                                        <div className="error">{errors.AdminMail}</div>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">Assessments</td>
                                <td>
                                    <select
                                        name="Assessments"
                                        value={formData["Assessments"]}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="">Select</option>
                                        <option value="Inside BIT">Internal</option>
                                        <option value="Outside BIT">External </option>
                                    </select>
                                    {errors.Assessments && (
                                        <div className="error">{errors.Assessments}</div>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">Trainer ID</td>
                                <td>
                                    <input
                                        type="text"
                                        name="TrainerID"
                                        value={formData["TrainerID"]}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                    {errors["TrainerID"] && (
                                        <div className="error">{errors["TrainerID"]}</div>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">Duration(in days)</td>
                                <td>
                                    <input
                                        type="number"
                                        name="Duration"
                                        value={formData.Duration}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                    {errors.Duration && (
                                        <div className="error">{errors.Duration}</div>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">Venue Details</td>
                                <td>
                                    <input
                                        type="text"
                                        name="VenueDetails"
                                        value={formData["VenueDetails"]}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                    {errors["VenueDetails"] && (
                                        <div className="error">{errors["VenueDetails"]}</div>
                                    )}
                                </td>
                            </tr>
                            {formData.Resource === "Outside BIT" && (

                                <tr>
                                    <td className="label-cell">Vendor Name</td>
                                    <td>
                                        <input
                                            type="text"
                                            name="VendorName"
                                            value={formData["VendorName"]}
                                            onChange={handleChange}
                                            className="form-input"

                                        />
                                        {errors["VendorName"] && (
                                            <div className="error">{errors["VendorName"]}</div>
                                        )}
                                    </td>
                                </tr>

                            )}
                            {formData.Resource === "Outside BIT" && (

                                <tr>
                                    <td className="label-cell">Apex Details</td>
                                    <td>
                                        <input
                                            type="file"
                                            name="ApexDetails"
                                            accept="application/pdf"
                                            onChange={handleChange}


                                        />
                                        {errors["ApexDetails"] && (
                                            <div className="error">{errors["ApexDetails"]}</div>
                                        )}
                                    </td>
                                </tr>

                            )}


                        </tbody>
                    </table>
                    <div>

                        <button type="submit" className="form-btn"  >
                            Submit Request
                        </button>

                    </div>
                    <div>
                        <Link to='/dashboard/CustomTraining'>
                            <button type="submit" className="form-btn2"  >
                                Custom Training
                            </button>
                        </Link>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestForm;
