import React from "react";
import { useState } from "react";
import { Box, Text, Tooltip, Menu, MenuButton, MenuItem, MenuList, MenuDivider, Drawer, useDisclosure, DrawerContent, DrawerHeader, DrawerOverlay, DrawerBody 
    , Input, 
    Toast,
    useToast,
    Spinner
    
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { Avatar, Button } from "@chakra-ui/react";
import { ChatState } from "../../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../../ChatLoading";
import UserListItem from "../../UserAvatar/UserListItem";
import { getSender } from "../../../config/ChatLogics";
import NotificationBadge from "./NotificationBadge";

const SideDrawer = () => {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading]= useState(false)
    const [loadingChat, setLoadingChat] = useState();
    


    const {user , setSelectedChat, chats, setChats,notification,setNotification} = ChatState()
         const { isOpen, onOpen, onClose } = useDisclosure();


     const Navigate = useNavigate();
    
     const logoutHandler = () => {
        localStorage.removeItem("userInfo")
        Navigate("/");
    }

     const toast = useToast()
     
     const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

     const handleSearch = async () => {
        if(!search){
           toast({
            title: "Please enter something in search",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top-left"
           }) 
           return 
        }
        const startTime = Date.now()
        try{
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.get(`/api/user?search=${search}`, config)
            const elapsed = Date.now() - startTime
            const minDuration = 500
            if (elapsed < minDuration) {
                await sleep(minDuration - elapsed)
            }
            const normalizedResults = Array.isArray(data) ? data : data?.users ?? []
            setSearchResult(normalizedResults)
        }catch(error){
            toast({
                title: "Error Occured",
                description: "Failed to load the search results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })  
        } finally {
            setLoading(false)
        }

                 }
     
        const accessChat = async (userId) => {     
            try{
                setLoadingChat(true)
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
              }

              const {data} =  await axios.post("/api/chat", {userId}, config)
             
               if(!chats.find((c) =>c._id === data._id)) setChats([data, ...chats])
              
              setSelectedChat(data)
              setLoadingChat(false)
              onClose()
            
            
            } catch(error){
                toast({
                    title: "Error fetching the chat",
                    description: error?.response?.data?.message || "Failed to fetch the chat",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left"
                })

            }
        }

    return (
        <>
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shadow-sm shrink-0">
          
          {/* Search Input Trigger */}
          <div className="w-1/3">
            <div className="relative group max-w-xs cursor-pointer" onClick={onOpen}>
              <input 
                type="text" 
                placeholder="Search users..." 
                readOnly
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-full focus:ring-2 focus:ring-emerald-800 focus:bg-white focus:border-emerald-800 transition-all duration-300 outline-none text-sm cursor-pointer"
              />
              <span className="absolute left-4 top-3 text-gray-400 group-hover:text-emerald-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
            </div>
          </div>
          
          {/* App Title */}
          <div className="flex-grow text-center text-2xl font-bold tracking-tight text-emerald-950">
            RageBait
          </div>
          
          {/* User Profile & Notifications */}
          <div className="w-1/3 flex items-center justify-end gap-6">
            
            <Menu>
              <MenuButton className="relative text-gray-400 hover:text-emerald-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {notification.length > 0 && (
                   <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#D4AF37] border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">{notification.length}</span>
                )}
              </MenuButton>
              <MenuList pl={2}>
                 {!notification.length && "No New Messages"}
                 {notification.map((notif) => (
                     <MenuItem key={notif._id} onClick={() => {
                         setSelectedChat(notif.chat)
                         setNotification(notification.filter((n) => n !== notif))
                     }}>
                         {notif.chat?.isGroupChat ? `New Message in ${notif.chat.chatName}` : `New Message from ${getSender(user, notif.chat.users)}`}
                     </MenuItem>
                ))}
              </MenuList>
            </Menu>
  
            <Menu>
              <MenuButton>
                <div className="flex items-center gap-3 cursor-pointer p-1.5 pr-4 rounded-full border border-gray-100 hover:shadow-md transition-all bg-white">
                  <div className="h-8 w-8 rounded-full bg-emerald-900 text-white flex items-center justify-center font-medium text-sm overflow-hidden">
                     <img src={user.pic} alt={user.name} className="h-full w-full object-cover" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">
                    {user.name}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </MenuButton> 
              <MenuList>
                 <ProfileModal user={user}>
                    <MenuItem>My Profile</MenuItem>
                 </ProfileModal>
                 <MenuDivider />
                 <MenuItem onClick={logoutHandler}>
                     Logout
                 </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </header>

        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay/>
            <DrawerContent>
                <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>

            <DrawerBody>
                <Box display="flex" pb={2}>
                    <Input placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} style={{marginRight:"5px", padding:"5px", width:"100%"}}/>
                    <Button onClick={handleSearch} colorScheme="blue">
                        Go
                    </Button>
                </Box>
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
                    <Text>No users found</Text>
                ) : null}

                {loadingChat && <Spinner ml="auto" diplay="flex"/>}
            </DrawerBody>
             </DrawerContent>
        </Drawer>
        </>
    )
}

export default SideDrawer