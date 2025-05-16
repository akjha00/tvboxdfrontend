import { useState } from 'react';
import axios from 'axios';

export default function AddReviewForm({ showId, onReviewAdded }) {
  const [rating, setRating] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `/api/ratings`,
        { showId, rating, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Review submitted!');
      setContent('');
      setRating('');
      if (onReviewAdded) onReviewAdded(res.data); // optional callback to refresh reviews
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.error || 'Failed to submit review');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-6 w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <div className="mb-4">
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              xmlns="http://www.w3.org/2000/svg"
              fill={(hoverRating || rating) >= star ? 'gold' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              className="w-6 h-6 cursor-pointer transition-colors"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.913c.969 0 1.371 1.24.588 1.81l-3.974 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.974-2.89a1 1 0 00-1.176 0l-3.974 2.89c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.974-2.89c-.783-.57-.38-1.81.588-1.81h4.913a1 1 0 00.951-.69l1.518-4.674z" />
            </svg>
          ))}
        </div>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your thoughts..."
        className="w-full h-32 p-3 rounded border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
        required
      />
      <br />
      <br />
      <button
      type="submit"
      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      disabled={rating === 0}
      >
        Submit Review
      </button>
      </form>
    </div>
  );
}