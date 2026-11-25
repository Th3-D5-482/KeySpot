
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Header } from "../Header";
import { RelativeChords } from "../RelativeChords";
import { TransposeValues } from "../TransposeValues";

type GuitarOption = {
  shapeKey: string;
  fret: number;
};

type OutcomeContentProps = {
  onBackFunction?: () => void;
  originalKey?: string;
  targetKey?: string;
  getSemitones?: (fromKey?: string, toKey?: string) => number | null;
  getGuitarOptions?: (targetKey?: string, maxFret?: number) => GuitarOption[];
  getOrdinalSuffix?: (value: number | null) => string;
};

export const OutcomeContent = ({
  onBackFunction,
  originalKey,
  targetKey,
  getSemitones,
  getGuitarOptions,
  getOrdinalSuffix,
}: OutcomeContentProps) => {
  const [selectedGuitarOption, setSelectedGuitarOption] =
    useState<GuitarOption | null>(null);
  const [areGuitarOptionsExpanded, setAreGuitarOptionsExpanded] =
    useState(false);
  const forwardSemitones = getSemitones?.(originalKey, targetKey) ?? null;
  const reverseSemitones = getSemitones?.(targetKey, originalKey) ?? null;

  const guitarOptions = getGuitarOptions?.(targetKey) ?? [];
  const visibleGuitarOptions = areGuitarOptionsExpanded
    ? guitarOptions
    : guitarOptions.slice(0, 3);
  const capoLabel = selectedGuitarOption
    ? `Capo ${selectedGuitarOption.fret}${getOrdinalSuffix?.(selectedGuitarOption.fret) ?? ""}`
    : undefined;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 36 }}
    >
      <View className="flex-1 pt-2">

        {/* HEADER */}

        <Header
          showBackButton={true}
          title="TRANSPOSE RESULT"
          onBackFunction={onBackFunction}
        />

        {/* TRANSPOSITION RESULT */}

        <View className="mt-7 rounded-[28px] border border-[#252D3A] bg-[#151922] px-5 py-6">

          <View className="mb-6 flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-xl border border-[#252D3A] bg-[#202632]">
              <MaterialCommunityIcons
                name="swap-horizontal"
                size={21}
                color="#34D399"
              />
            </View>

            <View className="flex-1">
              <Text className="text-[13px] font-extrabold tracking-[1.5px] text-white">
                TRANSPOSITION
              </Text>
              <Text className="mt-1 text-[11px] text-[#8491A5]">
                Your key conversion breakdown
              </Text>
            </View>
          </View>

          {/* UPWARD TRANSPOSITION */}

          <View className="rounded-[20px] border border-[#285B4B] bg-[#14251F] px-3 py-5">
            <TransposeValues
              originalKey={originalKey}
              targetKey={targetKey}
              sign="+"
              semitones={forwardSemitones}
            />
          </View>

          {/* DIVIDER */}

          <View className="my-5 flex-row items-center">
            <View className="h-px flex-1 bg-[#252D3A]" />

            <Text className="mx-4 text-[10px] font-bold tracking-[2px] text-[#64748B]">
              OR
            </Text>

            <View className="h-px flex-1 bg-[#252D3A]" />
          </View>

          {/* DOWNWARD TRANSPOSITION */}

          <View className="rounded-[20px] border border-[#51402A] bg-[#242019] px-3 py-5">
            <TransposeValues
              originalKey={originalKey}
              targetKey={targetKey}
              sign="-"
              semitones={reverseSemitones}
            />
          </View>
        </View>

        {/* INSTRUMENT GUIDE */}

        <View className="mt-8">

          <View className="mb-5">
            <Text className="text-[22px] font-extrabold tracking-tight text-white">
              Instrument Guide
            </Text>

            <Text className="mt-1.5 text-[13px] leading-5 text-[#8491A5]">
              Apply the transposition to your instrument.
            </Text>
          </View>

          <View className="rounded-[26px] border border-[#252D3A] bg-[#151922] px-5 py-5">

            {/* KEYBOARD */}

            <View className="flex-row items-start gap-3">
              <View className="h-12 w-12 items-center justify-center rounded-2xl border border-[#285B4B] bg-[#14251F]">
                <MaterialCommunityIcons
                  name="piano"
                  size={24}
                  color="#34D399"
                />
              </View>

              <View className="flex-1 pt-0.5">
                <Text className="text-[16px] font-bold text-white">
                  Keyboard
                </Text>

                <Text className="mt-1 text-[12px] leading-[19px] text-[#8491A5]">
                  Adjust your keyboard transpose setting by the required semitones.
                </Text>
              </View>
            </View>

            {/* KEYBOARD VALUES */}

            <View className="mt-5 flex-row gap-3">
              <View className="flex-1 rounded-2xl border border-[#285B4B] bg-[#14251F] px-4 py-4">
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons
                    name="arrow-up"
                    size={15}
                    color="#34D399"
                  />
                  <Text className="text-[10px] font-extrabold tracking-[1.5px] text-[#34D399]">
                    UP
                  </Text>
                </View>

                <Text className="mt-2 text-[25px] font-extrabold text-white">
                  +{forwardSemitones ?? "N/A"}
                </Text>

                <Text className="mt-1 text-[11px] text-[#8491A5]">
                  Semitones
                </Text>
              </View>

              <View className="flex-1 rounded-2xl border border-[#51402A] bg-[#242019] px-4 py-4">
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons
                    name="arrow-down"
                    size={15}
                    color="#FBBF24"
                  />
                  <Text className="text-[10px] font-extrabold tracking-[1.5px] text-[#FBBF24]">
                    DOWN
                  </Text>
                </View>

                <Text className="mt-2 text-[25px] font-extrabold text-white">
                  -{reverseSemitones ?? "N/A"}
                </Text>

                <Text className="mt-1 text-[11px] text-[#8491A5]">
                  Semitones
                </Text>
              </View>
            </View>

            {/* SEPARATOR */}

            <View className="my-6 h-px bg-[#252D3A]" />

            {/* GUITAR */}

            <View className="flex-row items-start gap-3">
              <View className="h-12 w-12 items-center justify-center rounded-2xl border border-[#51402A] bg-[#242019]">
                <MaterialCommunityIcons
                  name="guitar-acoustic"
                  size={24}
                  color="#FBBF24"
                />
              </View>

              <View className="flex-1 pt-0.5">
                <Text className="text-[16px] font-bold text-white">
                  Guitar
                </Text>

                <Text className="mt-1 text-[12px] leading-[19px] text-[#8491A5]">
                  Use these chord shapes with a capo to play in the target key.
                </Text>
              </View>
            </View>

            {/* GUITAR OPTIONS */}

            {guitarOptions.length > 0 ? (
              <View className="mt-5 gap-2.5">
                {visibleGuitarOptions.map((option) => {
                  const isSelected =
                    selectedGuitarOption?.fret === option.fret &&
                    selectedGuitarOption.shapeKey === option.shapeKey;

                  return (
                    <Pressable
                      key={`${option.shapeKey}-${option.fret}`}
                      onPress={() =>
                        setSelectedGuitarOption((selectedOption) =>
                          selectedOption?.fret === option.fret &&
                          selectedOption.shapeKey === option.shapeKey
                            ? null
                            : option
                        )
                      }
                      accessibilityRole="button"
                      accessibilityLabel={`Use ${option.shapeKey} chord shapes with capo at fret ${option.fret}`}
                      accessibilityState={{ selected: isSelected }}
                      className={`flex-row items-center justify-between rounded-2xl border px-4 py-4 ${
                        isSelected
                          ? "border-[#FBBF24] bg-[#2D291C]"
                          : "border-[#3C3424] bg-[#202019]"
                      }`}
                    >
                      <View className="flex-row items-center gap-2">
                        <Text className="text-[19px] font-extrabold text-white">
                          {option.shapeKey}
                        </Text>

                        {isSelected && (
                          <MaterialCommunityIcons
                            name="check-circle"
                            size={18}
                            color="#FBBF24"
                          />
                        )}
                      </View>

                      <View className="items-end">
                        <Text className="text-[15px] font-extrabold text-[#FBBF24]">
                          Capo {option.fret}
                          {getOrdinalSuffix?.(option.fret) ?? ""}
                        </Text>

                        <Text className="mt-1 text-[11px] text-[#8491A5]">
                          Fret position
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}

                {guitarOptions.length > 3 && (
                  <Pressable
                    onPress={() =>
                      setAreGuitarOptionsExpanded((isExpanded) => !isExpanded)
                    }
                    accessibilityRole="button"
                    accessibilityLabel={
                      areGuitarOptionsExpanded
                        ? "Show fewer capo options"
                        : `Show ${guitarOptions.length - 3} more capo options`
                    }
                    accessibilityState={{ expanded: areGuitarOptionsExpanded }}
                    className="flex-row items-center justify-center gap-2 rounded-2xl border border-[#252D3A] bg-[#202632] px-4 py-3"
                  >
                    <Text className="text-[13px] font-bold text-[#A3AEC0]">
                      {areGuitarOptionsExpanded
                        ? "Show fewer options"
                        : `Show ${guitarOptions.length - 3} more options`}
                    </Text>

                    <MaterialCommunityIcons
                      name={
                        areGuitarOptionsExpanded ? "chevron-up" : "chevron-down"
                      }
                      size={18}
                      color="#A3AEC0"
                    />
                  </Pressable>
                )}
              </View>
            ) : (
              <Text className="mt-4 text-[12px] text-[#8491A5]">
                Guitar capo options unavailable.
              </Text>
            )}
          </View>
        </View>

        {/* RELATIVE CHORDS */}

        <View className="mt-8">
          <View className="mb-5">
            <Text className="text-[22px] font-extrabold tracking-tight text-white">
              Relative Chords
            </Text>

            <Text className="mt-1.5 text-[13px] leading-5 text-[#8491A5]">
              {selectedGuitarOption
                ? `Compare ${selectedGuitarOption.shapeKey} chord shapes with the target key.`
                : "Select a capo option to compare its chord shapes with the target key."}
            </Text>
          </View>

          <View className="flex-row gap-3">
            <RelativeChords
              title={`Key of ${selectedGuitarOption?.shapeKey ?? originalKey ?? "N/A"}`}
              subtitle={selectedGuitarOption ? "Guitar Shape" : "Original"}
              rootKey={selectedGuitarOption?.shapeKey ?? originalKey ?? ""}
            />

            <RelativeChords
              title={`Key of ${targetKey ?? "N/A"}`}
              subtitle={capoLabel ? `Target · ${capoLabel}` : "Target"}
              rootKey={targetKey ?? ""}
              forwardSemitones={forwardSemitones}
              reverseSemitones={reverseSemitones}
            />
          </View>
        </View>

      </View>
    </ScrollView>
  );
};
