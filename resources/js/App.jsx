import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
// import { AuthProvider } from './contexts/AuthContext';
import '../css/app.css';

function App() {
  return (
    <div>
      <h1>React App is Working!</h1>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </Router>
    </div>
  );
}

// Render the app
const container = document.getElementById('app');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        {/* <AuthProvider> */}
            <App />
        {/* </AuthProvider> */}
    </React.StrictMode>
);

export default App;