
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type HeaderProps = {
  title: string;
  showBackButton: boolean;
  onBackFunction?: () => void;
};

export const Header = ({
  title,
  showBackButton,
  onBackFunction,
}: HeaderProps) => {
  return (
    <View className="flex-row items-center min-h-[64px]">

      {/* BACK BUTTON */}

      {showBackButton && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBackFunction}
          className="h-11 w-11 items-center justify-center rounded-2xl border border-[#293241] bg-[#171B23] mr-3"
        >
          <Ionicons
            name="arrow-back"
            size={21}
            color="#E2E8F0"
          />
        </TouchableOpacity>
      )}

      {/* BRANDING */}

      <View className="flex-1 justify-center">

        <View className="flex-row items-center gap-2">

          <Text className="text-white text-[25px] font-extrabold tracking-tight">
            KeySpot
          </Text>

          <View className="h-2 w-2 rounded-full bg-[#34D399]" />

        </View>

        <Text className="text-[#8491A5] text-[10px] font-bold tracking-[2px] mt-1">
          {title.toUpperCase()}
        </Text>

      </View>

    </View>
  );
};
