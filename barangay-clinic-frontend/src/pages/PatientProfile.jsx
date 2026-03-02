import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PatientProfile = () => {
  const { id } = useParams(); // Grabs the patient ID from the URL
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);

  // State for the new treatment form
  const [treatmentForm, setTreatmentForm] = useState({
    symptoms: "",
    diagnosis: "",
    treatmentGiven: "",
    attendingStaff:
      JSON.parse(localStorage.getItem("clinic_user"))?.username || "Staff", // Grabs logged-in user
    vitalSigns: { bloodPressure: "", temperature: "", weight: "" },
  });

  const fetchData = async () => {
    try {
      // 1. Get Patient Details
      const patientRes = await axios.get(
        `http://localhost:5000/api/patients/${id}`,
      );
      setPatient(patientRes.data);

      // 2. Get their Treatment History
      const historyRes = await axios.get(
        `http://localhost:5000/api/treatments/patient/${id}`,
      );
      setHistory(historyRes.data);
    } catch (err) {
      console.error("Error fetching profile data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleTreatmentChange = (e) => {
    const { name, value } = e.target;
    // Handle nested vital signs object
    if (["bloodPressure", "temperature", "weight"].includes(name)) {
      setTreatmentForm((prev) => ({
        ...prev,
        vitalSigns: { ...prev.vitalSigns, [name]: value },
      }));
    } else {
      setTreatmentForm({ ...treatmentForm, [name]: value });
    }
  };

  const handleSaveTreatment = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/treatments", {
        ...treatmentForm,
        patientId: id,
      });
      // Clear form except staff name
      setTreatmentForm((prev) => ({
        ...prev,
        symptoms: "",
        diagnosis: "",
        treatmentGiven: "",
        vitalSigns: { bloodPressure: "", temperature: "", weight: "" },
      }));
      fetchData(); // Refresh history table
      alert("Treatment record saved!");
    } catch (err) {
      console.error("Error saving treatment", err);
      alert("Failed to save treatment.");
    }
  };

  if (!patient) return <p>Loading patient data...</p>;

  return (
    <div>
      <button
        onClick={() => navigate("/patients")}
        style={{ marginBottom: "15px", backgroundColor: "#7f8c8d" }}
      >
        &larr; Back to Patients
      </button>

      {/* Patient Info Card */}
      <div className="card" style={{ borderLeft: "5px solid #3498db" }}>
        <h2>
          {patient.firstName} {patient.lastName}
        </h2>
        <p>
          <strong>DOB:</strong>{" "}
          {new Date(patient.dateOfBirth).toLocaleDateString()} |{" "}
          <strong>Contact:</strong> {patient.contactNumber}
        </p>
        <p>
          <strong>Address:</strong> {patient.address}
        </p>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        {/* Left Side: Form to add a new visit */}
        <div className="card" style={{ flex: "1" }}>
          <h3>Record New Visit</h3>
          <form onSubmit={handleSaveTreatment}>
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: "1" }}>
                <label>BP (mmHg)</label>
                <input
                  type="text"
                  name="bloodPressure"
                  placeholder="120/80"
                  value={treatmentForm.vitalSigns.bloodPressure}
                  onChange={handleTreatmentChange}
                />
              </div>
              <div style={{ flex: "1" }}>
                <label>Temp (°C)</label>
                <input
                  type="text"
                  name="temperature"
                  placeholder="37.0"
                  value={treatmentForm.vitalSigns.temperature}
                  onChange={handleTreatmentChange}
                />
              </div>
              <div style={{ flex: "1" }}>
                <label>Weight (kg)</label>
                <input
                  type="text"
                  name="weight"
                  placeholder="65"
                  value={treatmentForm.vitalSigns.weight}
                  onChange={handleTreatmentChange}
                />
              </div>
            </div>

            <label>Symptoms</label>
            <input
              type="text"
              name="symptoms"
              value={treatmentForm.symptoms}
              onChange={handleTreatmentChange}
              required
            />

            <label>Diagnosis</label>
            <input
              type="text"
              name="diagnosis"
              value={treatmentForm.diagnosis}
              onChange={handleTreatmentChange}
              required
            />

            <label>Treatment / Prescribed Meds</label>
            <textarea
              name="treatmentGiven"
              value={treatmentForm.treatmentGiven}
              onChange={handleTreatmentChange}
              rows="3"
            />

            <button type="submit" className="success" style={{ width: "100%" }}>
              Save Record
            </button>
          </form>
        </div>

        {/* Right Side: History Table */}
        <div className="card" style={{ flex: "2" }}>
          <h3>Visit History</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Diagnosis</th>
                <th>Attending</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((visit) => (
                  <tr key={visit._id}>
                    <td>{new Date(visit.visitDate).toLocaleDateString()}</td>
                    <td>{visit.diagnosis}</td>
                    <td>{visit.attendingStaff}</td>
                    <td>
                      {/* This is the final step we will build for the Med Cert! */}
                      <button
                        className="danger"
                        onClick={() => navigate(`/medcert/${visit._id}`)}
                        style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                      >
                        Generate Med Cert
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No previous visits recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
