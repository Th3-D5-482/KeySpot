
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

  const accentColor = isUp ? "#34D399" : "#FBBF24";

  return (
    <View className="items-center">

      {/* KEY TRANSITION */}

      <View className="w-full flex-row items-center justify-between">

        {/* ORIGINAL KEY */}

        <View className="flex-1 items-center">
          <Text className="mb-2 text-[10px] font-bold tracking-[1.5px] text-[#8491A5]">
            FROM
          </Text>

          <Text
            className="text-[25px] font-extrabold tracking-tight text-white"
            numberOfLines={1}
          >
            {originalKey ?? "N/A"}
          </Text>
        </View>

        {/* ARROW */}

        <View className="mx-2 h-10 w-10 items-center justify-center rounded-full border border-[#303A49] bg-[#202632]">
          <Ionicons
            name="arrow-forward"
            size={19}
            color="#8491A5"
          />
        </View>

        {/* TARGET KEY */}

        <View className="flex-1 items-center">
          <Text className="mb-2 text-[10px] font-bold tracking-[1.5px] text-[#8491A5]">
            TO
          </Text>

          <Text
            className="text-[25px] font-extrabold tracking-tight text-white"
            numberOfLines={1}
          >
            {targetKey ?? "N/A"}
          </Text>
        </View>

      </View>

      {/* SEMITONE RESULT */}

      <View className="mt-5 flex-row items-center justify-center">
        <Text
          style={{ color: accentColor }}
          className="mr-1 text-[34px] font-extrabold"
        >
          {sign}
        </Text>

        <Text className="text-[46px] font-extrabold tracking-tight text-white">
          {semitones ?? "N/A"}
        </Text>
      </View>

      {/* DIRECTION LABEL */}

      <View
        style={{
          backgroundColor: isUp ? "#203D32" : "#3A3020",
          borderColor: isUp ? "#285B4B" : "#51402A",
        }}
        className="mt-2 rounded-full border px-3 py-1.5"
      >
        <Text
          style={{ color: accentColor }}
          className="text-[10px] font-extrabold uppercase tracking-[1.8px]"
        >
          {isUp ? "Transpose Up" : "Transpose Down"}
        </Text>
      </View>

      <Text className="mt-2 text-[11px] font-medium text-[#8491A5]">
        {semitones === 1 ? "1 semitone" : `${semitones ?? "N/A"} semitones`}
      </Text>

    </View>
  );
};
