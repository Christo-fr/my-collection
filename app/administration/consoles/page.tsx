import LayoutFull from "@/components/layout/LayoutFull";
import AdminConsolesView from "@/features/admin-consoles/components/AdminConsolesView";

export default function ConsolesPage() {
  return (
    <LayoutFull title="Gestion des consoles">
      <AdminConsolesView />
    </LayoutFull>
  );
}
