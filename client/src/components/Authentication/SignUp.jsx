import React, { useState } from "react";
import { VStack, InputGroup, Input, Button } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [show, setShow] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleClick = () => setShow(!show);

  // ✅ IMAGE UPLOAD
  const postDetail = (pics) => {
    setLoading(true);

    if (!pics) {
      alert("Please select an image");
      setLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "CHAT-APP");
      data.append("cloud_name", "dlp666xsd");

      fetch("https://api.cloudinary.com/v1_1/dlp666xsd/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.secure_url);
          console.log("Uploaded:", data.secure_url);
          setLoading(false);
        })
        .catch(() => {
          alert("Upload failed");
          setLoading(false);
        });
    } else {
      alert("Only JPG/PNG allowed");
      setLoading(false);
    }
  };

  // ✅ SUBMIT
  const submitHandler = async () => {
    setLoading(true);

    if (!name || !email || !password || !confirmpassword) {
      alert("Please fill all fields");
      setLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/user", // ✅ FIXED
        { name, email, password, pic },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );

      alert("Registration Successful ✅");

      localStorage.setItem("userInfo", JSON.stringify(data));

      setLoading(false);
      navigate("/chats");
    } catch (error) {
      alert(
        error?.response?.data?.message || "Something went wrong ❌"
      );
      setLoading(false);
    }
  };

  return (
    <VStack spacing="10px">
      <Input placeholder="Name" onChange={(e) => setName(e.target.value)} />

      <Input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <InputGroup
  endElement={
    <Button size="sm" onClick={handleClick}>
      {show ? "Hide" : "Show"}
    </Button>
  }
>
  <Input
    type={show ? "text" : "password"}
    placeholder="Password"
    onChange={(e) => setPassword(e.target.value)}
  />
</InputGroup>

      <InputGroup
  endElement={
    <Button size="sm" onClick={handleClick}>
      {show ? "Hide" : "Show"}
    </Button>
  }
>
  <Input
    type={show ? "text" : "password"}
    placeholder="Confirm Password"
    onChange={(e) => setConfirmpassword(e.target.value)}
  />
</InputGroup>
      {/* FILE INPUT */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => postDetail(e.target.files[0])}
      />

      {/* PREVIEW */}
      {pic && <img src={pic} alt="preview" width="100" />}

      <Button onClick={submitHandler} loading={loading} width="100%">
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;