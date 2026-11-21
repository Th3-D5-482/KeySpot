
import {
  ActivityIndicator,
  Animated,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Footer } from "../Footer";
import { Header } from "../Header";

type ListenPanelProps = {
  isListening: boolean;
  onListen: () => void;
  onTranspose: () => void;
  firstPulse: Animated.Value;
  secondPulse: Animated.Value;
};

export const ListenPanel = ({
  isListening,
  onListen,
  onTranspose,
  firstPulse,
  secondPulse,
}: ListenPanelProps) => {
  const pulseStyle = (value: Animated.Value) => ({
    opacity: value.interpolate({
      inputRange: [0, 1],
      outputRange: [0.45, 0],
    }),
    transform: [
      {
        scale: value.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.6],
        }),
      },
    ],
  });

  return (
    <View className="flex-1">

      {/* HEADER */}

      <Header
        title="MUSIC KEY DETECTOR"
        showBackButton={false}
      />

      {/* MAIN CONTENT */}

      <View className="flex-1 justify-center">

        {/* DETECTOR CARD */}

        <View className="w-full rounded-[28px] border border-[#252D3A] bg-[#151922] px-5 py-8">

          {/* INTRODUCTION */}

          <View className="items-center">

            <Text className="text-[#F8FAFC] text-[32px] font-extrabold tracking-[-1px] text-center">
              Hear it.
            </Text>

            <Text className="text-[#8491A5] text-[17px] font-medium text-center mt-2 leading-6">
              Know the key. Play along.
            </Text>

          </View>

          {/* LISTEN BUTTON */}

          <View className="w-[184px] h-[184px] self-center mt-10 items-center justify-center">

            {isListening && (
              <>
                <Animated.View
                  pointerEvents="none"
                  className="absolute inset-0 rounded-full border border-[#34D399]"
                  style={pulseStyle(firstPulse)}
                />

                <Animated.View
                  pointerEvents="none"
                  className="absolute inset-0 rounded-full border border-[#34D399]"
                  style={pulseStyle(secondPulse)}
                />
              </>
            )}

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={isListening}
              onPress={onListen}
              accessibilityRole="button"
              accessibilityLabel={
                isListening
                  ? "KeySpot is listening"
                  : "Tap to identify music key"
              }
              className={`
                w-full h-full rounded-full items-center justify-center
                ${
                  isListening
                    ? "bg-[#151922] border-[2px] border-[#34D399]"
                    : "bg-[#34D399]"
                }
              `}
            >

              {isListening ? (
                <>
                  <ActivityIndicator
                    size="large"
                    color="#34D399"
                  />

                  <Text className="text-[#F8FAFC] text-base font-bold mt-4">
                    Listening
                  </Text>
                </>
              ) : (
                <>
                  <View className="items-center">

                    <Text className="text-[#0F1117] text-[23px] font-extrabold tracking-tight">
                      Tap to
                    </Text>

                    <Text className="text-[#0F1117] text-[23px] font-extrabold tracking-tight">
                      Listen
                    </Text>

                  </View>
                </>
              )}

            </TouchableOpacity>

          </View>

          {/* STATUS */}

          <View className="items-center mt-8">

            {isListening ? (
              <>
                <View className="flex-row items-center justify-center">

                  <View className="w-2 h-2 rounded-full bg-[#34D399] mr-2" />

                  <Text className="text-[#34D399] text-[13px] font-semibold">
                    Listening for chord changes
                  </Text>

                </View>

                <Text className="text-[#8491A5] text-[12px] text-center mt-3 leading-5">
                  Keep playing through the progression
                </Text>
              </>
            ) : (
              <>
                <Text className="text-[#E2E8F0] text-[14px] font-semibold text-center">
                  Ready to identify your key?
                </Text>

                <Text className="text-[#8491A5] text-[12px] text-center mt-2 leading-5 px-2">
                  Play a song or chord progression and let KeySpot do the rest.
                </Text>
              </>
            )}

          </View>

        </View>

        {/* TRANSPOSE SHORTCUT */}

        {!isListening && (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onTranspose}
            accessibilityRole="button"
            className="flex-row items-center justify-center mt-5 py-4 rounded-2xl border border-[#252D3A] bg-[#151922]"
          >

            <Text className="text-[#CBD5E1] text-[13px] font-medium">
              Want to change a key?
            </Text>

            <Text className="text-[#34D399] text-[13px] font-bold ml-2">
              Transpose
            </Text>

            <Text className="text-[#34D399] text-[15px] font-semibold ml-2">
              →
            </Text>

          </TouchableOpacity>
        )}

      </View>

      {/* FOOTER */}

      <Footer />

    </View>
  );
};
