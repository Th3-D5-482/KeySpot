
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
    <View className="flex-row items-center min-h-[72px] mb-2">

      {/* BACK BUTTON */}

      {showBackButton && (
        <TouchableOpacity
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBackFunction}
          className="h-12 w-12 items-center justify-center rounded-2xl border border-[#252D3A] bg-[#151922] mr-4"
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color="#E2E8F0"
          />
        </TouchableOpacity>
      )}

      {/* BRANDING */}

      <View className="flex-1 justify-center">

        <View className="flex-row items-center">

          <Text className="text-[#F8FAFC] text-[26px] font-extrabold tracking-[-0.8px]">
            KeySpot
          </Text>

          <View className="h-[7px] w-[7px] rounded-full bg-[#34D399] ml-2 mt-2" />

        </View>

        <Text className="text-[#8491A5] text-[10px] font-semibold tracking-[2.2px] mt-[5px]">
          {title.toUpperCase()}
        </Text>

      </View>

    </View>
  );
};
