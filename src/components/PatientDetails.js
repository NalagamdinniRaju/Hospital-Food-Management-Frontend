
// PatientDetails.jsx
import React from 'react';
import { X, User, Phone, AlertTriangle, Heart } from 'lucide-react';

const PatientDetails = ({ patient, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 max-w-2xl shadow-xl rounded-2xl bg-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Patient Details</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Basic Info Section */}
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-center space-x-4 mb-4">
              <User className="w-8 h-8 text-blue-600" />
              <div>
                <h4 className="text-2xl font-bold text-gray-900">{patient.name}</h4>
                <p className="text-gray-600">{patient.age} years • {patient.gender}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-white rounded-lg p-3">
                <span className="text-sm text-gray-600">Room</span>
                <p className="text-lg font-semibold">{patient.roomNumber}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <span className="text-sm text-gray-600">Bed</span>
                <p className="text-lg font-semibold">{patient.bedNumber}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <span className="text-sm text-gray-600">Floor</span>
                <p className="text-lg font-semibold">{patient.floorNumber}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Phone className="w-5 h-5 text-gray-600" />
              <h4 className="text-lg font-semibold">Contact Information</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-gray-600">Primary Contact</h5>
                <p className="text-gray-900">{patient.contactInformation}</p>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-600">Emergency Contact</h5>
                <p className="text-gray-900">{patient.emergencyContact}</p>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Heart className="w-5 h-5 text-red-600" />
                  <h4 className="text-lg font-semibold">Diseases</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {patient.diseases.map((disease, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm"
                    >
                      {disease}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <h4 className="text-lg font-semibold">Allergies</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((allergy, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;