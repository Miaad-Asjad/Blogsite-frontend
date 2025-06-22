import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { motion } from 'framer-motion';
import CommentSection from '../components/CommentSection';
import Loader from '../components/Loader';
import Footer from '../components/Footer';

const PostPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Scroll to top on blog open
    window.scrollTo(0, 0);

    const fetchBlog = async () => {
      try {
        const res = await axiosInstance.get(`/api/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error('Failed to fetch blog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center mt-20 text-red-500 text-xl font-semibold">
        Blog not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-10"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center text-sm sm:text-base text-gray-600 mb-8 gap-2">
          <span>By <span className="font-semibold">{blog.author?.name || 'Anonymous'}</span></span>
          <span>•</span>
          <span>{new Date(blog.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
          {blog.category && (
            <>
              <span>•</span>
              <span className="italic text-blue-600">{blog.category.name}</span>
            </>
          )}
        </div>

        {blog.image && (
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${blog.image}`}
            alt={blog.title}
            className="w-full h-auto rounded-md mb-8 object-cover max-h-96"
          />
        )}

        <article
          className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.description }}
        />
      </motion.div>

      <div className="max-w-4xl mx-auto mt-12">
        <CommentSection blogId={blog._id} />
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
};

export default PostPage;
