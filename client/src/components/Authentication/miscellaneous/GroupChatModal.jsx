import React from "react";
import { Button, Modal, ModalBody, ModalCloseButton, ModalHeader, ModalOverlay, useDisclosure ,  ModalFooter, ModalContent, Text } from "@chakra-ui/react";

const GroupChatModal = ({children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    
    return ( 
     <>
       <Button onClick={onOpen}>
           Open Modal
       </Button>
       <Modal isOpen={isOpen} onClose={onClose}>
           <ModalOverlay/>
           <ModalContent>
           <ModalHeader>Modal Title</ModalHeader>
           <ModalCloseButton/>
           <ModalBody>
             <Text>Sample text is here</Text>
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