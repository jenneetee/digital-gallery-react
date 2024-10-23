import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Import Router and Routes
import App from './App';
import Login from './Login';  // Import your Login component
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />  {/* Set the default route to Login */}
        <Route path="/app" element={<App />} />  {/* Add any other routes you need */}
        {/* Add more routes as necessary */}
      </Routes>
    </Router>
  </React.StrictMode>,
);
