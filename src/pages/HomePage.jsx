

import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance'; 
import CategoriesList from '../components/CategoriesList';
import BlogCard from '../components/BlogCard';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../components/Loader';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'WordSphere | Home';

    const fetchData = async () => {
      try {
        const [blogsRes, categoriesRes] = await Promise.all([
          axiosInstance.get('/api/blogs'),
          axiosInstance.get('/api/categories'),
        ]);

        setBlogs(blogsRes.data);
        setCategories(categoriesRes.data);

        
        toast.success('Blogs & Categories loaded!');
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const recentBlogs = blogs.slice(0, 6);

  const handleCategoryClick = (category) => {
    console.log("Category clicked:", category);
    
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      <div className="px-4 py-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600">WordSphere - Home</h1>
          <p className="text-gray-600 mt-4 text-base">
            Dive into the world of words. Share your stories, ideas, and inspirations!
          </p>
        </div>

        {/* Blogs Section */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader />
          </div>
        ) : (
          <>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl font-semibold mb-6 text-gray-800"
            >
              Recent Blogs
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {recentBlogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <BlogCard blog={blog} />
                </motion.div>
              ))}
            </div>

            {/* Categories Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Explore Categories</h2>
              <CategoriesList
                categories={categories.slice(0, 5)}
                onClickCategory={handleCategoryClick}
              />
              <Link
                to="/categories"
                className="text-blue-600 hover:underline text-sm"
              >
                See All Categories →
              </Link>
            </motion.div>
          </>
        )}
      </div>

      <Footer />
      <ToastContainer position="top-center" />
    </div>
  );
};

export default HomePage;
