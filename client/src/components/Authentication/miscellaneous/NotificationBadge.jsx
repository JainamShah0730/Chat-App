import { FaBell } from "react-icons/fa";

function NotificationBadge({ count }) {
  return (
    <div className="relative inline-block">
      <FaBell size={25} />

      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
          {count}
        </span>
      )}
    </div>
  );
}

export default NotificationBadge;