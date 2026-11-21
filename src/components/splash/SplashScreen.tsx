
import { Image, Text, View } from "react-native";

export const SplashScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-[#0F1117]">

      {/* BRAND */}

      <View className="items-center">

        {/* LOGO */}

        <View className="h-64 w-64 items-center justify-center">
          <Image
            source={require("../../../assets/images/KeySpot/others/designer.png")}
            className="h-60 w-60"
            resizeMode="contain"
          />
        </View>

        {/* APP NAME */}

        <View className="mt-1 items-center">
          <Text className="text-[44px] font-extrabold tracking-[-1.5px] text-[#F8FAFC]">
            KeySpot
          </Text>

          {/* BRAND ACCENT */}

          <View className="mt-3 h-[4px] w-10 rounded-full bg-[#34D399]" />
        </View>

        {/* TAGLINE */}

        <View className="mt-5 flex-row items-center">
          <Text className="text-[11px] font-bold tracking-[2.5px] text-[#8491A5]">
            HEAR
          </Text>

          <View className="mx-3 h-1 w-1 rounded-full bg-[#34D399]" />

          <Text className="text-[11px] font-bold tracking-[2.5px] text-[#8491A5]">
            KNOW
          </Text>

          <View className="mx-3 h-1 w-1 rounded-full bg-[#34D399]" />

          <Text className="text-[11px] font-bold tracking-[2.5px] text-[#8491A5]">
            PLAY
          </Text>
        </View>

      </View>

      {/* CREATOR CREDIT */}

      <View className="absolute bottom-12 items-center">

        <Text className="text-[9px] font-bold tracking-[2.5px] text-[#64748B]">
          CRAFTED BY
        </Text>

        <Text className="mt-2 text-[13px] font-bold tracking-[1px] text-[#CBD5E1]">
          Th3_D5_482
        </Text>

        {/* SUBTLE ACCENT */}

        <View className="mt-3 h-[2px] w-6 rounded-full bg-[#252D3A]" />

      </View>

    </View>
  );
};
