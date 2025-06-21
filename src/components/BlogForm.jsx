import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Editor } from "@tinymce/tinymce-react";
import axiosInstance from "../utils/axiosInstance";

const BlogForm = ({
  formData,
  setFormData,
  handleSubmit,
  submitText,
  formStatus,
  initialData = null,
}) => {
  const [filePreview, setFilePreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState("");

  const isLocalhost = window.location.hostname === "localhost";
  const imageBaseURL = isLocalhost
    ? "http://localhost:5000"
    : import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        category: initialData.category?.slug || "",
        image: initialData.image || "",
      });

      if (initialData.image) {
        setFilePreview(`${imageBaseURL}/uploads/${initialData.image}`);
      }
    }
  }, [initialData]);

 
  useEffect(() => {
    if (formData.image instanceof File) {
      const url = URL.createObjectURL(formData.image);
      setFilePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [formData.image]);

  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await axiosInstance.get("/api/categories");
        setCategories(res.data);
      } catch (error) {
        setError("Failed to load categories.");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      const file = files[0];
      if (file.size > 2 * 1024 * 1024) return;
      setFormData((prev) => ({ ...prev, image: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-md"
    >
      {formStatus?.message && (
        <div
          className={`text-center font-medium text-sm mb-4 ${
            formStatus.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {formStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter title"
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <Editor
          apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
          value={formData.description}
          onEditorChange={(content) =>
            setFormData((prev) => ({ ...prev, description: content }))
          }
          init={{
            height: 300,
            menubar: true,
            plugins: [
              "advlist", "autolink", "lists", "link", "image", "charmap", "preview", "anchor",
              "searchreplace", "visualblocks", "code", "fullscreen", "insertdatetime", "media", "table", "help", "wordcount",
            ],
            toolbar:
              "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image | removeformat | help",
            images_upload_url: `${import.meta.env.VITE_API_BASE_URL}/blogs/upload-image`,
            images_upload_credentials: true,
            automatic_uploads: true,
            file_picker_types: "image",
          }}
        />

        {loadingCategories ? (
          <p className="text-gray-500 italic">Loading categories...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        )}

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
        />

        {filePreview && (
          <img
            src={filePreview}
            alt="Preview"
            className="w-full h-52 object-cover rounded-md border"
          />
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-lg font-medium transition duration-200"
        >
          {submitText}
        </button>
      </form>
    </motion.div>
  );
};

export default BlogForm;
