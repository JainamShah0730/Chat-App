import React, { useEffect } from 'react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/SignUp';

const Homepage = () => {
  const navigate = useNavigate();
   
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
        <Tabs variant="enclosed" isFitted colorScheme="teal">
          <TabList className="mb-4">
            <Tab _selected={{ color: 'white', bg: '#064e3b' }} className="rounded-t-lg font-medium transition-colors">Login</Tab>
            <Tab _selected={{ color: 'white', bg: '#064e3b' }} className="rounded-t-lg font-medium transition-colors">Sign Up</Tab>
          </TabList>

          <TabPanels>
            <TabPanel className="p-0 pt-2">
              <Login />
            </TabPanel>

            <TabPanel className="p-0 pt-2">
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>

    </div>
  );
};

export default Homepage;