import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // State for the "Add Patient" form
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    address: "",
    contactNumber: "",
  });

  // Fetch patients from the backend when the page loads, or when searching
  const fetchPatients = async () => {
    try {
      const res = await axios.get(
        `https://barangay-clinic.onrender.com/api/patients?search=${searchTerm}`,
      );
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  // Run fetchPatients when the component loads AND whenever searchTerm changes
  useEffect(() => {
    fetchPatients();
  }, [searchTerm]);

  // Handle typing in the form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit the new patient to the backend
  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://barangay-clinic.onrender.com/api/patients", formData);
      setFormData({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        address: "",
        contactNumber: "",
      }); // Clear form
      fetchPatients(); // Refresh the table
      alert("Patient added successfully!");
    } catch (err) {
      console.error("Error adding patient:", err);
      alert("Failed to add patient.");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Patient Records</h2>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search patient name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "300px", margin: 0 }}
        />
      </div>

      {/* Add New Patient Form */}
      <div className="card">
        <h3>Add New Patient</h3>
        <form
          onSubmit={handleAddPatient}
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "15px",
          }}
        >
          <div style={{ flex: "1 1 150px" }}>
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ flex: "1 1 150px" }}>
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ flex: "1 1 150px" }}>
            <label>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ flex: "1 1 150px" }}>
            <label>Contact #</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
            />
          </div>
          <div style={{ flex: "1 1 100%", textAlign: "right" }}>
            <button type="submit" className="success">
              Save Patient
            </button>
          </div>
        </form>
      </div>

      {/* Patient Table */}
      <div className="card">
        <h3>Patient Roster</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Address</th>
              <th>Contact</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 ? (
              patients.map((patient) => (
                <tr key={patient._id}>
                  <td>
                    <strong>
                      {patient.firstName} {patient.lastName}
                    </strong>
                  </td>
                  <td>{new Date(patient.dateOfBirth).toLocaleDateString()}</td>
                  <td>{patient.address}</td>
                  <td>{patient.contactNumber || "N/A"}</td>
                  <td>
                    {/* Later, this will link to their specific history/med cert page */}
                    <button
                      onClick={() => navigate(`/patient/${patient._id}`)}
                      style={{ padding: "5px 10px", fontSize: "0.8rem" }}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Patients;
