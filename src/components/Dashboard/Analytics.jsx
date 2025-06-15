// src/pages/admin/Analytics.jsx
import { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

export default function Analytics() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    membersByYear: [],
    activeMembers: 0,
    pendingApprovals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total members
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        const totalMembers = usersSnapshot.size;
        
        // Get pending approvals
        const pendingQuery = query(usersRef, where('isApproved', '==', false));
        const pendingSnapshot = await getDocs(pendingQuery);
        const pendingApprovals = pendingSnapshot.size;

        // Get active members (approved)
        const activeMembers = totalMembers - pendingApprovals;

        // Group by year (example)
        const yearsMap = {};
        usersSnapshot.forEach(doc => {
          const year = doc.data().yearOfExit;
          yearsMap[year] = (yearsMap[year] || 0) + 1;
        });
        const membersByYear = Object.entries(yearsMap)
          .map(([year, count]) => ({ year, count }))
          .sort((a, b) => a.year - b.year);

        setStats({
          totalMembers,
          membersByYear,
          activeMembers,
          pendingApprovals
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ffc947] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-[#ffc947]">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-[#e8ecef] mr-4">
              <UserGroupIcon className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Total Members</p>
              <p className="text-xl font-bold text-[#333]">{stats.totalMembers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-[#ffc947]">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-[#e8ecef] mr-4">
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Active Members</p>
              <p className="text-xl font-bold text-green-600">{stats.activeMembers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-[#ffc947]">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-[#e8ecef] mr-4">
              <ExclamationCircleIcon className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Pending Approvals</p>
              <p className="text-xl font-bold text-yellow-600">{stats.pendingApprovals}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-5">
        <h3 className="text-lg font-medium text-[#333] mb-4">Members by Year of Exit</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.membersByYear}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ecef" />
              <XAxis dataKey="year" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '0.5rem',
                  border: '1px solid #e8ecef'
                }} 
              />
              <Legend />
              <Bar 
                dataKey="count" 
                name="Members" 
                fill="#ffc947" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}