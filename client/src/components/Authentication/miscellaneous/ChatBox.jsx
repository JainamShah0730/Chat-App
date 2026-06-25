import React from "react";
import { ChatState } from "../../../Context/ChatProvider";
import SingleChat from "../../SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <div className={`flex-col flex-grow bg-white w-full h-full ${selectedChat ? "flex" : "hidden md:flex"}`}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default ChatBox;