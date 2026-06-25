import React, { useState, useRef, useEffect } from "react";
import { ChatState } from "../../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../../ChatLoading";
import UserListItem from "../../UserAvatar/UserListItem";
import { getSender } from "../../../config/ChatLogics";
import { useToast } from "../../ui/ToastContext";
import { Spinner } from "../../ui/Spinner";
import { Drawer } from "../../ui/Drawer";


const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    
    // Dropdown states
    const [notifMenuOpen, setNotifMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    
    const notifRef = useRef();
    const profileRef = useRef();

    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    const Navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) setNotifMenuOpen(false);
            if (profileRef.current && !profileRef.current.contains(event.target)) setProfileMenuOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        Navigate("/");
    };

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleSearch = async () => {
        if (!search) {
           toast({
            title: "Please enter something in search",
            status: "warning",
            duration: 5000,
            position: "top-left"
           });
           return;
        }
        const startTime = Date.now();
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`/api/user?search=${search}`, config);
            const elapsed = Date.now() - startTime;
            const minDuration = 500;
            if (elapsed < minDuration) {
                await sleep(minDuration - elapsed);
            }
            const normalizedResults = Array.isArray(data) ? data : data?.users ?? [];
            setSearchResult(normalizedResults);
        } catch (error) {
            toast({
                title: "Error Occured",
                description: "Failed to load the search results",
                status: "error",
                duration: 5000,
                position: "bottom-left"
            });
        } finally {
            setLoading(false);
        }
    };
     
    const accessChat = async (userId) => {     
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.post("/api/chat", { userId }, config);
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            
            setSelectedChat(data);
            setLoadingChat(false);
            setIsOpen(false);
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error?.response?.data?.message || "Failed to fetch the chat",
                status: "error",
                duration: 5000,
                position: "bottom-left"
            });
            setLoadingChat(false);
        }
    };

    return (
        <>
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shrink-0">
          <div className="w-1/3 flex items-center">
            <div 
              className="flex items-center w-56 px-4 py-2 bg-gray-50 border border-gray-100 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <span className="text-sm text-gray-400 truncate">Search users...</span>
            </div>
          </div>
          
          <div className="flex-grow text-center text-2xl font-bold tracking-tight text-[#0a4a3c]">
            RageBait
          </div>
          
          <div className="w-1/3 flex items-center justify-end gap-6">
            
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                className="relative text-gray-400 hover:text-emerald-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {notification.length > 0 && (
                   <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#D4AF37] border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">{notification.length}</span>
                )}
              </button>
              
              {notifMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                   {!notification.length && <div className="px-4 py-2 text-sm text-gray-500">No New Messages</div>}
                   {notification.map((notif) => (
                       <div 
                         key={notif._id} 
                         className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                         onClick={() => {
                           setSelectedChat(notif.chat);
                           setNotification(notification.filter((n) => n !== notif));
                           setNotifMenuOpen(false);
                         }}
                       >
                           {notif.chat?.isGroupChat ? `New Message in ${notif.chat.chatName}` : `New Message from ${getSender(user, notif.chat.users)}`}
                       </div>
                  ))}
                </div>
              )}
            </div>
  
            <div className="relative" ref={profileRef}>
              <button onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
                <div className="flex items-center gap-2.5 cursor-pointer rounded-full transition-all bg-white">
                  <div className="h-8 w-8 rounded-full bg-[#0a4a3c] text-white flex items-center justify-center font-medium text-sm">
                     {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    My Profile
                  </span>
                </div>
              </button>
              
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                  <ProfileModal user={user}>
                    <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer w-full text-left">My Profile</div>
                  </ProfileModal>
                  <div className="h-px bg-gray-100 my-1"></div>
                  <button 
                    onClick={logoutHandler}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <Drawer title="Search Users" isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div className="flex gap-2 mb-4">
                <input 
                  type="text"
                  placeholder="Search by name or email" 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                />
                <button 
                  onClick={handleSearch} 
                  className="px-4 py-2 bg-[#0a4a3c] text-white rounded-md text-sm font-medium hover:bg-emerald-800 transition-colors"
                >
                    Go
                </button>
            </div>
            
            {loading ? (
                <ChatLoading/>
            ) : searchResult?.length > 0 ? (
                searchResult.map((user) => (
                    <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => accessChat(user._id)}
                    />
                ))
            ) : search ? (
                <div className="text-gray-500 text-sm mt-4 text-center">No users found</div>
            ) : null}

            {loadingChat && <div className="flex justify-center mt-4"><Spinner /></div>}
        </Drawer>
        </>
    );
};

export default SideDrawer;