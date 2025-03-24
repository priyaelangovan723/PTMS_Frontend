import { Outlet } from "react-router-dom"

import '../../styles/Faculty Dashboard/Dashboard.css'
import AdminNavbar from "./AdminNavbar"

const AdminLayout = () => {
    return(
        <>
        <div className="main-container">
            <AdminNavbar/>
            <Outlet/>
        </div>
        
        
        </>
    )
}

export default AdminLayout