import { GoogleLogin } from "@react-oauth/google";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SigninAdmin = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [adminEmails, setAdminEmails] = useState([]);

  // Fetch admin emails from backend
  useEffect(() => {
    const fetchAdminEmails = async () => {
      try {
        const response = await axios.get("https://ptms-backend.onrender.com/admins");
        const backendAdmins = response.data.map(item => item.AdminMail);
        setAdminEmails(backendAdmins);
      } catch (error) {
        console.error("Error fetching admin emails:", error);
      }
    };

    fetchAdminEmails();
  }, []);

  const handleSuccess = (credentialResponse) => {
    const credentialResponseDecoded = jwtDecode(credentialResponse.credential);
    const email = credentialResponseDecoded.email;
    const name = credentialResponseDecoded.name;
    const userData = { email, name };

    // Store userData in localStorage
    localStorage.setItem("userData", JSON.stringify(userData));
    setUserData({ email, name });
  };

  // Check admin access after setting userData
  useEffect(() => {
    if (userData) {
      const isAdmin = adminEmails.includes(userData.email);
      if (isAdmin) {
        navigate("/admin/dashboard", { state: userData });
      } else {
        console.log("Invalid entry");
      }
    }
  }, [userData, adminEmails, navigate]);

  return (
    <div className="container">
      <div className="signin-container">
        <h2>Placement Training Management</h2>
        <div className="spacer"></div>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.error("Failed to login")}
        />
        <p>Sign in with your BIT account</p>
        <div className="spacer"></div>
      </div>
    </div>
  );
};

export default SigninAdmin;
