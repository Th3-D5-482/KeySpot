import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

type ChordsDropDownProps = {
  originalKey: string;
  setOriginalKey: (key: string) => void;
  musicalKeys: string[];
  title?: string;
};

export const ChordsDropDown = ({
  originalKey,
  setOriginalKey,
  musicalKeys,
  title = "Select Key",
}: ChordsDropDownProps) => {
  const [pickerVisible, setPickerVisible] = useState(false);

  return (
    <View className="mt-2 w-full">
      <Pressable
        onPress={() => setPickerVisible(true)}
        className="h-14 w-full flex-row items-center justify-between rounded-2xl border border-gray-800 bg-[#111111] px-4"
      >
        <Text className="text-base font-medium text-white">{originalKey}</Text>
        <Text className="text-gray-500 text-base">▼
        </Text>
      </Pressable>
      <Modal
        visible={pickerVisible}
        animationType="fade"
        onRequestClose={() => setPickerVisible(false)}
        transparent
        statusBarTranslucent
      >
        <Pressable
          onPress={() => setPickerVisible(false)}
          className="flex-1 justify-center bg-black/70 px-8"
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
            className="overflow-hidden rounded-[24px] border border-gray-800 bg-[#080808]"
          >
            <Text className="px-5 py-5 text-white text-lg font-bold">{title}</Text>
            <View className="h-px bg-gray-800" />
            {musicalKeys.map((key) => {
              const isSelected = originalKey === key;

              return (
                <Pressable
                  key={key}
                  onPress={() => {
                    setOriginalKey(key);
                    setPickerVisible(false);
                  }}
                  className={`px-5 py-4 ${isSelected ? "bg-[#181818]" : ""}`}
                >
                  <Text
                    className={`text-base ${
                      isSelected ? "font-bold text-white" : "text-gray-400"
                    }`}
                  >
                    {key}
                  </Text>
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};
