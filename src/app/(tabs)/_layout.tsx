
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Image } from "react-native";

export const unstable_settings = {
  anchor: "home",
};

export default function TabsLayout() {
  return (
    <Tabs
      backBehavior="initialRoute"
      screenOptions={{
        headerShown: false,

        sceneStyle: {
          backgroundColor: "#0B0D12",
        },

        tabBarStyle: {
          backgroundColor: "#171B23",
          borderTopColor: "#293241",
          borderTopWidth: 1,
          height: 76,
          paddingTop: 10,
          paddingBottom: 12,
          elevation: 0,
        },

        tabBarActiveTintColor: "#34D399",
        tabBarInactiveTintColor: "#8491A5",

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 3,
        },

        tabBarItemStyle: {
          borderRadius: 16,
        },

        tabBarIconStyle: {
          marginTop: 1,
        },
      }}
    >
      {/* Home */}
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
                width: 21,
                height: 25,
                tintColor: focused ? "#34D399" : "#8491A5",
              }}
              resizeMode="contain"
            />
          ),
        }}
      />

      {/* Transpose */}
      <Tabs.Screen
        name="transpose"
        options={{
          title: "Transpose",

          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              name={
                focused
                  ? "swap-horizontal"
                  : "swap-horizontal-outline"
              }
              size={23}
              color={focused ? "#34D399" : "#8491A5"}
            />
          ),
        }}
      />

      <Tabs.Screen name="result" options={{
        tabBarItemStyle: {
          display: "none"
        }
      }} />
      <Tabs.Screen name="outcome" options={{
        tabBarItemStyle: {
          display: "none"
        }
      }} />
    </Tabs>
  );
}
