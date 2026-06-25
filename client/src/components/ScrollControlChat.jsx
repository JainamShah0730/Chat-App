import React from "react";
import ScrollableFeed from "react-scrollable-feed"
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../config/ChatLogics.jsx";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({messages}) => {
  const {user} = ChatState();

  const formatTime = (dateString) => {
    if (!dateString) return "10:35 AM";
    const date = new Date(dateString);
    if (isNaN(date)) return "10:35 AM";
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ScrollableFeed className="px-2">
      {messages && messages.map((m, i) => {
        const isMyMessage = m.sender._id === user._id;
        const showAvatar = isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id);
        const initials = m.sender.name ? m.sender.name.substring(0, 2).toUpperCase() : 'U';

        return (
          <div className={`flex w-full ${isMyMessage ? 'justify-end' : 'justify-start'}`} key={m._id} style={{ marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10 }}>
            {!isMyMessage && (
              <div className="flex-shrink-0 mr-3 w-8 flex flex-col justify-start mt-1">
                {showAvatar ? (
                  <div 
                    className="h-8 w-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-medium text-xs shadow-sm"
                    title={m.sender.name}
                  >
                    {initials}
                  </div>
                ) : <div className="h-8 w-8" />}
              </div>
            )}
            
            <div className={`flex flex-col max-w-[75%] ${isMyMessage ? 'items-end' : 'items-start'}`}>
              <span
                className={`rounded-2xl px-5 py-2.5 text-sm shadow-sm ${
                  isMyMessage 
                    ? 'bg-[#0a4a3c] text-white rounded-br-sm' 
                    : 'bg-white text-gray-700 border border-gray-100 rounded-bl-sm'
                }`}
              >
                {m.content}
              </span>
              
              <span className="text-[10px] font-medium text-gray-400 mt-1 mb-1">
                {formatTime(m.createdAt)}
              </span>
            </div>
          </div>
        );
      })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;