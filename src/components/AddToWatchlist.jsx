import { useState } from 'react';
import axios from 'axios';

export default function AddToWatchlist({ showId, onAdded }) {
  const [season, setSeason] = useState('');
  const [episode, setEpisode] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  const handleAdd = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('You must be logged in');

    try {
      await axios.post(
        `/api/watchlist/${showId}`,
        {
          current_season: parseInt(season),
          current_episode: parseInt(episode),
          status: status || 'watching',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Added to watchlist!');
      if (onAdded) onAdded(); // optional callback
    } catch (err) {
      console.error('Error adding to watchlist:', err);
      setMessage('Failed to add');
    }
  };

  return (
    <div>
      <h3>Add to Watchlist</h3>
      <input
        type="number"
        placeholder="Season"
        value={season}
        onChange={(e) => setSeason(e.target.value)}
      />
      <input
        type="number"
        placeholder="Episode"
        value={episode}
        onChange={(e) => setEpisode(e.target.value)}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">Select Status</option>
        <option value="watching">Watching</option>
        <option value="completed">Completed</option>
        <option value="paused">Paused</option>
      </select>
      <button onClick={handleAdd}>Add to Watchlist</button>
      {message && <p>{message}</p>}
    </div>
  );
}