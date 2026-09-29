import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ListenPanelProps = {
  isListening: boolean;
  onListen: () => void;
  onTranspose:() => void;
};

export const ListenPanel = ({ isListening, onListen, onTranspose }: ListenPanelProps) => {
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
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={isListening}
            onPress={onListen}
            className={`
              w-56
              h-56
              rounded-full
              mt-11
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
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onTranspose}
        className="border rounded-[30px] border-gray-800 bg-[#080808] py-4"
      >
        <View className="flex-row items-center px-5">

          <Ionicons
            name="swap-horizontal"
            size={26}
            color="#777777"
          />

          <View className="flex-1 items-center ml-3">
            <Text className="text-white text-lg font-semibold text-center">
              Transpose
            </Text>

            <Text
              className="text-gray-600 text-xs mt-1 text-center"
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Change key · Find increments
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={24}
            color="#555555"
          />

        </View>
      </TouchableOpacity>

      {/* Footer */}
      <View className="items-center pb-5 mt-7">
        <Text className="text-gray-700 text-[10px] font-medium tracking-widest">
          HEAR • KNOW • PLAY
        </Text>
      </View>

    </View>
  );
};