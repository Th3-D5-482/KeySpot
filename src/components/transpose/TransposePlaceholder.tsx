
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

import { ChordsDropDown } from "../ChordsDropDown";
import { Footer } from "../Footer";
import { Header } from "../Header";

type TransposePlaceholderProps = {
  originalKey: string;
  setOriginalKey: (key: string) => void;
  musicalKeys: string[];
  targetKey: string;
  setTargetKey: (key: string) => void;
  showBackButton: boolean;
  onBackFunction?: () => void;
  onCalculate: () => void;
};

export const TransposePlaceholder = ({
  originalKey,
  setOriginalKey,
  musicalKeys,
  targetKey,
  setTargetKey,
  showBackButton,
  onBackFunction,
  onCalculate,
}: TransposePlaceholderProps) => {
  return (
    <View className="flex-1 pt-2">

      {/* HEADER */}

      <Header
        title="TRANSPOSE"
        showBackButton={showBackButton}
        onBackFunction={onBackFunction}
      />

      {/* MAIN CONTENT */}

      <View className="flex-1 justify-center">

        {/* TRANSPOSE CARD */}

        <View className="rounded-[28px] border border-[#252D3A] bg-[#151922] px-5 py-7">

          {/* ICON */}

          <View className="items-center">

            <View className="h-[62px] w-[62px] items-center justify-center rounded-[20px] border border-[#285B4B] bg-[#14251F]">

              <MaterialCommunityIcons
                name="music-clef-treble"
                size={31}
                color="#34D399"
              />

            </View>

          </View>

          {/* INTRODUCTION */}

          <View className="mt-5 items-center">

            <Text className="text-[#F8FAFC] text-[27px] font-extrabold tracking-[-0.8px] text-center">
              Transpose
            </Text>

            <Text className="text-[#8491A5] text-[13px] font-medium text-center mt-2">
              Change the key of your music.
            </Text>

            <Text className="text-[#64748B] text-[12px] text-center mt-2 leading-5">
              Select your original and target keys{"\n"}
              to calculate the transposition.
            </Text>

          </View>

          {/* KEY SELECTION */}

          <View className="mt-7">

            {/* ORIGINAL KEY */}

            <View>

              <View className="flex-row items-center mb-2.5">

                <MaterialCommunityIcons
                  name="music-note"
                  size={16}
                  color="#8491A5"
                />

                <Text className="text-[#A7B2C3] text-[10px] font-bold tracking-[1.6px] ml-2">
                  ORIGINAL KEY
                </Text>

              </View>

              <ChordsDropDown
                originalKey={originalKey}
                setOriginalKey={(key) => setOriginalKey(key.toString())}
                musicalKeys={musicalKeys}
                title="Select Original Key"
              />

            </View>

            {/* TRANSITION INDICATOR */}

            <View className="items-center my-3">

              <View className="h-9 w-9 items-center justify-center rounded-full border border-[#252D3A] bg-[#202632]">

                <MaterialCommunityIcons
                  name="arrow-down"
                  size={17}
                  color="#8491A5"
                />

              </View>

            </View>

            {/* TARGET KEY */}

            <View>

              <View className="flex-row items-center mb-2.5">

                <MaterialCommunityIcons
                  name="music-note-eighth"
                  size={16}
                  color="#8491A5"
                />

                <Text className="text-[#A7B2C3] text-[10px] font-bold tracking-[1.6px] ml-2">
                  TARGET KEY
                </Text>

              </View>

              <ChordsDropDown
                originalKey={targetKey}
                setOriginalKey={(key) => setTargetKey(key.toString())}
                musicalKeys={musicalKeys}
                title="Select Target Key"
              />

            </View>

          </View>

          {/* CALCULATE BUTTON */}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onCalculate}
            accessibilityRole="button"
            className="h-[56px] w-full flex-row items-center justify-center rounded-2xl bg-[#34D399] mt-7"
          >

            <Text className="text-[#0F1117] text-[14px] font-extrabold">
              Calculate Transposition
            </Text>

            <MaterialCommunityIcons
              name="arrow-right"
              size={20}
              color="#0F1117"
              style={{ marginLeft: 9 }}
            />

          </TouchableOpacity>

        </View>

      </View>

      {/* FOOTER */}

      <Footer />

    </View>
  );
};
