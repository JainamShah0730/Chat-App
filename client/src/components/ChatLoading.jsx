import React from "react";

const ChatLoading = () => {
    return (
       <div className="flex flex-col gap-3 w-full">
         {[...Array(8)].map((_, i) => (
           <div key={i} className="h-[45px] w-full rounded-md bg-gray-200 animate-pulse" />
         ))}
       </div>
    )
}

export default ChatLoading