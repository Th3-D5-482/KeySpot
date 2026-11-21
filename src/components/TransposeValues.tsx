import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type TransposeValuesProps = {
  originalKey?: string;
  targetKey?: string;
  sign?: string;
  semitones: number | null;
};

export const TransposeValues = ({
  originalKey,
  targetKey,
  sign,
  semitones,
}: TransposeValuesProps) => {
  const isUp = sign === "+";

  const accentColor = isUp ? "#34D399" : "#F59E0B";

  return (
    <View className="items-center">

      {/* KEY TRANSITION */}

      <View className="flex-row items-center justify-center">

        <View className="items-center flex-1">
          <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#8491A5] mb-1.5">
            FROM
          </Text>

          <Text
            className="text-white text-[24px] font-extrabold tracking-tight"
            numberOfLines={1}
          >
            {originalKey ?? "N/A"}
          </Text>
        </View>

        <View className="mx-3 h-10 w-10 rounded-full bg-[#252D3A] items-center justify-center">
          <Ionicons
            name="arrow-forward"
            size={20}
            color="#8B9BB4"
          />
        </View>

        <View className="items-center flex-1">
          <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#8491A5] mb-1.5">
            TO
          </Text>

          <Text
            className="text-white text-[24px] font-extrabold tracking-tight"
            numberOfLines={1}
          >
            {targetKey ?? "N/A"}
          </Text>
        </View>

      </View>

      {/* SEMITONE RESULT */}

      <View className="flex-row items-center justify-center mt-5">

        <Text
          style={{ color: accentColor }}
          className="text-[34px] font-extrabold mr-1"
        >
          {sign}
        </Text>

        <Text className="text-white text-[46px] font-extrabold tracking-tight">
          {semitones ?? "N/A"}
        </Text>

      </View>

      <Text
        style={{ color: accentColor }}
        className="text-[11px] font-bold uppercase tracking-[2px] mt-1"
      >
        {isUp ? "Transpose Up" : "Transpose Down"}
      </Text>

      <Text className="text-[#8491A5] text-[12px] font-medium mt-1">
        {semitones === 1 ? "1 semitone" : `${semitones ?? "N/A"} semitones`}
      </Text>

    </View>
  );
};