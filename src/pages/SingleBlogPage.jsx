import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import CommentSection from '../components/CommentSection';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const SingleBlogPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axiosInstance.get(`/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <p className="text-center py-10 text-gray-500">Loading blog...</p>;
  if (!blog) return <p className="text-center py-10 text-red-500">Blog not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-3">{blog.title}</h1>

      <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
        {blog.author?.profilePic && (
          <img
            src={`${baseURL}/uploads/${blog.author.profilePic}`}
            alt={blog.author.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <span>By {blog.author?.name || 'Unknown Author'}</span>
        <span>•</span>
        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
      </div>

      {blog.image && (
        <img
          src={`${baseURL}/uploads/${blog.image}`}
          alt={blog.title}
          className="w-full h-80 object-cover rounded-lg mb-6"
        />
      )}

      <div
        className="prose max-w-none prose-lg text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      <div className="mt-12">
        <CommentSection blogId={blog._id} />
      </div>
    </div>
  );
};

export default SingleBlogPage;
