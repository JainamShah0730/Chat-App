import React from 'react';
import { CloseIcon } from '../ui/Icons';

const UserBadgeItem = ({user, handleFunction}) => {
    return (
       <div 
         className="px-2 py-1 m-1 mb-2 rounded-lg text-xs bg-emerald-600 text-white cursor-pointer inline-flex items-center gap-1 hover:bg-emerald-700 transition-colors"
         onClick={handleFunction}
       >
         {user.name}
         <CloseIcon className="w-3 h-3" />
       </div>
    )
}

export default UserBadgeItem 