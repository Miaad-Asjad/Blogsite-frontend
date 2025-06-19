import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";
import { FaCamera } from "react-icons/fa";
import { toast } from "react-hot-toast";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isValidType = ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;
      if (isValidType && isValidSize) {
        setProfileImage(file);
      } else {
        toast.error("Upload a valid image (JPEG, PNG, JPG, WEBP) under 5MB.");
        setProfileImage(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { name, username, email, password } = formData;
    const trimmedName = name.trim();
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    
    if (!trimmedName || !trimmedUsername || !trimmedEmail || !trimmedPassword) {
      toast.error("Please fill in all fields.");
      setIsSubmitting(false);
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      toast.error("Username can only contain letters, numbers, and underscores.");
      setIsSubmitting(false);
      return;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    if (trimmedPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      setIsSubmitting(false);
      return;
    }

  
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", trimmedName);
    formDataToSubmit.append("username", trimmedUsername);
    formDataToSubmit.append("email", trimmedEmail);
    formDataToSubmit.append("password", trimmedPassword);
    if (profileImage) {
      formDataToSubmit.append("profilePicture", profileImage);
    }

    try {
      const response = await axiosInstance.post("/api/auth/register", formDataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { userId } = response.data;

      toast.success("Verification code sent to your email!");

      
      localStorage.setItem("pendingEmail", trimmedEmail);
      localStorage.setItem("pendingUserId", userId);

      
      navigate("/verify", {
        state: {
          userId,
          email: trimmedEmail,
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
      console.error("Error during registration:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2 }}
      className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-100 flex justify-center items-center px-4 py-12"
    >
      <motion.div
        className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <h2 className="text-2xl sm:text-3xl text-center font-bold text-blue-600 mb-6">
          Register
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4"
          >
            <label className="block text-sm sm:text-base text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

         
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-4"
          >
            <label className="block text-sm sm:text-base text-gray-700 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-4"
          >
            <label className="block text-sm sm:text-base text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

         
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-6"
          >
            <label className="block text-sm sm:text-base text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-6"
          >
            <label className="block text-sm sm:text-base text-gray-700 mb-2">Profile Picture</label>
            <input
              type="file"
              id="profileImage"
              name="profilePicture"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="profileImage"
              className="flex items-center gap-2 justify-center cursor-pointer bg-blue-100 text-blue-700 py-2 px-4 rounded-lg border border-blue-300 hover:bg-blue-200 transition"
            >
              <FaCamera />
              <span>Select Profile Image</span>
            </label>

            {profileImage && (
              <div className="mt-3 flex flex-col items-center gap-2">
                <p className="text-sm text-green-600">Selected: {profileImage.name}</p>
                <img
                  src={URL.createObjectURL(profileImage)}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full object-cover border"
                  onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                />
              </div>
            )}
          </motion.div>

          
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
              isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default RegisterPage;


