
import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Header } from "../Header";

type DiatonicChord = {
  degree: string;
  chord: string;
};

type ResultContentProps = {
  detectedKey: string;
  detectedMode: string;
  confidenceValue: string;
  diatonicChords: DiatonicChord[];
  detectedChords: string[];
  onDetectAnother: () => void;
  onTranpose: () => void;
  onBack: () => void;
};

export const ResultContent = ({
  detectedKey,
  detectedMode,
  confidenceValue,
  diatonicChords,
  detectedChords,
  onDetectAnother,
  onTranpose,
  onBack,
}: ResultContentProps) => {
  return (
    <View className="flex-1 px-5">

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 18,
          paddingBottom: 36,
        }}
      >

        {/* Header */}
        <Header
          title="DETECTED KEY"
          showBackButton={true}
          onBackFunction={onBack}
        />

        {/* Detected Key */}
        <View className="w-full items-center rounded-[30px] border border-[#293241] bg-[#171B23] mt-7 px-5 py-9">

          <View className="flex-row items-center rounded-full bg-[#202632] border border-[#293241] px-3 py-1.5">
            <View className="w-2 h-2 rounded-full bg-[#34D399] mr-2" />

            <Text className="text-[#34D399] text-[10px] font-bold tracking-[1.5px]">
              KEY DETECTED
            </Text>
          </View>

          <Text className="text-white text-[76px] font-extrabold tracking-tight mt-4">
            {detectedKey}
          </Text>

          <Text className="text-[#A3AEC0] text-lg font-semibold mt-1">
            {detectedMode}
          </Text>

          {/* Confidence */}
          <View className="w-full flex-row items-center justify-between border-t border-[#293241] mt-8 pt-5">
            <View className="flex-row items-center">
              <Ionicons
                name="analytics-outline"
                size={17}
                color="#8491A5"
              />

              <Text className="text-[#8491A5] text-sm font-medium ml-2">
                Analysis confidence
              </Text>
            </View>

            <Text className="text-[#34D399] text-base font-bold">
              {confidenceValue}%
            </Text>
          </View>
        </View>

        {/* Transpose Action */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onTranpose}
          className="flex-row items-center rounded-[24px] border border-[#285B4B] bg-[#14251F] mt-5 px-5 py-5"
        >
          <View className="w-12 h-12 items-center justify-center rounded-2xl bg-[#203D32]">
            <Ionicons
              name="swap-horizontal"
              size={25}
              color="#34D399"
            />
          </View>

          <View className="flex-1 ml-4">
            <Text className="text-white text-base font-bold">
              Transpose this key
            </Text>

            <Text className="text-[#8491A5] text-xs mt-1">
              Change the key to suit your needs
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={21}
            color="#34D399"
          />
        </TouchableOpacity>

        {/* Diatonic Chords */}
        <View className="mt-9">

          <View className="flex-row items-center">
            <View className="w-9 h-9 rounded-xl bg-[#202632] items-center justify-center">
              <Ionicons
                name="musical-notes-outline"
                size={19}
                color="#34D399"
              />
            </View>

            <Text className="text-white text-lg font-bold ml-3">
              Chords in this key
            </Text>
          </View>

          <Text className="text-[#8491A5] text-sm leading-5 mt-3">
            The diatonic chord family associated with the detected key.
          </Text>

          <View className="flex-row flex-wrap mt-4">
            {diatonicChords.map((item, index) => (
              <View
                key={`${item.degree}-${item.chord}-${index}`}
                className="min-w-[76px] items-center rounded-2xl border border-[#293241] bg-[#171B23] px-4 py-3 mr-2 mb-2"
              >
                <Text className="text-[#8491A5] text-[11px] font-semibold">
                  {item.degree}
                </Text>

                <Text className="text-white text-lg font-extrabold mt-1">
                  {item.chord}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Detected Chords */}
        <View className="mt-8">

          <View className="flex-row items-center">
            <View className="w-9 h-9 rounded-xl bg-[#202632] items-center justify-center">
              <Ionicons
                name="ear-outline"
                size={19}
                color="#F59E0B"
              />
            </View>

            <Text className="text-white text-lg font-bold ml-3">
              Chords heard
            </Text>
          </View>

          <Text className="text-[#8491A5] text-sm leading-5 mt-3">
            The strongest chord patterns identified in your recording.
          </Text>

          <View className="flex-row flex-wrap mt-4">
            {detectedChords.map((chord, index) => (
              <View
                key={`${chord}-${index}`}
                className="rounded-xl border border-[#3C3424] bg-[#242019] px-4 py-3 mr-2 mb-2"
              >
                <Text className="text-[#FBBF24] text-sm font-bold">
                  {chord}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Detect Another Song */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onDetectAnother}
          className="w-full flex-row items-center justify-center rounded-2xl bg-[#34D399] mt-10 py-4"
        >
          <Ionicons
            name="mic-outline"
            size={20}
            color="#0B0D12"
          />

          <Text className="text-[#0B0D12] text-base font-extrabold ml-2">
            Detect Another Song
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};
