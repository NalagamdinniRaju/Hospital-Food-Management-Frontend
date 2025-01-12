
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Utensils, ClipboardList, Truck, ChevronRight, Star, Shield, Clock } from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      switch (user.role) {
        case 'manager': navigate('/manager'); break;
        case 'pantry': navigate('/pantry'); break;
        case 'delivery': navigate('/delivery'); break;
        default: navigate('/login');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900">
              <span className="block">Streamline Your Hospital's</span>
              <span className="block text-blue-600">Food Management</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-500">
              Efficiently manage meal planning, inventory, and delivery tracking in your healthcare facility
              with our comprehensive food management system.
            </p>
            <div className="mt-8">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                {user ? 'Go to Dashboard' : 'Get Started'}
                <ChevronRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Utensils className="w-8 h-8 text-blue-600" />}
              title="Smart Meal Planning"
              description="Create personalized meal plans based on dietary requirements and medical conditions with our intelligent planning system."
            />
            <FeatureCard
              icon={<ClipboardList className="w-8 h-8 text-green-600" />}
              title="Inventory Control"
              description="Real-time tracking of food inventory levels, automated reordering, and waste reduction analytics."
            />
            <FeatureCard
              icon={<Truck className="w-8 h-8 text-purple-600" />}
              title="Delivery Management"
              description="Track meal deliveries in real-time and ensure timely service to every patient in your facility."
            />
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our System?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard
              icon={<Clock className="w-6 h-6 text-blue-600" />}
              title="Time Efficient"
              description="Save up to 40% of staff time with automated processes and streamlined workflows."
            />
            <BenefitCard
              icon={<Shield className="w-6 h-6 text-green-600" />}
              title="Safety First"
              description="Ensure food safety compliance with built-in monitoring and alert systems."
            />
            <BenefitCard
              icon={<Star className="w-6 h-6 text-yellow-600" />}
              title="Patient Satisfaction"
              description="Improve patient experience with accurate and timely meal delivery."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
    <div className="flex flex-col items-center text-center">
      <div className="p-3 bg-gray-50 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

const BenefitCard = ({ icon, title, description }) => (
  <div className="flex items-start p-6 bg-white rounded-lg shadow-md">
    <div className="flex-shrink-0">
      <div className="p-3 bg-gray-50 rounded-full">
        {icon}
      </div>
    </div>
    <div className="ml-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

export default LandingPage;