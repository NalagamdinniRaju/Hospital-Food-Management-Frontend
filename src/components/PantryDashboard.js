

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CheckCircle2, Utensils, Clock, Package, AlertTriangle } from 'lucide-react';
import io from 'socket.io-client';

const REACT_APP_API_URL = "https://hospital-food-manager-backend.onrender.com";

const PantryDashboard = () => {
  const [dietCharts, setDietCharts] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchDietCharts();
    fetchDeliveries();
    const newSocket = io(REACT_APP_API_URL);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('dietChartUpdated', (updatedDietChart) => {
        setDietCharts((prevDietCharts) =>
          prevDietCharts.map((dietChart) =>
            dietChart._id === updatedDietChart._id ? updatedDietChart : dietChart
          )
        );
      });

      socket.on('deliveryUpdated', (updatedDelivery) => {
        setDeliveries((prevDeliveries) =>
          prevDeliveries.map((delivery) =>
            delivery._id === updatedDelivery._id ? updatedDelivery : delivery
          )
        );
      });
    }
  }, [socket]);

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

  const fetchDeliveries = async () => {
    try {
      const response = await axios.get(`${REACT_APP_API_URL}/api/deliveries`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDeliveries(response.data);
    } catch (error) {
      toast.error('Failed to fetch deliveries');
    }
  };

  const createDelivery = async (dietChartId, mealType) => {
    try {
      await axios.post(
        `${REACT_APP_API_URL}/api/deliveries`,
        { dietChartId, mealType },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Delivery created successfully');
      fetchDeliveries();
    } catch (error) {
      toast.error('Failed to create delivery');
    }
  };

  const updateDeliveryStatus = async (deliveryId, status) => {
    try {
      await axios.put(
        `${REACT_APP_API_URL}/api/deliveries/${deliveryId}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Delivery status updated successfully');
      fetchDeliveries();
    } catch (error) {
      toast.error('Failed to update delivery status');
    }
  };

  const getDeliveryStatus = (dietChartId, mealType) => {
    const delivery = deliveries.find(
      (d) => d.dietChartId._id === dietChartId && d.mealType === mealType
    );
    return delivery ? delivery.status : 'Not created';
  };


  const getMealStatusColor = (status) => {
    switch (status) {
      case 'Not created': return 'bg-gray-100 text-gray-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4 mb-8">
          <Utensils className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Pantry Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dietCharts.map((dietChart) => (
            <div key={dietChart._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {dietChart.patientId.name}
                  </h2>
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-100 text-blue-800 text-sm">
                    Room {dietChart.patientId.roomNumber}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Date: {new Date(dietChart.date).toLocaleDateString()}
                </p>

                <div className="space-y-6">
                  {['morning', 'evening', 'night'].map((mealType) => (
                    <div key={mealType} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-medium capitalize text-gray-900">
                          {mealType} Meal
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMealStatusColor(getDeliveryStatus(dietChart._id, mealType))}`}>
                          {getDeliveryStatus(dietChart._id, mealType)}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <p><span className="font-medium">Ingredients:</span> {dietChart[mealType].ingredients.join(', ')}</p>
                        <p><span className="font-medium">Instructions:</span> {dietChart[mealType].instructions.join(', ')}</p>
                      </div>

                      {getDeliveryStatus(dietChart._id, mealType) === 'Not created' ? (
                        <button
                          onClick={() => createDelivery(dietChart._id, mealType)}
                          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 w-full justify-center"
                        >
                          <Package className="w-4 h-4 mr-2" />
                          Create Delivery
                        </button>
                      ) : (
                        <button
                          onClick={() => updateDeliveryStatus(
                            deliveries.find(d => d.dietChartId._id === dietChart._id && d.mealType === mealType)._id,
                            'ready'
                          )}
                          disabled={getDeliveryStatus(dietChart._id, mealType) === 'ready'}
                          className={`mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg w-full justify-center transition-colors duration-200 ${
                            getDeliveryStatus(dietChart._id, mealType) === 'ready'
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Mark as Ready
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PantryDashboard;