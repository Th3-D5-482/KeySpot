import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { ChordsDropDown } from "../ChordsDropDown";
import { Footer } from "../Footer";

type TransposePlaceholderProps = {
  originalKey: string;
  setOriginalKey: (key: string) => void;
  musicalKeys: string[];
  pickerVisible: boolean;
  setPickerVisible: (visible: boolean) => void;
  targetKey: string;
  setTargetKey: (key: string) => void;
  onBackFunction?: () => void;
};

export const TransposePlaceholder = ({
  originalKey,
  setOriginalKey,
  musicalKeys,
  pickerVisible,
  setPickerVisible,
  targetKey,
  setTargetKey,
  onBackFunction,
}: TransposePlaceholderProps) => {
  return (
    <View className="flex-1 bg-black px-5 py-5">

      {/* Header */}
      <View className="flex-row items-center px-1 pt-7">
        <TouchableOpacity activeOpacity={0.7} onPress={onBackFunction}
          className="w-10 h-10 items-center justify-center rounded-full bg-[#111111]" 
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
        <View className="ml-4">
          <Text className="text-white text-3xl font-bold tracking-tight">
            KeySpot
          </Text>

          <Text className="text-gray-500 text-xs font-medium mt-1 tracking-widest">
            TRANSPOSE
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 mt-8 justify-center">
        <View className="w-full rounded-[32px] border border-gray-800 bg-[#080808] px-6 py-9">

          {/* Title */}
          <View className="items-center">
            <Text className="text-white text-4xl font-bold text-center">
              Transpose
            </Text>

            <Text className="text-gray-500 text-base text-center mt-3 leading-6">
              Change the key of your music.
            </Text>

            <Text className="text-gray-600 text-sm text-center mt-1 leading-5">
              Select your original and target keys
              {"\n"}to find the difference.
            </Text>
          </View>

          {/* Key Selectors */}
          <View className="mt-9">
            <Text className="text-gray-400 text-xs font-semibold tracking-widest mb-1">
              ORIGINAL KEY
            </Text>

            <ChordsDropDown
              originalKey={originalKey}
              setOriginalKey={(key) => setOriginalKey(key.toString())}
              pickerVisible={pickerVisible}
              setPickerVisible={setPickerVisible}
              musicalKeys={musicalKeys}
            />

            <Text className="text-gray-400 text-xs font-semibold tracking-widest mt-7 mb-1">
              TARGET KEY
            </Text>

            <ChordsDropDown
              originalKey={targetKey}
              setOriginalKey={(key) => setTargetKey(key.toString())}
              pickerVisible={pickerVisible}
              setPickerVisible={setPickerVisible}
              musicalKeys={musicalKeys}
            />
          </View>

          {/* Calculate Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            className="w-full mt-9 h-16 rounded-2xl bg-white items-center justify-center"
          >
            <Text className="text-black text-base font-bold">
              Calculate
            </Text>
          </TouchableOpacity>

        </View>
      </View>

      {/* Footer */}
      <Footer />

    </View>
  );
};
