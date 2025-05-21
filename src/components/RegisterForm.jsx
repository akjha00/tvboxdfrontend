import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const RegisterForm = ({ onLogin }) => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/users/register', form);
      onLogin(res.data.token);
      if (res.data.token) {
        // Immediately create profile
        await axios.post('/api/profile', {
          username: res.data.username,
          bio: 'No bio yet',
          photo_url: '',
        }, {
          headers: {
            Authorization: `Bearer ${res.data.token}`,
          }
        });
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-indigo-950 text-center">Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300" name="username" placeholder="Username" onChange={handleChange} />
      <input className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300" name="email" type="email" placeholder="Email" onChange={handleChange} />
      <input className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300" name="password" type="password" placeholder="Password" onChange={handleChange} />
      <button className="w-full bg-indigo-600 hover:bg-indigo-800 text-white font-semibold py-2 rounded-xl transition duration-300 shadow-md" type="submit">Sign Up</button>
    </form>
  );
};

export default RegisterForm;