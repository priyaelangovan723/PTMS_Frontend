import { useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";
import "../../../styles/Admin/Analytics/Analytics.css";
import * as XLSX from "xlsx";
import "../../../styles/Track Schedule Request/TrackRequest.css";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const Analytics = () => {
    const [filters, setFilters] = useState({
        period: "Weekly",
        department: "All Departments",
        status: "All",
        search: "",
        year: "All Years", 
    });

    const allTrainings = [
        // Aptitude & Verbal Trainings
        { name: "Aptitude", type: "Internal", department: "CSE", dates: "2025-01-15", trainerId: "T014", status: "Completed", rollNumber: "7376242CB118", score: 82 },
        { name: "Aptitude", type: "Internal", department: "IT", dates: "2025-01-16", trainerId: "T014", status: "Completed", rollNumber: "7376232CS139", score: 79 },
        { name: "Verbal Ability", type: "Internal", department: "AIML", dates: "2025-02-10", trainerId: "T015", status: "Completed", rollNumber: "7376222AD179", score: 88 },
        { name: "Verbal Ability", type: "Internal", department: "ISE", dates: "2025-02-15", trainerId: "T015", status: "Completed", rollNumber: "7376211SE144", score: 91 },
        
        // Programming Languages
        { name: "Java Programming", type: "External", department: "CSD", dates: "2025-03-12", trainerId: "T018", status: "Completed", rollNumber: "7376242CB119", score: 85 },
        { name: "Java Programming", type: "External", department: "CT", dates: "2025-03-14", trainerId: "T018", status: "Completed", rollNumber: "7376232CS140", score: 76 },
        { name: "Python for Interviews", type: "Internal", department: "CSE", dates: "2025-04-08", trainerId: "T019", status: "In Progress", rollNumber: "7376222AD180", score: 89 },
        { name: "Python for Interviews", type: "Internal", department: "AIDS", dates: "2025-04-10", trainerId: "T019", status: "In Progress", rollNumber: "7376211SE145", score: 87 },
    
        // Core CS Subjects
        { name: "Data Structures", type: "Internal", department: "CSE", dates: "2025-05-01", trainerId: "T020", status: "Completed", rollNumber: "7376242CB120", score: 80 },
        { name: "Advanced DSA", type: "External", department: "CSE", dates: "2025-06-22", trainerId: "T023", status: "Completed", rollNumber: "7376232CS141", score: 92 },
        { name: "DBMS Essentials", type: "Internal", department: "IT", dates: "2025-07-05", trainerId: "T022", status: "In Progress", rollNumber: "7376222AD180", score: 78 },
        { name: "Operating Systems", type: "Internal", department: "ISE", dates: "2025-07-25", trainerId: "T026", status: "Completed", rollNumber: "7376211SE146", score: 85 },
    
        // System Design & Coding
        { name: "System Design Basics", type: "External", department: "AIDS", dates: "2025-08-15", trainerId: "T021", status: "Completed", rollNumber: "7376242CB121", score: 85 },
        { name: "Competitive Programming", type: "External", department: "AIML", dates: "2025-09-10", trainerId: "T025", status: "Completed", rollNumber: "7376232CS142", score: 73 },
    
        // Web & Cloud Technologies
        { name: "Cloud & DevOps", type: "Internal", department: "CSD", dates: "2025-10-20", trainerId: "T028", status: "Completed", rollNumber: "7376222AD180", score: 89 },
        { name: "Full Stack MERN", type: "External", department: "CSBS", dates: "2025-11-18", trainerId: "T031", status: "Completed", rollNumber: "7376211SE147", score: 94 },
        { name: "Web Development", type: "Internal", department: "CSE", dates: "2025-12-07", trainerId: "T030", status: "In Progress", rollNumber: "7376242CB122", score: 86 },
    
        // Miscellaneous
        { name: "Cyber Security Basics", type: "External", department: "IT", dates: "2025-12-10", trainerId: "T029", status: "Completed", rollNumber: "7376232CS143", score: 90 },
        { name: "Networking Basics", type: "External", department: "EEE", dates: "2025-12-14", trainerId: "T027", status: "In Progress", rollNumber: "7376222AD180", score: 77 },
    ];
    
    

    const [currentPage, setCurrentPage] = useState(1);
    const trainingsPerPage = 5;

    // Extract year from roll number (1st, 2nd, 3rd, 4th)
    const getYearFromRollNumber = (rollNumber) => {
        const year = parseInt(rollNumber.substring(4, 6)); 
        switch (year) {
            case 24: return "1st Year";
            case 23: return "2nd Year";
            case 22: return "3rd Year";
            case 21: return "4th Year";
            default: return "Unknown";
        }
    };

    // Filter by period (Weekly, Monthly, Yearly)
    const filterByPeriod = (trainings, period) => {
        const now = new Date();
        let periodStart = new Date();

        if (period === "Weekly") {
            periodStart.setDate(now.getDate() - 7);
        } else if (period === "Monthly") {
            periodStart.setMonth(now.getMonth() - 1);
        } else if (period === "Yearly") {
            periodStart.setFullYear(now.getFullYear() - 1);
        }

        return trainings.filter((training) => {
            const trainingDate = new Date(training.dates);
            return trainingDate >= periodStart;
        });
    };

    // Filter by year (1st, 2nd, 3rd, 4th)
    const filterByYear = (trainings, year) => {
        if (year === "All Years") return trainings;

        const yearMapping = {
            "1st Year": 24,
            "2nd Year": 23,
            "3rd Year": 22,
            "4th Year": 21,
        };

        return trainings.filter((training) => {
            const rollYear = parseInt(training.rollNumber.substring(4, 6)); 
            return rollYear === yearMapping[year];
        });
    };

    // Search across all fields
    const searchTrainings = (trainings, search) => {
        if (!search) return trainings;

        return trainings.filter((training) => {
            return Object.values(training).some((value) =>
                String(value).toLowerCase().includes(search.toLowerCase())
            );
        });
    };

    const filteredTrainings = filterByYear(
        filterByPeriod(allTrainings, filters.period),
        filters.year
    ).filter((training) => {
        return (
            (filters.department === "All Departments" || training.department === filters.department) &&
            (filters.status === "All" || training.status === filters.status)
        );
    });

    const searchedTrainings = searchTrainings(filteredTrainings, filters.search);

    const indexOfLastTraining = currentPage * trainingsPerPage;
    const indexOfFirstTraining = indexOfLastTraining - trainingsPerPage;
    const currentTrainings = searchedTrainings.slice(indexOfFirstTraining, indexOfLastTraining);
    const totalPages = Math.ceil(searchedTrainings.length / trainingsPerPage);

    // Calculate metrics based on filtered and searched trainings
    const totalConducted = searchedTrainings.length;
    const inProgress = searchedTrainings.filter(t => t.status === "In Progress").length;
    const completed = searchedTrainings.filter(t => t.status === "Completed").length;
    const isStudentSearch = filters.search ;

    // Data for the bar chart (Department-wise)
    const barChartData = {
        labels: isStudentSearch 
            ? searchedTrainings.map(t => t.name)  // Training names if searching a student
            : ["EEE", "CSE", "IT", "ISE", "CSBS", "CT", "AIDS", "AIML", "CSD"], // Default department-wise
        datasets: [
            {
                label: isStudentSearch ? "Training-wise Score" : "Trainings by Department",
                data: isStudentSearch 
                    ? searchedTrainings.map(t => t.score) // Show scores if searching a student
                    : [
                        searchedTrainings.filter(t => t.department === "EEE").length,
                        searchedTrainings.filter(t => t.department === "CSE").length,
                        searchedTrainings.filter(t => t.department === "IT").length,
                        searchedTrainings.filter(t => t.department === "ISE").length,
                        searchedTrainings.filter(t => t.department === "CSBS").length,
                        searchedTrainings.filter(t => t.department === "CT").length,
                        searchedTrainings.filter(t => t.department === "AIDS").length,
                        searchedTrainings.filter(t => t.department === "AIML").length,
                        searchedTrainings.filter(t => t.department === "CSD").length,
                    ],
                backgroundColor: isStudentSearch ? "#4BC0C0" : [
                    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#C9CBCF", "#FFCD56", "#4BC0C0"
                ],
                borderColor: "#4BC0C0",
                borderWidth: 1,
            },
        ],
    };
    const barChartTitle = isStudentSearch ? "Training-wise Scores" : "Trainings by Department";

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false, 
        scales: {
            x: {
                barPercentage: 0.4, 
                categoryPercentage: 0.5, 
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    // Data for the pie chart (Internal vs External Trainings)
    const pieChartData = {
        labels: ["Internal", "External"], 
        datasets: [
            {
                label: "Trainings by Type",
                data: [
                    searchedTrainings.filter(t => t.type === "Internal").length, 
                    searchedTrainings.filter(t => t.type === "External").length, 
                ],
                backgroundColor: [
                    "#FF6384", 
                    "#36A2EB", 
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                ],
            },
        ],
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false, 
        plugins: {
            legend: {
                position: "top", 
            },
        },
    };

    // Data for the student performance line chart
    const studentPerformanceData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // Months
        datasets: [
            {
                label: "Student Performance (%)",
                data: searchedTrainings.map(t => t.score),
                borderColor: "#4BC0C0", 
                backgroundColor: "rgba(75, 192, 192, 0.2)", 
                borderWidth: 2,
                pointRadius: 5,
                pointBackgroundColor: "#4BC0C0",
            },
        ],
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Months",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Performance (%)",
                },
                beginAtZero: true,
                max: 100,
            },
        },
    };

    // Generate Excel report with filtered data
    const generateExcelReport = () => {
        const worksheet = XLSX.utils.json_to_sheet(searchedTrainings); // Use filtered data
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Trainings Report");
        XLSX.writeFile(workbook, "Filtered_Trainings_Report.xlsx");
    };

    return (
        <div className="content-container">
            {/* Page Title */}
            <h1>Training Reports</h1>

            {/* Summary Cards */}
            <div className="summary-cards">
                {[
                    { title: "Total Conducted", value: `${totalConducted} Trainings` },
                    { title: "In Progress", value: `${inProgress} Trainings` },
                    { title: "Completed", value: `${completed} Trainings` },
                ].map((card, index) => (
                    <div className="summary-card" key={index}>
                        <h3>{card.title}</h3>
                        <p>{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="filters-container">
                <select value={filters.period} onChange={(e) => setFilters({ ...filters, period: e.target.value })}>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                </select>

                <select value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })}>
                    <option value="All Years">All Years</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                </select>

                <select value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })}>
                    <option value="All Departments">All Departments</option>
                    <option value="EEE">EEE</option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ISE">ISE</option>
                    <option value="CSBS">CSBS</option>
                    <option value="CT">CT</option>
                    <option value="AIDS">AIDS</option>
                    <option value="AIML">AIML</option>
                    <option value="CSD">CSD</option>
                </select>

                <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                    <option value="All">All</option>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                </select>

                <input
                    type="text"
                    placeholder="Search..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />

                <button className="apply-button" onClick={generateExcelReport}>Generate Report</button>
            </div>

            <div>
                <div className="training-table-container">
                    <table className="training-table">
                        <thead>
                            <tr>
                                {["Training Name", "Type", "Department", "Year", "Dates", "Trainer ID", "Status"].map((head, index) => (
                                    <th key={index}>{head}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentTrainings.length > 0 ? (
                                currentTrainings.map((training, index) => (
                                    <tr key={index}>
                                        <td>{training.name}</td>
                                        <td>{training.type}</td>
                                        <td>{training.department}</td>
                                        <td>{getYearFromRollNumber(training.rollNumber)}</td>
                                        <td>{training.dates}</td>
                                        <td>{training.trainerId}</td>
                                        <td>{training.status}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center", padding: "10px" }}>
                                        No matching trainings found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="pagination1">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                        Prev
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                        Next
                    </button>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-container">
                <div className="chart">
                    <h3>{barChartTitle}</h3>
                    <Bar data={barChartData} options={barChartOptions} />
                </div>
                <div className="chart">
                    <h3>Trainings by Type (Internal vs External)</h3>
                    <Pie data={pieChartData} options={pieChartOptions} />
                </div>
                <div className="chart">
                    <h3>Student Performance Over Time</h3>
                    <Line data={studentPerformanceData} options={lineChartOptions} />
                </div>
            </div>
        </div>
    );
};

export default Analytics;