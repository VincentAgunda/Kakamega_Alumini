// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import MemberTable from "./MemberTable";
import ContentManager from "./ContentManager";
import Analytics from "./Analytics";
import RsvpManager from "./RsvpManager";
import { useAuth } from "../../contexts/AuthContext";
import {
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  TicketIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminDashboard() {
  const [tabs] = useState([
    {
      name: "Member Management",
      icon: UserGroupIcon,
      component: <MemberTable />,
    },
    {
      name: "Content Management",
      icon: DocumentTextIcon,
      component: <ContentManager />,
    },
    {
      name: "RSVP Management",
      icon: TicketIcon,
      component: <RsvpManager />,
    },
    {
      name: "Analytics",
      icon: ChartBarIcon,
      component: <Analytics />,
    },
  ]);
  
  const { userData, loading, isAdmin } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (loading || !isClient) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#ffc947] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <ExclamationCircleIcon className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#333] mb-2">
            Access Restricted
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this admin dashboard
          </p>
          
          <div className="bg-[#e8ecef] rounded-lg p-4 text-left">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Role:</span>
              <span className="font-medium text-[#333]">
                {userData?.role || "User"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-t border-gray-200">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${isAdmin ? "text-green-600" : "text-red-500"}`}>
                {isAdmin ? "Admin" : "Standard User"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="px-6 py-8 sm:px-8 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#333]">
                  Admin Dashboard
                </h1>
                <p className="mt-2 text-gray-600">
                  Manage alumni members, content, and view analytics
                </p>
              </div>
              <div className="flex items-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-[#333]">
                    {userData?.name || "Admin"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {userData?.email || "admin@example.com"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Tab.Group>
            <Tab.List className="flex px-2 sm:px-6 bg-[#e8ecef] overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    classNames(
                      "flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 focus:outline-none transition-colors duration-200",
                      selected
                        ? "border-[#ffc947] text-[#333]"
                        : "border-transparent text-gray-600 hover:text-[#333]"
                    )
                  }
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="p-4 sm:p-6">
              {tabs.map((tab) => (
                <Tab.Panel key={tab.name} className="focus:outline-none">
                  {tab.component}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}