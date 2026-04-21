import  { useEffect, useState } from 'react'
import axios from 'axios'
const ChatPage = () => {

    const [chats, setChats] = useState([]);

    const fetchChats = async () => {
        const {data} = await axios.get('/api/chat')
         console.log('chat API response', data)


        setChats(Array.isArray(data) ? data : data?.chats ?? []);

    }

    useEffect(() =>{
        fetchChats();
    }, []);

    return (
        <div>
            {/* {chats.map((chat) => ( <div key={chat.id}>{chat.chatName}</div>))} */}
         {(Array.isArray(chats) ? chats : []).map ((chat) => (<div key={chat.id}>{chat.chatName}</div>))}
        </div>
    )
}

export default ChatPage