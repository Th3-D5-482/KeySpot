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
    <View className="flex-1 bg-[#0B0D12] px-5 pt-5 pb-3">

      {/* HEADER */}

      <Header
        title="TRANSPOSE"
        showBackButton={showBackButton}
        onBackFunction={onBackFunction}
      />

      {/* MAIN CONTENT */}

      <View className="flex-1 justify-center">

        <View className="rounded-[28px] border border-[#293241] bg-[#171B23] px-5 py-7">

          {/* ICON */}

          <View className="items-center">

            <View className="h-[68px] w-[68px] rounded-[22px] bg-[#12251F] border border-[#23473A] items-center justify-center">
              <MaterialCommunityIcons
                name="music-clef-treble"
                size={34}
                color="#34D399"
              />
            </View>

          </View>

          {/* TITLE */}

          <View className="mt-5 items-center">

            <Text className="text-white text-[28px] font-extrabold tracking-tight text-center">
              Transpose
            </Text>

            <Text className="text-[#8491A5] text-[14px] text-center mt-2 leading-5">
              Change the key of your music.
            </Text>

            <Text className="text-[#64748B] text-[13px] text-center mt-2 leading-5">
              Select your original and target keys{"\n"}
              to calculate the transposition.
            </Text>

          </View>

          {/* KEY SELECTION */}

          <View className="mt-8">

            {/* ORIGINAL KEY */}

            <View>

              <View className="flex-row items-center gap-2 mb-2">
                <MaterialCommunityIcons
                  name="music"
                  size={16}
                  color="#8B9BB4"
                />

                <Text className="text-[#A7B2C3] text-[11px] font-bold tracking-[1.5px]">
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

            {/* TRANSITION ICON */}

            <View className="items-center my-3">

              <View className="h-9 w-9 rounded-full border border-[#293241] bg-[#202632] items-center justify-center">
                <MaterialCommunityIcons
                  name="arrow-down"
                  size={18}
                  color="#8491A5"
                />
              </View>

            </View>

            {/* TARGET KEY */}

            <View>

              <View className="flex-row items-center gap-2 mb-2">
                <MaterialCommunityIcons
                  name="music-note"
                  size={16}
                  color="#8B9BB4"
                />

                <Text className="text-[#A7B2C3] text-[11px] font-bold tracking-[1.5px]">
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
            activeOpacity={0.8}
            onPress={onCalculate}
            className="mt-8 h-[58px] w-full flex-row items-center justify-center gap-2 rounded-2xl bg-[#34D399]"
          >

            <Text className="text-[#071711] text-[15px] font-extrabold">
              Calculate Transposition
            </Text>

            <MaterialCommunityIcons
              name="arrow-right"
              size={20}
              color="#071711"
            />

          </TouchableOpacity>

        </View>

      </View>

      {/* FOOTER */}

      <Footer />

    </View>
  );
};