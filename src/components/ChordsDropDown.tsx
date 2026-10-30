import { Modal, Pressable, Text, View } from "react-native";

type ChordsDropDownProps = {
  originalKey: string;
  setOriginalKey: (key: string) => void;
  pickerVisible: boolean;
  setPickerVisible: (visible: boolean) => void;
  musicalKeys: string[];
  title?: string;
};

export const ChordsDropDown = ({
  originalKey,
  setOriginalKey,
  pickerVisible,
  setPickerVisible,
  musicalKeys,
  title = "Select Key",
}: ChordsDropDownProps) => {
  return (
    <View className='w-full mt-2'>
      <Pressable onPress={() => setPickerVisible(true)} className="w-full h-14 border border-gray-800 rounded-2xl items-center justify-between px-4 bg-[#111111] flex-row">
        <Text className='text-white text-base font-medium'>{originalKey}</Text>
        <Text className="text-gray-500 text-base">▼
        </Text>
      </Pressable>
      <Modal visible={pickerVisible} animationType="fade" onRequestClose={() => setPickerVisible(false)} transparent statusBarTranslucent>
        <Pressable onPress={() => setPickerVisible(false)} className="flex-1 bg-black/70 px-8 justify-center">
          <Pressable onPress={(event) => event.stopPropagation()} className="border border-gray-800 rounded-[24px] overflow-hidden bg-[#080808]">
            <Text className="px-5 py-5 text-white text-lg font-bold">{title}</Text>
            <View className="h-px bg-gray-800" />
            {musicalKeys.map((key) => (
              <Pressable onPress={() => setPickerVisible(false)} className={`px-5 py-4 ${originalKey === key ? "bg-[#181818]" : ""
                }`}>
                <Text className={`text-base ${originalKey === key
                    ? "text-white font-bold"
                    : "text-gray-400"
                  }`}
                >{key}</Text>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};
