import { useState } from "react";
import ChatBox from "../components/Authentication/miscellaneous/ChatBox";
import MyChats from "../components/Authentication/miscellaneous/MyChats";
import SideDrawer from "../components/Authentication/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";

const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user, selectedChat } = ChatState();

  return (
    // Main Background: Soft Ivory/White for a clean canvas
    <div className="flex flex-col h-screen bg-[#F9F7F3] text-[#111827] font-sans selection:bg-emerald-900 selection:text-white overflow-hidden">
      
      {/* Header Bar */}
      {user && <SideDrawer />}

      {/* Main Chat Workspace */}
      <main className="flex-grow flex p-6 gap-6 max-w-screen-2xl mx-auto w-full overflow-hidden">
        
        {/* Sidebar Container */}
        {user && (
          <aside className={`flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${selectedChat ? "hidden md:flex" : "flex"} w-full md:w-1/3 md:max-w-sm shrink-0`}>
            <MyChats fetchAgain={fetchAgain} />
          </aside>
        )}

        {/* Main Chat Area Container */}
        {user && (
          <section className={`flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative ${selectedChat ? "flex" : "hidden md:flex"} flex-grow w-full md:w-auto`}>
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </section>
        )}
        
      </main>
    </div>
  );
};

export default ChatPage;