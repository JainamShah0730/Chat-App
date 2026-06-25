import React, { useEffect, useState, useRef } from "react"
import { ChatState } from "../Context/ChatProvider";
import { Spinner } from "./ui/Spinner";
import { ArrowBackIcon } from "./ui/Icons";
import { useToast } from "./ui/ToastContext";
import { getSender,getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./Authentication/miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./Authentication/miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import "./Style.css"
import ScrollableChat from "./ScrollControlChat";
import io from "socket.io-client";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "../Animation/Typing.json";
const ENDPOINT = import.meta.env.VITE_API_URL;
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
       const [messages, setMessage] = useState([])
       const [loading, setLoading] = useState(false);
       const[newMessage, setNewMessage] = useState("")
       const[socketConnected, setSocketConnected] = useState(false)
       const[typing, setTyping] = useState(false)
       const[isTyping, setIsTyping] = useState(false)
       
       // File upload states
       const [fileUrl, setFileUrl] = useState("");
       const [fileType, setFileType] = useState("");
       const [fileName, setFileName] = useState("");
       const [fileUploadLoading, setFileUploadLoading] = useState(false);
       const fileInputRef = useRef(null);
    
       const toast = useToast()
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState()

 const fetchMessages = async () => {
    if(!selectedChat)return

    try{
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        }

        setLoading(true)
        const {data} = await axios.get(`/api/message/${selectedChat._id}`,
            config
        )
       
        setMessage(data)
        setLoading(false)

        socket.emit("join chat", selectedChat._id)
    }catch (error){
        toast({
            title:"Error Occured!",
            description:"Failed to load the Message",
            status:"error",
            duration:5000,
            position:"bottom"
        })
    }
 }

 useEffect(()=> {
      socket = io(ENDPOINT)
      socket.emit("setup",user)
      socket.on("connected", () => setSocketConnected(true))
      socket.on("typing",()=>setIsTyping(true))
      socket.on("stop typing", ()=> setIsTyping(false))
    },[])

 useEffect(() => {
    fetchMessages()

    selectedChatCompare = selectedChat
 }, [selectedChat]) 

 useEffect(() => {
    const messageRecievedHandler = (newMessageRecieved) => {
        if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
           if (!notification.includes(newMessageRecieved)) {
            setNotification([newMessageRecieved, ...notification]);
            setFetchAgain(!fetchAgain);
           }
        } else {
            setMessage([...messages, newMessageRecieved]);
        }
    };
    
    socket.on("message recieved", messageRecievedHandler);
    
    return () => {
        socket.off("message recieved", messageRecievedHandler);
    };
 });
 
 const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileUploadLoading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "CHAT-APP");
    data.append("cloud_name", "dlp666xsd");

    fetch("https://api.cloudinary.com/v1_1/dlp666xsd/auto/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setFileUrl(data.secure_url);
        setFileType(data.resource_type);
        setFileName(file.name);
        setFileUploadLoading(false);
      })
      .catch((err) => {
        toast({
          title: "Upload failed",
          status: "error",
          duration: 5000,
          position: "bottom",
        });
        setFileUploadLoading(false);
      });
  };

    const sendMessage = async(event) => {
        if(event.key== "Enter" && (newMessage || fileUrl)){
            socket.emit("stop typing", selectedChat._id)
      try {
        const config ={
            headers: {
                "Content-Type" : "application/json",
                Authorization: `Bearer ${user.token}`,
            }
        }
        
        const msgData = {
            content: newMessage,
            chatId: selectedChat._id,
            fileUrl,
            fileType,
            fileName
        };
        
        setNewMessage("")
        setFileUrl("");
        setFileType("");
        setFileName("");
        
        const {data} = await axios.post("/api/message", msgData, config)

    socket.emit("new message",data)
     setMessage([...messages, data])
      }catch(error){
        toast({
            title:"Error Occured!",
            description:"Failed to send the Message",
            status:"error",
            duration:5000,
            position:"bottom",
        })
      }
        }

    }

    const typingHandler = (e) => {
      setNewMessage(e.target.value)

      if(!socketConnected) return

      if(!typing){
        setTyping(true) 
        socket.emit("typing", selectedChat._id)
      }
      
      if (window.typingTimeout) clearTimeout(window.typingTimeout);
      
      window.typingTimeout = setTimeout(() => {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }, 3000);
    }


    return(
        <div className="flex flex-col h-full w-full">
        {selectedChat ? (
            <div className="flex flex-col h-full w-full"> 
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white shrink-0 border-b border-gray-50 rounded-t-2xl">
                <div className="flex items-center gap-4">
                    <button 
                        className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={() => setSelectedChat("")}
                    >
                        <ArrowBackIcon w={5} h={5} />
                    </button>

                    {!selectedChat.isGroupChat ? (
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-50 border border-gray-200 text-gray-600 flex items-center justify-center font-medium text-sm">
                                {getSender(user, selectedChat.users).substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-base font-bold text-[#0a4a3c] font-sans">
                                    {getSender(user, selectedChat.users)}
                                </span>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span> Active Now
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3"> 
                            <div className="h-10 w-10 rounded-full bg-gray-50 border border-gray-200 text-gray-600 flex items-center justify-center font-medium text-sm">
                                {selectedChat.chatName.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-base font-bold text-[#0a4a3c] font-sans">
                                    {selectedChat.chatName.toUpperCase()}
                                </span>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span> Active Now
                                </div>
                            </div>
                            <UpdateGroupChatModal 
                                fetchAgain={fetchAgain}
                                setFetchAgain={setFetchAgain}
                                fetchMessages={fetchMessages}
                            />
                        </div>
                    )}
                </div>
                
                {/* Header Right Icons */}
                <div className="flex items-center gap-3 text-gray-400">
                    <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                    <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </button>
                </div>
            </div>

            {/* Chat Area */}
             <div className="flex-grow flex flex-col px-6 py-4 bg-white overflow-hidden relative rounded-b-2xl">
               
               {loading ? (
                <div className="m-auto">
                    <Spinner className="w-20 h-20" colorClass="text-emerald-600" />
                </div>
               ) : (
               <div className="flex flex-col overflow-y-auto w-full h-full custom-scrollbar pb-2">
                 <ScrollableChat messages={messages}/>
               </div>
               ) }
               
               <form 
                    onSubmit={(e) => { e.preventDefault(); sendMessage({ key: "Enter" }); }} 
                    className="mt-4 relative shrink-0"
               >
                {isTyping && ( 
                  <div className="absolute -top-12 left-2">
                    <Player
                      autoplay
                      loop
                      src={animationData}
                      style={{ height: "40px", width: "70px" }}
                    />
                  </div>
                )}
                
                {fileUrl && (
                    <div className="absolute bottom-full left-4 mb-2 bg-white border border-gray-200 rounded-lg p-2 flex items-center gap-2 shadow-sm z-10">
                      <div className="flex flex-col max-w-[150px]">
                        <span className="text-xs font-medium text-gray-700 truncate">{fileName}</span>
                        <span className="text-[10px] text-gray-500">{fileType}</span>
                      </div>
                      <button type="button" onClick={() => { setFileUrl(""); setFileName(""); setFileType(""); }} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                )}
                
                <div className="relative flex items-center bg-gray-50 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-[#0a4a3c] transition-all border border-gray-100">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-gray-400 hover:text-gray-600 transition-colors p-2 relative">
                        {fileUploadLoading ? (
                           <Spinner className="w-5 h-5 text-emerald-600" />
                        ) : (
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                        )}
                        {fileUrl && !fileUploadLoading && (
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500"></span>
                        )}
                    </button>
                    
                    <input 
                        type="text"
                        className="w-full px-4 py-2 bg-transparent focus:outline-none text-sm text-gray-700 placeholder-gray-400"
                        placeholder={fileUrl ? "Add a message..." : "Type your message..."}
                        onChange={typingHandler}
                        onKeyDown={sendMessage}
                        value={newMessage}
                    />
                    
                    <button 
                        type="button" 
                        onClick={() => sendMessage({ key: "Enter" })}
                        disabled={!newMessage && !fileUrl}
                        className="flex items-center gap-2 bg-[#0a4a3c] hover:bg-[#07362b] text-white rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 -rotate-90">
                            <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                        </svg>
                    </button>
                </div>
               </form>
             </div>
            </div>
        ) : (
            <div className="flex flex-col flex-grow items-center justify-center h-full w-full bg-[#FDFBF7]/30 rounded-2xl">
                <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4 shadow-sm border border-emerald-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-800/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-emerald-950 tracking-tight">Welcome to RageBait</h2>
                <p className="text-sm text-gray-500 mt-2 font-medium">Click on a user to start chatting</p>
            </div>
        )}
        </div>
    )
}

export default SingleChat