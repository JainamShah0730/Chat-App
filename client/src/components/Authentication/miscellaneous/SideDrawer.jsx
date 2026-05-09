import React from "react";
import { useState } from "react";
import { Box, Text, Tooltip, Menu, MenuButton } from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { Avatar, Button } from "@chakra-ui/react";
import { ChatState } from "../../../Context/ChatProvider";


const SideDrawer = () => {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState()
    const [Loading, setLoading]= useState(false)
    const [LoadingChat, setLoadingChat] = useState();
    
    const {user} = ChatState()


    return (
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
                <button variant="ghost">
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
                        <Avatar size="sm" cursor="pointer" name={user.name}/>
                     </MenuButton>
                </Menu>
            </div>
        </Box>
    )
}

export default SideDrawer