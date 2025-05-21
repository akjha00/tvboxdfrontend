import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current user profile info
    const fetchProfile = async () => {
      try {
        const profileRes = await api.get('/api/profile/me', {
            headers: { Authorization: `Bearer ${token}` },
        });
        const reviewsRes = await api.get(`/api/ratings/user/${user.user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(profileRes.data.username);
        setBio(profileRes.data.bio || '');
        setPhotoUrl(profileRes.data.avatar_url || '');
      } catch (err) {
        console.log(err);
        setError('Failed to load profile');
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(
        '/api/profile',
        { username, bio, avatar_url: photoUrl },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      navigate('/profile');
    } catch (err) {
      setError('Update failed');
    }
  };

  return (
    <div className="max-w-4xl w-4xl mx-auto mt-20 bg-white dark:bg-gray-800 p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Edit @{user.user.username}'s Profile</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-1">Bio</label>
          <textarea
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded"
            value={bio}
            maxlength={250}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-1">Photo URL</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}