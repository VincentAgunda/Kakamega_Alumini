import { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-300 text-sm font-medium">Total Members</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalMembers}</p>
        </div>
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-300 text-sm font-medium">Active Members</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.activeMembers}</p>
        </div>
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-300 text-sm font-medium">Pending Approvals</h3>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendingApprovals}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Members by Year of Exit</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.membersByYear}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Members" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}