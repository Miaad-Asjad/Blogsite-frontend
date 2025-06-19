import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import ReactLoading from "react-loading";
import axiosInstance from "../utils/axiosInstance";

const Login = () => {
  const [formData, setFormData] = useState({ emailOrUsername: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(""); // 👈 Error state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormError(""); // 👈 Clear error when user types
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    try {
      const identifier = formData.emailOrUsername.trim();

      const res = await axiosInstance.post("/api/auth/login", {
        identifier,
        password: formData.password,
      });

      const { user, accessToken, refreshToken } = res.data;

      localStorage.setItem("userData", JSON.stringify({ user, accessToken, refreshToken }));
      dispatch(loginSuccess({ user, accessToken, refreshToken }));

      navigate("/write");
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "Login failed";

        if (status === 404) {
          setFormError("User not found.");
        } else if (status === 401) {
          setFormError("⚠️ Please verify your email first.");
        } else if (status === 400) {
          setFormError("Invalid credentials. Please check your password.");
        } else {
          setFormError(`🚫 ${message}`);
        }
      } else {
        setFormError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2 }}
      className="h-screen bg-gradient-to-r from-blue-200 to-blue-100 flex justify-center items-center px-4"
    >
      <motion.div
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <h2 className="text-3xl text-center font-bold text-blue-600 mb-6">Login</h2>

        {formError && (
          <div className="text-red-600 text-sm font-medium mb-4 text-center">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="emailOrUsername" className="block text-lg text-gray-700 mb-2">
              Email or Username
            </label>
            <input
              type="text"
              name="emailOrUsername"
              id="emailOrUsername"
              value={formData.emailOrUsername}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-lg text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-right text-sm mb-6">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            {loading ? (
              <div className="flex justify-center">
                <ReactLoading type="spin" color="#fff" height={24} width={24} />
              </div>
            ) : (
              "Log In"
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:text-blue-500">
              Register here
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
