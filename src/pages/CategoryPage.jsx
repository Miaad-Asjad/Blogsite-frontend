import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosInstance } from "../utils";
import BlogCard from "../components/BlogCard";

const CategoryPage = () => {
  const { slug } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatSlug = (slug) =>
    slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  useEffect(() => {
    // ✅ Scroll to top when category changes
    window.scrollTo(0, 0);

    if (!slug) {
      setError("Invalid category URL.");
      setLoading(false);
      return;
    }

    const fetchBlogsBySlug = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/api/blogs/category/${slug}`);
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
  }, [slug]);

  if (loading)
    return <p className="text-center py-10 text-gray-500">Loading blogs...</p>;

  if (error)
    return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 capitalize">
        Blogs in: {formatSlug(slug)}
      </h1>

      {blogs.length === 0 ? (
        <p className="text-gray-600">
          No blogs found in this category.
          <br />
          <Link to="/" className="text-blue-600 hover:underline inline-block mt-2">
            ← Go back to Home
          </Link>
        </p>
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
