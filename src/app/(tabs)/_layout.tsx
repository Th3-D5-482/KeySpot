import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Image } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0B0B0F",
          borderTopColor: "#25252D",
          borderTopWidth: 1,
          height: 68,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#777781",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: 600,
        },
        tabBarItemStyle: {
          borderRadius: 16,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../../assets/images/KeySpot/icons/home_filled.png")
                  : require("../../../assets/images/KeySpot/icons/home_outlined.png")
              }
              style={{
                width: 20,
                height: 25,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="transpose"
        options={{
          title: "Transpose",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "swap-horizontal" : "swap-horizontal-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="result"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}