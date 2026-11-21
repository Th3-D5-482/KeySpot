
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
    <View className="flex-1 rounded-[22px] border border-[#252D3A] bg-[#151922] px-3 py-4">

      {/* CARD HEADER */}

      <View className="mb-4">
        <Text
          className="text-[14px] font-extrabold tracking-tight text-white"
          numberOfLines={1}
        >
          {title}
        </Text>

        <View className="mt-2 self-start rounded-md border border-[#285B4B] bg-[#14251F] px-2 py-1">
          <Text className="text-[9px] font-extrabold uppercase tracking-[1.5px] text-[#34D399]">
            {subtitle}
          </Text>
        </View>
      </View>

      {/* DIVIDER */}

      <View className="mb-3 h-px bg-[#252D3A]" />

      {/* CHORD LIST */}

      <View className="gap-2">
        {chords.map((item) => (
          <View
            key={item.degree}
            className="min-h-[48px] flex-row items-center rounded-xl border border-[#252D3A] bg-[#202632] px-2.5 py-2"
          >
            <View className="w-8">
              <Text className="text-[11px] font-bold text-[#8491A5]">
                {item.degree}
              </Text>
            </View>

            <Text
              className="flex-1 text-center text-[15px] font-extrabold text-white"
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>

      {chords.length === 0 && (
        <Text className="py-4 text-center text-[11px] text-[#8491A5]">
          No chords available.
        </Text>
      )}
    </View>
  );
};
