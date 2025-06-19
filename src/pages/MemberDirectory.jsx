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
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        {/* Spinner border color changed to yellow-500 */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero section background changed to a green gradient */}
        {/* Text colors changed to white and yellow-400 */}
        <div className="bg-gradient-to-r from-[#0d3b22] to-[#1a5d38] rounded-2xl shadow-md overflow-hidden p-8 mb-8">
          <h1 className="text-3xl font-bold text-white">
            Alumni Directory
          </h1>
          <p className="mt-2 text-md text-yellow-400">
            Connect with {memberCount} fellow alumni members
          </p>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search alumni by name, profession, year, phone, or email..."
            className="w-full px-5 py-3 border-2 border-transparent rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-xl">
            {error}
          </div>
        )}

        {filteredMembers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md border border-green-200"> {/* Added border */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-bold text-[#0d3b22]"> {/* Changed text color */}
              {searchTerm ? 'No matching alumni found' : 'No alumni members available'}
            </h3>
            <p className="mt-2 text-green-700"> {/* Changed text color */}
              Check back soon to find more alumni.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMembers.map((member) => {
              const isConnected = userConnections.includes(member.id);
              return (
                <div 
                  key={member.id} 
                  className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col border border-green-200" // Added green border
                >
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 mr-4">
                      {member.photoURL ? (
                        <img 
                          src={member.photoURL} 
                          alt={member.firstName} 
                          className="h-20 w-20 rounded-full object-cover"
                        />
                      ) : (
                        <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center"> {/* Changed background */}
                          <span className="text-2xl font-bold text-[#0d3b22]"> {/* Changed text color */}
                            {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#0d3b22]"> {/* Changed text color */}
                        {member.firstName} {member.lastName}
                      </h3>
                      <p className="text-md text-gray-500">
                        {member.profession || 'Profession not specified'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{member.email}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{member.phone || 'Phone not provided'}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Class of {member.yearOfExit || 'unknown'}</span>
                    </div>
                  </div>
                  
                  {member.bio && (
                    <p className="mt-4 text-sm text-gray-700 line-clamp-3">
                      {member.bio}
                    </p>
                  )}
                  
                  <div className="mt-6 flex justify-end">
                    <button 
                      onClick={() => handleConnect(member.id)}
                      disabled={connecting || isConnected}
                      className={`text-sm font-bold px-4 py-2 rounded-lg transition-colors duration-300 ${
                        isConnected 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-[#2a6e47] text-white hover:bg-[#1a5d38]' // Changed button colors
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
  );
}