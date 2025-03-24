import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { UserProvider } from './Components/UserContext.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  
  <UserProvider>
  <React.StrictMode>
    <GoogleOAuthProvider clientId='284307674245-nnrbe325i82gdara4t84790fvumm636h.apps.googleusercontent.com'>
    <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
  </UserProvider>
  ,
)
