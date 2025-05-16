import { useContext, useState, useRef, useEffect} from 'react';
import { AuthContext } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Search from './components/Search';
import Activity from './pages/Activity';
import Profile from './pages/Profile';
import ShowPage from './pages/ShowPage';
import EditProfile from './pages/EditProfile';

function App() {
  const { user, login, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [register, setRegister] = useState(false);
  const [buttonText, setButtonText] = useState("Don't have an account? Register here.");
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5">
        {register ? <RegisterForm onLogin={login} /> : <LoginForm onLogin={login} />}
          <div className="text-center mt-4">
              <a
                  onClick={() => {
                      setRegister(!register)
                      if (!register){
                          setButtonText("Already have an account? Login here.")
                      }
                      else {
                          setButtonText("Don't have an account? Register here.")
                      }
                  }}
                  className={`cursor-pointer text-sm font-semibold transition ${
                      register ?  'text-gray-500 hover:text-blue-500' : 'text-blue-600'
                  }`}
                  >{buttonText}</a>
          </div>
      </div>);
  }

  return (
    <Router>
      <div className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 z-50 shadow">
        <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-500 text-white py-4 shadow-lg z-50 rounded-b-2xl">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-indigo-950 hover:text-teal-300">
              TVBoxd
            </Link>
            <div className="space-x-4"></div>
            <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center space-x-2 bg-white text-black px-3 py-1 rounded-full shadow hover:bg-gray-100 transition"
            >
              <span className="font-semibold">Welcome, {user.user.username}</span>
              <span className="text-xl">&#9662;</span> {/* ▼ down arrow */}
            </button>
              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-800"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
      <Routes>
        <Route path="/search" element={<Search />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/" element={<Navigate to="/activity" replace />} />
        <Route path="*" element={<Activity />} />
        <Route path="/shows/:id" element={<ShowPage />} />
        <Route path="/edit" element={<EditProfile />} />
      </Routes>
    </Router>
  );
}

export default App;