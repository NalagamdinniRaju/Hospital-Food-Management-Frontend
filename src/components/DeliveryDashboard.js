

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Truck, Filter, Package, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import io from 'socket.io-client';

const REACT_APP_API_URL = "https://hospital-food-manager-backend.onrender.com";

const DeliveryDashboard = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [socket, setSocket] = useState(null);

  
  useEffect(() => {
    fetchDeliveries();
    const newSocket = io(REACT_APP_API_URL);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('deliveryUpdated', (updatedDelivery) => {
        setDeliveries((prevDeliveries) =>
          prevDeliveries.map((delivery) =>
            delivery._id === updatedDelivery._id ? updatedDelivery : delivery
          )
        );
      });

      socket.on('newDelivery', (newDelivery) => {
        setDeliveries((prevDeliveries) => [...prevDeliveries, newDelivery]);
      });
    }
  }, [socket]);

  useEffect(() => {
    filterDeliveries();
  }, [deliveries, statusFilter]);

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

  const filterDeliveries = () => {
    if (statusFilter === 'all') {
      setFilteredDeliveries(deliveries);
    } else {
      setFilteredDeliveries(deliveries.filter(delivery => delivery.status === statusFilter));
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


  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ready': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivering': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'ready': return <Package className="w-4 h-4" />;
      case 'delivering': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
            Delivery Dashboard
          </h1>
          <div className="flex items-center space-x-4 bg-white p-2 rounded-lg shadow-sm">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Deliveries</option>
              <option value="pending">Pending</option>
              <option value="ready">Ready</option>
              <option value="delivering">Delivering</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeliveries.map((delivery) => (
            <div key={delivery._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {delivery.dietChartId.patientId.name}
                  </h2>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
                    {getStatusIcon(delivery.status)}
                    <span className="ml-2 capitalize">{delivery.status}</span>
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Package className="w-5 h-5 mr-2" />
                    <span>Room {delivery.dietChartId.patientId.roomNumber}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2" />
                    <span className="capitalize">{delivery.mealType} Meal</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Meal Details</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Ingredients:</span> {delivery.dietChartId[delivery.mealType].ingredients.join(', ')}</p>
                    <p><span className="font-medium">Instructions:</span> {delivery.dietChartId[delivery.mealType].instructions.join(', ')}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <select
                    value={delivery.status}
                    onChange={(e) => updateDeliveryStatus(delivery._id, e.target.value)}
                    className="block w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="delivering">Delivering</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;