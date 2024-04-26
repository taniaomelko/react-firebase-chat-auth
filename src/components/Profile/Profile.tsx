import { useState, useEffect } from 'react';
import { MainInfo } from '../MainInfo/MainInfo';
import { PasswordTab } from '../PasswordTab/PasswordTab';
import { auth } from '../../firebase/firebase';
import { useAuth } from '../../firebase/authContext';

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
  [Tab.Password]: <PasswordTab />,
};

export const Profile = () => {
  const { currentUser  } = useAuth(); 

  const [emailVerified, setEmailVerified] = useState(currentUser?.emailVerified);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.MainInfo);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setEmailVerified(user?.emailVerified);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  if (!emailVerified) {
    return (
      <div className="py-20">
        <div className="container">
          <p>Please verify your email address to access all features.</p>
        </div>
      </div>
    );
  }


  return (
    <section>
      <div className="container">
        <div className="grid tablet:grid-cols-3 gap-20 mx-auto max-w-600">
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
