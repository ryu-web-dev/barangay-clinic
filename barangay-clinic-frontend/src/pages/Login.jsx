import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  // State to hold what the user types
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // To show red error messages
  
  // React Router's hook to change pages
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing when you click submit
    setError(''); // Clear any old errors

    try {
      // Ask the backend if these credentials are correct
      const response = await axios.post('https://barangay-clinic.onrender.com/api/auth/login', {
        username,
        password
      });

      // If successful, save the VIP Pass (token) and user details to the browser
      localStorage.setItem('clinic_token', response.data.token);
      localStorage.setItem('clinic_user', JSON.stringify(response.data.user));

      // Redirect the user to the Patients dashboard!
      navigate('/patients');
      
    } catch (err) {
      // If the backend says "Invalid password", show that exact message
      setError(err.response?.data?.message || 'Cannot connect to the server.');
    }
  };

  // We add a little inline styling to center the login box nicely
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#2c3e50' }}>
      <div className="card" style={{ width: '350px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '5px' }}>Health Center</h2>
        <p style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#7f8c8d' }}>Staff Login Portal</p>
        
        {/* If there's an error, show it in red */}
        {error && <div style={{ color: '#e74c3c', marginBottom: '15px', fontWeight: 'bold' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          <label>Username</label>
          <input 
            type="text" 
            placeholder="Enter username..."
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />

          <label>Password</label>
          <input 
            type="password" 
            placeholder="Enter password..."
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />

          <button type="submit" style={{ width: '100%', marginTop: '10px' }}>Log In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;