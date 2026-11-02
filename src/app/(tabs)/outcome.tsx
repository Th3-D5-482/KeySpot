import { OutcomeContent } from "@/components/outcome/OutcomeContent";
import { Screen } from "@/components/Screen";
import { useBackFunction } from "@/hooks/useBackFunction";

export default function Outcome() {
  const onBackFunction = useBackFunction();

  return (
    <Screen>
      <OutcomeContent onBackFunction={onBackFunction}/>
    </Screen>
  );
}
