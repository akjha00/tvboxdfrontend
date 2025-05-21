import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import FloatingEditButton from '../components/FloatingEditButton';
import FloatingHomeButton from '../components/FloatingHomeButton';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user } = useContext(AuthContext);
  const username = useParams().username ? useParams().username : user.user.username ;
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileRes = await api.get(`/profile/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const reviewsRes = await api.get(`/ratings/user/${profileRes.data.user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const followingRes = await api.get(`/social/following/${profileRes.data.user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const followersRes = await api.get(`/social/followers/${profileRes.data.user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        for (let i = 0; i < followersRes.data.length; i++) {
          if (followersRes.data[i].username == user.user.username) {
            setIsFollowing(true);
          }
        }

        setProfile(profileRes.data);
        setReviews(reviewsRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile info:', err);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token, username]);

  const follow = async () => {

    try {
      const res = await api.post(
        `/social/follow/${profile.user_id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });

    } catch (err) {
      console.log(err);
    }
  };

  const unfollow = async () => {

    try {
      const res = await api.delete(
        `/social/unfollow/${profile.user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      
    } catch (err) {
      console.log(err);
    }
  };


  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>Profile not found.</p>;

  return (
    <div className="pt-25 pb-25">
      <div className="max-w-6xl w-6xl mx-auto px-10 py-16 pt-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-10">
        <div className="flex items-center gap-6">
          {profile?.avatar_url != '' ? (
            <img
              src={profile.avatar_url}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 dark:border-gray-600 shadow"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-4xl font-bold text-white shadow">
              📺
            </div>
          )}
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2">@{username}</h1>
            {profile?.bio && (
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl">{profile.bio}</p>
            )}
          </div>
        </div>

        {username != user.user.username && (
          <div className="mt-4 md:mt-0">
            <button
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() => {
                if (isFollowing) {
                  setIsFollowing(false);
                  unfollow();
                }
                else {
                  setIsFollowing(true);
                  follow();
                }
              }}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          </div>
        )}
      </div>
        {/* Divider */}
        <div className="border-t border-gray-300 dark:border-gray-700 mb-0" />

        {/* Reviews Section */}
        <div className="max-h-100 overflow-y-auto space-y-4 pr-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-6">📝 {username == user.user.username ? 'Your' : username + '\'s'} Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">{username == user.user.username ? 'You have not' : username + ' has not'} written any reviews yet.</p>
            ) : (
              <ul className="space-y-6">
                {reviews.map((review) => (
                  <li key={review.id} className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                    <a onClick={()=>navigate(`/shows/${review.id}`)}><h3 className="text-xl font-semibold text-gray-800 dark:text-white">{review.title}</h3></a>
                      <div className="text-yellow-500 text-base">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-200">{review.review}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      {username == user.user.username &&
          <FloatingEditButton/>
        }
        {username != user.user.username && 
          <FloatingHomeButton/>}
    </div>
  );
}