import React from "react";

import {  createBrowserRouter } from "react-router-dom";

import Layout from "../Components/Layout";
import SigninForm from "../Pages/Faculty(User)/Login/SigninForm";
import RequestForm from "../Pages/Faculty(User)/Schedule Request/RequestForm";
import TrackRequest from "../Pages/Faculty(User)/Track Schedule Request/TrackRequest";
import Dashboard from "../Pages/Faculty(User)/Faculty Dashboard/Dashboard";
import SigninAdmin from "../Pages/Admin/Admin Login/SigninAdmin";
import Ongoing from "../Pages/Faculty(User)/Ongoing Training/Ongoing";
import UserViewRequests from "../Pages/Faculty(User)/View Full Submitted Request/UserViewRequests";
import Aptitude from "../Pages/Faculty(User)/Domain Wise Reports/Aptitude";
import AdminDashboard from "../Pages/Admin/Dashboard/AdminDashboard";
import AdminLayout from "../Components/Admin/AdminLayout";
import AdminRequests from "../Pages/Admin/View Requests/AdminRequests";
import AdminViewReq from "../Pages/Admin/View Full Requests/AdminViewReq";
import AdminOngoing from "../Pages/Admin/Admin Ongoing/AdminOngoing";
import AdminApti from "../Pages/Admin/Domain Wise Reports/AdminApti";
import Analytics from "../Pages/Admin/Analytics/Analytics";
import Filter from "../Pages/Faculty(User)/Filter Students/Filter";
import CustomTraining from "../Pages/Faculty(User)/Custom Training Schedule/CustomTraining";
import Pastdata from "../Pages/Faculty(User)/Request Past Data/Pastdata";

const Router = createBrowserRouter([
    {
        path: "/",
        element: <SigninForm />
    },
    {
        path: "/dashboard",
        element: <Layout />,
        children: [
            { path: "", element: <Dashboard /> }, // Default child route
            { path: "add-request", element: <RequestForm /> },
            { path: "track-request", element: <TrackRequest /> },
            { path: "ongoing", element: <Ongoing /> },
            { path: "view-full-req", element: <UserViewRequests /> },
            { path: "aptitude", element: <Aptitude /> },
            {path:"/dashboard/CustomTraining", element: <CustomTraining/>},
            { path: "filter", element : <Filter/>},
            { path: "request-past-data", element: <Pastdata/>},
            {path:"analytics",element:<Analytics/>}
        ]
    },
    {
        path : "/admin/signin",
        element : <SigninAdmin/>
      },
      {
        path : "/admin/",
        element : <AdminLayout/>,
        children: [
          {path:"/admin/dashboard",element: <AdminDashboard/>},
          {path:"/admin/view-requests", element: <AdminRequests/>},
          {path:"/admin/view-full-request",element:<AdminViewReq/>},
          {path:"/admin/Ongoing", element : <AdminOngoing/>},
          {path:"/admin/aptitude",element: <AdminApti/>},
          {path:"analytics",element:<Analytics/>}
          
          
          
        ]
  
      }
    
])
export default Router