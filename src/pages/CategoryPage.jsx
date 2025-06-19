import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BlogCard from "../components/BlogCard";

const CategoryPage = () => {
  const { slug } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    if (!slug) {
      setError("Invalid category URL.");
      setLoading(false);
      return;
    }

    const fetchBlogsBySlug = async () => {
      try {
        setLoading(true);
        const url = `${baseURL}/api/blogs/category/${slug}`;
        const res = await axios.get(url);
        setBlogs(res.data || []);
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load blogs for this category"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlogsBySlug();
  }, [slug, baseURL]);

  if (loading)
    return <p className="text-center py-10 text-gray-500">Loading blogs...</p>;

  if (error)
    return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 capitalize">
        Blogs in: {slug.replace(/-/g, " ")}
      </h1>

      {blogs.length === 0 ? (
        <p className="text-gray-600">No blogs found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
