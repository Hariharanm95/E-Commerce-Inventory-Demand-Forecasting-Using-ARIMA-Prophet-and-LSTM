import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Please Login
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              You need to be logged in to view your profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 flex flex-col justify-center relative overflow-hidden sm:py-12">
      <div className="max-w-xl mx-auto w-full">
        <div className="relative bg-white shadow-lg rounded-lg p-5 sm:p-10">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Your Profile</h1>
            <p className="text-md text-gray-500">Welcome to your profile page.</p>
          </div>
          <div className="divide-y divide-gray-200">
            <div className="py-4 sm:py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <dt className="text-sm font-medium text-gray-500">Username:</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0">{user.username}</dd>
            </div>
            <div className="py-4 sm:py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <dt className="text-sm font-medium text-gray-500">Email:</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0">{user.email}</dd>
            </div>
            {/* Add more profile information sections here */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">About</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {/* Add a brief about section here */}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;