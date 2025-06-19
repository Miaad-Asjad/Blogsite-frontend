import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";

const AllCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "WordSphere | Categories";
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/api/categories");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading)
    return <p className="text-center py-10 text-gray-500">Loading categories...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">All Categories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            to={`/category/${cat.slug}`}
            className="block text-center bg-white text-blue-600 border border-blue-200 rounded-xl px-4 py-6 shadow-sm transition-all duration-300 hover:bg-blue-600 hover:text-white hover:border-blue-600"
          >
            <h2 className="text-lg font-semibold capitalize">{cat.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllCategoriesPage;
