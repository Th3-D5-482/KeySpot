import { Text, View } from "react-native";

import { NOTE_NAMES } from "./features/detection/constants";
import { getDiatonicChords } from "./features/detection/keys";

type RelativeChordsProps = {
  title: string;
  subtitle: string;
  rootKey: string;
  forwardSemitones?: number | null;
  reverseSemitones?: number | null;
};

export const RelativeChords = ({
  title,
  subtitle,
  rootKey,
}: RelativeChordsProps) => {
  const keyIndex = NOTE_NAMES.indexOf(rootKey);

  const chords =
    keyIndex === -1
      ? []
      : getDiatonicChords(keyIndex, "Major").slice(0, 6);

  return (
    <View className="flex-1 rounded-[22px] border border-[#2A3444] bg-[#171B23] px-3.5 py-4">

      {/* CARD HEADER */}

      <View className="mb-4">
        <Text
          className="text-white text-[15px] font-extrabold tracking-tight"
          numberOfLines={1}
        >
          {title}
        </Text>

        <Text className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#8491A5] mt-1">
          {subtitle}
        </Text>
      </View>

      {/* DIVIDER */}

      <View className="h-px bg-[#293241] mb-3" />

      {/* CHORD LIST */}

      <View className="gap-1.5">

        {chords.map((item, index) => (

          <View
            key={item.degree}
            className="flex-row items-center rounded-xl bg-[#202632] px-2.5 py-3"
          >

            <View className="w-9">
              <Text className="text-[12px] font-bold text-[#8491A5]">
                {item.degree}
              </Text>
            </View>

            <Text className="text-[15px] font-extrabold text-white flex-1">
              {item.label}
            </Text>

          </View>

        ))}

      </View>

    </View>
  );
};