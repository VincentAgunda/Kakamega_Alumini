import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import MemberTable from "./MemberTable";
import ContentManager from "./ContentManager";
import Analytics from "./Analytics";
import { useAuth } from "../../contexts/AuthContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminDashboard() {
  const [tabs] = useState([
    'Member Management',
    'Content Management',
    'Analytics',
  ]);
  const { userData, loading, isAdmin } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    console.log("AdminDashboard userData:", userData);
    console.log("AdminDashboard loading:", loading);
    console.log("AdminDashboard isAdmin:", isAdmin);
  }, [userData, loading, isAdmin]);

  if (loading || !isClient) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            You don't have permission to access this page
          </p>
          <p className="text-sm mt-2">Your role: {userData?.role || 'user'}</p>
          <p className="text-sm mt-2">Admin status: {isAdmin ? 'true' : 'false'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage alumni members, content, and view analytics
            </p>
          </div>

          <Tab.Group>
            <Tab.List className="flex border-b border-gray-200 dark:border-gray-700">
              {tabs.map((tab) => (
                <Tab
                  key={tab}
                  className={({ selected }) =>
                    classNames(
                      'px-4 py-3 text-sm font-medium focus:outline-none',
                      selected
                        ? 'text-primary border-b-2 border-primary dark:text-primary-dark dark:border-primary-dark'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    )
                  }
                >
                  {tab}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="p-6">
              <Tab.Panel>
                <MemberTable />
              </Tab.Panel>
              <Tab.Panel>
                <ContentManager />
              </Tab.Panel>
              <Tab.Panel>
                <Analytics />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}