import LayoutFull from "@/components/layout/LayoutFull";
import ConsolesView from "@/components/admin/AdminConsoleView";

export default function ConsolesPage() {
  return (
    <LayoutFull title="Gestion des consoles">
      <ConsolesView />
    </LayoutFull>
  );
}
