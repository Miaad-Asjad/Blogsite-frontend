import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import ProtectedRoute from "../components/ProtectedRoute";
import BlogForm from "../components/BlogForm";

const WritePage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
  });

  const [formStatus, setFormStatus] = useState({ type: "", message: "" });

  const refreshAccessToken = async () => {
    try {
      const storedUserData = JSON.parse(localStorage.getItem("userData"));
      const refreshToken = storedUserData?.refreshToken;

      if (!refreshToken) return null;

      const response = await axiosInstance.post("/api/auth/refresh-token", {
        refreshToken,
      });

      const { accessToken } = response.data;
      const updatedUserData = { ...storedUserData, accessToken };
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
      return accessToken;
    } catch {
      return null;
    }
  };

  const handleBlogSubmit = async (formData) => {
    try {
      let token = JSON.parse(localStorage.getItem("userData"))?.accessToken;

      if (!token) {
        token = await refreshAccessToken();
        if (!token) {
          setFormStatus({
            type: "error",
            message: "Authentication failed. Please log in again.",
          });
          return;
        }
      }

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      if (formData.image) {
        data.append("image", formData.image);
      }

      const res = await axiosInstance.post("/api/blogs", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setFormStatus({
        type: "success",
        message: res.data.message || "Blog submitted successfully!",
      });

      setFormData({
        title: "",
        description: "",
        category: "",
        image: null,
      });
    } catch (err) {
      const msg =
        err.response?.data?.message || "Something went wrong! Please try again.";
      setFormStatus({ type: "error", message: msg });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleBlogSubmit(formData);
  };

  return (
    <ProtectedRoute>
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-600">
          Write a New Blog
        </h1>
        <BlogForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          submitText="Submit Blog"
          formStatus={formStatus}
        />
      </div>
    </ProtectedRoute>
  );
};

export default WritePage;
