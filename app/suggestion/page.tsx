import LayoutSplit from "@/components/layout/LayoutSplit";
import Heading from "@/components/ui/Heading";
import SuggestionView from "@/components/game/GameSuggestionView";

export default function SuggestionPage() {
  return (
    <LayoutSplit image={{ url: "/parallax/suggestion.webp", truncated: true }}>
      <Heading as="h1" size="xl">
        Suggestion
      </Heading>
      <SuggestionView />
    </LayoutSplit>
  );
}
