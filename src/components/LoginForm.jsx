import { useState } from 'react';
import axios from 'axios';

export default function LoginForm({ onLogin }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/users/login', { identifier, password });
      localStorage.setItem('token', res.data.token);
      onLogin(res.data.token);
    } catch (err) {
      console.log(err)
      setError('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-indigo-950 text-center">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
        type="text"
        placeholder="Email or Username"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        required
      />
      <input
        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button className="w-full bg-indigo-600 hover:bg-indigo-800 text-white font-semibold py-2 rounded-xl transition duration-300 shadow-md">
        Login
      </button>
    </form>
  );
}