import {
  ActivityIndicator,
  Animated,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TransposeButton } from "../TransposeButton";

type ListenPanelProps = {
  isListening: boolean;
  onListen: () => void;
  onTranspose: () => void;
  firstPulse: Animated.Value,
  secondPulse: Animated.Value,
};

export const ListenPanel = ({ isListening, onListen, onTranspose, firstPulse,secondPulse }: ListenPanelProps) => {
  return (
    <View className="flex-1 bg-black px-5 py-5">

      {/* Header */}
      <View className="pt-7">
        <Text className="text-white text-3xl font-bold tracking-tight">
          KeySpot
        </Text>

        <Text className="text-gray-500 text-xs font-medium mt-1 tracking-widest">
          MUSIC KEY DETECTOR
        </Text>
      </View>

      {/* Main Card */}
      <View className="flex-1 justify-center">
        <View className="w-full rounded-[32px] border border-gray-800 bg-[#080808] px-6 py-9 items-center">

          <Text className="text-white text-4xl font-bold text-center">
            Hear it.
          </Text>

          <Text className="text-gray-500 text-xl text-center mt-2">
            Know the key.
          </Text>

          <Text className="text-gray-500 text-xl text-center">
            Play along.
          </Text>

          {/* Listen Button */}
          <View className="w-56 h-56 mt-11 items-center justify-center">
            {isListening && (
              <>
                <Animated.View
                  pointerEvents="none"
                  className="absolute inset-0 rounded-full border-2 border-[#05ce40]"
                  style={{
                    opacity: firstPulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.45, 0],
                    }),
                    transform: [
                      {
                        scale: firstPulse.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.55],
                        }),
                      },
                    ],
                  }}
                />
                <Animated.View
                  pointerEvents="none"
                  className="absolute inset-0 rounded-full border-2 border-[#05ce40]"
                  style={{
                    opacity: secondPulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.45, 0],
                    }),
                    transform: [
                      {
                        scale: secondPulse.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.55],
                        }),
                      },
                    ],
                  }}
                />
              </>
            )}

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={isListening}
              onPress={onListen}
              className={`
                w-full
                h-full
                rounded-full
                justify-center
                items-center
                ${isListening
                  ? "bg-[#111111] border-2 border-gray-700"
                  : "bg-white"
                }
              `}
            >
              {isListening ? (
                <>
                  <ActivityIndicator size="large" color="white" />

                  <Text className="text-white text-lg font-semibold mt-4">
                    Listening
                  </Text>
                </>
              ) : (
                <>
                  <Text className="text-black text-2xl font-bold text-center">
                    Tap to
                  </Text>

                  <Text className="text-black text-2xl font-bold text-center">
                    Listen
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Status */}
          {isListening ? (
            <View className="items-center mt-9">

              <View className="flex-row items-center px-2">
                <View className="w-2 h-2 rounded-full bg-[#05ce40] mr-2" />

                <Text className="text-[#05ce40] text-sm font-semibold">
                  Listening for chord changes...
                </Text>
              </View>

              <Text className="text-gray-600 text-xs mt-2 text-center">
                Keep playing through the progression
              </Text>

            </View>
          ) : (
            <View className="items-center mt-9">

              <Text className="text-gray-500 text-sm text-center">
                Play a song and tap the button
              </Text>

              <Text className="text-gray-600 text-xs text-center mt-2">
                KeySpot will analyze the full chord progression
              </Text>

            </View>
          )}
        </View>
      </View>

      {/* Transpose */}
      <TransposeButton onTranspose={onTranspose} />

      {/* Footer */}
      <View className="items-center pb-5 mt-7">
        <Text className="text-gray-700 text-[10px] font-medium tracking-widest">
          HEAR • KNOW • PLAY
        </Text>
      </View>

    </View>
  );
};