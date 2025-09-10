

import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from '@expo/vector-icons/Ionicons';

export const CircleInfoIcon = (props) => (
  <FontAwesome6 name="circle-info" size={24} color="black" {...props} />
);

export const HomeIcon = (props) => (
  <FontAwesome name="home" size={32} color="white" {...props} />
);

export const InfoIcon = (props) => (
  <FontAwesome name="info" size={32} color="white" {...props} />
);

export const OutIcon = (props) => (
  <FontAwesome6 name="person-walking-arrow-right" size={25} color="white" {...props} />
);

export const GameIcon = (props) => (
  <FontAwesome name="gamepad" size={32} color="white" {...props} />
);

export const NotificationIcon = ({ color = 'black', ...props }) => (
  <Ionicons name="notifications" size={32} color={color} {...props} />
);

export const UserIcon = (props) => (
  <FontAwesome name="user-circle-o" size={32} color="black" {...props} />
);
