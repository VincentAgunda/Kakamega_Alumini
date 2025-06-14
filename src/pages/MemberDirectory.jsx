import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function MemberDirectory() {
  const { userData, loading, currentUser } = useAuth();
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [error, setError] = useState(null);
  const [memberCount, setMemberCount] = useState(0);
  const [connecting, setConnecting] = useState(false);
  const [userConnections, setUserConnections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingMembers(true);
        setError(null);
        
        // Fetch approved members
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('isApproved', '==', true));
        const querySnapshot = await getDocs(q);
        
        const membersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setMembers(membersData);
        setMemberCount(membersData.length);
        
        // Fetch current user's connections
        if (currentUser?.uid) {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserConnections(userSnap.data().connections || []);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleConnect = async (memberId) => {
    if (!currentUser || !memberId) return;
    
    try {
      setConnecting(true);
      const userRef = doc(db, 'users', currentUser.uid);
      
      await updateDoc(userRef, {
        connections: arrayUnion(memberId)
      });
      
      // Update UI to show connection
      setUserConnections(prev => [...prev, memberId]);
      
    } catch (error) {
      console.error('Error connecting:', error);
      setError('Failed to connect. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  const filteredMembers = members.filter(member => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    const fieldsToSearch = [
      member.firstName,
      member.lastName,
      member.email,
      member.profession,
      member.yearOfExit?.toString(),
      member.phone
    ];

    return fieldsToSearch.some(
      field => field && field.toLowerCase().includes(searchTermLower)
    );
  });

  if (loading || loadingMembers) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Alumni Directory
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Connect with {memberCount} fellow alumni members
            </p>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search alumni by name, profession, year, phone, or email..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md dark:bg-red-900/30 dark:text-red-300">
                {error}
              </div>
            )}

            {filteredMembers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'No matching alumni found' : 'No alumni members available'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => {
                  const isConnected = userConnections.includes(member.id);
                  return (
                    <div 
                      key={member.id} 
                      className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 hover:shadow-md transition"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-4">
                          {member.photoURL ? (
                            <img 
                              src={member.photoURL} 
                              alt={member.firstName} 
                              className="h-16 w-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className="bg-gray-200 dark:bg-gray-600 border-2 border-dashed rounded-full w-16 h-16 flex items-center justify-center">
                              <span className="text-xl font-bold text-gray-500 dark:text-gray-400">
                                {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {member.firstName} {member.lastName}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {member.profession || 'Profession not specified'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>{member.email}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{member.phone || 'Phone not provided'}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Class of {member.yearOfExit || 'unknown'}</span>
                        </div>
                      </div>
                      
                      {member.bio && (
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                          {member.bio}
                        </p>
                      )}
                      
                      <div className="mt-4 flex justify-end">
                        <button 
                          onClick={() => handleConnect(member.id)}
                          disabled={connecting || isConnected}
                          className={`text-sm font-medium px-3 py-1 rounded-full ${
                            isConnected 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                              : 'text-primary hover:text-primary-dark dark:text-primary-300 dark:hover:text-primary-200'
                          }`}
                        >
                          {isConnected ? 'Connected' : connecting ? 'Connecting...' : 'Connect'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}