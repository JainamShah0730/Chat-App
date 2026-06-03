import { Box } from '@chakra-ui/react'
import React from 'react'
import { CloseIcon } from '@chakra-ui/icons'

const UserBadgeItem = ({user, handleFunction}) => {
    return (
       <Box 
       px={2}
       py={2}
       borderRadius="lg"
       m={1}
       mb={2}
       fontSize={12}
       background="purple.500"
       color="white"
       cursor="pointer"
       onClick={handleFunction}
       >
         {user.name}
         <CloseIcon pl={1}/>

       </Box>
    )
}

export default UserBadgeItem 