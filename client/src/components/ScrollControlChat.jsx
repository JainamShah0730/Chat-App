import React from "react";
import ScrollableFeed from "react-scrollable-feed"
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../config/ChatLogics.jsx";
import { ChatState } from "../Context/ChatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";


const ScrollableChat = ({messages}) => {
  const {user} = ChatState();

  return (
    <ScrollableFeed>
      {messages && messages.map((m, i) => {
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.sender.name || 'User')}&background=random`;
        const isMyMessage = m.sender._id === user._id;

        return (
          <div style={{display: 'flex'}} key={m._id}>
            {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={2}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic || avatarUrl}
                />
              </Tooltip>
            )}

            <span
              className={`rounded-2xl px-4 py-2 max-w-[75%] text-sm shadow-sm ${
                isMyMessage 
                  ? 'bg-emerald-800 text-white rounded-br-sm' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
              }`}
              style={{
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        );
      })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;