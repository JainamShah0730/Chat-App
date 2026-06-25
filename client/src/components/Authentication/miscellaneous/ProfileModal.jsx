import React, { useState } from 'react';
import { ViewIcon } from "../../ui/Icons";
import { Modal } from "../../ui/Modal";
import { ChatState } from "../../../Context/ChatProvider";
import { useToast } from "../../ui/ToastContext";
import axios from "axios";

const ProfileModal = ({ user, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [picLoading, setPicLoading] = useState(false);
    
    const { user: loggedInUser, setUser } = ChatState();
    const toast = useToast();
    
    const isCurrentUser = loggedInUser?._id === user?._id;

    const handlePicChange = async (pic) => {
      if (!pic) return;
      if (pic.type !== "image/jpeg" && pic.type !== "image/png") {
        toast({ title: "Only JPG/PNG allowed", status: "warning" });
        return;
      }
      setPicLoading(true);
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "CHAT-APP");
      data.append("cloud_name", "dlp666xsd");

      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/dlp666xsd/image/upload", {
          method: "POST",
          body: data,
        });
        const cloudData = await res.json();
        
        const config = { headers: { Authorization: `Bearer ${loggedInUser.token}` } };
        const { data: updatedUser } = await axios.put("/api/user/update-pic", { pic: cloudData.secure_url }, config);
        
        setUser(updatedUser);
        localStorage.setItem("userInfo", JSON.stringify(updatedUser));
        toast({ title: "Profile picture updated!", status: "success" });
      } catch (error) {
        toast({ title: "Upload failed", status: "error" });
      } finally {
        setPicLoading(false);
      }
    };
    
    const handleRemovePic = async () => {
        setPicLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${loggedInUser.token}` } };
            const { data: updatedUser } = await axios.put("/api/user/update-pic", { pic: "" }, config);
            
            setUser(updatedUser);
            localStorage.setItem("userInfo", JSON.stringify(updatedUser));
            toast({ title: "Profile picture removed!", status: "success" });
        } catch (error) {
            toast({ title: "Remove failed", status: "error" });
        } finally {
            setPicLoading(false);
        }
    };

    return(
        <>
         {children ? (
            <span onClick={() => setIsOpen(true)}>{children}</span>
         ) : (
            <button 
                className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                onClick={() => setIsOpen(true)}
            >
                <ViewIcon />
            </button>
         )}

        <Modal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
          title="User Profile"
          footer={
            <button 
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium transition-colors"
            >
              Close
            </button>
          }
        >
          <div className="flex flex-col items-center justify-center py-6 gap-6">
            <h2 className="text-3xl font-bold text-gray-900 font-sans">{user?.name}</h2>
            <div className="relative group">
              {user?.pic ? (
                <>
                  <img 
                    className="w-32 h-32 rounded-full object-cover border-4 border-emerald-50 shadow-sm" 
                    src={user?.pic} 
                    alt={user?.name} 
                  />
                  {isCurrentUser && (
                    <button
                      type="button"
                      onClick={handleRemovePic}
                      disabled={picLoading}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-sm transition-colors focus:outline-none"
                      title="Remove image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </>
              ) : (
                <div className="w-32 h-32 rounded-full bg-emerald-100 flex items-center justify-center text-4xl text-emerald-800 font-bold border-4 border-emerald-50">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}

              {isCurrentUser && (
                <>
                  <div 
                    className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
                    onClick={() => !picLoading && document.getElementById("modal-profile-upload").click()}
                  >
                     {picLoading ? (
                        <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                     ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                     )}
                  </div>
                  <input
                    id="modal-profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePicChange(e.target.files[0])}
                  />
                </>
              )}
            </div>
            <p className="text-lg text-gray-600 font-sans">
              Email: {user?.email}
            </p>
          </div>
        </Modal>
        </>
    )
}

export default ProfileModal;