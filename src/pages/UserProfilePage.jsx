import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import BlogCard from '../components/BlogCard';
import EditProfileForm from '../components/EditProfileForm';

const UserProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userRes, blogRes] = await Promise.all([
          axiosInstance.get(`/api/users/${userId}`),
          axiosInstance.get(`/api/blogs/user/${userId}`),
        ]);
        setUser(userRes.data);
        setBlogs(blogRes.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const getProfileImageURL = () => {
    if (!user?.profilePicture) return '/default-profile.png';
    if (user.profilePicture.startsWith('http')) return user.profilePicture;
    return `${baseURL}/uploads/${user.profilePicture}`;
  };

  const handleProfileUpdated = (updatedUserData) => {
    setUser(updatedUserData);
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full" />
            <div className="space-y-2">
              <div className="w-48 h-4 bg-gray-300 rounded" />
              <div className="w-32 h-4 bg-gray-300 rounded" />
            </div>
          </div>
          <div className="h-6 w-32 bg-gray-300 rounded" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-red-500 font-semibold text-lg">
        User not found.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* User Info */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-10 border-b pb-6">
        <img
          src={getProfileImageURL()}
          alt={user.name || 'User Profile'}
          className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 shadow-md"
        />

        <div className="text-center md:text-left w-full">
          {!editMode ? (
            <>
              <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-500">@{user.username}</p>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-400 mt-1">
                Blogs Published: {blogs.length}
              </p>
              <button
                onClick={() => setEditMode(true)}
                className="mt-3 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <EditProfileForm user={user} onProfileUpdated={handleProfileUpdated} />
              <button
                onClick={() => setEditMode(false)}
                className="mt-4 text-sm text-gray-600 underline"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Blogs */}
      <div>
        <h3 className="text-2xl font-semibold text-blue-600 mb-6">
          {blogs.length > 0
            ? `Blogs by ${user.name}`
            : `${user.name} hasn't written any blogs yet.`}
        </h3>

        {blogs.length === 0 ? (
          <p className="text-gray-500">Nothing to show yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
