import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/authSlice';
import { ChevronDown } from 'lucide-react';
import axios from 'axios';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const toggleCategory = () => setCategoryOpen((prev) => !prev);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const resultAction = await dispatch(logoutUser());
      if (logoutUser.fulfilled.match(resultAction)) {
        navigate('/login');
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      toggleMenu();
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/categories`);
        setCategories(res.data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, [baseURL]);

  useEffect(() => {
    setCategoryOpen(false);
    setIsOpen(false);
  }, [location.pathname]);

  const getProfileImageURL = (user) => {
    if (!user?.profilePicture) return '/default-profile.png';
    return user.profilePicture.startsWith('http')
      ? user.profilePicture
      : `${baseURL}/uploads/${user.profilePicture}`;
  };

  const renderProfileImage = () => (
    <Link to={`/profile/${user._id}`}>
      <img
        src={getProfileImageURL(user)}
        alt="Profile"
        className="w-9 h-9 rounded-full object-cover border border-gray-300"
        loading="lazy"
      />
    </Link>
  );

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-3xl font-bold text-blue-600">WordSphere</Link>

          <div className="md:hidden">
            <button onClick={toggleMenu} className="focus:outline-none">
              <div className="space-y-1.5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-6 h-0.5 bg-gray-700 rounded" />
                ))}
              </div>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
            <Link to="/write" className="text-gray-700 hover:text-blue-600 font-medium">Write</Link>

            {!user && (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</Link>
                <Link to="/register" className="text-gray-700 hover:text-blue-600 font-medium">Register</Link>
              </>
            )}

            <div className="relative">
              <button onClick={toggleCategory} className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition">
                Categories
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${categoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoryOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white border rounded-md shadow-md z-50 max-h-72 overflow-y-auto">
                  {categories.length > 0 ? (
                    categories.map(cat =>
                      cat?.slug ? (
                        <Link
                          key={cat._id}
                          to={`/category/${cat.slug}`}
                          onClick={() => setCategoryOpen(false)}
                          className="block px-4 py-2 text-gray-700 hover:bg-blue-50 transition"
                        >
                          {cat.name}
                        </Link>
                      ) : null
                    )
                  ) : (
                    <p className="px-4 py-2 text-gray-400">No categories</p>
                  )}
                </div>
              )}
            </div>

            {user && (
              <>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-gray-700 hover:text-red-500 font-medium transition"
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
                {renderProfileImage()}
              </>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-opacity-20 backdrop-blur-sm z-40"
              onClick={toggleMenu}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 100, damping: 18 }}
              className="fixed top-0 left-0 w-3/4 max-w-xs h-full bg-white z-50 p-6 shadow-lg"
            >
              <div className="flex justify-end mb-6">
                <button onClick={toggleMenu} className="text-2xl text-gray-700">&times;</button>
              </div>

              <nav className="space-y-4">
                <Link to="/" onClick={toggleMenu} className="block text-gray-700 hover:text-blue-600 font-medium">Home</Link>
                <Link to="/write" onClick={toggleMenu} className="block text-gray-700 hover:text-blue-600 font-medium">Write</Link>

                {!user && (
                  <>
                    <Link to="/login" onClick={toggleMenu} className="block text-gray-700 hover:text-blue-600 font-medium">Login</Link>
                    <Link to="/register" onClick={toggleMenu} className="block text-gray-700 hover:text-blue-600 font-medium">Register</Link>
                  </>
                )}

                <div className="pt-4 border-t">
                  <p className="text-gray-800 font-medium mb-2">Categories</p>
                  {categories.length > 0 ? (
                    categories.map(cat =>
                      cat?.slug ? (
                        <Link
                          key={cat._id}
                          to={`/category/${cat.slug}`}
                          onClick={toggleMenu}
                          className="block text-sm text-blue-600 hover:underline"
                        >
                          {cat.name}
                        </Link>
                      ) : null
                    )
                  ) : (
                    <p className="text-sm text-gray-400">No categories</p>
                  )}
                </div>

                {user && (
                  <>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="block text-gray-700 hover:text-red-500 font-medium mt-4"
                    >
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                    <div className="mt-2 block">{renderProfileImage()}</div>
                  </>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;


