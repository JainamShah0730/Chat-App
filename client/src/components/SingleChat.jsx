import React, { useEffect } from "react"
import { ChatState } from "../Context/ChatProvider";
import { Box, FormControl, IconButton, Input, Spinner, Text, Toast, useToast} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender,getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./Authentication/miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./Authentication/miscellaneous/UpdateGroupChatModal";
import { useState } from "react";
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
            isClosable:true,
            position:"bottom"
        })
    }
 }

//  console.log(messages)

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

    const sendMessage = async(event) => {
        if(event.key== "Enter" && newMessage){
            socket.emit("stop typing", selectedChat._id)
      try {
        const config ={
            headers: {
                "Content-Type" : "application/json",
                Authorization: `Bearer ${user.token}`,
            }
        }
              setNewMessage("")
        const {data} = await axios.post("/api/message",{
            content: newMessage,
            chatId: selectedChat._id,
        },
      config
    )

    //  console.log(data)

    socket.emit("new message",data)
     setMessage([...messages, data])
      }catch(error){
        toast({
            title:"Error Occured!",
            description:"Failed to send the Message",
            status:"error",
            duration:5000,
            isClosable: true,
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
        <>
        {selectedChat ? (
            <div className="flex flex-col h-full w-full"> 
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
                <div className="flex items-center gap-3">
                    <button 
                        className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                        onClick= {() => setSelectedChat("")}
                    >
                        <ArrowBackIcon w={5} h={5} />
                    </button>

                    {!selectedChat.isGroupChat ? (
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-emerald-950 font-sans">
                                {getSender(user, selectedChat.users)}
                            </span>
                            <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                        </div>
                    ) : (
                        <div className="flex items-center gap-3"> 
                            <span className="text-lg font-bold text-emerald-950 font-sans">
                                {selectedChat.chatName.toUpperCase()}
                            </span>
                            <UpdateGroupChatModal 
                                fetchAgain={fetchAgain}
                                setFetchAgain={setFetchAgain}
                                fetchMessages={fetchMessages}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
             <div className="flex-grow flex flex-col p-4 bg-gray-50/50 overflow-hidden relative">
               
               {loading ? (
                <div className="m-auto">
                    <Spinner size="xl" color="teal.600" w={20} h={20} />
                </div>
               ) : (
               <div className="flex flex-col overflow-y-auto w-full h-full custom-scrollbar pb-2">
                 <ScrollableChat messages={messages}/>
               </div>
               ) }
               
               <form 
                    onSubmit={(e) => { e.preventDefault(); sendMessage({ key: "Enter" }); }} 
                    className="mt-3 relative shrink-0"
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
                
                <div className="relative flex items-center">
                    <input 
                        type="text"
                        className="w-full pl-6 pr-12 py-3.5 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-sm transition-all text-gray-700 text-sm"
                        placeholder="Type a message..."
                        onChange={typingHandler}
                        onKeyDown={sendMessage}
                        value={newMessage}
                        required
                    />
                    <button 
                        type="button" 
                        onClick={() => sendMessage({ key: "Enter" })}
                        className="absolute right-2 p-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-full transition-colors shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                        </svg>
                    </button>
                </div>
               </form>
             </div>
            </div>
        ) : (
            <div className="flex items-center justify-center h-full w-full bg-gray-50/30">
                <div className="text-2xl text-gray-400 font-medium font-sans flex flex-col items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-emerald-800/20">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                    Click on a user to start chatting
                </div>
            </div>
        )}
        </>
    )
}

export default SingleChat 