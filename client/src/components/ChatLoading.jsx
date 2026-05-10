import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

const ChatLoading = () => {
    return (
       <Stack spacing={3} width="100%">
         <Skeleton height="45px" width="100%" borderRadius="md" startColor="gray.100" endColor="gray.300"/>
         <Skeleton height="45px" width="100%" borderRadius="md" startColor="gray.100" endColor="gray.300"/>
         <Skeleton height="45px" width="100%" borderRadius="md" startColor="gray.100" endColor="gray.300"/>
         <Skeleton height="45px" width="100%" borderRadius="md" startColor="gray.100" endColor="gray.300"/>
         <Skeleton height="45px" width="100%" borderRadius="md" startColor="gray.100" endColor="gray.300"/>
         <Skeleton height="45px" width="100%" borderRadius="md" startColor="gray.100" endColor="gray.300"/>
         <Skeleton height="45px" width="100%" borderRadius="md" startColor="gray.100" endColor="gray.300"/>
         <Skeleton height="45px" width="100%" borderRadius="md" startColor="gray.100" endColor="gray.300"/>
       </Stack>
    )
}

export default ChatLoading