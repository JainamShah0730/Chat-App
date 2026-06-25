import { FaBell } from "react-icons/fa";


function NotificationBadge({ count }) {
  return (
    <div className="relative inline-block">
      <FaBell size={25} />

      {count > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1 transform translate-x-1/4 -translate-y-1/4 z-10">
          {count}
        </div>
      )}
    </div>
  );
}

export default NotificationBadge;