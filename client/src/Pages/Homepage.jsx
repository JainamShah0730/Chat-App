import React from 'react'
import {Container ,Box, Text, Tabs} from '@chakra-ui/react'
import Login  from '../components/Authentication/Login';  
import Signup  from '../components/Authentication/SignUp';


const Homepage = ()=> {
    return <Container maxW='xl' centerContent>
        <Box 
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px">
            <Text fontSize="4xl" fontFamily="Work Sans" color="black">
                RageBait
            </Text>
        </Box>

        <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px"> 
             <Tabs.Root variant="enclosed" maxW="md" fitted defaultValue={"Login"}>
      <Tabs.List mb="1em">
        <Tabs.Trigger value="Login" width="50%">Login</Tabs.Trigger>
        <Tabs.Trigger value="Signup" width="50%">Sign Up</Tabs.Trigger>
       
      </Tabs.List>
      <Tabs.Content value="Login">
        <Login/>
      </Tabs.Content>

       <Tabs.Content value="Signup">
        <Signup/>
      </Tabs.Content>
    </Tabs.Root>
        </Box>

    </Container>
};

export default Homepage