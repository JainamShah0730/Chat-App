import React, { useState } from "react";
import { ChatState } from "../../../Context/ChatProvider";
import UserBadgeItem from "../../UserAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../../UserAvatar/UserListItem";
import { useToast } from "../../ui/ToastContext";
import { Modal } from "../../ui/Modal";
import { ViewIcon } from "../../ui/Icons";
import { Spinner } from "../../ui/Spinner";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameloading] = useState(false);
     
    const toast = useToast();
    const { user, selectedChat, setSelectedChat } = ChatState();
    
    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: "User already in group",
                status: "error",
                duration: 5000,
                position: "bottom",
            });
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                position: "bottom",
            });
            return;
        }
   
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put("/api/chat/groupadd", {
                chatId: selectedChat._id,
                userId: user1._id,
            }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) { 
            toast({
                title: "Error Occured",
                description: error.response?.data?.message || error.message || "Something went wrong",
                status: "error",
                duration: 5000,
                position: "bottom",
            });
            setLoading(false);
        }
    };
    
    const handleRemove = async (user1) => { 
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                position: "bottom",
            });
            return;
        } 
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put("/api/chat/groupremove", {
                chatId: selectedChat._id,
                userId: user1._id,
            }, config);
      
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured",
                description: error.response?.data?.message || error.message || "Something went wrong",
                status: "error",
                duration: 5000,
                position: "bottom",
            });
            setLoading(false);
        }
    };
    
    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameloading(true);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put("/api/chat/rename", {
                chatId: selectedChat._id,
                chatName: groupChatName,
            }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameloading(false);
        } catch (error) {
           toast({
            title: "Error occured",
            description: error.response?.data?.message || error.message || "Something went wrong",
            status: "error",
            duration: 5000,
            position: "bottom"
           });
           setRenameloading(false);
        }
        setGroupChatName("");
    };

    const handleSearch = async (query) => {
      setSearch(query);
      if (!query) return;

      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`/api/user?search=${query}`, config);
        setLoading(false);
        setSearchResult(data);
      } catch (error) {
          toast({
                title: "Error Occured",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                position: "bottom-left",
          });
          setLoading(false);
      }
    };
    
    return (
        <>
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 bg-gray-50 border border-gray-200"
        >
            <ViewIcon />
        </button>
        
        <Modal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
          title={selectedChat.chatName}
          footer={
            <button 
              onClick={() => handleRemove(user)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              Leave Group
            </button>
          }
        >
            <div className="flex flex-col gap-4">
               <div className="flex flex-wrap w-full gap-1 mb-2">
                {selectedChat.users.map((u) => (
                    <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)}/>
                ))}
               </div>

               <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Chat Name"
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)} 
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                />
                <button 
                  onClick={handleRename}
                  disabled={renameloading}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                    {renameloading ? <Spinner className="w-5 h-5 text-white" /> : "Update"}
                </button>
               </div>
               
               <div>
                <input 
                  type="text"
                  placeholder="Add User to group"
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                />
               </div>
               
               <div className="flex flex-col w-full">
                {loading ? (
                    <div className="flex justify-center py-4"><Spinner /></div>
                ) : (
                    searchResult?.map((user) => (
                        <UserListItem 
                          key={user._id}
                          user={user}
                          handleFunction={() => handleAddUser(user)} 
                        />
                    ))
                )}
               </div>
            </div>
        </Modal>
        </>
    );
};

export default UpdateGroupChatModal;