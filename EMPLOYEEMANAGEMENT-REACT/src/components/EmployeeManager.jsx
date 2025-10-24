import React, { useState, useEffect } from 'react';
import './style.css';
import config from './config.js';
const EmployeeManager = () => {
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState({
    id: '',
    name: '',
    gender: '',
    department: '',
    position: '',
    salary: '',
    experience: '',
    email: '',
    password: '',
    contact: ''
  });
  const [idToFetch, setIdToFetch] = useState('');
  const [fetchedEmployee, setFetchedEmployee] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Use hardcoded URL temporarily
  // const baseUrl = `http://localhost:8099/employeeapi`;
  const baseUrl = `${config.url}/employeeapi`;

  useEffect(() => {
    fetchAllEmployees();
  }, []);

  const fetchAllEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/all`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched data:', data);
        
        // Ensure employees is always an array
        if (Array.isArray(data)) {
          setEmployees(data);
        } else {
          setEmployees([]);
          setMessage('Invalid data format received from server.');
        }
      } else {
        setEmployees([]);
        setMessage('Failed to fetch employees. Server returned: ' + response.status);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setEmployees([]);
      setMessage('Failed to connect to server. Make sure backend is running on port 2000.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    for (let key in employee) {
      if (!employee[key] || employee[key].toString().trim() === '') {
        setMessage(`Please fill out the ${key} field.`);
        return false;
      }
    }
    return true;
  };

  const addEmployee = async () => {
    if (!validateForm()) return;
    try {
      const response = await fetch(`${baseUrl}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee)
      });
      
      if (response.ok) {
        setMessage('Employee added successfully.');
        fetchAllEmployees();
        resetForm();
      } else {
        setMessage('Error adding employee.');
      }
    } catch (error) {
      setMessage('Error adding employee.');
    }
  };

  const updateEmployee = async () => {
    if (!validateForm()) return;
    try {
      const response = await fetch(`${baseUrl}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee)
      });
      
      if (response.ok) {
        setMessage('Employee updated successfully.');
        fetchAllEmployees();
        resetForm();
      } else {
        setMessage('Error updating employee.');
      }
    } catch (error) {
      setMessage('Error updating employee.');
    }
  };

  const deleteEmployee = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/delete/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        const message = await response.text();
        setMessage(message);
        fetchAllEmployees();
      } else {
        setMessage('Error deleting employee.');
      }
    } catch (error) {
      setMessage('Error deleting employee.');
    }
  };

  const getEmployeeById = async () => {
    try {
      const response = await fetch(`${baseUrl}/get/${idToFetch}`);
      if (response.ok) {
        const data = await response.json();
        setFetchedEmployee(data);
        setMessage('');
      } else {
        setFetchedEmployee(null);
        setMessage('Employee not found.');
      }
    } catch (error) {
      setFetchedEmployee(null);
      setMessage('Error fetching employee.');
    }
  };

  const handleEdit = (emp) => {
    setEmployee(emp);
    setEditMode(true);
    setMessage(`Editing employee with ID ${emp.id}`);
  };

  const resetForm = () => {
    setEmployee({
      id: '',
      name: '',
      gender: '',
      department: '',
      position: '',
      salary: '',
      experience: '',
      email: '',
      password: '',
      contact: ''
    });
    setEditMode(false);
  };

  return (
    <div className="employee-container">
      {message && (
        <div className={`message-banner ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <h2>Employee Management System</h2>

      <div>
        <h3>{editMode ? 'Edit Employee' : 'Add Employee'}</h3>
        <div className="form-grid">
          <input type="number" name="id" placeholder="Employee ID" value={employee.id} onChange={handleChange} />
          <input type="text" name="name" placeholder="Full Name" value={employee.name} onChange={handleChange} />
          <select name="gender" value={employee.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
          </select>
          <select name="department" value={employee.department} onChange={handleChange}>
            <option value="">Select Department</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
          </select>
          <select name="position" value={employee.position} onChange={handleChange}>
            <option value="">Select Position</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Manager">Manager</option>
            <option value="HR Specialist">HR Specialist</option>
            <option value="Financial Analyst">Financial Analyst</option>
            <option value="Sales Executive">Sales Executive</option>
          </select>
          <input type="number" name="salary" placeholder="Salary" value={employee.salary} onChange={handleChange} />
          <select name="experience" value={employee.experience} onChange={handleChange}>
            <option value="">Select Experience</option>
            <option value="0-1">0-1 years</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5-10">5-10 years</option>
            <option value="10+">10+ years</option>
          </select>
          <input type="email" name="email" placeholder="Email" value={employee.email} onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" value={employee.password} onChange={handleChange} />
          <input type="text" name="contact" placeholder="Contact" value={employee.contact} onChange={handleChange} />
        </div>

        <div className="btn-group">
          {!editMode ? (
            <button className="btn-blue" onClick={addEmployee}>Add Employee</button>
          ) : (
            <>
              <button className="btn-green" onClick={updateEmployee}>Update Employee</button>
              <button className="btn-gray" onClick={resetForm}>Cancel</button>
            </>
          )}
        </div>
      </div>

      <div>
        <h3>Get Employee By ID</h3>
        <input
          type="number"
          value={idToFetch}
          onChange={(e) => setIdToFetch(e.target.value)}
          placeholder="Enter Employee ID"
        />
        <button className="btn-blue" onClick={getEmployeeById}>Fetch</button>

        {fetchedEmployee && (
          <div>
            <h4>Employee Found:</h4>
            <pre>{JSON.stringify(fetchedEmployee, null, 2)}</pre>
          </div>
        )}
      </div>

      <div>
        <h3>All Employees</h3>
        {loading ? (
          <p>Loading employees...</p>
        ) : employees.length === 0 ? (
          <p>No employees found. {message && `- ${message}`}</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {Object.keys(employee).map((key) => (
                    <th key={key}>{key.toUpperCase()}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    {Object.keys(employee).map((key) => (
                      <td key={key}>{emp[key]}</td>
                    ))}
                    <td>
                      <div className="action-buttons">
                        <button className="btn-green" onClick={() => handleEdit(emp)}>Edit</button>
                        <button className="btn-red" onClick={() => deleteEmployee(emp.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeManager;