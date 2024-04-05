import { useState } from 'react';
import { MainInfo } from '../MainInfo/MainInfo';
import { Password } from '../Password/Password';

enum Tab {
  MainInfo = "MainInfo",
  Password = "Password",
}

interface TabProps {
  id: Tab;
  label: string;
}

const tabs: TabProps[] = [
  { id: Tab.MainInfo, label: "Main Info" },
  { id: Tab.Password, label: "Password" },
];

const tabComponents: Record<Tab, React.ReactNode> = {
  [Tab.MainInfo]: <MainInfo />,
  [Tab.Password]: <Password />,
};

export const Profile = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.MainInfo);

  return (
    <section>
      <div className="container">
        <div className="grid tablet:grid-cols-3 gap-20 mx-auto max-w-[600px]">
          <div className="tablet:col-span-1 py-20 px-10 bg-light-grey">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`link !w-full py-8 px-8 border-b border-grey border-solid text-left ${activeTab === tab.id ? 'text-cyan' : ''}`}
                onClick={() => setActiveTab(tab.id)} 
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="tablet:col-span-2 py-20">
            {tabComponents[activeTab]}
          </div>
        </div>
      </div>
    </section>
  );
};
