import { GoogleLogin } from "@react-oauth/google";
import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SigninForm = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  const handleSuccess = (credentialResponse) => {
    const credentialResponseDecoded = jwtDecode(credentialResponse.credential);
    const email = credentialResponseDecoded.email;
    const name = credentialResponseDecoded.name;

    if (email.endsWith("@bitsathy.ac.in")) {
      setUserData({ email, name });
    } else {
      toast.error("Please Sign in with your BIT Sathy account ", {
        position: "top-right",
        style: { width: "400px", textAlign: "center" , color: "black"},
        autoClose: 3000,
      });
    }
  };

  if (userData) {
    navigate("/dashboard", { state: userData });
  }

  const handleadmin = () => {
    navigate("/admin/signin")
  }

  return (
    <>

      <div className="container">

        <div className="signin-container">
          <h2>Placement Training Management</h2>
          <div className="spacer"></div>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => toast.error("Failed to login")}
          />
          <p>Sign in with your BIT account</p>
          <div className="spacer"></div>
          <button onClick={handleadmin} className="admin-button">Admin</button>

        </div>
        <ToastContainer  />
      </div >
    </>
  );
};

export default SigninForm;
