
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";


import "../../../styles/Schedule Request/RequestForm.css";
import { Link } from "react-router-dom";


const Pastdata = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        From: "",
        To: "",
        reason: "",
        facultySearch: "",
        facultyName: "",
    });

    const [errors, setErrors] = useState({});
    const [facultyMembers, setFacultyMembers] = useState([]);
    useEffect(() => {
        // Fetch or set faculty data here
        setFacultyMembers([
            {id: 101, name:"Mr. Ranjith", mailid: "ranjith.bitsathy.ac.in"},
            {id: 102, name:"Ms. Madhumitha", mailid: "madhumitha.bitsathy.ac.in"},
            {id: 103, name:"Mr. abc", mailid: "abc.bitsathy.ac.in"},
            {id: 104, name:"Ms. xyz", mailid: "xyz.bitsathy.ac.in"},
            {id: 105, name:"Ms. kjl", mailid: "kjl.bitsathy.ac.in"},
            {id: 106, name:"Ms. rst", mailid: "rst.bitsathy.ac.in"},
            {id: 107, name:"Ms. uuu", mailid: "uuu.bitsathy.ac.in"},
            {id: 108, name:"Ms. aaa", mailid: "aaa.bitsathy.ac.in"},
            {id: 109, name:"Ms. zzz", mailid: "zzz.bitsathy.ac.in"},
        ]);
    }, []);
    const [filteredFaculty, setFilteredFaculty] = useState(facultyMembers);
    const [dropdownVisible, setDropdownVisible] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
        setErrors((prevState) => ({ ...prevState, [name]: "" }));
    };

    
   
    const handleFacultySearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setFormData({ ...formData, facultySearch: searchValue });
    
        // Filter faculty list based on ID or Name
        const matchedFaculty = facultyMembers.filter(
            (faculty) =>
                faculty.name.toLowerCase().includes(searchValue) ||
                faculty.id.toString().includes(searchValue)
        );
    
        setFilteredFaculty(matchedFaculty);
        setDropdownVisible(true);
    };
    

    const handleFacultySelect = (faculty) => {
        setFormData({
            ...formData,
            facultyName: faculty.id,
            facultySearch: `${faculty.name} (${faculty.id})`
        });
        setDropdownVisible(false); // Hide dropdown after selection
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            if (!formData[key]) {
                newErrors[key] = `${key} is required.`;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        console.log("Form Data Submitted:", formData);
    };

    return (
        <div className="color-container">
            <div className="form-container">
                <h1>Request Past Training Data</h1>
                <form onSubmit={handleSubmit}>
                    <table className="form-table">
                        <tbody>
                            <tr>
                                <td className="label-cell">From</td>
                                <td>
                                    <input
                                        type="date"
                                        name="From"
                                        value={formData.From}
                                        onChange={handleChange}
                                        className="form-date"
                                    />
                                    {errors.From && <div className="error">{errors.From}</div>}
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">To</td>
                                <td>
                                    <input
                                        type="date"
                                        name="To"
                                        value={formData.To}
                                        onChange={handleChange}
                                        className="form-date"
                                    />
                                    {errors.To && <div className="error">{errors.To}</div>}
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">Reason</td>
                                <td>
                                    <input
                                    typr="text"
                                        name="reason"
                                        value={formData.reason}
                                        onChange={handleChange}
                                        className="form-input"
                                         placeholder="Reason or Description for requesting past data"
                                    />
                                    {errors.reason && <div className="error">{errors.reason}</div>}
                                </td>
                            </tr>
                         
                            <tr>
    <td className="label-cell">Requested By</td>
    <td>
        <div className="autocomplete-container">
            <input
                type="text"
                name="facultySearch"
                value={formData.facultySearch}
                onChange={handleFacultySearch}
                onFocus={() => setDropdownVisible(true)} // Show dropdown on focus
                className="form-input"
                placeholder="Enter Faculty ID or Name"
            />
            {dropdownVisible && filteredFaculty.length > 0 && (
                <ul className="dropdown-list">
                    {filteredFaculty.map((faculty) => (
                        <li 
                            key={faculty.id} 
                            onClick={() => handleFacultySelect(faculty)}
                            className="dropdown-item"
                        >
                            {faculty.name} ({faculty.id}) @{faculty.mailid}
                        </li>
                    ))}
                </ul>
            )}
        </div>
        {errors.facultyName && <div className="error">{errors.facultyName}</div>}
    </td>
</tr>


                        </tbody>
                    </table>
                    <Link to ='/dashboard/'>
                    <div>
                        <button type="submit" className="form-btn">
                            Request Data
                        </button>
                    </div>
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default Pastdata;