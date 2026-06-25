import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/SignUp';

const Homepage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
   
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#111827] font-sans selection:bg-emerald-900 selection:text-white justify-center items-center p-4">
      
      {/* Brand Header */}
      <div className="flex justify-center bg-white w-full max-w-md p-4 mb-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-bold tracking-tight text-emerald-950 font-sans">
          RageBait
        </h1>
      </div>

      {/* Main Auth Card */}
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex mb-4 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          <button 
            className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === 'login' ? 'bg-[#064e3b] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === 'signup' ? 'bg-[#064e3b] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        <div className="pt-2">
          {activeTab === 'login' ? <Login /> : <Signup />}
        </div>
      </div>
    </div>
  );
};

export default Homepage;