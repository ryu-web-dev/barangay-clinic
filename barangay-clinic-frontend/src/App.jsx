import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PatientProfile from './pages/PatientProfile';
import './index.css';
import Login from './pages/Login';
import Patients from './pages/Patients';
import MedCert from './pages/MedCert';
import Inventory from './pages/Inventory';
import { useNavigate } from 'react-router-dom';

// We will create these components next!

// This is the Layout for logged-in users (Sidebar + Main Content)
// This is the Layout for logged-in users (Sidebar + Main Content)
const MainLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Destroy the session keys in browser memory
    localStorage.removeItem('clinic_token');
    localStorage.removeItem('clinic_user');
    
    // 2. Kick the user back to the Login screen
    navigate('/');
  };

  return (
    <div className="app-container">
      <nav className="sidebar">
        
        {/* Clickable Logo and Title (Acts as a Home Button) */}
        <div 
          onClick={() => navigate('/patients')} 
          style={{ cursor: 'pointer', textAlign: 'center', marginBottom: '20px' }}
        >
          {/* Note: I used a placeholder image. Later, just put your barangay logo in the 'public' folder as 'logo.png' and change src="/logo.png" */}
          <img 
            src="logo.png" 
            alt="Barangay Logo" 
            style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '10px', objectFit: 'cover' }} 
          />
          <h2 style={{ borderBottom: 'none', paddingBottom: '0', margin: '0' }}>
            Barangay Health Center
          </h2>
        </div>
        
        {/* Divider Line */}
        <div style={{ borderBottom: '2px solid #34495e', marginBottom: '20px' }}></div>

        <Link to="/patients">Patients & Visits</Link>
        <Link to="/inventory">Inventory</Link>
        <Link to="/patients">Medical Certificate</Link>
        
        {/* Fully Functional Logout Button */}
        <button 
          className="danger" 
          onClick={handleLogout}
          style={{ marginTop: '50px', width: '100%' }}
        >
          Logout
        </button>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />
        
        {/* Protected Routes (Wrapped in Layout) */}
        <Route path="/patients" element={<MainLayout><Patients /></MainLayout>} />
        <Route path="/patient/:id" element={<MainLayout><PatientProfile /></MainLayout>} />
        <Route path="/inventory" element={<MainLayout><Inventory /></MainLayout>} />
        
        {/* FIXED: This route now correctly expects an ID from the URL */}
        <Route path="/medcert/:id" element={<MainLayout><MedCert /></MainLayout>} />
      </Routes>
    </Router>
  );
}

export default App;