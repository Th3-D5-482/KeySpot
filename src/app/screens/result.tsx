import { useLocalSearchParams, useRouter } from "expo-router";

import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Result() {
  const router =
    useRouter();

  const {
    key,
    mode,
    confidence,
    chords,
    diatonic,
  } =
    useLocalSearchParams();

  const detectedKey =
    typeof key === "string"
      ? key
      : "?";

  const detectedMode =
    typeof mode === "string"
      ? mode
      : "?";

  const confidenceValue =
    typeof confidence === "string"
      ? confidence
      : "0";

  const detectedChords =
    typeof chords === "string" &&
      chords.length > 0
      ? chords.split(",")
      : [];

  const diatonicChords =
    typeof diatonic === "string" &&
      diatonic.length > 0
      ? diatonic
        .split(",")
        .map(item => {
          const [degree, chord] =
            item.split(":");

          return {
            degree,
            chord,
          };
        })
      : [];

  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-black px-5">

        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingTop: 50,
            paddingBottom: 40,
          }}
        >

          {/* Header */}

          <Text className="text-gray-500 text-sm font-semibold tracking-widest">
            KEYSPOT RESULT
          </Text>

          <Text className="text-white text-4xl font-bold mt-3">
            Detected Key
          </Text>

          {/* Main Result */}

          <View className="w-full rounded-[32px] border border-gray-800 bg-[#080808] items-center py-12 mt-8">

            <Text className="text-white text-7xl font-bold">
              {detectedKey}
            </Text>

            <Text className="text-gray-400 text-2xl font-medium mt-3">
              {detectedMode}
            </Text>

            <Text className="text-gray-600 w-full text-sm mt-4 text-center">
              Analysis confidence
            </Text>

            <Text className="text-white text-lg font-semibold mt-1">
              {confidenceValue}%
            </Text>

          </View>

          {/* Diatonic Family */}

          <View className="mt-10">

            <Text className="text-white text-2xl font-bold">
              Chords in this key
            </Text>

            <Text className="text-gray-500 text-sm mt-2">
              The diatonic chord family KeySpot
              used as part of the analysis.
            </Text>

            <View className="flex-row flex-wrap mt-5">

              {diatonicChords.map(
                (item, index) => (
                  <View
                    key={`${item.degree}-${item.chord}-${index}`}
                    className="bg-[#111111] border border-gray-800 rounded-2xl px-4 py-3 mr-2 mb-2"
                  >
                    <Text className="text-gray-500 text-xs">
                      {item.degree}
                    </Text>

                    <Text className="text-white text-lg font-bold mt-1">
                      {item.chord}
                    </Text>
                  </View>
                )
              )}

            </View>
          </View>

          {/* Detected Chords */}

          <View className="mt-10">

            <Text className="text-white text-2xl font-bold">
              Chords heard
            </Text>

            <Text className="text-gray-500 text-sm mt-2">
              The strongest chord patterns found
              throughout the recording.
            </Text>

            <View className="flex-row flex-wrap mt-5">

              {detectedChords.map(
                (chord, index) => (
                  <View
                    key={`${chord}-${index}`}
                    className="bg-white rounded-2xl px-4 py-3 mr-2 mb-2"
                  >
                    <Text className="text-black text-base font-bold">
                      {chord}
                    </Text>
                  </View>
                )
              )}

            </View>
          </View>

          {/* New Recording */}

          <TouchableOpacity
            activeOpacity={0.85}
            className="w-full bg-white rounded-2xl mt-12 py-5 items-center justify-center"
            onPress={() => {
              router.replace(
                "/screens/home"
              );
            }}
          >
            <Text className="text-black text-lg font-bold">
              Detect Another Song
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
}