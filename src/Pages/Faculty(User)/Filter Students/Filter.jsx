import { useState,useEffect } from "react";
import "../../../styles/Filter Students/Filter.css";
import * as XLSX from "xlsx";
import '../../../styles/Faculty Dashboard/Dashboard.css';
import '../../../styles/Track Schedule Request/TrackRequest.css'

const Filter = () => {
    
  

    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedCGPA, setSelectedCGPA] = useState("");
    const [selectedBatch, setSelectedBatch] = useState("");
    const [selectedRankFilter, setSelectedRankFilter] = useState("");
    const [selectedInterest, setSelectedInterest] = useState("");
    const [students, setStudents] = useState([]);
    useEffect(() => {
        fetch("https://ptms-backend.onrender.com/students/")
            .then(response => response.json())
            .then(data => {
                setStudents(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching student data:", error);
                setError("Failed to load students");
                setLoading(false);
            });
    }, []);

    const departments = ["CSE", "ISE", "ECE", "EEE", "MECH","AIDS","AIML","Agri","Food Tech","Bio Tech","ECE","EEE"];
    const cgpaRanges = ["Above 9.5", "9.0 - 9.5", "8.5 - 9.0", "Below 8.5"];
    const batches = ["2025 - Fourth Year", "2026 - Third Year", "2027 - Second Year"];
    const rankFilters = ["Top 5", "Top 10", "Top 20", "Any Rank"];
    const interests = ["Core", "NIP", "Placements"];

    const filterStudents = students.filter((student) => {
        const departmentMatch = selectedDepartment ? student.department === selectedDepartment : true;
        const cgpaMatch = selectedCGPA
            ? (selectedCGPA === "Above 9.5" && student.cgpa > 9.5) ||
              (selectedCGPA === "9.0 - 9.5" && student.cgpa >= 9.0 && student.cgpa <= 9.5) ||
              (selectedCGPA === "8.5 - 9.0" && student.cgpa >= 8.5 && student.cgpa < 9.0) ||
              (selectedCGPA === "Below 8.5" && student.cgpa < 8.5)
            : true;
        const batchMatch = selectedBatch ? student.batch === selectedBatch : true;
        const rankMatch = selectedRankFilter
            ? (selectedRankFilter === "Top 5" && student.fullstack_rank <= 5) ||
              (selectedRankFilter === "Top 10" && student.fullstack_rank <= 10) ||
              (selectedRankFilter === "Top 20" && student.fullstack_rank<= 20) ||
              (selectedRankFilter === "Any Rank")
            : true;
        const interestMatch = selectedInterest ? student.interest === selectedInterest : true;

        return departmentMatch && cgpaMatch && batchMatch && rankMatch && interestMatch;
    });

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filterStudents);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Students");
        XLSX.writeFile(workbook, "Filtered_Students_Report.xlsx");
    };

    const clearFilters = () => {
        setSelectedDepartment("");
        setSelectedCGPA("");
        setSelectedBatch("");
        setSelectedRankFilter("");
        setSelectedInterest("");
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(filterStudents.length / itemsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="filter-content-container">
            <div className="filter-app-container">
                {/* Navbar */}
                <nav className="filter-navbar">
                    <div className="filter-navbar-title">Training & Placement Filter</div>
                    <div className="filter-navbar-buttons">
                        <button onClick={downloadExcel} className="filter-download-excel">
                            Download Report (Excel)
                        </button>
                        <button onClick={clearFilters} className="filter-clear-filters">
                            Clear Filters
                        </button>
                    </div>
                </nav>

                {/* Filters Section */}
                <aside className="filter-filters-section">
                    <div className="filter-department-item">
                        <label className="filter-department-label">Department</label>
                        <select className="filter-department-select" onChange={(e) => setSelectedDepartment(e.target.value)} value={selectedDepartment}>
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept} value={dept}>
                                    {dept}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-cgpa-item">
                        <label className="filter-cgpa-label">CGPA</label>
                        <select className="filter-cgpa-select" onChange={(e) => setSelectedCGPA(e.target.value)} value={selectedCGPA}>
                            <option value="">Select CGPA Range</option>
                            {cgpaRanges.map((range) => (
                                <option key={range} value={range}>
                                    {range}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-batch-item">
                        <label className="filter-batch-label">Batch</label>
                        <select className="filter-batch-select" onChange={(e) => setSelectedBatch(e.target.value)} value={selectedBatch}>
                            <option value="">Select Batch</option>
                            {batches.map((batch) => (
                                <option key={batch} value={batch}>
                                    {batch}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-rank-item">
                        <label className="filter-rank-label">Fullstack Rank</label>
                        <select className="filter-rank-select" onChange={(e) => setSelectedRankFilter(e.target.value)} value={selectedRankFilter}>
                            <option value="">Select Rank Filter</option>
                            {rankFilters.map((rank) => (
                                <option key={rank} value={rank}>
                                    {rank}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-interest-item">
                        <label className="filter-interest-label">Student Interest</label>
                        <select className="filter-interest-select" onChange={(e) => setSelectedInterest(e.target.value)} value={selectedInterest}>
                            <option value="">Select Interest</option>
                            {interests.map((interest) => (
                                <option key={interest} value={interest}>
                                    {interest}
                                </option>
                            ))}
                        </select>
                    </div>
                </aside>

                {/* Filtered Students Table */}
                <div className="filter-table-container">
                    <table className="filter-students-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Department</th>
                                <th>CGPA</th>
                                <th>Rank</th>
                                <th>Fullstack Rank</th>
                                <th>Batch</th>
                                <th>Interest</th>
                                <th>Email ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterStudents.slice(indexOfFirstItem, indexOfLastItem).map((student) => (
                                <tr key={student.id}>
                                    <td>{student.name}</td>
                                    <td>{student.department}</td>
                                    <td>{student.cgpa}</td>
                                    <td>{student.student_rank}</td>
                                    <td>{student.fullstack_rank}</td>
                                    <td>{student.batch}</td>
                                    <td>{student.interest}</td>
                                    <td>{student.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className={currentPage === 1 ? "disabled" : "prev"}>Previous</button>

                        <span className="total-pages">{`Page ${currentPage} of ${totalPages}`}</span>
                        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className={currentPage === totalPages ? "disabled" : "next"}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filter;