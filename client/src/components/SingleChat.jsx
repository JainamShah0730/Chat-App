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
import io from "socket.io-client"
import Lottie from "lottie-react"
import animationData from "../Animation/Typing.json"

const ENDPOINT = import.meta.env.VITE_API_URL;
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  

       const [messages, setMessage] = useState([])
       const [loading, setLoading] = useState(false);
       const[newMessage, setNewMessage] = useState("")
       const[socketConnected, setSocketConnected] = useState(false)
       const[typing, setTyping] = useState(false)
       const[isTyping, setIsTyping] = useState(false)
    
    
    const defaultOption = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings:{
            preserveAspectRatio : "xMidYMid slice",
        }
    }
    
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
            socket.emit("stop Typing", selectedChat._id)
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

//   typing Indicator logic 
      if(!socketConnected) return

      if(!typing){
        setTyping(true) 
        socket.emit("typing", selectedChat._id)
      }
      let lastTypingTime = new Date().getTime()
      var timerLength = 3000;
      setTimeout (() => {
        var tiemNow = newDate().getTime()
        var timeDiff = timeNow - lastTypingTime

        if(timeDiff >= timerLength && typing){
            socket.emit("stop typing", selectedChat._id)
            setTyping(false)
        }
      }, timerLength)
       


    }


    return(
        <>
        {selectedChat ? (
            <> 
            <Text 
            fontSize={{ base: "28px", md: "30px"}}
            pb={3}
            px={2}
            w="100%" 
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between"}}
            alignItems="center">
                <IconButton display={{ base:"flex" , md:"none"}}
                icon={<ArrowBackIcon/>}
                onClick= {() => setSelectedChat("")}/>

                {!selectedChat.isGroupChat ? (
                    <>
                     {getSender (user, selectedChat.users)}
                     <ProfileModal user={getSenderFull (user, selectedChat.users)}/>
                    </> 
                ) : (
                     <> {selectedChat.chatName.toUpperCase()}
                     <UpdateGroupChatModal fetchAgain={fetchAgain}
                     setFetchAgain={setFetchAgain}
                     fetchMessages={fetchMessages}/>
                </>
                )}
            </Text>
             <Box display="flex"
             flexDir="column"
             justifyContent="flex-end"
             p={3}
             bg="#E8E8E8"
             w="100%"
             h="100%"
             borderRadius="lg"
             overflowY="hidden">
               

               {loading ? (
                <Spinner size="xl" w={20} 
                h={20} 
                alignSelf="center"
                margin="auto"/>
               ) : (
               <div className= "messages">
               <ScrollableChat messages={messages}/>
               </div>
               ) }
               <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                {isTyping ? ( <div><Lottie 
                animationData={animationData}
                loop={true}
                style={{marginBottom:15 , marginLeft:0, width: 70}}
                /></div>) :( <></> )}
                <Input 
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                onChange={typingHandler}
                value={newMessage}
                />
                

               </FormControl>
             </Box>
            </>
        ) : (
            <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                <Text fontSize ="3xl" pb={3} fontFamily="Work sans">
                    Click on user to start Chatting 
                </Text>
            </Box>
        
        )}
        </>
    )
}

export default SingleChat 