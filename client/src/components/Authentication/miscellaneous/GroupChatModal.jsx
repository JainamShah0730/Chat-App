import React, { useState } from "react";
import { ChatState } from "../../../Context/ChatProvider";
import axios from "axios";
import UserBadgeItem from "../../UserAvatar/UserBadgeItem";
import UserListItem from "../../UserAvatar/UserListItem";
import { useToast } from "../../ui/ToastContext";
import { Modal } from "../../ui/Modal";

const GroupChatModal = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();
    const { user, chats, setChats } = ChatState(); 

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

    const handleSubmit = async () => {
      if (!groupChatName || selectedUsers.length === 0) {
        toast({
          title: "Please fill all the fields",
          status: "warning",
          duration: 5000,
          position: "top",
        });
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.post("/api/chat/group", {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        }, config);
        
        setChats([data, ...chats]);
        setIsOpen(false);
        toast({
          title: "New Group Chat Created!",
          status: "success",
          duration: 5000,
          position: "bottom"
        });
      } catch (error) {  
         toast({
          title: "Failed to create the Chat!",
          description: error.response?.data || "Server error",
          status: "error",
          duration: 5000,
          position: "bottom"
         });
      }
    };
    
    const handleDelete = (delUser) => {
      setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };
    
    const handleGroup = (userToAdd) => {
        if (selectedUsers.some((u) => u._id === userToAdd._id)) {
            toast({
                title: "User already added",        
                status: "warning",
                duration: 5000,
                position: "top",
            });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    return ( 
     <>
       <span onClick={() => setIsOpen(true)}>
           {children || <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium">Open Modal</button>}
       </span>

       <Modal 
         isOpen={isOpen} 
         onClose={() => setIsOpen(false)} 
         title="Create Group Chat"
         footer={
            <button 
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#0a4a3c] hover:bg-emerald-800 text-white rounded-md text-sm font-medium transition-colors"
            >
              Create Chat
            </button>
         }
       >
         <div className="flex flex-col gap-4">
           <div>
             <input 
               type="text"
               placeholder="Chat Name"
               onChange={(e) => setGroupChatName(e.target.value)}
               className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
             />
           </div>
           
           <div>
             <input 
               type="text"
               placeholder="Add Users eg: Jainam, Aryan, Teerth"
               onChange={(e) => handleSearch(e.target.value)}
               className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
             />
           </div>
           
           <div className="flex flex-wrap w-full gap-1">
             {selectedUsers.map((u) => (
                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)}/>
             ))}
           </div>

           <div className="flex flex-col w-full">
             {loading ? (
                <div className="text-center py-4 text-sm text-gray-500 animate-pulse">loading...</div>
             ) : (
                searchResult?.slice(0,4).map(user => (
                    <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                ))
             )}
           </div>
         </div>
       </Modal>
     </>
    );
};

export default GroupChatModal;