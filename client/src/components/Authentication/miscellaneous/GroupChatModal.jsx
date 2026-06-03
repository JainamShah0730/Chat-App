import React, { use, useState } from "react";
import {  Button, Modal, ModalBody, ModalCloseButton, ModalHeader, ModalOverlay, useDisclosure ,  ModalFooter, ModalContent, Text, useToast, FormControl, Input } from "@chakra-ui/react";
import { ChatState } from "../../../Context/ChatProvider";
const GroupChatModal = ({children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setselectedUsers] = useState([])
    const [search, setSearch] = useState("")
    const[searchResult, setSearchResult]= useState([])
    const [loading, setLoading] = useState(false);


    const toast = useToast()
  
     const { user, chats , setChats} = ChatState(); 
    const handleSearch = () => {}

    return ( 
     <>
       <Button onClick={onOpen}>
           Open Modal
       </Button>
       <Modal isOpen={isOpen} onClose={onClose}>
           <ModalOverlay/>
           <ModalContent  >
           <ModalHeader fontSize="35px"
           fontFamily="Work sans"
           display="flex"
           justifyContent="center">Create Group Chat</ModalHeader>
           <ModalCloseButton/>
           <ModalBody diplay="flex" flexDir="column" alignItems="center">
              <FormControl>
                 <Input placeholder=" Chat Name" mb={3} onChange={(e) => setGroupChatName(e.target.value)} />
              </FormControl>
              <FormControl>
                <Input placeholder=" Add Users eg: Jainam, Aryan, Teerth" 
                mb={1} 
                onChange={(e) => handleSearch(e.target.value)} />
              </FormControl>
               
                {/* render searched users here  */}

           </ModalBody>

           <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
            </Button>

            <Button variant="ghost"> Secondary Action</Button>
           </ModalFooter>
        </ModalContent>

       </Modal>
     </>
    )
}

export default GroupChatModal