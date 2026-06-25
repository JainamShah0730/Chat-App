import React, { useEffect, useState } from 'react';
import { ChatState } from '../../../Context/ChatProvider';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
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
      <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 shrink-0">
        <h2 className="text-xl font-bold tracking-tight text-emerald-950 font-sans">
          My Chats
        </h2>
        <GroupChatModal>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-sm font-medium transition-colors border border-emerald-100 shadow-sm">
            <span>New Group</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          </button>
        </GroupChatModal>
      </div>
      
      {/* Chat List */}
      <div className="flex-grow flex flex-col p-3 overflow-y-auto bg-gray-50/50">
        {chats ? (
          <div className="flex flex-col gap-2">
            {chats.map((chat) => (
              <div
                onClick={() => setSelectedChat(chat)}
                key={chat._id}
                className={`cursor-pointer px-4 py-3 rounded-xl transition-all shadow-sm border ${
                  selectedChat === chat
                    ? "bg-emerald-800 text-white border-emerald-900 shadow-emerald-900/20"
                    : "bg-white text-gray-800 border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                }`}
              >
                <div className="font-medium truncate">
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                </div>
                {chat.latestMessage && (
                  <div className={`text-xs mt-1 truncate ${selectedChat === chat ? "text-emerald-100" : "text-gray-500"}`}>
                    <b>{chat.latestMessage.sender.name}: </b>
                    {chat.latestMessage.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  );
};

export default MyChats;
