import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";

interface TabItem {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  selectedIndex?: number;
  onChange?: (index: number) => void;
  action?: React.ReactNode;
  className?: string;
}

export default function Tabs({
  items,
  selectedIndex,
  onChange,
  action,
  className = "",
}: TabsProps) {
  return (
    <TabGroup
      selectedIndex={selectedIndex}
      onChange={onChange}
      className={`w-full flex-1 min-h-0 flex flex-col ${className}`}
    >
      <TabList className="flex items-center justify-between border-b border-main/10 pb-2 flex-shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          {items.map((item) => (
            <Tab
              className="md:first:pl-0 px-2 lg:px-4 uppercase text-sm font-medium rounded-lg transition-all outline-none cursor-pointer text-main/60 data-[hover]:text-main data-[selected]:bg-accent data-[selected]:text-main"
              key={item.label}
            >
              {item.label}
            </Tab>
          ))}
        </div>

        {action && <div>{action}</div>}
      </TabList>

      {/* min-h-0 et flex-1 permettent de propager la hauteur aux sections enfant */}
      <TabPanels className="flex-1 min-h-0 flex flex-col pt-4">
        {items.map((item) => (
          <TabPanel
            unmount={false}
            className="flex-1 min-h-0 flex flex-col focus:outline-none"
            key={item.label}
          >
            {item.content}
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
