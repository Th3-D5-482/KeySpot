import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/screens/home");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-black items-center justify-center">

        {/* Logo + App Name */}
        <View className="items-center">

          <View className="w-64 h-64 items-center justify-center">
            <Image
              source={require("../../assets/images/KeySpot/designer.png")}
              className="w-56 h-56"
              resizeMode="contain"
            />
          </View>

          <Text className="text-white text-5xl font-bold tracking-tight mt-2">
            KeySpot
          </Text>

          <Text className="text-gray-500 text-base font-medium tracking-widest mt-2">
            HEAR • KNOW • PLAY
          </Text>

        </View>

        {/* Developer Credit */}
        <View className="absolute bottom-12 items-center">
          <Text className="text-gray-600 text-sm font-medium">
            Crafted by
          </Text>

          <Text className="text-gray-400 text-sm font-semibold mt-1">
            Th3_D5_482
          </Text>
        </View>

      </View>
    </SafeAreaProvider>
  );
}