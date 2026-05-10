import React from 'react'
import { ViewIcon } from "@chakra-ui/icons"
import { IconButton, Image, Text, useDisclosure } from "@chakra-ui/react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    return(
        <>
         {children ? (
            <span onClick={onOpen}>{children}</span>
         ) : (
            <IconButton 
                display={{ base: "flex" }}
                icon={<ViewIcon />}
                onClick={onOpen}
            />
         )}

      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />

        <ModalContent height="410px">
          <ModalHeader fontSize="4xl" fontFamily="Work sans" display="flex" justifyContent="center">
            {user?.name}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody display="flex" flexDir="column" alignItems="center" justifyContent="space-between">
            <Image borderRadius="full" boxSize="150px" src={user?.pic} alt={user?.name} />
            <Text fontSize={{ base: "28px", md: "30px" }} fontFamily="work sans">
              Email: {user?.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

        </>
    )
}

export default ProfileModal