import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

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
    <View className="w-full">

      {/* SELECTOR */}

      <Pressable
        onPress={() => setPickerVisible(true)}
        className="h-[60px] w-full flex-row items-center justify-between rounded-2xl border border-[#293241] bg-[#202632] px-4 active:bg-[#252D3A]"
      >

        <View className="flex-row items-center gap-3">

          <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#171B23]">
            <MaterialCommunityIcons
              name="music-note"
              size={20}
              color="#8B9BB4"
            />
          </View>

          <Text className="text-[17px] font-bold text-white">
            {originalKey}
          </Text>

        </View>

        <MaterialCommunityIcons
          name="chevron-down"
          size={24}
          color="#8491A5"
        />

      </Pressable>

      {/* KEY PICKER MODAL */}

      <Modal
        visible={pickerVisible}
        animationType="fade"
        onRequestClose={() => setPickerVisible(false)}
        transparent
        statusBarTranslucent
      >

        <View className="flex-1 justify-center bg-black/75 px-6">

          {/* OUTSIDE PRESS */}

          <Pressable
            onPress={() => setPickerVisible(false)}
            className="absolute inset-0"
          />

          {/* MODAL CARD */}

          <View className="overflow-hidden rounded-[28px] border border-[#293241] bg-[#171B23]">

            {/* MODAL HEADER */}

            <View className="flex-row items-center justify-between px-5 py-5">

              <View>
                <Text className="text-white text-[18px] font-extrabold">
                  {title}
                </Text>

                <Text className="text-[#8491A5] text-[13px] mt-1">
                  Choose a musical key
                </Text>
              </View>

              <Pressable
                onPress={() => setPickerVisible(false)}
                className="h-9 w-9 rounded-full bg-[#202632] items-center justify-center"
              >
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color="#8491A5"
                />
              </Pressable>

            </View>

            {/* DIVIDER */}

            <View className="h-px bg-[#293241]" />

            {/* KEY OPTIONS */}

            <ScrollView
              showsVerticalScrollIndicator={false}
              className="max-h-[420px]"
            >

              <View className="p-3 gap-1">

                {musicalKeys.map((key) => {
                  const isSelected = originalKey === key;

                  return (
                    <Pressable
                      key={key}
                      onPress={() => {
                        setOriginalKey(key);
                        setPickerVisible(false);
                      }}
                      className={`flex-row items-center justify-between rounded-2xl px-4 py-4 ${
                        isSelected
                          ? "bg-[#12251F] border border-[#23473A]"
                          : "bg-transparent"
                      }`}
                    >

                      <View className="flex-row items-center gap-3">

                        <View
                          className={`h-10 w-10 items-center justify-center rounded-xl ${
                            isSelected
                              ? "bg-[#1B382E]"
                              : "bg-[#202632]"
                          }`}
                        >
                          <MaterialCommunityIcons
                            name="music-note"
                            size={20}
                            color={isSelected ? "#34D399" : "#8491A5"}
                          />
                        </View>

                        <Text
                          className={`text-[16px] ${
                            isSelected
                              ? "font-extrabold text-white"
                              : "font-medium text-[#A7B2C3]"
                          }`}
                        >
                          {key}
                        </Text>

                      </View>

                      {isSelected && (
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={22}
                          color="#34D399"
                        />
                      )}

                    </Pressable>
                  );
                })}

              </View>

            </ScrollView>

            {/* FOOTER */}

            <View className="border-t border-[#293241] px-5 py-4">

              <Text className="text-center text-[11px] font-semibold tracking-[1px] text-[#64748B]">
                {musicalKeys.length} AVAILABLE KEYS
              </Text>

            </View>

          </View>

        </View>

      </Modal>

    </View>
  );
};