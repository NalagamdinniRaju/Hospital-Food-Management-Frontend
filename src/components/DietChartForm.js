
import React, { useState, useEffect } from 'react';
import { X, Save, User, Calendar, Coffee, Sun, Moon } from 'lucide-react';

const DietChartForm = ({ onSubmit, onCancel, dietChart, patients }) => {
  const initialMealState = {
    ingredients: '',
    instructions: ''
  };

  const [formData, setFormData] = useState({
    patientId: '',
    date: '',
    morning: { ...initialMealState },
    evening: { ...initialMealState },
    night: { ...initialMealState }
  });

  useEffect(() => {
    if (dietChart) {
      setFormData({
        ...dietChart,
        patientId: dietChart.patientId._id,
        date: new Date(dietChart.date).toISOString().split('T')[0],
        morning: {
          ingredients: dietChart.morning.ingredients.join(', '),
          instructions: dietChart.morning.instructions.join(', ')
        },
        evening: {
          ingredients: dietChart.evening.ingredients.join(', '),
          instructions: dietChart.evening.instructions.join(', ')
        },
        night: {
          ingredients: dietChart.night.ingredients.join(', '),
          instructions: dietChart.night.instructions.join(', ')
        }
      });
    }
  }, [dietChart]);

  const handleChange = (e, meal, field) => {
    if (meal) {
      setFormData({
        ...formData,
        [meal]: {
          ...formData[meal],
          [field]: e.target.value
        }
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      morning: {
        ingredients: formData.morning.ingredients.split(',').map(item => item.trim()),
        instructions: formData.morning.instructions.split(',').map(item => item.trim())
      },
      evening: {
        ingredients: formData.evening.ingredients.split(',').map(item => item.trim()),
        instructions: formData.evening.instructions.split(',').map(item => item.trim())
      },
      night: {
        ingredients: formData.night.ingredients.split(',').map(item => item.trim()),
        instructions: formData.night.instructions.split(',').map(item => item.trim())
      }
    };
    onSubmit(processedData);
  };

  const renderMealSection = (mealTime, title, icon, bgColor) => (
    <div className={`${bgColor} rounded-xl p-6 mb-6`}>
      <div className="flex items-center space-x-2 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Ingredients (comma-separated)
          </label>
          <div className="relative">
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              type="text"
              value={formData[mealTime].ingredients}
              onChange={(e) => handleChange(e, mealTime, 'ingredients')}
              placeholder="e.g., Rice, Dal, Vegetables"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Instructions (comma-separated)
          </label>
          <div className="relative">
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              rows="3"
              value={formData[mealTime].instructions}
              onChange={(e) => handleChange(e, mealTime, 'instructions')}
              placeholder="e.g., Serve hot, Add salt to taste"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 max-w-3xl shadow-xl rounded-2xl bg-white mb-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {dietChart ? 'Edit Diet Chart' : 'Create New Diet Chart'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient and Date Selection */}
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Patient Details</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Select Patient
                </label>
                <select
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                >
                  <option value="">Choose a patient</option>
                  {patients.map((patient) => (
                    <option key={patient._id} value={patient._id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Diet Chart Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Meal Sections */}
          {renderMealSection(
            'morning',
            'Morning Meal',
            <Coffee className="w-5 h-5 text-yellow-600" />,
            'bg-yellow-50'
          )}
          {renderMealSection(
            'evening',
            'Evening Meal',
            <Sun className="w-5 h-5 text-orange-600" />,
            'bg-orange-50'
          )}
          {renderMealSection(
            'night',
            'Night Meal',
            <Moon className="w-5 h-5 text-indigo-600" />,
            'bg-indigo-50'
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {dietChart ? 'Update Diet Chart' : 'Save Diet Chart'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DietChartForm;