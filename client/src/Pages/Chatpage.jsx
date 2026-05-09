import { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import axios from 'axios'
import { ChatState } from '../Context/ChatProvider'
import SideDrawer from '../components/Authentication/miscellaneous/SideDrawer'
import MyChats from '../components/Authentication/miscellaneous/MyChats'
import ChatBox from '../components/Authentication/miscellaneous/ChatBox'

const ChatPage = () => {

    const {user} = ChatState()
    return (
        <div style={{width:"100%"}}>
        {user && <SideDrawer/>}

        <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        height="91.5vh"
        padding="10px"
        >

            {user && <MyChats/>}
            {user && <ChatBox/>}
        </Box>
        </div>
    )
}

export default ChatPage