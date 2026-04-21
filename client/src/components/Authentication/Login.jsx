import React, { useState } from "react";
import { VStack, InputGroup, Input, Button } from "@chakra-ui/react";
import { Field } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [show, setShow] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);

    if (!email || !password) {
      alert("Please fill all fields");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        { email, password },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );

      alert("Login Successful ✅");

      localStorage.setItem("userInfo", JSON.stringify(data));

      setLoading(false);
      navigate("/chats");
    } catch (error) {
      alert(error?.response?.data?.message || "Login failed ❌");
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <Field.Root id="login-email" required>
        <Field.Label>Email</Field.Label>
        <Input
          type="email"
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field.Root>

      <Field.Root id="login-password">
        <Field.Label>Password</Field.Label>
        <InputGroup
          endElement={
            <Button size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          }
        >
          <Input
            type={show ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputGroup>
      </Field.Root>

      <Button width="100%" mt={4} onClick={submitHandler} loading={loading}>
        Login
      </Button>

      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;