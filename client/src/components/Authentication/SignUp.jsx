import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleClick = () => setShow(!show);

  const postDetail = (pics) => {
    setLoading(true);

    if (!pics) {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
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
          setLoading(false);
        })
        .catch(() => {
          toast({
            title: "Upload failed",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
        });
    } else {
      toast({
        title: "Only JPG/PNG allowed",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      toast({
        title: "Passwords do not match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        { headers: { "Content-type": "application/json" } }
      );

      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: error.response?.data?.message || "Registration failed",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4 mt-2" onSubmit={submitHandler}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          placeholder="Enter Name"
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-sm"
          onChange={(e) => setName(e.target.value)}
          value={name}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          placeholder="Enter Email"
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-sm"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            className="w-full pl-4 pr-16 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-sm"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-2 flex items-center px-2 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
            onClick={handleClick}
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full pl-4 pr-16 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-sm"
            onChange={(e) => setConfirmpassword(e.target.value)}
            value={confirmpassword}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-2 flex items-center px-2 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
            onClick={handleClick}
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture (Optional)</label>
        <input
          type="file"
          accept="image/*"
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
          onChange={(e) => postDetail(e.target.files[0])}
        />
        {pic && (
          <div className="mt-3 flex justify-center">
             <img src={pic} alt="preview" className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-sm" />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-2 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-medium shadow-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        ) : (
          "Sign Up"
        )}
      </button>
    </form>
  );
};

export default Signup;