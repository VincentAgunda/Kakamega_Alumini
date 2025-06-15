// src/pages/admin/MemberTable.jsx
import { useState, useEffect } from 'react';
import { db } from "../../config/firebase";
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon, PhoneIcon, UserIcon } from '@heroicons/react/24/outline';

export default function MemberTable() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('pending');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingMember, setEditingMember] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profession: '',
    yearOfExit: '',
    house: '',
    isApproved: false
  });

  useEffect(() => {
    fetchMembers();
  }, [filter]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      let q;
      
      if (filter === 'pending') {
        q = query(usersRef, where('isApproved', '==', false));
      } else if (filter === 'approved') {
        q = query(usersRef, where('isApproved', '==', true));
      } else {
        q = query(usersRef);
      }

      const querySnapshot = await getDocs(q);
      const membersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setMembers(membersData);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId, approve = true) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isApproved: approve,
        approvedAt: approve ? new Date().toISOString() : null
      });
      
      setMembers(members.map(member => 
        member.id === userId ? { ...member, isApproved: approve } : member
      ));
      
      setSuccessMessage(`Member ${approve ? 'approved' : 'set to pending'} successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error(`Error ${approve ? 'approving' : 'unapproving'} member:`, error);
      setSuccessMessage(`Failed to update member status: ${error.message}`);
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setMembers(members.filter(member => member.id !== userId));
        setSuccessMessage('Member deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting member:', error);
        setSuccessMessage(`Failed to delete member: ${error.message}`);
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    }
  };

  const handleEditClick = (member) => {
    setEditingMember(member.id);
    setEditForm({
      firstName: member.firstName || '',
      lastName: member.lastName || '',
      email: member.email || '',
      phone: member.phone || '',
      profession: member.profession || '',
      yearOfExit: member.yearOfExit || '',
      house: member.house || '',
      isApproved: member.isApproved || false
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...editForm,
        lastUpdated: new Date().toISOString()
      });
      
      setMembers(members.map(member => 
        member.id === userId ? { ...member, ...editForm } : member
      ));
      
      setEditingMember(null);
      setSuccessMessage('Member updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating member:', error);
      setSuccessMessage(`Failed to update member: ${error.message}`);
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
  };

  const filteredMembers = members.filter(member => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      member.firstName?.toLowerCase().includes(searchTermLower) ||
      member.lastName?.toLowerCase().includes(searchTermLower) ||
      member.email?.toLowerCase().includes(searchTermLower) ||
      member.phone?.toLowerCase().includes(searchTermLower) ||
      member.indexNumber?.toLowerCase().includes(searchTermLower)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffc947]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-xl">
          {successMessage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-[#ffc947] focus:border-[#ffc947]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl ${filter === 'all' ? 'bg-[#ffc947] text-[#333] font-bold' : 'bg-[#e8ecef] hover:bg-[#d6dde3] text-[#333]'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-xl ${filter === 'pending' ? 'bg-[#ffc947] text-[#333] font-bold' : 'bg-[#e8ecef] hover:bg-[#d6dde3] text-[#333]'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-xl ${filter === 'approved' ? 'bg-[#ffc947] text-[#333] font-bold' : 'bg-[#e8ecef] hover:bg-[#d6dde3] text-[#333]'}`}
          >
            Approved
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full divide-y divide-[#e8ecef]">
          <thead className="bg-[#e8ecef]">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Phone
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Year
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#e8ecef]">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-[#f8f9fa] transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#e8ecef] flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        {editingMember === member.id ? (
                          <input
                            name="firstName"
                            value={editForm.firstName}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md mb-1"
                            placeholder="First Name"
                          />
                        ) : (
                          <div className="text-sm font-medium text-[#333]">
                            {member.firstName} {member.lastName}
                          </div>
                        )}
                        {editingMember === member.id ? (
                          <input
                            name="profession"
                            value={editForm.profession}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                            placeholder="Profession"
                          />
                        ) : (
                          <div className="text-sm text-gray-600">
                            {member.profession}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {editingMember === member.id ? (
                      <input
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        placeholder="Email"
                      />
                    ) : (
                      member.email
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {editingMember === member.id ? (
                      <input
                        name="phone"
                        value={editForm.phone}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        placeholder="Phone"
                      />
                    ) : (
                      <div className="flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-1" />
                        {member.phone || 'N/A'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {editingMember === member.id ? (
                      <input
                        name="yearOfExit"
                        value={editForm.yearOfExit}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        placeholder="Year of Exit"
                      />
                    ) : (
                      member.yearOfExit
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingMember === member.id ? (
                      <select
                        name="isApproved"
                        value={editForm.isApproved}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                      >
                        <option value={false}>Pending</option>
                        <option value={true}>Approved</option>
                      </select>
                    ) : (
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {member.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {editingMember === member.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(member.id)}
                          className="text-green-600 hover:text-green-800"
                          title="Save"
                        >
                          <CheckIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-800"
                          title="Cancel"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(member)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        
                        {member.isApproved ? (
                          <button
                            onClick={() => handleApprove(member.id, false)}
                            className="text-yellow-600 hover:text-yellow-800"
                            title="Set to Pending"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApprove(member.id, true)}
                            className="text-green-600 hover:text-green-800"
                            title="Approve"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-600">
                  No {filter === 'all' ? 'members' : filter + ' members'} found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}