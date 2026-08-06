import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";

interface TabItem {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  action?: React.ReactNode; // Prop optionnelle pour insérer un élément à droite
  className?: string;
}

export default function Tabs({ items, action, className = "" }: TabsProps) {
  return (
    <TabGroup className={`w-full ${className}`}>
      <TabList className="flex items-center justify-between border-b border-main/10 pb-2">
        {/* Groupe des onglets à gauche */}
        <div className="flex items-center gap-2 flex-wrap">
          {items.map((item) => (
            <Tab
              className="first:pl-0 px-4 uppercase text-sm font-medium rounded-lg transition-all outline-none cursor-pointer text-main/60 data-[hover]:text-main data-[selected]:bg-accent data-[selected]:text-main"
              key={item.label}
            >
              {item.label}
            </Tab>
          ))}
        </div>

        {/* Élément d'action (bouton) à droite */}
        {action && <div>{action}</div>}
      </TabList>

      <TabPanels>
        {items.map((item) => (
          <TabPanel className="pt-4 focus:outline-none" key={item.label}>
            {item.content}
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
