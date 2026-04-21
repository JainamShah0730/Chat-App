import React, {useState} from "react";
import { VStack, Box, InputGroup, useToastStyles  } from "@chakra-ui/react";
import { Field, Input, Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";

const Signup = () => {
    const [show, setShow] = useState(false);

    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [confirmpassword, setConfirmpassword] = useState()
    const [password, setpassword] = useState()
    const [pic, setPic] = useState()
    const [loading, setLoading]= useState(false)
    const toast= useToast();

    const handleClick = () => setShow(!show)
    const postDetail =(pics) => {
      setLoading(true);
      if(pic===undefined ){
        toast({
          title: "Please select an Image!",
          status: "waring",
          durantion: 5000,
          isClosable: true,
          position:"bottom",
        })

      }
     }
    const submitHandler=()=>{}


  return (
     <VStack spacing='5px'color="black">
    <Field.Root id="signup-name" required>
  <Field.Label>Name</Field.Label>
  <Input placeholder="Enter name" 
  onChange={(e) => setName(e.target.value)} />
</Field.Root>

<Field.Root id="signup-email" required>
  <Field.Label>Email</Field.Label>
  <Input type='email' placeholder="Enter Email"
  onChange={(e)=> setEmail(e.target.value)} />
</Field.Root>


<Field.Root id="signup-password">
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

<Field.Root id="signup-confirm-password" required>
  <Field.Label>Confirm Password</Field.Label>
  <InputGroup
   endElement={
          <Button h="1.75" size="sm" onClick={handleClick}>
            {show ? "Hide" : "Show"}
          </Button>
        }
        >
           <Input type={show ? "text" : "password"} onChange={(e) => setConfirmpassword(e.target.value)}/>
  </InputGroup>
</Field.Root>

<Field.Root id="signup-pic">
  <Field.Label>Upload your Picture</Field.Label>
  <Input  type="file" p={1.5} accept="image/*"
  onChange={(e)=> postDetail(e.target.files[0])} />
</Field.Root>

<Button colorScheme="blue" width="100%" style={{marginTop:15}}
onClick={submitHandler}>
    Sign Up
</Button>


    </VStack>
  )
}

export default Signup