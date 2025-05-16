import { act, useEffect, useState } from 'react';
import axios from 'axios';
import Search from '../components/Search';
import { useNavigate } from 'react-router-dom';

export default function ActivityPage() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/social/feed', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        setActivity(res.data);
      } catch (err) {
        console.error('Error fetching activity:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  if (loading) return <p>Loading activity...</p>;

  return (
    <div className="relative">
      <div className="fixed top-28 left-0 w-full z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Feed</h1>
          <Search
            onSelect={(item) => {
              if (item.title) {
                navigate(`/shows/${item.id}`);
              } else {
                navigate(`/profile/${item.username}`);
              }
            }}
          />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-10 pt-60">

        {activity.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">No activity to show yet.</p>
        ) : (
          <div className="max-h-150 overflow-y-auto space-y-4 pr-2 pt-2">
            <ul className="space-y-6 w-xl">
              {activity.map((review) => (
                <li
                  key={review.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex gap-4 items-start"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-lg font-semibold text-gray-800 dark:text-white">
                  {review.avatar_url != '' ? (
                      <img
                        src={review.avatar_url}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover border-1 border-gray-300 dark:border-gray-600 shadow"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-2xl text-black shadow">
                        {review.username[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-semibold text-gray-800 dark:text-white"><a onClick={()=>navigate(`/profile/${review.username}`)}><span className="font-medium">{review.username}</span></a></p>
                      <div className="text-yellow-500 text-sm">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">on <a onClick={()=>navigate(`/shows/${review.id}`)}><span className="font-medium">{review.title}</span></a></p>
                    <p className="text-gray-700 dark:text-gray-200">{review.review}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}