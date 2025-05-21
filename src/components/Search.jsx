import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function Search({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');
  const dropdownRef = useRef();

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.get(`/search?query=${encodeURIComponent(query)}`);
      setResults(res.data);
    } catch (err) {
      setError('Error fetching search results');
    }
  };
  
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        api.get(`/search?query=${encodeURIComponent(query)}`)
          .then(res => {
            setResults(res.data);
            setShowDropdown(true);
          })
          .catch(err => {
            console.error('Search error:', err);
            setResults([]);
            setShowDropdown(false);
          });
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleSelect = (item) => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
    onSelect(item); // Pass selected result to parent
  };

  return (
    <div className="sticky top-16 w-full flex justify-center px-4">
      <form onSubmit={handleSearch} 
      className="flex justify-center items-center w-full my-6">
        <div className="relative w-full max-w-2xl">
        <input
          type="text"
          value={query}
          placeholder="Search TV shows or users"
          className="w-full pl-4 pr-16 py-3 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg text-lg"
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition">Search</button>
        </div>
      </form>
      {showDropdown && results.length > 0 && (
    <ul className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50 border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
      {results.map((item, index) => (
        <li
          key={item.id || index}
          onClick={() => handleSelect(item)}
          className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <p className="text-gray-800 dark:text-white font-medium">
            {item.title || item.username}
          </p>
          {item.title && (
            <p className="text-sm text-gray-500 dark:text-gray-400">TV Show</p>
          )}
          {item.username && (
            <p className="text-sm text-gray-500 dark:text-gray-400">User</p>
          )}
        </li>
      ))}
    </ul>
  )}
    </div>
  );
}
