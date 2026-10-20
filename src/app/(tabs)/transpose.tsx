import { NOTE_NAMES } from "@/components/features/detection/constants";
import { Screen } from "@/components/Screen";
import { TransposePlaceholder } from "@/components/transpose/TransposePlaceholder";
import { useState } from "react";

export default function Transpose() {
  const [originalKey, setOriginalKey] = useState("C");
  const [pickerVisible, setPickerVisible] = useState(false);
  return (
    <Screen>
      <TransposePlaceholder originalKey={originalKey} setOriginalKey={setOriginalKey} musicalKeys={NOTE_NAMES} pickerVisible={pickerVisible} setPickerVisible={setPickerVisible} />
    </Screen>
  );
}
