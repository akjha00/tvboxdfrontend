import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AddReviewForm from '../components/AddReviewForm';
import AddToWatchlist from '../components/AddToWatchlist';
import FloatingHomeButton from '../components/FloatingHomeButton';

export default function ShowPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [show, setShow] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [addReviewButtonText, setAddReviewButtonText] = useState("Add Review");
  const imageBaseUrl = 'https://image.tmdb.org/t/p/original';
  const [showAddReview, setShowAddReview] = useState(false);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const res = await axios.get(`/api/shows/${id}`);
        setShow(res.data);
      } catch (err) {
        console.error('Failed to fetch show:', err);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/api/ratings/show/${id}`);
        setReviews(res.data);
        if (user) {
          const userHasReviewed = res.data.some(
            (review) => review.user_id === user.user.id
          );
          setHasReviewed(userHasReviewed);
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      }
    };

    fetchShow();
    fetchReviews();
  }, [id, user, hasReviewed]);

  async function fetchReviewsAgain(showId) {
    try {
      const res = await axios.get(`/api/ratings/show/${showId}`);
      setHasReviewed(true);
      return res.data; // array of reviews
    } catch (err) {
      console.error('Error fetching reviews:', err.message);
      return [];
    }
  }

  // <AddReviewForm showId={id} onReviewAdded={() => {fetchReviewsAgains(id)}} />

  if (!show) return <p>Loading...</p>;

  return (
    <div className="p-6">
    <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* Left: Text content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">{show.title}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{show.description}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Released: {show.release_year}</p>

        <div className="mb-6">
          {user && !hasReviewed ? (
            <div>
              <button onClick={() => {
                if(showAddReview) {
                  setAddReviewButtonText("Add Review");
                }
                else {
                  setAddReviewButtonText("Cancel");
                }
                setShowAddReview(!showAddReview)
              }} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                {addReviewButtonText}
              </button>
              {showAddReview && (
                <AddReviewForm
                  showId={show.id}
                  onReviewAdded={() => {
                    setShowAddReview(false);
                    fetchReviewsAgain(show.id); // if you have a function to refresh reviews
                  }}
                />
              )}
            </div>
          ) : user && hasReviewed ? (
            <p className="px-4 py-2 bg-indigo-100 text-indigo-950 rounded-md border border-indigo-300 text-sm">
            ⭐ You’ve already reviewed this show.
          </p>
          ) : (
            <p>Please log in to leave a review.</p>
          )}
        </div>
      </div>

      {/* Right: Poster image */}
      {show.poster_url && (
        <div className="w-full md:w-64 flex-shrink-0 p-6 md:p-0">
          <img
            src={`${imageBaseUrl}${show.poster_url}`}
            alt={show.title}
            className="w-full h-auto object-cover rounded-lg shadow"
          />
        </div>
      )}
    </div>

    {/* Reviews Section */}
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
              <span className="text-yellow-500 mr-2">
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </span>
              <p className="text-gray-800 dark:text-white">{review.review}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">— {review.username}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
    <FloatingHomeButton/>
  </div>
  );
}
