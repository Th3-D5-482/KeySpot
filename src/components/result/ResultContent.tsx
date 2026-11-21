
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
    <View className="flex-1">

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 8,
          paddingBottom: 28,
        }}
      >

        {/* HEADER */}

        <Header
          title="DETECTED KEY"
          showBackButton={true}
          onBackFunction={onBack}
        />

        {/* DETECTED KEY CARD */}

        <View className="w-full items-center rounded-[28px] border border-[#252D3A] bg-[#151922] mt-6 px-5 py-8">

          {/* STATUS LABEL */}

          <View className="flex-row items-center rounded-full border border-[#285B4B] bg-[#14251F] px-3 py-2">

            <View className="w-[7px] h-[7px] rounded-full bg-[#34D399] mr-2" />

            <Text className="text-[#34D399] text-[10px] font-bold tracking-[1.6px]">
              KEY DETECTED
            </Text>

          </View>

          {/* KEY */}

          <Text className="text-[#F8FAFC] text-[76px] font-extrabold tracking-[-3px] mt-3">
            {detectedKey}
          </Text>

          <Text className="text-[#A3AEC0] text-[16px] font-semibold mt-[-2px]">
            {detectedMode}
          </Text>

          {/* CONFIDENCE */}

          <View className="w-full border-t border-[#252D3A] mt-7 pt-5">

            <View className="flex-row items-center justify-between">

              <View className="flex-row items-center">

                <Ionicons
                  name="analytics-outline"
                  size={18}
                  color="#8491A5"
                />

                <Text className="text-[#8491A5] text-[13px] font-medium ml-2">
                  Analysis confidence
                </Text>

              </View>

              <Text className="text-[#34D399] text-[15px] font-bold">
                {confidenceValue}%
              </Text>

            </View>

          </View>

        </View>

        {/* TRANSPOSE ACTION */}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onTranpose}
          accessibilityRole="button"
          className="flex-row items-center rounded-[20px] border border-[#285B4B] bg-[#14251F] mt-4 px-4 py-4"
        >

          <View className="w-11 h-11 items-center justify-center rounded-2xl bg-[#203D32]">

            <Ionicons
              name="swap-horizontal"
              size={23}
              color="#34D399"
            />

          </View>

          <View className="flex-1 ml-3">

            <Text className="text-[#F8FAFC] text-[14px] font-bold">
              Transpose this key
            </Text>

            <Text className="text-[#8491A5] text-[11px] mt-1">
              Change the key to suit your needs
            </Text>

          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#34D399"
          />

        </TouchableOpacity>

        {/* DIATONIC CHORDS */}

        <View className="mt-8">

          {/* SECTION HEADER */}

          <View className="flex-row items-center">

            <View className="w-10 h-10 items-center justify-center rounded-xl border border-[#252D3A] bg-[#151922]">

              <Ionicons
                name="musical-notes-outline"
                size={19}
                color="#34D399"
              />

            </View>

            <View className="ml-3">

              <Text className="text-[#F8FAFC] text-[16px] font-bold">
                Chords in this key
              </Text>

              <Text className="text-[#8491A5] text-[11px] mt-1">
                The diatonic chord family
              </Text>

            </View>

          </View>

          {/* CHORD GRID */}

          <View className="flex-row flex-wrap mt-4">

            {diatonicChords.map((item, index) => (
              <View
                key={`${item.degree}-${item.chord}-${index}`}
                className="w-[31%] min-h-[78px] items-center justify-center rounded-2xl border border-[#252D3A] bg-[#151922] mr-[2.3%] mb-2.5"
              >

                <Text className="text-[#8491A5] text-[10px] font-semibold tracking-wider">
                  {item.degree}
                </Text>

                <Text className="text-[#F8FAFC] text-[20px] font-extrabold mt-1">
                  {item.chord}
                </Text>

              </View>
            ))}

          </View>

        </View>

        {/* DETECTED CHORDS */}

        <View className="mt-6">

          {/* SECTION HEADER */}

          <View className="flex-row items-center">

            <View className="w-10 h-10 items-center justify-center rounded-xl border border-[#3C3424] bg-[#242019]">

              <Ionicons
                name="ear-outline"
                size={19}
                color="#FBBF24"
              />

            </View>

            <View className="ml-3">

              <Text className="text-[#F8FAFC] text-[16px] font-bold">
                Chords heard
              </Text>

              <Text className="text-[#8491A5] text-[11px] mt-1">
                Identified in your recording
              </Text>

            </View>

          </View>

          {/* DETECTED CHORD LIST */}

          <View className="flex-row flex-wrap mt-4">

            {detectedChords.map((chord, index) => (
              <View
                key={`${chord}-${index}`}
                className="items-center justify-center rounded-xl border border-[#3C3424] bg-[#242019] px-4 py-3 mr-2.5 mb-2.5"
              >

                <Text className="text-[#FBBF24] text-[14px] font-bold">
                  {chord}
                </Text>

              </View>
            ))}

          </View>

        </View>

        {/* DETECT ANOTHER SONG */}

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onDetectAnother}
          accessibilityRole="button"
          className="w-full flex-row items-center justify-center rounded-2xl bg-[#34D399] mt-8 py-[17px]"
        >

          <Ionicons
            name="mic-outline"
            size={20}
            color="#0F1117"
          />

          <Text className="text-[#0F1117] text-[14px] font-extrabold ml-2">
            Detect Another Song
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </View>
  );
};
