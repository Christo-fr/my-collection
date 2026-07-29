import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";

interface TabItem {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  className?: string;
}

export default function Tabs({ items, className = "" }: TabsProps) {
  return (
    <TabGroup className={`w-full ${className}`}>
      <TabList className="flex items-center gap-2 flex-wrap border-b border-main/10 pb-3">
        {items.map((item) => (
          <Tab
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all outline-none cursor-pointer text-main/60 data-[hover]:text-main data-[hover]:bg-main/10 data-[selected]:bg-accent data-[selected]:text-white data-[selected]:shadow-md"
            key={item.label}
          >
            {item.label}
          </Tab>
        ))}
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
