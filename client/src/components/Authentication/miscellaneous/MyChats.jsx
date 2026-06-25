import React, { useEffect, useState } from 'react';
import { ChatState } from '../../../Context/ChatProvider';
import axios from 'axios';
import { useToast } from '../../ui/ToastContext';
import ChatLoading from '../../ChatLoading';
import { getSender } from '../../../config/ChatLogics';
import GroupChatModal from './GroupChatModal';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error?.response?.data?.message || "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };


  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <div className={`flex-col h-full w-full bg-white ${selectedChat ? "hidden md:flex" : "flex"}`}>
      
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-6 shrink-0">
        <h2 className="text-xl font-bold tracking-tight text-[#0a4a3c] font-sans">
          Messages
        </h2>
        <GroupChatModal>
          <button className="text-[#0a4a3c] hover:bg-emerald-50 p-1.5 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
          </button>
        </GroupChatModal>
      </div>
      
      {/* Chat List */}
      <div className="flex-grow flex flex-col px-4 pb-4 overflow-y-auto custom-scrollbar">
        {chats ? (
          <div className="flex flex-col gap-1">
            {chats.map((chat) => {
              const chatName = (!chat.isGroupChat && loggedUser) ? getSender(loggedUser, chat.users) : chat.chatName;
              const initials = chatName ? chatName.substring(0, 2).toUpperCase() : 'U';

              return (
              <div
                onClick={() => setSelectedChat(chat)}
                key={chat._id}
                className={`cursor-pointer px-4 py-3 rounded-xl transition-all flex items-center gap-4 ${
                  selectedChat === chat
                    ? "bg-[#0a4a3c] text-white"
                    : "bg-white text-gray-800 hover:bg-gray-50"
                }`}
              >
                <div className={`shrink-0 h-11 w-11 rounded-full flex items-center justify-center font-medium text-sm border ${
                  selectedChat === chat ? 'border-emerald-600 text-emerald-100 bg-[#083a2f]' : 'border-gray-200 text-gray-600 bg-gray-50'
                }`}>
                  {initials}
                </div>
                
                <div className="flex flex-col overflow-hidden">
                  <div className="font-semibold text-sm truncate">
                    {chatName}
                  </div>
                  {chat.latestMessage ? (
                    <div className={`text-[13px] mt-0.5 truncate ${selectedChat === chat ? "text-emerald-100/80" : "text-gray-500"}`}>
                      {chat.latestMessage.content}
                    </div>
                  ) : (
                    <div className={`text-[13px] mt-0.5 truncate ${selectedChat === chat ? "text-emerald-100/80" : "text-gray-500"}`}>
                      Start chatting!
                    </div>
                  )}
                </div>
              </div>
            )})}
          </div>
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  );
};

export default MyChats;
