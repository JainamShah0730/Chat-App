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


const SideDrawer = () => {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading]= useState(false)
    const [loadingChat, setLoadingChat] = useState();
    


    const {user , setSelectedChat, chats, setChats} = ChatState()
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
        <Box 
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="lightgray"
        width="100%"
        padding="5px 10px 5px 10px"
        borderwidth="5px"
        >
            <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
                <button variant="ghost" onClick={onOpen}>
                    <i className="fas fa-search"></i>
                 <Text display={{base:"none", md:"flex"}} px="4">
                 Search User
                 </Text>
                </button>
            </Tooltip>

            <Text fontSize="2xl" fontFamily="Work Sans">
                RageBait
            </Text>
            <div>
                <Menu>
                     <MenuButton p={1}>
                        <BellIcon fontSize="2xl" m={1}/>
                     </MenuButton>
                     {/* <MenuList></MenuList> */}

                </Menu>
                <Menu>
                     <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                        <Avatar size="sm" cursor="pointer" name={user?.name} src={user?.pic}/>
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
        </Box>

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