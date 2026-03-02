import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MedCert = () => {
  const { id } = useParams(); // Gets the specific treatment ID
  const navigate = useNavigate();
  const [treatment, setTreatment] = useState(null);

  useEffect(() => {
    const fetchTreatment = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/treatments/${id}`);
        setTreatment(res.data);
      } catch (err) {
        console.error('Error fetching treatment record:', err);
      }
    };
    fetchTreatment();
  }, [id]);

  if (!treatment) return <p style={{ padding: '20px' }}>Loading certificate data...</p>;

  const patient = treatment.patientId; // Populated from our backend!

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '40px', minHeight: '100vh' }}>
      
      {/* Non-printable Top Bar */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button onClick={() => navigate(-1)} style={{ backgroundColor: '#7f8c8d' }}>&larr; Back</button>
        <button onClick={() => window.print()} className="success">🖨️ Print Certificate</button>
      </div>

      {/* --- START OF PRINTABLE CERTIFICATE --- */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h3 style={{ margin: 0, textTransform: 'uppercase' }}>Republic of the Philippines</h3>
        <h4 style={{ margin: 0, fontWeight: 'normal' }}>Province of Rizal</h4>
        <h4 style={{ margin: 0, fontWeight: 'normal' }}>Municipality of Binangonan</h4>
        <h2 style={{ marginTop: '10px', color: '#2c3e50' }}>BARANGAY HEALTH CENTER</h2>
      </div>

      <h1 style={{ textAlign: 'center', textDecoration: 'underline', marginBottom: '40px' }}>
        MEDICAL CERTIFICATE
      </h1>

      <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
        <p style={{ textAlign: 'right', marginBottom: '30px' }}>
          <strong>Date:</strong> {new Date().toLocaleDateString()}
        </p>

        <p><strong>TO WHOM IT MAY CONCERN:</strong></p>

        <p style={{ textIndent: '40px', marginTop: '20px' }}>
          This is to certify that <strong>{patient.firstName} {patient.lastName}</strong>, 
          a resident of {patient.address}, was examined and treated at this Barangay Health Center 
          on <strong>{new Date(treatment.visitDate).toLocaleDateString()}</strong>.
        </p>

        <div style={{ margin: '30px 0', padding: '20px', border: '1px solid #bdc3c7', borderRadius: '4px' }}>
          <p><strong>Vital Signs:</strong> BP: {treatment.vitalSigns?.bloodPressure || 'N/A'} | Temp: {treatment.vitalSigns?.temperature || 'N/A'} | Wt: {treatment.vitalSigns?.weight || 'N/A'}</p>
          <p><strong>Symptoms:</strong> {treatment.symptoms}</p>
          <p><strong>Diagnosis:</strong> {treatment.diagnosis}</p>
          <p><strong>Treatment / Prescription Given:</strong> {treatment.treatmentGiven || 'None'}</p>
        </div>

        <p style={{ textIndent: '40px' }}>
          This certificate is being issued upon the request of the aforementioned patient for whatever legal purpose it may serve.
        </p>

        <div style={{ marginTop: '60px', textAlign: 'right' }}>
          <p style={{ margin: 0, fontWeight: 'bold', textDecoration: 'underline', textTransform: 'uppercase' }}>
            {treatment.attendingStaff}
          </p>
          <p style={{ margin: 0 }}>Attending Health Worker / Physician</p>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#7f8c8d' }}>Barangay Health Center</p>
        </div>
      </div>
      {/* --- END OF PRINTABLE CERTIFICATE --- */}

    </div>
  );
};

export default MedCert;