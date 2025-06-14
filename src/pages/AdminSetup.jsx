import { useEffect, useState } from 'react';
import { createAdminAccount } from '../utils/createAdmin';

export default function AdminSetup() {
  const [status, setStatus] = useState('Preparing admin setup...');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const setupAdmin = async () => {
      try {
        setStatus('Creating admin account...');
        const result = await createAdminAccount();
        
        if (result) {
          setSuccess(true);
          setStatus('Admin account created successfully! Check console for credentials.');
        } else {
          setError('Failed to create admin account. See console for details.');
          setStatus('Admin setup failed.');
        }
      } catch (err) {
        console.error('Setup error:', err);
        setError(err.message);
        setStatus('Admin setup encountered an error.');
      }
    };

    setupAdmin();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Admin Account Setup</h2>
        
        <div className={`p-4 mb-4 rounded ${
          success ? 'bg-green-100 text-green-800' : 
          error ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {status}
          {error && <p className="mt-2 text-sm">{error}</p>}
        </div>
        
        {success && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
            <p className="font-bold">Important:</p>
            <p>1. Check your browser console for login credentials</p>
            <p>2. Immediately log in and change the password</p>
            <p>3. Delete this setup page after use</p>
          </div>
        )}
      </div>
    </div>
  );
}