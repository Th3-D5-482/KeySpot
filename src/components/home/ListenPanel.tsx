
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
      outputRange: [0.4, 0],
    }),
    transform: [
      {
        scale: value.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.55],
        }),
      },
    ],
  });

  return (
    <View className="flex-1 py-5 px-5">

      {/* Header */}
      <Header
        title="MUSIC KEY DETECTOR"
        showBackButton={false}
      />

      {/* Main Content */}
      <View className="flex-1 justify-center py-6">

        <View className="w-full items-center rounded-[32px] border border-[#293241] bg-[#171B23] px-5 py-9">

          {/* Introduction */}
          <View className="items-center">
            <Text className="text-white text-[36px] font-extrabold tracking-tight text-center">
              Hear it.
            </Text>

            <Text className="text-[#8491A5] text-[19px] font-medium text-center mt-1">
              Know the key.
            </Text>

            <Text className="text-[#8491A5] text-[19px] font-medium text-center">
              Play along.
            </Text>
          </View>

          {/* Listening Button */}
          <View className="w-52 h-52 mt-10 items-center justify-center">

            {isListening && (
              <>
                <Animated.View
                  pointerEvents="none"
                  className="absolute inset-0 rounded-full border-2 border-[#34D399]"
                  style={pulseStyle(firstPulse)}
                />

                <Animated.View
                  pointerEvents="none"
                  className="absolute inset-0 rounded-full border-2 border-[#34D399]"
                  style={pulseStyle(secondPulse)}
                />
              </>
            )}

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={isListening}
              onPress={onListen}
              className={`
                w-full h-full rounded-full items-center justify-center
                ${
                  isListening
                    ? "bg-[#202632] border-2 border-[#34D399]"
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

                  <Text className="text-white text-lg font-bold mt-4">
                    Listening
                  </Text>
                </>
              ) : (
                <>
                  <Text className="text-[#0B0D12] text-[25px] font-extrabold text-center">
                    Tap to
                  </Text>

                  <Text className="text-[#0B0D12] text-[25px] font-extrabold text-center">
                    Listen
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Listening Status */}
          <View className="items-center mt-9">

            {isListening ? (
              <>
                <View className="flex-row items-center">
                  <View className="w-2 h-2 rounded-full bg-[#34D399] mr-2" />

                  <Text className="text-[#34D399] text-sm font-bold">
                    Listening for chord changes...
                  </Text>
                </View>

                <Text className="text-[#8491A5] text-xs text-center mt-3">
                  Keep playing through the progression
                </Text>
              </>
            ) : (
              <>
                <Text className="text-[#CBD5E1] text-sm font-semibold text-center">
                  Ready to identify your key?
                </Text>

                <Text className="text-[#8491A5] text-xs text-center mt-2 leading-5">
                  Play a song or chord progression and let KeySpot
                  do the rest.
                </Text>
              </>
            )}

          </View>
        </View>

        {/* Transpose Shortcut */}
        {!isListening && (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onTranspose}
            className="flex-row items-center justify-center mt-6 py-3"
          >
            <Text className="text-[#8491A5] text-sm font-medium">
              Want to change a key?
            </Text>

            <Text className="text-[#34D399] text-sm font-bold ml-2">
              Transpose
            </Text>

            <Text className="text-[#34D399] text-base ml-1">
              →
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Footer */}
      <Footer />

    </View>
  );
};
