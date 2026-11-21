
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

      {/* KEY SELECTOR */}

      <Pressable
        onPress={() => setPickerVisible(true)}
        accessibilityRole="button"
        accessibilityLabel={`${title}: ${originalKey}`}
        className="h-[58px] w-full flex-row items-center justify-between rounded-2xl border border-[#252D3A] bg-[#202632] px-4 active:bg-[#252D3A]"
      >

        <View className="flex-row items-center">

          <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#151922]">

            <MaterialCommunityIcons
              name="music-note"
              size={19}
              color="#34D399"
            />

          </View>

          <Text className="text-[#F8FAFC] text-[17px] font-bold ml-3">
            {originalKey}
          </Text>

        </View>

        <MaterialCommunityIcons
          name="chevron-down"
          size={22}
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

          {/* MODAL CONTAINER */}

          <View className="overflow-hidden rounded-[26px] border border-[#252D3A] bg-[#151922]">

            {/* MODAL HEADER */}

            <View className="flex-row items-center justify-between px-5 py-5">

              <View className="flex-1">

                <Text className="text-[#F8FAFC] text-[17px] font-extrabold">
                  {title}
                </Text>

                <Text className="text-[#8491A5] text-[12px] mt-1">
                  Choose a musical key
                </Text>

              </View>

              <Pressable
                onPress={() => setPickerVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Close key selector"
                className="h-9 w-9 items-center justify-center rounded-xl border border-[#252D3A] bg-[#202632]"
              >

                <MaterialCommunityIcons
                  name="close"
                  size={19}
                  color="#A7B2C3"
                />

              </Pressable>

            </View>

            {/* DIVIDER */}

            <View className="h-px bg-[#252D3A]" />

            {/* KEY OPTIONS */}

            <ScrollView
              showsVerticalScrollIndicator={false}
              className="max-h-[420px]"
              contentContainerStyle={{
                padding: 12,
              }}
            >

              {musicalKeys.map((key) => {
                const isSelected = originalKey === key;

                return (
                  <Pressable
                    key={key}
                    onPress={() => {
                      setOriginalKey(key);
                      setPickerVisible(false);
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    className={`flex-row items-center justify-between rounded-xl px-4 py-3.5 mb-1.5 ${
                      isSelected
                        ? "border border-[#285B4B] bg-[#14251F]"
                        : "border border-transparent bg-transparent"
                    }`}
                  >

                    <View className="flex-row items-center">

                      <View
                        className={`h-10 w-10 items-center justify-center rounded-xl ${
                          isSelected
                            ? "bg-[#203D32]"
                            : "bg-[#202632]"
                        }`}
                      >

                        <MaterialCommunityIcons
                          name="music-note"
                          size={19}
                          color={isSelected ? "#34D399" : "#8491A5"}
                        />

                      </View>

                      <Text
                        className={`text-[15px] ml-3 ${
                          isSelected
                            ? "font-extrabold text-[#F8FAFC]"
                            : "font-medium text-[#CBD5E1]"
                        }`}
                      >
                        {key}
                      </Text>

                    </View>

                    {isSelected && (
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={21}
                        color="#34D399"
                      />
                    )}

                  </Pressable>
                );
              })}

            </ScrollView>

            {/* MODAL FOOTER */}

            <View className="border-t border-[#252D3A] px-5 py-4">

              <Text className="text-center text-[#64748B] text-[10px] font-bold tracking-[1.5px]">
                {musicalKeys.length} AVAILABLE KEYS
              </Text>

            </View>

          </View>

        </View>

      </Modal>

    </View>
  );
};
