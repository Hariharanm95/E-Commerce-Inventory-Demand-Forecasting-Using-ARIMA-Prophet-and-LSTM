import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div className="container mx-auto mt-8">Please login to view your profile.</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      {/* Add more profile information here */}
    </div>
  );
};

export default ProfilePage;