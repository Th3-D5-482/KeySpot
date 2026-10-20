import { Screen } from "@/components/Screen";
import { TransposePlaceholder } from "@/components/transpose/TransposePlaceholder";
import { useState } from "react";

const musicalKeys = [
  "C",
  "C# / Db",
  "D",
  "D# / Eb",
  "E",
  "F",
  "F# / Gb",
  "G",
  "G# / Ab",
  "A",
  "A# / Bb",
  "B",
];

export default function Transpose() {
  const [originalKey, setOriginalKey] = useState("C");
  const [pickerVisible, setPickerVisible] = useState(false);
  return (
    <Screen>
      <TransposePlaceholder originalKey={originalKey} setOriginalKey={setOriginalKey} musicalKeys={musicalKeys} pickerVisible={pickerVisible} setPickerVisible={setPickerVisible} />
    </Screen>
  );
}
