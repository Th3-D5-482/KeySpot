
import { Image, Text, View } from "react-native";

export const SplashScreen = () => {
  return (
    <View className="flex-1 bg-[#0B0D12] items-center justify-center">

      {/* Brand */}
      <View className="items-center">

        {/* Logo */}
        <View className="w-64 h-64 items-center justify-center">
          <Image
            source={require("../../../assets/images/KeySpot/others/designer.png")}
            className="w-60 h-60"
            resizeMode="contain"
          />
        </View>

        {/* App Name */}
        <View className="items-center mt-2">
          <Text className="text-white text-[42px] font-extrabold tracking-tight">
            KeySpot
          </Text>

          {/* Brand Accent */}
          <View className="w-10 h-1 rounded-full bg-[#34D399] mt-3" />
        </View>

        {/* Tagline */}
        <Text className="text-[#8491A5] text-xs font-bold tracking-[3px] mt-4">
          HEAR  •  KNOW  •  PLAY
        </Text>

      </View>

      {/* Creator Credit */}
      <View className="absolute bottom-12 items-center">

        <Text className="text-[#64748B] text-xs font-medium tracking-wider">
          CRAFTED BY
        </Text>

        <Text className="text-[#CBD5E1] text-sm font-bold tracking-wide mt-2">
          Th3_D5_482
        </Text>

      </View>

    </View>
  );
};
