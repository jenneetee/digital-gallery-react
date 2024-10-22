import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import ListGroup from './components/ListGroup';
import Payments from './Payments';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            {/* Links to different pages */}
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/listgroup">List of Art</Link>
            </li>
            <li>
              <Link to="/payments">Payments</Link>
            </li>
          </ul>
        </nav>

        {/* Routes to different components based on the URL */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/listgroup" element={<ListGroup />} />
          <Route path="/payments" element={<Payments />} />
          {/* Default route */}
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
