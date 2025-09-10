import { Tabs } from "expo-router";
import { CircleInfoIcon, HomeIcon, OutIcon } from "../../components/Layout/Icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
       <Tabs.Screen
        name="salida"
        options={{
          title: "Salidas",
          tabBarIcon: ({ color }) => <OutIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color }) => <CircleInfoIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
