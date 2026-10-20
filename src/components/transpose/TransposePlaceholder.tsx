import { Text, View } from "react-native";
import { ChordsDropDown } from "../ChordsDropDown";

type TransposePlaceholderProps = {
  originalKey: string;
  setOriginalKey: (key: string) => void;
  musicalKeys: string[];
  pickerVisible: boolean;
  setPickerVisible: (visible: boolean) => void;
};

export const TransposePlaceholder = ({ originalKey, setOriginalKey, musicalKeys, pickerVisible, setPickerVisible }: TransposePlaceholderProps) => {
  return (
    <View className="flex-1 py-5 px-5">
      <View className="pt-7">
        <Text className="text-white w-full text-3xl font-bold tracking-tighter">KeySpot</Text>
        <Text className="text-gray-500 text-sm mt-1">TRANSPOSE</Text>
      </View>
      <View className="pt-16">
        <Text className="text-white font-extrabold text-4xl">Transpose</Text>
      </View>
      <View className="pt-5">
        <Text className="text-gray-500 text-xl">Enter the original key and the key you</Text>
        <Text className="text-gray-500 text-xl mt-1">want to transpose to. See the difference</Text>
        <Text className="text-gray-500 text-xl mt-1">and relative chords.</Text>
      </View>
      <View className="pt-16 items-center border border-gray-800 rounded-[32px] mt-8 px-6 py-20">
        <Text className="text-white w-full">Original Key</Text>
        <ChordsDropDown originalKey={originalKey} setOriginalKey={(key) => setOriginalKey(key.toString())} pickerVisible={pickerVisible} setPickerVisible={setPickerVisible} musicalKeys={musicalKeys} />
      </View>
    </View>
  );
}

