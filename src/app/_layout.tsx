
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "../../global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,

          contentStyle: {
            backgroundColor: "#0B0D12",
          },

          animation: "slide_from_right",

          gestureEnabled: true,
        }}
      />
    </SafeAreaProvider>
  );
}
