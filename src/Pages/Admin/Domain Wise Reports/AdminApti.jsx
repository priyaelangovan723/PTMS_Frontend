import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import * as XLSX from 'xlsx';

import '../../../styles/Faculty Dashboard/Dashboard.css';
import '../../../styles/Track Schedule Request/TrackRequest.css'
import '../../../styles/Track Schedule Request/YourRequests.css'
import '../../../styles/Domain Wise Reports/Aptitude.css'

const AdminApti = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const itemsPerPage = 10;

    useEffect(() => {
        const initialData = [
            {
                "courseID": 101,
                "courseTitle": "Advanced Python Training",
                "students": [
                    {
                        "studentID": "S1001",
                        "studentName": "John Doe",
                        "Roll No": "7376222IT151",
                        "enrollmentDate": "2024-01-20",
                        "status": "Active",
                        "contactInfo": { "email": "john.doe@example.com", "phone": "123-456-7890" },
                        "attendance": [
                            { "date": "2024-01-21", "FN1": "Present", "FN2": "Absent", "AN1": "Present", "AN2": "Present" },
                            { "date": "2024-01-22", "FN1": "Absent", "FN2": "Absent", "AN1": "Present", "AN2": "Present" }
                        ],
                        "assessments": [
                            { "testDate": "2024-01-22", "score": 80 },
                            { "testDate": "2024-01-23", "score": 90 }
                        ]
                    }
                ]
            },
            {
                "courseID": 102,
                "courseTitle": "Machine Learning Basics",
                "students": [
                    {
                        "studentID": "S2001",
                        "studentName": "Alice Brown",
                        "Roll No": "7376222IT201",
                        "enrollmentDate": "2024-02-01",
                        "status": "Active",
                        "contactInfo": { "email": "alice.brown@example.com", "phone": "456-789-0123" },
                        "attendance": [
                            { "date": "2024-02-02", "FN1": "Present", "FN2": "Absent", "AN1": "Present", "AN2": "Present" },
                            { "date": "2024-02-03", "FN1": "Present", "FN2": "Present", "AN1": "Absent", "AN2": "Present" }
                        ],
                        "assessments": [
                            { "testDate": "2024-02-04", "score": 78 },
                            { "testDate": "2024-02-05", "score": 92 }
                        ]
                    }
                ]
            },
            {
                "courseID": 103,
                "courseTitle": "Data Structures & Algorithms",
                "students": [
                    {
                        "studentID": "S3001",
                        "studentName": "Charlie Green",
                        "Roll No": "7376222IT301",
                        "enrollmentDate": "2024-02-10",
                        "status": "Active",
                        "contactInfo": { "email": "charlie.green@example.com", "phone": "321-654-0987" },
                        "attendance": [
                            { "date": "2024-02-11", "FN1": "Present", "FN2": "Present", "AN1": "Absent", "AN2": "Present" }
                        ],
                        "assessments": [
                            { "testDate": "2024-02-12", "score": 88 }
                        ]
                    }
                ]
            },
            {
                "courseID": 104,
                "courseTitle": "Full Stack Web Development",
                "students": [
                    {
                        "studentID": "S4001",
                        "studentName": "David White",
                        "Roll No": "7376222IT401",
                        "enrollmentDate": "2024-03-01",
                        "status": "Active",
                        "contactInfo": { "email": "david.white@example.com", "phone": "789-654-1230" },
                        "attendance": [
                            { "date": "2024-03-02", "FN1": "Present", "FN2": "Present", "AN1": "Present", "AN2": "Absent" }
                        ],
                        "assessments": [
                            { "testDate": "2024-03-03", "score": 95 }
                        ]
                    }
                ]
            }
        ];

        processStudents(initialData);
    }, []);

    const processStudents = (data) => {
        data.forEach(course => {
            course.students.forEach(student => {
                // Calculate attendance percentage
                let totalDays = student.attendance.length;
                let presentSessions = student.attendance.reduce((sum, record) => {
                    return sum + ["FN1", "FN2", "AN1", "AN2"].filter(session => record[session] === "Present").length;
                }, 0);
                student.attendancePercentage = totalDays > 0 ? ((presentSessions / (totalDays * 4)) * 100).toFixed(2) : "N/A";

                // Calculate assessment scores
                let totalScore = student.assessments.reduce((sum, test) => sum + test.score, 0);
                student.averageScore = student.assessments.length > 0 ? (totalScore / student.assessments.length).toFixed(2) : "N/A";
            });
        });

        setStudents(data);
        setFilteredStudents(data);
    };
    const searchfn = (e) => {
        const getSearch = e.target.value.toLowerCase();
        setSearchValue(getSearch);

        if (getSearch.length > 0) {
            const filteredItems = filteredStudents.filter((course) =>
                course.courseTitle.toLowerCase().includes(getSearch) ||
                course.students.some(student => student["Roll No"].toLowerCase().includes(getSearch))
            );
            setStudents(filteredItems);
        } else {
            setStudents(filteredStudents); // Reset to original data
        }
    };



    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(students.length / itemsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    



const downloadExcel = (type) => {
    let dataToExport = [];

    filteredStudents.forEach(course => {
        course.students.forEach(student => {
            if (type === 'attendance') {
                student.attendance.forEach(att => {
                    dataToExport.push({
                        "Course ID": course.courseID,
                        "Course Title": course.courseTitle,
                        "Student Roll No": student["Roll No"],
                        "Student Name": student.studentName,
                        "Status": student.status,
                        "Email": student.contactInfo.email,
                        "Phone": student.contactInfo.phone,
                        "Date": att.date,
                        "FN1": att.FN1,
                        "FN2": att.FN2,
                        "AN1": att.AN1,
                        "AN2": att.AN2,
                        "Overall Attendance %": parseFloat(student.attendancePercentage)
                    });
                });
            } else if (type === 'assessment') {
                student.assessments.forEach(test => {
                    dataToExport.push({
                        "Course ID": course.courseID,
                        "Course Title": course.courseTitle,
                        "Student Roll No": student["Roll No"],
                        "Student Name": student.studentName,
                        "Status": student.status,
                        "Email": student.contactInfo.email,
                        "Phone": student.contactInfo.phone,
                        "Date": test.testDate,
                        "Assessment Score": test.score,
                        "Overall Assessment %": parseFloat(student.averageScore)
                    });
                });
            }
        });
    });

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(dataToExport);

    // Get column for "Overall Attendance %" or "Overall Assessment %"
    const colLetter = type === 'attendance' ? "L" : "J"; // L = Attendance %, J = Assessment %

    // Get range of data
    const range = XLSX.utils.decode_range(ws["!ref"]);

    // Apply conditional formatting manually
    for (let R = range.s.r + 1; R <= range.e.r; ++R) { // Skip header
        const cellRef = `${colLetter}${R + 1}`;
        const cell = ws[cellRef];

        if (cell && cell.v !== undefined) {
            const value = parseFloat(cell.v);
            if ((type === 'attendance' && value < 80) || (type === 'assessment' && value < 50)) {
                cell.s = {
                    fill: { fgColor: { rgb: "FF0000" } }, // Red background
                    font: { bold: true, color: { rgb: "FFFFFF" } } // White bold text
                };
            }
        }
    }

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, type === 'attendance' ? "Attendance Report" : "Assessment Report");

    // Export with styles preserved
    XLSX.writeFile(wb, `${type}-report.xlsx`);
};

    
    

    return (
        <div className="content-container">
            <h1>Track Students Enrolled in Courses</h1>
            <div className="reports">
                <h4>Download Reports</h4>
                <div className="attendance-reports">
                    <button className="dwnld-btn" onClick={() => downloadExcel('attendance')}>Generate Attendance Report</button>
                </div>
                <div className="assessment-reports">
                    <button className="dwnld-btn" onClick={() => downloadExcel('assessment')}>Generate Asessment Report</button>
                </div>
            </div>
            <div className="search-bar">
                <FontAwesomeIcon icon={faSearch} />
                <input placeholder="Search by course or student Roll No" onChange={searchfn} value={searchValue} />
            </div>
            <div className="table1-container">
                <table>
                    <thead>
                        <tr>
                            <th>Course ID</th>
                            <th>Course Title</th>
                            <th>Student Name</th>
                            <th>Roll No</th>
                            <th>Enrollment Date</th>
                            <th>Status</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Attendance %</th>
                            <th>Assessment Scores</th>
                            <th>Average Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.slice(indexOfFirstItem, indexOfLastItem).map(course =>
                            course.students.map(student => (
                                <tr key={student.studentID}>
                                    <td>{course.courseID}</td>
                                    <td>{course.courseTitle}</td>
                                    <td>{student.studentName}</td>
                                    <td>{student['Roll No']}</td>
                                    <td>{student.enrollmentDate}</td>
                                    <td className={student.status === "Active" ? "active" : "completed"}>
                                        {student.status}
                                    </td>
                                    <td>{student.contactInfo.email}</td>
                                    <td>{student.contactInfo.phone}</td>
                                    <td className={student.attendancePercentage < 80 ? 'low-attendance' : 'green'}>
                                        {student.attendancePercentage}%
                                    </td>

                                    <td>
                                        {student.assessments.map(test => (
                                            <p key={test.testDate}>{test.testDate}: {test.score}</p>
                                        ))}
                                    </td>
                                    <td className={student.averageScore < 50 ? 'low-score' : 'green'}>
                                        {student.averageScore}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="pagination">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className={currentPage === 1 ? "disabled" : "prev"}>Previous</button>
                <span className="total-pages">{`Page ${currentPage} of ${totalPages}`}</span>
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className={currentPage === totalPages ? "disabled" : "next"}>Next</button>
            </div>
        </div>
    );
};

export default AdminApti;
