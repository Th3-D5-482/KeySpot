import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";

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
  const forwardSemitones = getSemitones?.(originalKey, targetKey) ?? null;
  const reverseSemitones = getSemitones?.(targetKey, originalKey) ?? null;

  const guitarOptions = getGuitarOptions?.(targetKey) ?? [];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <View className="flex-1 px-5 pt-5">

        {/* HEADER */}

        <Header
          showBackButton={true}
          title="TRANSPOSE RESULT"
          onBackFunction={onBackFunction}
        />

        {/* TRANSPOSITION RESULT */}

        <View className="mt-7 rounded-[28px] border border-[#2A3444] bg-[#171B23] p-5">

          <View className="flex-row items-center gap-2 mb-5">
            <MaterialCommunityIcons
              name="swap-horizontal"
              size={20}
              color="#8B9BB4"
            />

            <Text className="text-[11px] font-bold tracking-[2px] text-[#8B9BB4]">
              TRANSPOSITION
            </Text>
          </View>

          {/* UPWARD TRANSPOSITION */}

          <View className="rounded-2xl bg-[#12251F] border border-[#23473A] px-4 py-4">
            <TransposeValues
              originalKey={originalKey}
              targetKey={targetKey}
              sign="+"
              semitones={forwardSemitones}
            />
          </View>

          {/* DIVIDER */}

          <View className="flex-row items-center my-5">
            <View className="flex-1 h-px bg-[#293241]" />

            <Text className="mx-3 text-[10px] font-bold tracking-[1.5px] text-[#64748B]">
              OR
            </Text>

            <View className="flex-1 h-px bg-[#293241]" />
          </View>

          {/* DOWNWARD TRANSPOSITION */}

          <View className="rounded-2xl bg-[#292117] border border-[#51402A] px-4 py-4">
            <TransposeValues
              originalKey={originalKey}
              targetKey={targetKey}
              sign="-"
              semitones={reverseSemitones}
            />
          </View>

        </View>

        {/* INSTRUMENT GUIDE */}

        <View className="mt-8 mb-5">

          <View className="mb-5">
            <Text className="text-[22px] font-extrabold tracking-tight text-white">
              Instrument Guide
            </Text>

            <Text className="text-[13px] text-[#8491A5] mt-1">
              Apply the transposition to your instrument.
            </Text>
          </View>

          <View className="rounded-[24px] border border-[#2A3444] bg-[#171B23] px-5 py-5">

            {/* KEYBOARD */}

            <View className="flex-row items-start gap-3">

              <View className="h-11 w-11 items-center justify-center rounded-xl bg-[#12251F] border border-[#23473A]">
                <MaterialCommunityIcons
                  name="piano"
                  size={23}
                  color="#34D399"
                />
              </View>

              <View className="flex-1 pt-1">
                <Text className="text-white text-[16px] font-bold">
                  Keyboard
                </Text>

                <Text className="text-[#8491A5] text-[13px] mt-1">
                  Transpose your keyboard by the required semitones.
                </Text>
              </View>

            </View>

            <View className="flex-row gap-2 mt-4">

              <View className="flex-1 rounded-xl bg-[#12251F] border border-[#23473A] px-3 py-3">
                <Text className="text-[#34D399] text-[11px] font-bold tracking-wider">
                  UP
                </Text>

                <Text className="text-white text-[20px] font-extrabold mt-1">
                  +{forwardSemitones ?? "N/A"}
                </Text>

                <Text className="text-[#8491A5] text-[11px] mt-1">
                  Semitones
                </Text>
              </View>

              <View className="flex-1 rounded-xl bg-[#292117] border border-[#51402A] px-3 py-3">
                <Text className="text-[#F59E0B] text-[11px] font-bold tracking-wider">
                  DOWN
                </Text>

                <Text className="text-white text-[20px] font-extrabold mt-1">
                  -{reverseSemitones ?? "N/A"}
                </Text>

                <Text className="text-[#8491A5] text-[11px] mt-1">
                  Semitones
                </Text>
              </View>

            </View>

            {/* SEPARATOR */}

            <View className="h-px bg-[#293241] my-5" />

            {/* GUITAR */}

            <View className="flex-row items-start gap-3">

              <View className="h-11 w-11 items-center justify-center rounded-xl bg-[#292117] border border-[#51402A]">
                <MaterialCommunityIcons
                  name="guitar-acoustic"
                  size={23}
                  color="#F59E0B"
                />
              </View>

              <View className="flex-1 pt-1">
                <Text className="text-white text-[16px] font-bold">
                  Guitar
                </Text>

                <Text className="text-[#8491A5] text-[13px] mt-1">
                  Use these chord shapes with a capo to play in the target key.
                </Text>
              </View>

            </View>

            {guitarOptions.length > 0 ? (

              <View className="mt-5 gap-3">

                {guitarOptions.map((option) => (

                  <View
                    key={`${option.shapeKey}-${option.fret}`}
                    className="flex-row items-center justify-between rounded-2xl border border-[#51402A] bg-[#292117] px-4 py-4"
                  >

                    <View>
                      <Text className="text-white text-[17px] font-extrabold">
                        {option.shapeKey}
                      </Text>

                      <Text className="text-[#8491A5] text-[12px] mt-1">
                        Chord shape
                      </Text>
                    </View>

                    <View className="items-end">
                      <Text className="text-[#F59E0B] text-[16px] font-bold">
                        Capo {option.fret}
                        {getOrdinalSuffix?.(option.fret) ?? ""}
                      </Text>

                      <Text className="text-[#8491A5] text-[12px] mt-1">
                        Fret
                      </Text>
                    </View>

                  </View>

                ))}

              </View>

            ) : (

              <Text className="text-[#8491A5] text-[13px] mt-4">
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

            <Text className="text-[13px] text-[#8491A5] mt-1">
              Compare chord progressions across keys.
            </Text>
          </View>

          <View className="flex-row gap-3">

            <RelativeChords
              title={`Key of ${originalKey ?? "N/A"}`}
              subtitle="Original"
              rootKey={originalKey ?? ""}
            />

            <RelativeChords
              title={`Key of ${targetKey ?? "N/A"}`}
              subtitle="Target"
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