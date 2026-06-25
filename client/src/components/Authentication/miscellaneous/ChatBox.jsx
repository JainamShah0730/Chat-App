import React from "react";
import { ChatState } from "../../../Context/ChatProvider";
import SingleChat from "../../SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <div className={`w-full h-full ${selectedChat ? "block" : "hidden md:block"}`}>
      <div className="flex flex-col w-full h-full bg-white rounded-2xl">
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </div>
    </div>
  );
};

export default ChatBox;