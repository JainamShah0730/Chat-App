import React from "react";
import { useState } from "react";
import { Box, Text, Tooltip, Menu, MenuButton, MenuItem, MenuList, MenuDivider, Drawer, useDisclosure, DrawerContent, DrawerHeader, DrawerOverlay, DrawerBody 
    , Input, 
    Toast,
    useToast
    
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
    const [searchResult, setSearchResult] = useState(null)
    const [loading, setLoading]= useState(false)
    const [LoadingChat, setLoadingChat] = useState();
    


    const {user} = ChatState()
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
                ) : searchResult === null ? (
                    <Text fontSize="sm" color="gray.500">Search for users by name or email</Text>
                ) : searchResult.length > 0 ? (
                    searchResult.map((userItem) => (
                        <UserListItem
                            key={userItem._id}
                            user={userItem}
                            handleFunction={() => accessChat(userItem._id)}
                        />
                    ))
                ) : (
                    <Text>No users found</Text>
                )}
            </DrawerBody>
             </DrawerContent>
        </Drawer>
        </>
    )
}

export default SideDrawer