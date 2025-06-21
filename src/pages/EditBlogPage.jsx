import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogForm from "../components/BlogForm";
import axiosInstance from "../utils/axiosInstance";

const EditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
  });

  const [blog, setBlog] = useState(null); 
  const [formStatus, setFormStatus] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axiosInstance.get(`/api/blogs/${id}`);
        const blogData = res.data;

        setBlog(blogData); 

       
        setFormData({
          title: blogData.title,
          description: blogData.description,
          category: blogData.category.slug,
          image: null, 
        });
      } catch (err) {
        console.error("Failed to load blog:", err);
      }
    };

    fetchBlog();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      await axiosInstance.put(`/api/blogs/${id}`, data);
      setFormStatus({ type: "success", message: "Blog updated successfully" });
      setTimeout(() => navigate(`/blogs/${id}`), 1500);
    } catch (err) {
      setFormStatus({ type: "error", message: "Failed to update blog" });
    }
  };

  return (
    <div className="py-10 px-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Edit Blog</h1>

      <BlogForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        submitText="Update Blog"
        formStatus={formStatus}
        initialData={blog} 
      />
    </div>
  );
};

export default EditBlogPage;

