import React ,{useState} from 'react'
import { VStack, Box, InputGroup  } from "@chakra-ui/react";
import { Field, Input, Button } from "@chakra-ui/react";

const Login = () => {
   const [show, setShow] = useState(false);
   
     
       const [email, setEmail] = useState()
       
       const [password, setpassword] = useState()
       
   
       const handleClick = () => setShow(!show)
    
       const submitHandler=()=>{}
   
   
     return (
        <VStack spacing='5px'color="black">
   
   <Field.Root id="login-email" required>
     <Field.Label>Email</Field.Label>
     <Input type='email' placeholder="Enter Email"
     onChange={(e)=> setEmail(e.target.value)} />
   </Field.Root>
   
   
   <Field.Root id="login-password">
     <Field.Label>Password</Field.Label>
     <InputGroup
      endElement={
             <Button h="1.75" size="sm" onClick={handleClick}>
               {show ? "Hide" : "Show"}
             </Button>
           }
           >
              <Input type={show ? "text" : "password"} onChange={(e) => setpassword(e.target.value)}/>
     </InputGroup>
   </Field.Root>
   
   
  
   
   <Button colorScheme="blue" width="100%" style={{marginTop:15}}
   onClick={submitHandler}>
       Login
   </Button>
   <Button 
   variant="solid"
   colorScheme="red"
   width="100%"
   onClick={() => {
    setEmail("guest@example.com");
    setpassword("123456")
   }}> 
    Get Guest User Credentials
   </Button>
   
       </VStack>
     )
}

export default Login 