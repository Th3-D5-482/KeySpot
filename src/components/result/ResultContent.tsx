import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { TransposeButton } from "../TransposeButton";

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
  onBack:() => void;
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
    <View className="flex-1 bg-black px-5">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 42,
          paddingBottom: 36,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center px-1">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-[#111111]"
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <View className="ml-4">
            <Text className="text-gray-500 text-[11px] font-semibold tracking-[2px]">
              KEYSPOT RESULT
            </Text>

            <Text className="text-white text-[28px] font-bold mt-1">
              Detected Key
            </Text>
          </View>
        </View>

        {/* Detected Key Card */}
        <View className="w-full rounded-[30px] border border-gray-800 bg-[#080808] items-center py-10 mt-7">
          <Text className="text-white text-7xl font-bold">
            {detectedKey}
          </Text>

          <Text className="text-gray-400 text-xl font-medium mt-2">
            {detectedMode}
          </Text>

          <Text className="text-[#00E676] text-xs font-medium mt-5">
            Analysis confidence
          </Text>

          <Text className="text-white text-lg font-semibold mt-1">
            {confidenceValue}%
          </Text>
        </View>

        {/* Transpose */}
        <View className="mt-6">
          <TransposeButton onTranspose={onTranpose} />
        </View>

        {/* Chords in this key */}
        <View className="mt-9">
          <Text className="text-white text-xl font-bold">
            Chords in this key
          </Text>

          <Text className="text-gray-500 text-sm leading-5 mt-2">
            The diatonic chord family KeySpot used as part of the analysis.
          </Text>

          <View className="flex-row flex-wrap mt-4">
            {diatonicChords.map((item, index) => (
              <View
                key={`${item.degree}-${item.chord}-${index}`}
                className="bg-[#111111] border border-gray-800 rounded-2xl px-4 py-3 mr-2 mb-2"
              >
                <Text className="text-gray-500 text-[11px] text-center">
                  {item.degree}
                </Text>

                <Text className="text-white text-base font-bold mt-1">
                  {item.chord}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Chords Heard */}
        <View className="mt-9">
          <Text className="text-white text-xl font-bold">
            Chords heard
          </Text>

          <Text className="text-gray-500 text-sm leading-5 mt-2">
            The strongest chord patterns found throughout the recording.
          </Text>

          <View className="flex-row flex-wrap mt-4">
            {detectedChords.map((chord, index) => (
              <View
                key={`${chord}-${index}`}
                className="bg-white rounded-2xl px-4 py-3 mr-2 mb-2"
              >
                <Text className="text-black text-sm font-bold">
                  {chord}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Detect Another Song */}
        <TouchableOpacity
          activeOpacity={0.85}
          className="w-full bg-white rounded-2xl mt-10 py-4 items-center justify-center"
          onPress={onDetectAnother}
        >
          <Text className="text-black text-base font-bold">
            Detect Another Song
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};