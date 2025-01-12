

import React from 'react';
import { X } from 'lucide-react';

const DietChartDetails = ({ dietChart, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 max-w-2xl shadow-xl rounded-2xl bg-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Diet Chart Details</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Patient Info Section */}
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-blue-600">Patient Name</h4>
                <p className="text-lg font-semibold text-gray-900">{dietChart.patientId.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-600">Date</h4>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(dietChart.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Meals Section */}
          <div className="space-y-6">
            {['morning', 'evening', 'night'].map((meal) => (
              <div key={meal} className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-xl font-semibold text-gray-900 capitalize mb-4">
                  {meal} Meal
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-600 mb-2">Ingredients</h5>
                    <div className="flex flex-wrap gap-2">
                      {dietChart[meal].ingredients.map((ingredient, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-gray-200"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-600 mb-2">Instructions</h5>
                    <ul className="space-y-2">
                      {dietChart[meal].instructions.map((instruction, index) => (
                        <li key={index} className="text-gray-700 flex items-start">
                          <span className="inline-block w-6 text-gray-400">{index + 1}.</span>
                          {instruction}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietChartDetails;