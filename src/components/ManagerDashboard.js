import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, Eye, Users, ClipboardList, Search } from 'lucide-react';
import PatientForm from './PatientForm';
import DietChartForm from './DietChartForm';
import PatientDetails from './PatientDetails';
import DietChartDetails from './DietChartDetails';

const REACT_APP_API_URL = "https://hospital-food-manager-backend.onrender.com";

const ManagerDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [dietCharts, setDietCharts] = useState([]);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showDietChartForm, setShowDietChartForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDietChart, setSelectedDietChart] = useState(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [showDietChartDetails, setShowDietChartDetails] = useState(false);

  useEffect(() => {
    fetchPatients();
    fetchDietCharts();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${REACT_APP_API_URL}/api/patients`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPatients(response.data);
    } catch (error) {
      toast.error('Failed to fetch patients');
    }
  };

  const fetchDietCharts = async () => {
    try {
      const response = await axios.get(`${REACT_APP_API_URL}/api/diet-charts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDietCharts(response.data);
    } catch (error) {
      toast.error('Failed to fetch diet charts');
    }
  };

  const handlePatientSubmit = async (patientData) => {
    try {
      if (selectedPatient) {
        await axios.put(`${REACT_APP_API_URL}/api/patients/${selectedPatient._id}`, patientData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Patient updated successfully');
      } else {
        await axios.post(`${REACT_APP_API_URL}/api/patients`, patientData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Patient added successfully');
      }
      setShowPatientForm(false);
      setSelectedPatient(null);
      fetchPatients();
    } catch (error) {
      toast.error('Failed to save patient');
    }
  };

  const handleDietChartSubmit = async (dietChartData) => {
    try {
      if (selectedDietChart) {
        await axios.put(`${REACT_APP_API_URL}/api/diet-charts/${selectedDietChart._id}`, dietChartData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Diet chart updated successfully');
      } else {
        await axios.post(`${REACT_APP_API_URL}/api/diet-charts`, dietChartData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Diet chart added successfully');
      }
      setShowDietChartForm(false);
      setSelectedDietChart(null);
      fetchDietCharts();
    } catch (error) {
      toast.error('Failed to save diet chart');
    }
  };

  const handleDeletePatient = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await axios.delete(`${REACT_APP_API_URL}/api/patients/${patientId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Patient deleted successfully');
        fetchPatients();
      } catch (error) {
        toast.error('Failed to delete patient');
      }
    }
  };

  const handleDeleteDietChart = async (dietChartId) => {
    if (window.confirm('Are you sure you want to delete this diet chart?')) {
      try {
        await axios.delete(`${REACT_APP_API_URL}/api/diet-charts/${dietChartId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Diet chart deleted successfully');
        fetchDietCharts();
      } catch (error) {
        toast.error('Failed to delete diet chart');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manager Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Patients Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Users className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Patients</h2>
              </div>
              <button
                onClick={() => setShowPatientForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Patient
              </button>
            </div>

            <div className="space-y-4">
              {patients.map((patient) => (
                <div key={patient._id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-600">Room {patient.roomNumber}, Bed {patient.bedNumber}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => { setSelectedPatient(patient); setShowPatientDetails(true); }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => { setSelectedPatient(patient); setShowPatientForm(true); }}
                        className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-full transition-colors duration-200"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeletePatient(patient._id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diet Charts Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <ClipboardList className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Diet Charts</h2>
              </div>
              <button
                onClick={() => setShowDietChartForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Diet Chart
              </button>
            </div>

            <div className="space-y-4">
              {dietCharts.map((dietChart) => (
                <div key={dietChart._id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Diet Chart for {dietChart.patientId.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(dietChart.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => { setSelectedDietChart(dietChart); setShowDietChartDetails(true); }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => { setSelectedDietChart(dietChart); setShowDietChartForm(true); }}
                        className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-full transition-colors duration-200"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDietChart(dietChart._id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {showDietChartForm && (
            <DietChartForm
              onSubmit={handleDietChartSubmit}
              onCancel={() => {
                setShowDietChartForm(false);
                setSelectedDietChart(null);
              }}
              dietChart={selectedDietChart}
              patients={patients}
            />
          )}
           {showPatientForm && (
            <PatientForm
              onSubmit={handlePatientSubmit}
              onCancel={() => {
                setShowPatientForm(false);
                setSelectedPatient(null);
              }}
              patient={selectedPatient}
            />
          )}

        {/* Keep existing modal components */}
        {showPatientDetails && (
          <PatientDetails
            patient={selectedPatient}
            onClose={() => setShowPatientDetails(false)}
          />
        )}
        {showDietChartDetails && (
          <DietChartDetails
            dietChart={selectedDietChart}
            onClose={() => setShowDietChartDetails(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;