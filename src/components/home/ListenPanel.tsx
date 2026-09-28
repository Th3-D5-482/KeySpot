import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ListenPanelProps = {
  isListening: boolean;
  onListen: () => void;
};

export const ListenPanel = ({ isListening, onListen }: ListenPanelProps) => {
  return (
    <View className="flex-1 bg-black px-5 py-5">
      <View className="pt-8">
        <Text className="text-white text-3xl font-bold tracking-tight">
          KeySpot
        </Text>
        <Text className="text-gray-500 text-sm font-medium mt-1 tracking-wide">
          MUSIC KEY DETECTOR
        </Text>
      </View>

      <View className="flex-1 justify-center">
        <View className="w-full rounded-[32px] border border-gray-800 bg-[#080808] px-6 py-10 items-center">
          <Text className="text-white text-4xl font-bold text-center">
            Hear it.
          </Text>
          <Text className="text-gray-500 text-xl text-center mt-2">
            Know the key.
          </Text>
          <Text className="text-gray-500 text-xl text-center">Play along.</Text>

          <TouchableOpacity
            activeOpacity={0.85}
            disabled={isListening}
            onPress={onListen}
            className={`
              w-56
              h-56
              rounded-full
              mt-12
              justify-center
              items-center
              ${isListening ? "bg-[#111111] border-2 border-gray-700" : "bg-white"}
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

          {isListening ? (
            <View className="items-center mt-10">
              <View className="flex-row items-center">
                <View className="w-2.5 h-2.5 rounded-full bg-[#05ce40] mr-2" />
                <Text className="text-[#05ce40] text-base font-semibold">
                  Listening for chord changes...
                </Text>
              </View>
              <Text className="text-gray-600 text-sm mt-2 text-center">
                Keep playing through the progression
              </Text>
            </View>
          ) : (
            <View className="items-center mt-10">
              <Text className="text-gray-500 text-base text-center">
                Play a song and tap the button
              </Text>
              <Text className="text-gray-600 text-sm text-center mt-2">
                KeySpot will analyze the full chord progression
              </Text>
            </View>
          )}
        </View>
      </View>

      <View className="items-center pb-8">
        <Text className="text-gray-700 text-xs font-medium tracking-widest">
          HEAR • KNOW • PLAY
        </Text>
      </View>
    </View>
  );
};
