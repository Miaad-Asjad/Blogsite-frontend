// src/pages/EditBlogPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import BlogForm from "../components/BlogForm";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";

const EditBlogPage = () => {
  const { id } = useParams(); // blog ID from URL
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/blogs/${id}`);
      setBlog(data);
    } catch (err) {
      console.error("Failed to fetch blog:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      await axiosInstance.put(
        `/api/blogs/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      navigate(`/blogs/${id}`);
    } catch (err) {
      console.error("Error updating blog:", err);
    }
  };

  if (loading) return <Loader />;
  if (!blog) return <p className="text-center text-gray-500">Blog not found</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Edit Blog</h1>
      <BlogForm initialData={blog} onSubmit={handleUpdate} />
    </div>
  );
};

export default EditBlogPage;
