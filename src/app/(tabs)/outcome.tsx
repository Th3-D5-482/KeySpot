import { OutcomeContent } from "@/components/outcome/OutcomeContent";
import { Screen } from "@/components/Screen";
import { router } from "expo-router";

const onBackFunction = () => {
  router.back();
}

export default function Outcome() {
  return (
    <Screen>
      <OutcomeContent onBackFunction={onBackFunction}/>
    </Screen>
  );
}
