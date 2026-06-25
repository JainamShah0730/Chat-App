import { FaBell } from "react-icons/fa";
import { Box } from "@chakra-ui/react";

function NotificationBadge({ count }) {
  return (
    <Box position="relative" display="inline-block">
      <FaBell size={25} />

      {count > 0 && (
        <Box
          position="absolute"
          top="-2px"
          right="-2px"
          bg="red.500"
          color="white"
          fontSize="xs"
          borderRadius="full"
          px={2}
          py={1}
          transform="translate(25%, -25%)"
          zIndex={1}
        >
          {count}
        </Box>
      )}
    </Box>
  );
}

export default NotificationBadge;