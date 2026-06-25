import React from "react";

const UserListItem = ({ user, handleFunction }) => {
    return(
       <div 
         onClick={handleFunction} 
         className="flex items-center w-full px-3 py-2 mb-2 bg-gray-100 hover:bg-[#0a4a3c] hover:text-white text-gray-800 rounded-lg cursor-pointer transition-colors"
       >
         {user.pic ? (
            <img src={user.pic} alt={user.name} className="w-8 h-8 rounded-full mr-3 object-cover" />
         ) : (
            <div className="w-8 h-8 rounded-full mr-3 bg-emerald-600 text-white flex items-center justify-center font-medium text-sm">
                {user.name.charAt(0).toUpperCase()}
            </div>
         )}
         <div className="flex flex-col">
             <span className="font-medium text-sm">{user.name}</span>
             <span className="text-xs opacity-90"><b>Email:</b> {user.email}</span>
         </div>
       </div>
    )
}

export default UserListItem